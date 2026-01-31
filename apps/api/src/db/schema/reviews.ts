import { pgTable, uuid, varchar, text, integer, boolean, timestamp } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { bookings } from './bookings.js';
import { users } from './users.js';
import { chefProfiles } from './chefs.js';
import { menus } from './menus.js';

export const reviews = pgTable('reviews', {
  id: uuid('id').defaultRandom().primaryKey(),
  bookingId: uuid('booking_id')
    .references(() => bookings.id)
    .unique()
    .notNull(),
  customerId: uuid('customer_id')
    .references(() => users.id)
    .notNull(),
  chefId: uuid('chef_id')
    .references(() => chefProfiles.id)
    .notNull(),
  menuId: uuid('menu_id')
    .references(() => menus.id)
    .notNull(),

  rating: integer('rating').notNull(), // 1-5
  title: varchar('title', { length: 200 }),
  comment: text('comment'),

  // Chef response
  chefResponse: text('chef_response'),
  chefRespondedAt: timestamp('chef_responded_at', { mode: 'date' }),

  isVerifiedPurchase: boolean('is_verified_purchase').default(true).notNull(),
  isVisible: boolean('is_visible').default(true).notNull(),

  createdAt: timestamp('created_at', { mode: 'date' }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { mode: 'date' }).defaultNow().notNull(),
});

export const reviewsRelations = relations(reviews, ({ one }) => ({
  booking: one(bookings, {
    fields: [reviews.bookingId],
    references: [bookings.id],
  }),
  customer: one(users, {
    fields: [reviews.customerId],
    references: [users.id],
  }),
  chef: one(chefProfiles, {
    fields: [reviews.chefId],
    references: [chefProfiles.id],
  }),
  menu: one(menus, {
    fields: [reviews.menuId],
    references: [menus.id],
  }),
}));
