import {
  pgTable,
  uuid,
  varchar,
  text,
  timestamp,
  boolean,
  decimal,
  integer,
  json,
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { chefProfiles } from './chefs.js';
import { bookings } from './bookings.js';
import { reviews } from './reviews.js';

export const menuCategories = pgTable('menu_categories', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: varchar('name', { length: 100 }).unique().notNull(),
  slug: varchar('slug', { length: 100 }).unique().notNull(),
  description: text('description'),
  iconUrl: text('icon_url'),
  displayOrder: integer('display_order').default(0).notNull(),
  isActive: boolean('is_active').default(true).notNull(),
  createdAt: timestamp('created_at', { mode: 'date' }).defaultNow().notNull(),
});

export const menuCategoriesRelations = relations(menuCategories, ({ many }) => ({
  menus: many(menus),
}));

export const menus = pgTable('menus', {
  id: uuid('id').defaultRandom().primaryKey(),
  chefId: uuid('chef_id')
    .references(() => chefProfiles.id, { onDelete: 'cascade' })
    .notNull(),
  categoryId: uuid('category_id')
    .references(() => menuCategories.id)
    .notNull(),

  name: varchar('name', { length: 200 }).notNull(),
  description: text('description'),
  price: integer('price').notNull(), // in cents (SGD)
  currency: varchar('currency', { length: 3 }).default('SGD').notNull(),

  // Images (array of URLs)
  images: json('images').$type<string[]>().default([]),

  // Dietary info
  isVegetarian: boolean('is_vegetarian').default(false).notNull(),
  isVegan: boolean('is_vegan').default(false).notNull(),
  isGlutenFree: boolean('is_gluten_free').default(false).notNull(),
  allergens: json('allergens').$type<string[]>().default([]),

  // Serving info
  servingSize: varchar('serving_size', { length: 50 }),
  preparationTime: integer('preparation_time'), // minutes

  // Status
  isAvailable: boolean('is_available').default(true).notNull(),
  isFeatured: boolean('is_featured').default(false).notNull(),

  // Stats
  totalOrders: integer('total_orders').default(0).notNull(),
  averageRating: decimal('average_rating', { precision: 3, scale: 2 }).default('0').notNull(),

  createdAt: timestamp('created_at', { mode: 'date' }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { mode: 'date' }).defaultNow().notNull(),
});

export const menusRelations = relations(menus, ({ one, many }) => ({
  chef: one(chefProfiles, {
    fields: [menus.chefId],
    references: [chefProfiles.id],
  }),
  category: one(menuCategories, {
    fields: [menus.categoryId],
    references: [menuCategories.id],
  }),
  bookings: many(bookings),
  reviews: many(reviews),
}));
