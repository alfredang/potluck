import { pgTable, uuid, varchar, integer, timestamp } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { paymentStatusEnum } from './enums.js';
import { bookings } from './bookings.js';

export const payments = pgTable('payments', {
  id: uuid('id').defaultRandom().primaryKey(),
  bookingId: uuid('booking_id')
    .references(() => bookings.id)
    .unique()
    .notNull(),

  // Stripe references
  stripePaymentIntentId: varchar('stripe_payment_intent_id', { length: 255 }).unique(),
  stripeTransferId: varchar('stripe_transfer_id', { length: 255 }),

  // Amounts (in cents - SGD)
  amount: integer('amount').notNull(),
  platformFee: integer('platform_fee').notNull(),
  chefPayout: integer('chef_payout').notNull(),
  currency: varchar('currency', { length: 3 }).default('SGD').notNull(),

  // Status
  status: paymentStatusEnum('status').default('pending').notNull(),

  // Escrow management
  capturedAt: timestamp('captured_at', { mode: 'date' }),
  releaseScheduledAt: timestamp('release_scheduled_at', { mode: 'date' }),
  releasedAt: timestamp('released_at', { mode: 'date' }),
  refundedAt: timestamp('refunded_at', { mode: 'date' }),

  // Metadata
  paymentMethod: varchar('payment_method', { length: 50 }),
  last4: varchar('last_4', { length: 4 }),
  cardBrand: varchar('card_brand', { length: 20 }),

  createdAt: timestamp('created_at', { mode: 'date' }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { mode: 'date' }).defaultNow().notNull(),
});

export const paymentsRelations = relations(payments, ({ one }) => ({
  booking: one(bookings, {
    fields: [payments.bookingId],
    references: [bookings.id],
  }),
}));
