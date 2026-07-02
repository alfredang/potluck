// Shared types for the multi-provider checkout (Stripe / PayPal / HitPay).

export type PaymentProvider = 'stripe' | 'paypal' | 'hitpay';
export type CheckoutPlatform = 'web' | 'ios' | 'android';

export const PAYMENT_PROVIDERS: PaymentProvider[] = ['stripe', 'paypal', 'hitpay'];
export const CHECKOUT_PLATFORMS: CheckoutPlatform[] = ['web', 'ios', 'android'];

/** Thrown when a provider's env vars are missing — surfaces as 503, not 500. */
export class PaymentConfigError extends Error {}

/** What a provider returns after creating a hosted checkout session. */
export interface ProviderSession {
  redirectUrl: string;
  providerRef: string;
}

/** Provider-side verdict on a payment, used by webhooks + reconciliation. */
export type PaymentVerdict = 'paid' | 'pending' | 'failed';

/** The subset of an order that providers need to create a session. */
export interface OrderForPayment {
  id: string;
  orderNumber: string;
  menuName: string;
  chefName: string | null;
  customerName: string;
  customerEmail: string;
  total: number; // cents
  currency: string; // 'SGD'
  platform: CheckoutPlatform;
}

export function siteUrl(): string {
  return process.env.NEXT_PUBLIC_SITE_URL || 'https://potluckhub.io';
}

/** URL the customer lands on after paying (or cancelling) with any provider. */
export function checkoutResultUrl(
  orderId: string,
  provider: PaymentProvider,
  platform: CheckoutPlatform,
  extra?: Record<string, string>
): string {
  const url = new URL('/checkout/result', siteUrl());
  url.searchParams.set('order', orderId);
  url.searchParams.set('provider', provider);
  url.searchParams.set('platform', platform);
  for (const [k, v] of Object.entries(extra ?? {})) url.searchParams.set(k, v);
  return url.toString();
}
