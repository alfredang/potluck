import { pgTable, uuid, date, time, integer, boolean, timestamp } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { chefProfiles } from './chefs.js';
import { bookings } from './bookings.js';

export const chefAvailability = pgTable('chef_availability', {
  id: uuid('id').defaultRandom().primaryKey(),
  chefId: uuid('chef_id')
    .references(() => chefProfiles.id, { onDelete: 'cascade' })
    .notNull(),

  date: date('date', { mode: 'string' }).notNull(),
  startTime: time('start_time').notNull(),
  endTime: time('end_time').notNull(),

  maxBookings: integer('max_bookings').default(5).notNull(),
  currentBookings: integer('current_bookings').default(0).notNull(),

  isAvailable: boolean('is_available').default(true).notNull(),

  createdAt: timestamp('created_at', { mode: 'date' }).defaultNow().notNull(),
});

export const chefAvailabilityRelations = relations(chefAvailability, ({ one, many }) => ({
  chef: one(chefProfiles, {
    fields: [chefAvailability.chefId],
    references: [chefProfiles.id],
  }),
  bookings: many(bookings),
}));
