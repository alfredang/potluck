import { NextResponse } from 'next/server';
import { verifyPayPalWebhook } from '../../../../lib/payments/paypal';
import { PaymentConfigError } from '../../../../lib/payments/types';
import {
  getOrder,
  getOrderByProviderRef,
  markOrderFailed,
  markOrderPaid,
  reconcileOrder,
} from '../../../../lib/orders';

export const dynamic = 'force-dynamic';

interface PayPalEvent {
  event_type?: string;
  resource?: {
    id?: string;
    status?: string;
    custom_id?: string;
    supplementary_data?: { related_ids?: { order_id?: string } };
  };
}

export async function POST(req: Request) {
  const rawBody = await req.text();

  let verified = false;
  try {
    verified = await verifyPayPalWebhook(req.headers, rawBody);
  } catch (err) {
    if (err instanceof PaymentConfigError) {
      console.error('[webhooks/paypal] not configured:', err.message);
      return NextResponse.json({ error: 'Webhook not configured' }, { status: 503 });
    }
    console.error('[webhooks/paypal] verification error:', err);
  }
  if (!verified) return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });

  const event = JSON.parse(rawBody) as PayPalEvent;
  const resource = event.resource ?? {};

  // Resolve our order: capture events carry our order id in custom_id;
  // order-level events carry the PayPal order id (our providerRef).
  const paypalOrderId = resource.supplementary_data?.related_ids?.order_id ?? resource.id;
  const order = resource.custom_id
    ? await getOrder(resource.custom_id)
    : paypalOrderId
      ? await getOrderByProviderRef('paypal', paypalOrderId)
      : null;
  if (!order) return NextResponse.json({ received: true }); // not ours / already purged

  switch (event.event_type) {
    case 'PAYMENT.CAPTURE.COMPLETED':
      await markOrderPaid(order.id);
      break;
    case 'CHECKOUT.ORDER.APPROVED':
      // Buyer approved but capture may not have run (e.g. redirect lost) —
      // reconcile captures the order and marks it paid.
      await reconcileOrder(order);
      break;
    case 'PAYMENT.CAPTURE.DENIED':
    case 'PAYMENT.CAPTURE.DECLINED':
      await markOrderFailed(order.id, `PayPal: ${event.event_type}`);
      break;
    default:
      break;
  }

  return NextResponse.json({ received: true });
}
