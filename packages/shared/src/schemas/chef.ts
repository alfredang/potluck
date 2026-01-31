import { z } from 'zod';

export const chefProfileSchema = z.object({
  bio: z.string().max(1000).optional(),
  specialties: z.array(z.string()).max(10).optional(),

  // Address
  streetAddress: z.string().max(255).optional(),
  city: z.string().max(100).optional(),
  state: z.string().max(100).optional(),
  postalCode: z.string().max(20).optional(),
  country: z.string().max(100).default('Singapore'),
  latitude: z.number().min(-90).max(90).optional(),
  longitude: z.number().min(-180).max(180).optional(),

  // Social Links
  instagramUrl: z.string().url().optional().or(z.literal('')),
  facebookUrl: z.string().url().optional().or(z.literal('')),
  tiktokUrl: z.string().url().optional().or(z.literal('')),
  websiteUrl: z.string().url().optional().or(z.literal('')),
});

export const updateChefProfileSchema = chefProfileSchema.partial();

export const chefAvailabilitySchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format'),
  startTime: z.string().regex(/^\d{2}:\d{2}$/, 'Time must be in HH:MM format'),
  endTime: z.string().regex(/^\d{2}:\d{2}$/, 'Time must be in HH:MM format'),
  maxBookings: z.number().int().min(1).max(20).default(5),
});

export const chefQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(20),
  search: z.string().optional(),
  category: z.string().optional(),
  rating: z.coerce.number().min(1).max(5).optional(),
  lat: z.coerce.number().min(-90).max(90).optional(),
  lng: z.coerce.number().min(-180).max(180).optional(),
  radius: z.coerce.number().min(1).max(50).optional(), // km
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  isVerified: z.coerce.boolean().optional(),
});

export type ChefProfileInput = z.infer<typeof chefProfileSchema>;
export type UpdateChefProfileInput = z.infer<typeof updateChefProfileSchema>;
export type ChefAvailabilityInput = z.infer<typeof chefAvailabilitySchema>;
export type ChefQueryInput = z.infer<typeof chefQuerySchema>;
