import { z } from 'zod';

export const foodCategorySchema = z.enum([
  'chinese',
  'western',
  'thai',
  'japanese',
  'korean',
  'malay',
  'indian',
  'halal',
  'vegetarian',
]);

export const createMenuSchema = z.object({
  categoryId: z.string().uuid('Invalid category ID'),
  name: z.string().min(1, 'Name is required').max(200),
  description: z.string().max(2000).optional(),
  price: z.number().int().min(100, 'Minimum price is $1.00'), // in cents (SGD)
  images: z.array(z.string().url()).max(10).optional(),

  // Dietary info
  isVegetarian: z.boolean().default(false),
  isVegan: z.boolean().default(false),
  isGlutenFree: z.boolean().default(false),
  allergens: z.array(z.string()).max(20).optional(),

  // Serving info
  servingSize: z.string().max(50).optional(),
  preparationTime: z.number().int().min(1).max(480).optional(), // minutes
});

export const updateMenuSchema = createMenuSchema.partial();

export const menuQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(20),
  search: z.string().optional(),
  category: foodCategorySchema.optional(),
  chefId: z.string().uuid().optional(),
  minPrice: z.coerce.number().int().min(0).optional(),
  maxPrice: z.coerce.number().int().min(0).optional(),
  rating: z.coerce.number().min(1).max(5).optional(),
  isVegetarian: z.coerce.boolean().optional(),
  isVegan: z.coerce.boolean().optional(),
  isGlutenFree: z.coerce.boolean().optional(),
  lat: z.coerce.number().min(-90).max(90).optional(),
  lng: z.coerce.number().min(-180).max(180).optional(),
  radius: z.coerce.number().min(1).max(50).optional(),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  sortBy: z.enum(['price', 'rating', 'orders', 'distance']).optional(),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
});

export type CreateMenuInput = z.infer<typeof createMenuSchema>;
export type UpdateMenuInput = z.infer<typeof updateMenuSchema>;
export type MenuQueryInput = z.infer<typeof menuQuerySchema>;
