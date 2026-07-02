import { NextResponse } from 'next/server';
import { eq } from 'drizzle-orm';
import { db } from '../../../lib/db';
import { orders } from '../../../lib/schema';
import {
  computeAmounts,
  createProviderSession,
  ensureOrdersSchema,
  generateOrderNumber,
  isValidFutureDate,
  markOrderFailed,
  normalizeTime,
  resolveMenu,
} from '../../../lib/orders';
import {
  CHECKOUT_PLATFORMS,
  PAYMENT_PROVIDERS,
  PaymentConfigError,
  type CheckoutPlatform,
  type PaymentProvider,
} from '../../../lib/payments/types';

export const dynamic = 'force-dynamic';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

interface CheckoutBody {
  menuId?: string;
  guests?: number;
  scheduledDate?: string;
  scheduledTime?: string;
  specialRequests?: string | null;
  customerName?: string;
  customerEmail?: string;
  customerPhone?: string | null;
  provider?: string;
  platform?: string;
}

export async function POST(req: Request) {
  const body = (await req.json().catch(() => null)) as CheckoutBody | null;
  if (!body) return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });

  // --- Validate ---
  const provider = body.provider as PaymentProvider;
  if (!PAYMENT_PROVIDERS.includes(provider)) {
    return NextResponse.json({ error: 'Invalid payment provider' }, { status: 400 });
  }
  const platform: CheckoutPlatform = CHECKOUT_PLATFORMS.includes(body.platform as CheckoutPlatform)
    ? (body.platform as CheckoutPlatform)
    : 'web';

  const guests = Number(body.guests);
  if (!Number.isInteger(guests) || guests < 1 || guests > 20) {
    return NextResponse.json({ error: 'Guests must be between 1 and 20' }, { status: 400 });
  }
  if (!body.scheduledDate || !isValidFutureDate(body.scheduledDate)) {
    return NextResponse.json({ error: 'Invalid or past date (expected YYYY-MM-DD)' }, { status: 400 });
  }
  const scheduledTime = body.scheduledTime ? normalizeTime(body.scheduledTime) : null;
  if (!scheduledTime) {
    return NextResponse.json({ error: 'Invalid time (expected HH:mm)' }, { status: 400 });
  }
  const customerName = body.customerName?.trim();
  if (!customerName || customerName.length > 200) {
    return NextResponse.json({ error: 'Name is required' }, { status: 400 });
  }
  const customerEmail = body.customerEmail?.trim().toLowerCase();
  if (!customerEmail || customerEmail.length > 255 || !EMAIL_RE.test(customerEmail)) {
    return NextResponse.json({ error: 'A valid email is required' }, { status: 400 });
  }
  const customerPhone = body.customerPhone?.trim().slice(0, 50) || null;
  const specialRequests = body.specialRequests?.trim().slice(0, 2000) || null;

  if (!body.menuId) return NextResponse.json({ error: 'menuId is required' }, { status: 400 });
  const menu = await resolveMenu(body.menuId);
  if (!menu) return NextResponse.json({ error: 'Menu not found' }, { status: 404 });

  // --- Create the order (server-side pricing) ---
  await ensureOrdersSchema();
  const amounts = computeAmounts(menu.unitPrice, guests);
  const [order] = await db
    .insert(orders)
    .values({
      orderNumber: generateOrderNumber(),
      menuId: menu.menuId,
      menuName: menu.menuName,
      chefId: menu.chefId,
      chefName: menu.chefName,
      customerName,
      customerEmail,
      customerPhone,
      scheduledDate: body.scheduledDate,
      scheduledTime,
      guestCount: guests,
      specialRequests,
      unitPrice: menu.unitPrice,
      subtotal: amounts.subtotal,
      platformFee: amounts.platformFee,
      total: amounts.total,
      currency: 'SGD',
      provider,
      platform,
    })
    .returning();

  // --- Create the hosted payment session ---
  try {
    const session = await createProviderSession(provider, {
      id: order.id,
      orderNumber: order.orderNumber,
      menuName: order.menuName,
      chefName: order.chefName,
      customerName,
      customerEmail,
      total: order.total,
      currency: order.currency,
      platform,
    });
    await db
      .update(orders)
      .set({ providerRef: session.providerRef, updatedAt: new Date() })
      .where(eq(orders.id, order.id));
    return NextResponse.json({
      orderId: order.id,
      orderNumber: order.orderNumber,
      amount: {
        subtotal: order.subtotal,
        platformFee: order.platformFee,
        total: order.total,
        currency: order.currency,
      },
      redirectUrl: session.redirectUrl,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Payment provider error';
    console.error(`[checkout] ${provider} session failed for ${order.id}:`, err);
    await markOrderFailed(order.id, message);
    const status = err instanceof PaymentConfigError ? 503 : 502;
    return NextResponse.json(
      { error: status === 503 ? message : 'Could not start the payment. Please try another payment method.' },
      { status }
    );
  }
}
