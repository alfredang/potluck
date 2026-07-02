import { pgTable, uuid, varchar, integer, text, boolean, timestamp, index } from 'drizzle-orm/pg-core';
import { orderPlatformEnum } from './enums';

// Public chef reviews written from the website and mobile apps.
// chefId is text (not an FK) so reviews work for both the static marketing
// chefs (slug ids like "sarah-tan") and DB chefs (uuids) — same convention
// as the checkout `orders` table.
export const chefReviews = pgTable(
  'chef_reviews',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    chefId: text('chef_id').notNull(),

    authorName: varchar('author_name', { length: 100 }).notNull(),
    authorEmail: varchar('author_email', { length: 255 }),

    rating: integer('rating').notNull(), // 1-5
    title: varchar('title', { length: 200 }),
    body: text('body').notNull(),

    // Set when the review is linked to a paid checkout order
    orderId: uuid('order_id'),
    verifiedBooking: boolean('verified_booking').default(false).notNull(),

    platform: orderPlatformEnum('platform').default('web').notNull(),
    isVisible: boolean('is_visible').default(true).notNull(),

    createdAt: timestamp('created_at', { mode: 'date' }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { mode: 'date' }).defaultNow().notNull(),
  },
  (table) => [
    index('chef_reviews_chef_id_idx').on(table.chefId),
    index('chef_reviews_visible_idx').on(table.isVisible),
  ]
);
