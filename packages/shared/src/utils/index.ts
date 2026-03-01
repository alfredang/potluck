import { PLATFORM_FEE_PERCENTAGE } from '../constants/index';

/**
 * Format price from cents to display string
 * @param cents Price in cents
 * @param currency Currency code (default: SGD)
 * @returns Formatted price string (e.g., "S$12.50")
 */
export function formatPrice(cents: number, currency = 'SGD'): string {
  const dollars = cents / 100;
  const formatter = new Intl.NumberFormat('en-SG', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  return formatter.format(dollars);
}

/**
 * Calculate platform fee from subtotal
 * @param subtotalCents Subtotal in cents
 * @returns Platform fee in cents
 */
export function calculatePlatformFee(subtotalCents: number): number {
  return Math.round(subtotalCents * PLATFORM_FEE_PERCENTAGE);
}

/**
 * Calculate total with platform fee
 * @param subtotalCents Subtotal in cents
 * @returns Object with subtotal, platformFee, and total (all in cents)
 */
export function calculateBookingTotal(subtotalCents: number): {
  subtotal: number;
  platformFee: number;
  total: number;
} {
  const platformFee = calculatePlatformFee(subtotalCents);
  return {
    subtotal: subtotalCents,
    platformFee,
    total: subtotalCents + platformFee,
  };
}

/**
 * Calculate chef payout (total minus platform fee)
 * @param totalCents Total in cents
 * @returns Chef payout in cents
 */
export function calculateChefPayout(totalCents: number): number {
  const platformFee = Math.round(totalCents * PLATFORM_FEE_PERCENTAGE);
  return totalCents - platformFee;
}

/**
 * Generate a unique booking number
 * Format: HC-YYYYMMDD-XXXXX (e.g., HC-20240115-A3F7K)
 */
export function generateBookingNumber(): string {
  const date = new Date();
  const dateStr = date.toISOString().slice(0, 10).replace(/-/g, '');
  const random = Math.random().toString(36).substring(2, 7).toUpperCase();
  return `HC-${dateStr}-${random}`;
}

/**
 * Calculate distance between two coordinates using Haversine formula
 * @param lat1 Latitude of point 1
 * @param lng1 Longitude of point 1
 * @param lat2 Latitude of point 2
 * @param lng2 Longitude of point 2
 * @returns Distance in kilometers
 */
export function calculateDistance(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number {
  const R = 6371; // Earth's radius in km
  const dLat = toRadians(lat2 - lat1);
  const dLng = toRadians(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) *
      Math.cos(toRadians(lat2)) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function toRadians(degrees: number): number {
  return degrees * (Math.PI / 180);
}

/**
 * Format date for display
 * @param date Date string or Date object
 * @returns Formatted date string (e.g., "15 Jan 2024")
 */
export function formatDate(date: string | Date): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString('en-SG', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

/**
 * Format time for display
 * @param time Time string in HH:MM format
 * @returns Formatted time string (e.g., "7:30 PM")
 */
export function formatTime(time: string): string {
  const [hours, minutes] = time.split(':').map(Number);
  const date = new Date();
  date.setHours(hours ?? 0, minutes ?? 0);
  return date.toLocaleTimeString('en-SG', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
}

/**
 * Get initials from first and last name
 * @param firstName First name
 * @param lastName Last name
 * @returns Initials (e.g., "JD" for "John Doe")
 */
export function getInitials(firstName: string, lastName: string): string {
  return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
}

/**
 * Truncate text with ellipsis
 * @param text Text to truncate
 * @param maxLength Maximum length
 * @returns Truncated text
 */
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength - 3)}...`;
}

/**
 * Sleep for a specified duration
 * @param ms Milliseconds to sleep
 */
export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Check if a date is in the past
 * @param date Date string in YYYY-MM-DD format
 * @returns True if date is in the past
 */
export function isDateInPast(date: string): boolean {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const checkDate = new Date(date);
  return checkDate < today;
}

/**
 * Check if a date is today
 * @param date Date string in YYYY-MM-DD format
 * @returns True if date is today
 */
export function isToday(date: string): boolean {
  const today = new Date().toISOString().slice(0, 10);
  return date === today;
}
