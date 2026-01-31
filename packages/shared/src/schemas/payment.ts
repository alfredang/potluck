import { z } from 'zod';

export const createPaymentIntentSchema = z.object({
  bookingId: z.string().uuid('Invalid booking ID'),
});

export const confirmPaymentSchema = z.object({
  paymentIntentId: z.string().min(1, 'Payment intent ID is required'),
  paymentMethodId: z.string().min(1, 'Payment method ID is required'),
});

export const subscriptionTierSchema = z.enum(['free', 'basic', 'pro', 'unlimited']);

export const subscribeSchema = z.object({
  tier: subscriptionTierSchema.refine((val) => val !== 'free', {
    message: 'Cannot subscribe to free tier',
  }),
  paymentMethodId: z.string().min(1, 'Payment method ID is required'),
});

export const changeSubscriptionSchema = z.object({
  tier: subscriptionTierSchema,
});

export type CreatePaymentIntentInput = z.infer<typeof createPaymentIntentSchema>;
export type ConfirmPaymentInput = z.infer<typeof confirmPaymentSchema>;
export type SubscribeInput = z.infer<typeof subscribeSchema>;
export type ChangeSubscriptionInput = z.infer<typeof changeSubscriptionSchema>;
