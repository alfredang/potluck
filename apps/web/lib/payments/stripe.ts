// Stripe provider — hosted Checkout Sessions.
// Docs: https://docs.stripe.com/payments/checkout

import Stripe from 'stripe';
import {
  PaymentConfigError,
  checkoutResultUrl,
  type OrderForPayment,
  type PaymentVerdict,
  type ProviderSession,
} from './types';

let client: Stripe | null = null;

function getStripe(): Stripe {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) throw new PaymentConfigError('Card payments are not configured (STRIPE_SECRET_KEY missing)');
  if (!client) client = new Stripe(key);
  return client;
}

export async function createStripeCheckout(order: OrderForPayment): Promise<ProviderSession> {
  const stripe = getStripe();
  const session = await stripe.checkout.sessions.create({
    mode: 'payment',
    customer_email: order.customerEmail,
    line_items: [
      {
        quantity: 1,
        price_data: {
          currency: order.currency.toLowerCase(),
          unit_amount: order.total,
          product_data: {
            name: order.chefName ? `${order.menuName} — by ${order.chefName}` : order.menuName,
            description: `Potluck booking ${order.orderNumber} (incl. platform fee)`,
          },
        },
      },
    ],
    metadata: { orderId: order.id, orderNumber: order.orderNumber },
    success_url: `${checkoutResultUrl(order.id, 'stripe', order.platform)}&session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: checkoutResultUrl(order.id, 'stripe', order.platform, { cancelled: '1' }),
    expires_at: Math.floor(Date.now() / 1000) + 30 * 60, // 30 min
  });
  if (!session.url) throw new Error('Stripe did not return a checkout URL');
  return { redirectUrl: session.url, providerRef: session.id };
}

/** Ask Stripe whether the checkout session was actually paid. */
export async function verifyStripePayment(providerRef: string): Promise<PaymentVerdict> {
  const session = await getStripe().checkout.sessions.retrieve(providerRef);
  if (session.payment_status === 'paid') return 'paid';
  if (session.status === 'expired') return 'failed';
  return 'pending';
}

/** Verify + parse a Stripe webhook. Throws on bad signature. */
export function constructStripeEvent(rawBody: string, signature: string): Stripe.Event {
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!secret) throw new PaymentConfigError('STRIPE_WEBHOOK_SECRET missing');
  return getStripe().webhooks.constructEvent(rawBody, signature, secret);
}
