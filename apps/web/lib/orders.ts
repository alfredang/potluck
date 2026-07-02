// Order service for the multi-provider checkout. All amounts are integer
// cents (SGD); prices are always resolved server-side — never trusted from
// the client. Works for both the static marketing menus (slug ids) and the
// DB menus the mobile apps browse (uuid ids).

import { randomBytes } from 'crypto';
import { and, eq, sql } from 'drizzle-orm';
import { PLATFORM_FEE_PERCENTAGE } from '@homechef/shared';
import { db } from './db';
import { chefProfiles, menus, orders, users } from './schema';
import { CHEFS } from './chefs-data';
import { createStripeCheckout, verifyStripePayment } from './payments/stripe';
import { createPayPalOrder, verifyPayPalPayment } from './payments/paypal';
import { createHitPayRequest, verifyHitPayPayment } from './payments/hitpay';
import type {
  CheckoutPlatform,
  OrderForPayment,
  PaymentProvider,
  PaymentVerdict,
  ProviderSession,
} from './payments/types';

export type OrderRow = typeof orders.$inferSelect;

// ---------------------------------------------------------------------------
// Self-migrating schema (idempotent, same pattern as scripts/seed-blog.ts) —
// lets checkout work on a fresh environment without a manual drizzle push.
// Mirrors apps/api/src/db/schema/orders.ts; keep the two in sync.

let schemaReady: Promise<void> | null = null;

export function ensureOrdersSchema(): Promise<void> {
  if (!schemaReady) {
    schemaReady = (async () => {
      await db.execute(sql`CREATE EXTENSION IF NOT EXISTS pgcrypto`);
      await db.execute(sql`DO $$ BEGIN
        CREATE TYPE payment_provider AS ENUM ('stripe','paypal','hitpay');
      EXCEPTION WHEN duplicate_object THEN null; END $$;`);
      await db.execute(sql`DO $$ BEGIN
        CREATE TYPE order_status AS ENUM ('pending_payment','paid','failed','cancelled','refunded');
      EXCEPTION WHEN duplicate_object THEN null; END $$;`);
      await db.execute(sql`DO $$ BEGIN
        CREATE TYPE order_platform AS ENUM ('web','ios','android');
      EXCEPTION WHEN duplicate_object THEN null; END $$;`);
      await db.execute(sql`CREATE TABLE IF NOT EXISTS orders (
        id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        order_number varchar(20) UNIQUE NOT NULL,
        menu_id text NOT NULL,
        menu_name varchar(255) NOT NULL,
        chef_id text,
        chef_name varchar(255),
        customer_name varchar(255) NOT NULL,
        customer_email varchar(255) NOT NULL,
        customer_phone varchar(50),
        scheduled_date date NOT NULL,
        scheduled_time varchar(10) NOT NULL,
        guest_count integer NOT NULL,
        special_requests text,
        unit_price integer NOT NULL,
        subtotal integer NOT NULL,
        platform_fee integer NOT NULL,
        total integer NOT NULL,
        currency varchar(3) NOT NULL DEFAULT 'SGD',
        provider payment_provider NOT NULL,
        provider_ref varchar(255),
        status order_status NOT NULL DEFAULT 'pending_payment',
        platform order_platform NOT NULL DEFAULT 'web',
        paid_at timestamp,
        failure_reason text,
        created_at timestamp NOT NULL DEFAULT now(),
        updated_at timestamp NOT NULL DEFAULT now()
      )`);
      await db.execute(sql`CREATE INDEX IF NOT EXISTS orders_provider_ref_idx ON orders (provider_ref)`);
      await db.execute(sql`CREATE INDEX IF NOT EXISTS orders_status_idx ON orders (status)`);
      await db.execute(sql`CREATE INDEX IF NOT EXISTS orders_customer_email_idx ON orders (customer_email)`);
    })().catch((err) => {
      schemaReady = null; // allow retry on the next request
      throw err;
    });
  }
  return schemaReady;
}

// ---------------------------------------------------------------------------
// Menu resolution (server-side pricing)

export interface ResolvedMenu {
  menuId: string;
  menuName: string;
  chefId: string | null;
  chefName: string | null;
  unitPrice: number; // cents
}

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export async function resolveMenu(menuId: string): Promise<ResolvedMenu | null> {
  // 1. Static marketing-site menus (slug ids like "sarah-tan-1")
  for (const chef of CHEFS) {
    const menu = chef.menus.find((m) => m.id === menuId);
    if (menu) {
      return {
        menuId: menu.id,
        menuName: menu.name,
        chefId: chef.id,
        chefName: chef.name,
        unitPrice: menu.price,
      };
    }
  }

  // 2. DB menus (uuid ids — what the iOS/Android apps browse)
  if (!UUID_RE.test(menuId)) return null;
  const [row] = await db
    .select({
      id: menus.id,
      name: menus.name,
      price: menus.price,
      chefId: menus.chefId,
      chefFirstName: users.firstName,
      chefLastName: users.lastName,
    })
    .from(menus)
    .innerJoin(chefProfiles, eq(menus.chefId, chefProfiles.id))
    .innerJoin(users, eq(chefProfiles.userId, users.id))
    .where(eq(menus.id, menuId));
  if (!row) return null;
  return {
    menuId: row.id,
    menuName: row.name,
    chefId: row.chefId,
    chefName: `${row.chefFirstName} ${row.chefLastName}`.trim(),
    unitPrice: row.price,
  };
}

// ---------------------------------------------------------------------------
// Amounts & input normalization

export function computeAmounts(unitPrice: number, guests: number) {
  const subtotal = unitPrice * guests;
  const platformFee = Math.round(subtotal * PLATFORM_FEE_PERCENTAGE);
  return { subtotal, platformFee, total: subtotal + platformFee };
}

