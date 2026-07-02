import { NextResponse } from 'next/server';
import type Stripe from 'stripe';
import { constructStripeEvent } from '../../../../lib/payments/stripe';
import { PaymentConfigError } from '../../../../lib/payments/types';
import { markOrderFailed, markOrderPaid } from '../../../../lib/orders';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  const signature = req.headers.get('stripe-signature');
  if (!signature) return NextResponse.json({ error: 'Missing signature' }, { status: 400 });

  const rawBody = await req.text();
  let event: Stripe.Event;
  try {
    event = constructStripeEvent(rawBody, signature);
  } catch (err) {
    if (err instanceof PaymentConfigError) {
      console.error('[webhooks/stripe] not configured:', err.message);
      return NextResponse.json({ error: 'Webhook not configured' }, { status: 503 });
    }
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  switch (event.type) {
    case 'checkout.session.completed':
    case 'checkout.session.async_payment_succeeded': {
      const session = event.data.object as Stripe.Checkout.Session;
      const orderId = session.metadata?.orderId;
      if (orderId && session.payment_status === 'paid') await markOrderPaid(orderId);
      break;
    }
    case 'checkout.session.expired':
    case 'checkout.session.async_payment_failed': {
      const session = event.data.object as Stripe.Checkout.Session;
      const orderId = session.metadata?.orderId;
      if (orderId) await markOrderFailed(orderId, `Stripe: ${event.type}`);
      break;
    }
    default:
      break; // Unhandled event types are acknowledged so Stripe stops retrying.
  }

  return NextResponse.json({ received: true });
}
