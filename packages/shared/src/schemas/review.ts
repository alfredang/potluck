import { z } from 'zod';

export const createReviewSchema = z.object({
  bookingId: z.string().uuid('Invalid booking ID'),
  rating: z.number().int().min(1, 'Rating must be at least 1').max(5, 'Rating must be at most 5'),
  title: z.string().max(200).optional(),
  comment: z.string().max(2000).optional(),
});

export const updateReviewSchema = z.object({
  rating: z
    .number()
    .int()
    .min(1, 'Rating must be at least 1')
    .max(5, 'Rating must be at most 5')
    .optional(),
  title: z.string().max(200).optional(),
  comment: z.string().max(2000).optional(),
});

export const chefResponseSchema = z.object({
  response: z.string().min(1, 'Response is required').max(1000),
});

export const reviewQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(20),
  rating: z.coerce.number().int().min(1).max(5).optional(),
  sortBy: z.enum(['rating', 'date']).default('date'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
});

export type CreateReviewInput = z.infer<typeof createReviewSchema>;
export type UpdateReviewInput = z.infer<typeof updateReviewSchema>;
export type ChefResponseInput = z.infer<typeof chefResponseSchema>;
export type ReviewQueryInput = z.infer<typeof reviewQuerySchema>;