export function generateOrderNumber(): string {
  // Unambiguous alphabet (no 0/O/1/I)
  const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  const bytes = randomBytes(8);
  let out = '';
  for (let i = 0; i < 8; i++) out += alphabet[bytes[i] % alphabet.length];
  return `PL-${out}`;
}

/** Accepts "18:30" or "6:30 PM" and returns 24h "HH:mm", or null if invalid. */
export function normalizeTime(input: string): string | null {
  const m = input.trim().match(/^(\d{1,2}):(\d{2})(?:\s*(AM|PM))?$/i);
  if (!m) return null;
  let hours = parseInt(m[1], 10);
  const minutes = parseInt(m[2], 10);
  const meridiem = m[3]?.toUpperCase();
  if (minutes > 59) return null;
  if (meridiem) {
    if (hours < 1 || hours > 12) return null;
    if (meridiem === 'PM' && hours !== 12) hours += 12;
    if (meridiem === 'AM' && hours === 12) hours = 0;
  } else if (hours > 23) {
    return null;
  }
  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
}

/** YYYY-MM-DD, and not in the past (Singapore time). */
export function isValidFutureDate(dateStr: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(dateStr) || isNaN(Date.parse(dateStr))) return false;
  const todaySG = new Date().toLocaleDateString('en-CA', { timeZone: 'Asia/Singapore' });
  return dateStr >= todaySG;
}

// ---------------------------------------------------------------------------
// Provider dispatch

export function createProviderSession(
  provider: PaymentProvider,
  order: OrderForPayment
): Promise<ProviderSession> {
  switch (provider) {
    case 'stripe':
      return createStripeCheckout(order);
    case 'paypal':
      return createPayPalOrder(order);
    case 'hitpay':
      return createHitPayRequest(order);
  }
}

function verifyWithProvider(provider: PaymentProvider, providerRef: string): Promise<PaymentVerdict> {
  switch (provider) {
    case 'stripe':
      return verifyStripePayment(providerRef);
    case 'paypal':
      return verifyPayPalPayment(providerRef);
    case 'hitpay':
      return verifyHitPayPayment(providerRef);
  }
}

// ---------------------------------------------------------------------------
// Order persistence & state transitions (idempotent)

export async function getOrder(orderId: string): Promise<OrderRow | null> {
  if (!UUID_RE.test(orderId)) return null;
  const [row] = await db.select().from(orders).where(eq(orders.id, orderId));
  return row ?? null;
}

export async function getOrderByProviderRef(
  provider: PaymentProvider,
  providerRef: string
): Promise<OrderRow | null> {
  const [row] = await db
    .select()
    .from(orders)
    .where(and(eq(orders.provider, provider), eq(orders.providerRef, providerRef)));
  return row ?? null;
}

export async function markOrderPaid(orderId: string): Promise<OrderRow | null> {
  const [row] = await db
    .update(orders)
    .set({ status: 'paid', paidAt: new Date(), updatedAt: new Date() })
    .where(and(eq(orders.id, orderId), eq(orders.status, 'pending_payment')))
    .returning();
  if (row) void notifyOrderPaid(row);
  return row ?? null;
}

export async function markOrderFailed(
  orderId: string,
  reason: string,
  status: 'failed' | 'cancelled' = 'failed'
): Promise<OrderRow | null> {
  const [row] = await db
    .update(orders)
    .set({ status, failureReason: reason, updatedAt: new Date() })
    .where(and(eq(orders.id, orderId), eq(orders.status, 'pending_payment')))
    .returning();
  return row ?? null;
}

/**
 * If an order is still pending, ask its provider for the truth and settle it.
 * Called from the status endpoint and the result page so payments confirm
 * even when a webhook is delayed or misconfigured.
 */
export async function reconcileOrder(order: OrderRow): Promise<OrderRow> {
  if (order.status !== 'pending_payment' || !order.providerRef) return order;
  try {
    const verdict = await verifyWithProvider(order.provider, order.providerRef);
    if (verdict === 'paid') return (await markOrderPaid(order.id)) ?? order;
    if (verdict === 'failed') {
      return (await markOrderFailed(order.id, 'Payment failed or expired at provider')) ?? order;
    }
  } catch (err) {
    console.error(`[orders] reconcile ${order.id} (${order.provider}) failed:`, err);
  }
  return order;
}

/** Public shape returned to all three clients (web/iOS/Android). */
export function toPublicOrder(order: OrderRow) {
  return {
    orderId: order.id,
    orderNumber: order.orderNumber,
    status: order.status,
    provider: order.provider,
    total: order.total,
    currency: order.currency,
    menuName: order.menuName,
    chefName: order.chefName,
    scheduledDate: order.scheduledDate,
    scheduledTime: order.scheduledTime,
    guests: order.guestCount,
    paidAt: order.paidAt ? order.paidAt.toISOString() : null,
  };
}

/** Fire-and-forget ops notification for paid orders (Slack/CRM webhook). */
async function notifyOrderPaid(order: OrderRow): Promise<void> {
  const hook = process.env.ENQUIRY_WEBHOOK_URL;
  const summary = `💰 Paid booking ${order.orderNumber}: ${order.menuName} by ${order.chefName ?? 'unknown chef'} — ${order.guestCount} guests on ${order.scheduledDate} ${order.scheduledTime} — ${(order.total / 100).toFixed(2)} ${order.currency} via ${order.provider} (${order.customerName}, ${order.customerEmail})`;
  if (!hook) {
    console.log(`[orders] ${summary}`);
    return;
  }
  try {
    await fetch(hook, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: 'order_paid', text: summary, order: toPublicOrder(order) }),
    });
  } catch (err) {
    console.error('[orders] paid-order notification failed:', err);
  }
}
