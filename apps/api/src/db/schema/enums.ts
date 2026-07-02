import { pgEnum } from 'drizzle-orm/pg-core';

export const userRoleEnum = pgEnum('user_role', ['customer', 'chef', 'admin']);

export const subscriptionTierEnum = pgEnum('subscription_tier', [
  'free',
  'basic',
  'pro',
  'unlimited',
]);

export const bookingStatusEnum = pgEnum('booking_status', [
  'pending',
  'confirmed',
  'in_progress',
  'completed',
  'cancelled',
  'disputed',
]);

export const paymentStatusEnum = pgEnum('payment_status', [
  'pending',
  'held',
  'released',
  'refunded',
  'failed',
]);

export const disputeStatusEnum = pgEnum('dispute_status', [
  'open',
  'under_review',
  'resolved',
  'escalated',
]);

export const subscriptionStatusEnum = pgEnum('subscription_status', [
  'active',
  'canceled',
  'past_due',
]);

export const paymentProviderEnum = pgEnum('payment_provider', ['stripe', 'paypal', 'hitpay']);

export const orderStatusEnum = pgEnum('order_status', [
  'pending_payment',
  'paid',
  'failed',
  'cancelled',
  'refunded',
]);

export const orderPlatformEnum = pgEnum('order_platform', ['web', 'ios', 'android']);
