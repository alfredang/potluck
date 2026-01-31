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
import { users } from './users.js';
import { menus } from './menus.js';
import { chefAvailability } from './availability.js';
import { bookings } from './bookings.js';
import { reviews } from './reviews.js';
import { subscriptions } from './subscriptions.js';

export const chefProfiles = pgTable('chef_profiles', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id')
    .references(() => users.id, { onDelete: 'cascade' })
    .unique()
    .notNull(),

  bio: text('bio'),
  specialties: json('specialties').$type<string[]>().default([]),

  // Address
  streetAddress: varchar('street_address', { length: 255 }),
  city: varchar('city', { length: 100 }),
  state: varchar('state', { length: 100 }),
  postalCode: varchar('postal_code', { length: 20 }),
  country: varchar('country', { length: 100 }).default('Singapore').notNull(),
  latitude: decimal('latitude', { precision: 10, scale: 8 }),
  longitude: decimal('longitude', { precision: 11, scale: 8 }),

  // Social Links
  instagramUrl: text('instagram_url'),
  facebookUrl: text('facebook_url'),
  tiktokUrl: text('tiktok_url'),
  websiteUrl: text('website_url'),

  // Stripe Connect
  stripeAccountId: varchar('stripe_account_id', { length: 255 }),
  stripeOnboardingComplete: boolean('stripe_onboarding_complete').default(false).notNull(),

  // Ratings
  averageRating: decimal('average_rating', { precision: 3, scale: 2 }).default('0').notNull(),
  totalReviews: integer('total_reviews').default(0).notNull(),

  // Status
  isVerified: boolean('is_verified').default(false).notNull(),
  isAvailable: boolean('is_available').default(true).notNull(),

  createdAt: timestamp('created_at', { mode: 'date' }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { mode: 'date' }).defaultNow().notNull(),
});

export const chefProfilesRelations = relations(chefProfiles, ({ one, many }) => ({
  user: one(users, {
    fields: [chefProfiles.userId],
    references: [users.id],
  }),
  menus: many(menus),
  availability: many(chefAvailability),
  bookings: many(bookings),
  reviews: many(reviews),
  subscription: one(subscriptions, {
    fields: [chefProfiles.id],
    references: [subscriptions.chefId],
  }),
}));
