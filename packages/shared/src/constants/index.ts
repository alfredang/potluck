import type { SubscriptionPlan, FoodCategory } from '../types/index.js';

// Platform fee percentage (4%)
export const PLATFORM_FEE_PERCENTAGE = 0.04;

// Currency
export const DEFAULT_CURRENCY = 'SGD';

// Singapore coordinates (center)
export const SINGAPORE_CENTER = {
  latitude: 1.3521,
  longitude: 103.8198,
};

// Default search radius in km
export const DEFAULT_SEARCH_RADIUS_KM = 10;

// Subscription plans
export const SUBSCRIPTION_PLANS: Record<string, SubscriptionPlan> = {
  free: {
    tier: 'free',
    name: 'Free',
    price: 0,
    maxMenus: 1,
    features: ['1 menu listing', 'Basic profile', 'Booking management'],
  },
  basic: {
    tier: 'basic',
    name: 'Basic',
    price: 10, // SGD
    maxMenus: 3,
    features: ['Up to 3 menu listings', 'Basic profile', 'Booking management', 'Email support'],
  },
  pro: {
    tier: 'pro',
    name: 'Pro',
    price: 20, // SGD
    maxMenus: 10,
    features: [
      'Up to 10 menu listings',
      'Featured badge',
      'Priority support',
      'Analytics dashboard',
    ],
  },
  unlimited: {
    tier: 'unlimited',
    name: 'Unlimited',
    price: 30, // SGD
    maxMenus: -1,
    features: [
      'Unlimited menu listings',
      'Featured badge',
      'Priority support',
      'Analytics dashboard',
      'Custom promotions',
    ],
  },
};

// Food categories with display info
export const FOOD_CATEGORIES: Array<{
  slug: FoodCategory;
  name: string;
  emoji: string;
}> = [
  { slug: 'chinese', name: 'Chinese', emoji: '🥡' },
  { slug: 'western', name: 'Western', emoji: '🍝' },
  { slug: 'thai', name: 'Thai', emoji: '🍜' },
  { slug: 'japanese', name: 'Japanese', emoji: '🍱' },
  { slug: 'korean', name: 'Korean', emoji: '🍲' },
  { slug: 'malay', name: 'Malay', emoji: '🍛' },
  { slug: 'indian', name: 'Indian', emoji: '🫓' },
  { slug: 'halal', name: 'Halal', emoji: '☪️' },
  { slug: 'vegetarian', name: 'Vegetarian', emoji: '🥗' },
];

// Booking status display
export const BOOKING_STATUS_DISPLAY = {
  pending: { label: 'Pending', color: 'yellow' },
  confirmed: { label: 'Confirmed', color: 'blue' },
  in_progress: { label: 'In Progress', color: 'purple' },
  completed: { label: 'Completed', color: 'green' },
  cancelled: { label: 'Cancelled', color: 'red' },
  disputed: { label: 'Disputed', color: 'orange' },
} as const;

// Payment status display
export const PAYMENT_STATUS_DISPLAY = {
  pending: { label: 'Pending', color: 'yellow' },
  held: { label: 'On Hold', color: 'blue' },
  released: { label: 'Released', color: 'green' },
  refunded: { label: 'Refunded', color: 'purple' },
  failed: { label: 'Failed', color: 'red' },
} as const;

// JWT token expiry
export const ACCESS_TOKEN_EXPIRY = '15m';
export const REFRESH_TOKEN_EXPIRY = '7d';
export const REFRESH_TOKEN_EXPIRY_DAYS = 7;

// Auto-release payment after X hours from scheduled dining time
export const PAYMENT_AUTO_RELEASE_HOURS = 24;

// Max file upload size (5MB)
export const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024;

// Allowed image mime types
export const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

// Pagination defaults
export const DEFAULT_PAGE_SIZE = 20;
export const MAX_PAGE_SIZE = 50;
