import { NextResponse } from 'next/server';
import { getOrder, reconcileOrder, toPublicOrder } from '../../../../lib/orders';

export const dynamic = 'force-dynamic';

// Status endpoint polled by web/iOS/Android after redirecting to the provider.
// If the order is still pending we re-verify with the provider so payments
// settle even when a webhook is delayed.
export async function GET(
  _req: Request,
  { params }: { params: Promise<{ orderId: string }> }
) {
  const { orderId } = await params;
  let order = await getOrder(orderId);
  if (!order) return NextResponse.json({ error: 'Order not found' }, { status: 404 });
  order = await reconcileOrder(order);
  return NextResponse.json(toPublicOrder(order));
}
