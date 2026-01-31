import {
  pgTable,
  uuid,
  varchar,
  text,
  date,
  time,
  integer,
  timestamp,
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { bookingStatusEnum } from './enums.js';
import { users } from './users.js';
import { chefProfiles } from './chefs.js';
import { menus } from './menus.js';
import { chefAvailability } from './availability.js';
import { payments } from './payments.js';
import { reviews } from './reviews.js';
import { disputes } from './disputes.js';

export const bookings = pgTable('bookings', {
  id: uuid('id').defaultRandom().primaryKey(),
  bookingNumber: varchar('booking_number', { length: 20 }).unique().notNull(),

  customerId: uuid('customer_id')
    .references(() => users.id)
    .notNull(),
  chefId: uuid('chef_id')
    .references(() => chefProfiles.id)
    .notNull(),
  menuId: uuid('menu_id')
    .references(() => menus.id)
    .notNull(),
  availabilitySlotId: uuid('availability_slot_id').references(() => chefAvailability.id),

  // Booking details
  scheduledDate: date('scheduled_date', { mode: 'string' }).notNull(),
  scheduledTime: time('scheduled_time').notNull(),
  guestCount: integer('guest_count').default(1).notNull(),
  specialInstructions: text('special_instructions'),

  // Pricing (in cents - SGD)
  menuPrice: integer('menu_price').notNull(),
  subtotal: integer('subtotal').notNull(),
  platformFee: integer('platform_fee').notNull(), // 4%
  total: integer('total').notNull(),

  // Status tracking
  status: bookingStatusEnum('status').default('pending').notNull(),
  confirmedAt: timestamp('confirmed_at', { mode: 'date' }),
  completedAt: timestamp('completed_at', { mode: 'date' }),
  cancelledAt: timestamp('cancelled_at', { mode: 'date' }),
  cancellationReason: text('cancellation_reason'),

  // T&C acceptance
  termsAcceptedAt: timestamp('terms_accepted_at', { mode: 'date' }).notNull(),

  createdAt: timestamp('created_at', { mode: 'date' }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { mode: 'date' }).defaultNow().notNull(),
});

export const bookingsRelations = relations(bookings, ({ one }) => ({
  customer: one(users, {
    fields: [bookings.customerId],
    references: [users.id],
  }),
  chef: one(chefProfiles, {
    fields: [bookings.chefId],
    references: [chefProfiles.id],
  }),
  menu: one(menus, {
    fields: [bookings.menuId],
    references: [menus.id],
  }),
  availabilitySlot: one(chefAvailability, {
    fields: [bookings.availabilitySlotId],
    references: [chefAvailability.id],
  }),
  payment: one(payments, {
    fields: [bookings.id],
    references: [payments.bookingId],
  }),
  review: one(reviews, {
    fields: [bookings.id],
    references: [reviews.bookingId],
  }),
  dispute: one(disputes, {
    fields: [bookings.id],
    references: [disputes.bookingId],
  }),
}));
