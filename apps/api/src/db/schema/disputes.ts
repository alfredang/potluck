import { pgTable, uuid, varchar, text, timestamp } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { disputeStatusEnum } from './enums';
import { bookings } from './bookings';
import { users } from './users';

export const disputes = pgTable('disputes', {
  id: uuid('id').defaultRandom().primaryKey(),
  bookingId: uuid('booking_id')
    .references(() => bookings.id)
    .notNull(),
  raisedById: uuid('raised_by_id')
    .references(() => users.id)
    .notNull(),

  reason: varchar('reason', { length: 100 }).notNull(),
  description: text('description').notNull(),

  status: disputeStatusEnum('status').default('open').notNull(),
  resolution: text('resolution'),
  resolvedById: uuid('resolved_by_id').references(() => users.id),
  resolvedAt: timestamp('resolved_at', { mode: 'date' }),

  createdAt: timestamp('created_at', { mode: 'date' }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { mode: 'date' }).defaultNow().notNull(),
});

export const disputesRelations = relations(disputes, ({ one }) => ({
  booking: one(bookings, {
    fields: [disputes.bookingId],
    references: [bookings.id],
  }),
  raisedBy: one(users, {
    fields: [disputes.raisedById],
    references: [users.id],
    relationName: 'raisedBy',
  }),
  resolvedBy: one(users, {
    fields: [disputes.resolvedById],
    references: [users.id],
    relationName: 'resolvedBy',
  }),
}));
