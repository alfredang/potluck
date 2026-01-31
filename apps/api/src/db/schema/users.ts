import { pgTable, uuid, varchar, text, timestamp, boolean } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { userRoleEnum } from './enums.js';

export const users = pgTable('users', {
  id: uuid('id').defaultRandom().primaryKey(),
  email: varchar('email', { length: 255 }).unique().notNull(),
  passwordHash: varchar('password_hash', { length: 255 }),
  role: userRoleEnum('role').default('customer').notNull(),
  firstName: varchar('first_name', { length: 100 }).notNull(),
  lastName: varchar('last_name', { length: 100 }).notNull(),
  phone: varchar('phone', { length: 20 }),
  avatarUrl: text('avatar_url'),

  // OAuth
  googleId: varchar('google_id', { length: 255 }),
  appleId: varchar('apple_id', { length: 255 }),

  // Stripe customer ID (for subscription billing)
  stripeCustomerId: varchar('stripe_customer_id', { length: 255 }),

  // Status
  emailVerified: boolean('email_verified').default(false).notNull(),
  emailVerificationToken: varchar('email_verification_token', { length: 255 }),
  passwordResetToken: varchar('password_reset_token', { length: 255 }),
  passwordResetExpires: timestamp('password_reset_expires', { mode: 'date' }),
  isActive: boolean('is_active').default(true).notNull(),
  lastLoginAt: timestamp('last_login_at', { mode: 'date' }),

  createdAt: timestamp('created_at', { mode: 'date' }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { mode: 'date' }).defaultNow().notNull(),
});

export const usersRelations = relations(users, ({ one, many }) => ({
  chefProfile: one(chefProfiles, {
    fields: [users.id],
    references: [chefProfiles.userId],
  }),
  bookingsAsCustomer: many(bookings),
  reviews: many(reviews),
}));

// Forward declarations for relations (will be properly imported in index.ts)
import { chefProfiles } from './chefs.js';
import { bookings } from './bookings.js';
import { reviews } from './reviews.js';
