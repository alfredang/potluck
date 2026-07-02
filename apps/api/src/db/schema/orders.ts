import { pgTable, uuid, varchar, integer, text, date, timestamp, index } from 'drizzle-orm/pg-core';
import { orderPlatformEnum, orderStatusEnum, paymentProviderEnum } from './enums';

// Checkout orders — one row per paid booking request, provider-agnostic.
// menuId/chefId are stored as text (not FKs) so orders work for both the
// static marketing-site menus (slug ids like "sarah-tan-1") and DB menus (uuids).
export const orders = pgTable(
  'orders',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    orderNumber: varchar('order_number', { length: 20 }).unique().notNull(),

    // What is being booked
    menuId: text('menu_id').notNull(),
    menuName: varchar('menu_name', { length: 255 }).notNull(),
    chefId: text('chef_id'),
    chefName: varchar('chef_name', { length: 255 }),

    // Who is booking (guest checkout — no users FK required)
    customerName: varchar('customer_name', { length: 255 }).notNull(),
    customerEmail: varchar('customer_email', { length: 255 }).notNull(),
    customerPhone: varchar('customer_phone', { length: 50 }),

    // When
    scheduledDate: date('scheduled_date').notNull(),
    scheduledTime: varchar('scheduled_time', { length: 10 }).notNull(), // 24h "HH:mm"
    guestCount: integer('guest_count').notNull(),
    specialRequests: text('special_requests'),

    // Amounts (in cents - SGD)
    unitPrice: integer('unit_price').notNull(),
    subtotal: integer('subtotal').notNull(),
    platformFee: integer('platform_fee').notNull(), // 4%
    total: integer('total').notNull(),
    currency: varchar('currency', { length: 3 }).default('SGD').notNull(),

    // Payment
    provider: paymentProviderEnum('provider').notNull(),
    providerRef: varchar('provider_ref', { length: 255 }), // Stripe session / PayPal order / HitPay request id
    status: orderStatusEnum('status').default('pending_payment').notNull(),
    platform: orderPlatformEnum('platform').default('web').notNull(),
    paidAt: timestamp('paid_at', { mode: 'date' }),
    failureReason: text('failure_reason'),

    createdAt: timestamp('created_at', { mode: 'date' }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { mode: 'date' }).defaultNow().notNull(),
  },
  (table) => [
    index('orders_provider_ref_idx').on(table.providerRef),
    index('orders_status_idx').on(table.status),
    index('orders_customer_email_idx').on(table.customerEmail),
  ]
);
