import { NextResponse } from 'next/server';
import { verifyHitPayWebhook } from '../../../../lib/payments/hitpay';
import { PaymentConfigError } from '../../../../lib/payments/types';
import { getOrderByProviderRef, markOrderFailed, markOrderPaid } from '../../../../lib/orders';

export const dynamic = 'force-dynamic';

// HitPay posts application/x-www-form-urlencoded fields:
// payment_id, payment_request_id, phone, amount, currency, status,
// reference_number, hmac
export async function POST(req: Request) {
  const rawBody = await req.text();
  const fields: Record<string, string> = {};
  for (const [k, v] of new URLSearchParams(rawBody)) fields[k] = v;

  try {
    if (!verifyHitPayWebhook(fields)) {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
    }
  } catch (err) {
    if (err instanceof PaymentConfigError) {
      console.error('[webhooks/hitpay] not configured:', err.message);
      return NextResponse.json({ error: 'Webhook not configured' }, { status: 503 });
    }
    throw err;
  }

  const requestId = fields.payment_request_id;
  if (!requestId) return NextResponse.json({ error: 'Missing payment_request_id' }, { status: 400 });

  const order = await getOrderByProviderRef('hitpay', requestId);
  if (!order) return new NextResponse('ok'); // not ours

  if (fields.status === 'completed') {
    await markOrderPaid(order.id);
  } else if (fields.status === 'failed') {
    await markOrderFailed(order.id, 'HitPay: payment failed');
  }

  return new NextResponse('ok');
}
