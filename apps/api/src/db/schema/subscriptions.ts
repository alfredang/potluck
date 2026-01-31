import { pgTable, uuid, varchar, integer, boolean, timestamp } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { subscriptionTierEnum, subscriptionStatusEnum } from './enums';
import { chefProfiles } from './chefs';

export const subscriptions = pgTable('subscriptions', {
  id: uuid('id').defaultRandom().primaryKey(),
  chefId: uuid('chef_id')
    .references(() => chefProfiles.id, { onDelete: 'cascade' })
    .unique()
    .notNull(),

  tier: subscriptionTierEnum('tier').default('free').notNull(),
  stripeSubscriptionId: varchar('stripe_subscription_id', { length: 255 }),
  stripePriceId: varchar('stripe_price_id', { length: 255 }),

  // Limits based on tier
  maxMenus: integer('max_menus').default(1).notNull(), // free:1, basic:3, pro:10, unlimited:-1

  currentPeriodStart: timestamp('current_period_start', { mode: 'date' }),
  currentPeriodEnd: timestamp('current_period_end', { mode: 'date' }),
  cancelAtPeriodEnd: boolean('cancel_at_period_end').default(false).notNull(),

  status: subscriptionStatusEnum('status').default('active').notNull(),

  createdAt: timestamp('created_at', { mode: 'date' }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { mode: 'date' }).defaultNow().notNull(),
});

export const subscriptionsRelations = relations(subscriptions, ({ one, many }) => ({
  chef: one(chefProfiles, {
    fields: [subscriptions.chefId],
    references: [chefProfiles.id],
  }),
  payments: many(subscriptionPayments),
}));

// Subscription payment history
export const subscriptionPayments = pgTable('subscription_payments', {
  id: uuid('id').defaultRandom().primaryKey(),
  subscriptionId: uuid('subscription_id')
    .references(() => subscriptions.id)
    .notNull(),

  stripeInvoiceId: varchar('stripe_invoice_id', { length: 255 }),
  amount: integer('amount').notNull(), // in cents
  currency: varchar('currency', { length: 3 }).default('SGD').notNull(),

  status: varchar('status', { length: 50 }).notNull(), // paid, failed, pending
  paidAt: timestamp('paid_at', { mode: 'date' }),

  periodStart: timestamp('period_start', { mode: 'date' }).notNull(),
  periodEnd: timestamp('period_end', { mode: 'date' }).notNull(),

  createdAt: timestamp('created_at', { mode: 'date' }).defaultNow().notNull(),
});

export const subscriptionPaymentsRelations = relations(subscriptionPayments, ({ one }) => ({
  subscription: one(subscriptions, {
    fields: [subscriptionPayments.subscriptionId],
    references: [subscriptions.id],
  }),
}));
