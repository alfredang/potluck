import { z } from 'zod';

export const createBookingSchema = z.object({
  chefId: z.string().uuid('Invalid chef ID'),
  menuId: z.string().uuid('Invalid menu ID'),
  availabilitySlotId: z.string().uuid('Invalid availability slot ID'),
  scheduledDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format'),
  scheduledTime: z.string().regex(/^\d{2}:\d{2}$/, 'Time must be in HH:MM format'),
  guestCount: z.number().int().min(1, 'At least 1 guest required').max(20, 'Maximum 20 guests'),
  specialInstructions: z.string().max(500).optional(),
  termsAccepted: z.literal(true, {
    errorMap: () => ({ message: 'You must accept the terms and conditions' }),
  }),
});

export const updateBookingStatusSchema = z.object({
  status: z.enum(['confirmed', 'in_progress', 'completed']),
});

export const cancelBookingSchema = z.object({
  reason: z.string().min(1, 'Cancellation reason is required').max(500),
});

export const raiseDisputeSchema = z.object({
  reason: z.string().min(1).max(100),
  description: z.string().min(10, 'Please provide more details').max(2000),
});

export const resolveDisputeSchema = z.object({
  resolution: z.string().min(1).max(2000),
  action: z.enum(['refund_customer', 'pay_chef', 'partial_refund', 'no_action']),
  refundAmount: z.number().int().min(0).optional(), // in cents, for partial refund
});

export const bookingQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(20),
  status: z
    .enum(['pending', 'confirmed', 'in_progress', 'completed', 'cancelled', 'disputed'])
    .optional(),
  startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  endDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
});

export type CreateBookingInput = z.infer<typeof createBookingSchema>;
export type UpdateBookingStatusInput = z.infer<typeof updateBookingStatusSchema>;
export type CancelBookingInput = z.infer<typeof cancelBookingSchema>;
export type RaiseDisputeInput = z.infer<typeof raiseDisputeSchema>;
export type ResolveDisputeInput = z.infer<typeof resolveDisputeSchema>;
export type BookingQueryInput = z.infer<typeof bookingQuerySchema>;
