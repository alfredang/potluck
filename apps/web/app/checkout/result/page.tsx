import Link from 'next/link';
import type { Metadata } from 'next';
import { SiteNav } from '../../components/SiteNav';
import { SiteFooter } from '../../components/SiteFooter';
import { getOrder, markOrderFailed, reconcileOrder, type OrderRow } from '../../../lib/orders';
import { PollRefresh } from './PollRefresh';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Checkout',
  robots: { index: false, follow: false },
};

const PROVIDER_LABELS: Record<string, string> = {
  stripe: 'Card (Stripe)',
  paypal: 'PayPal',
  hitpay: 'PayNow / Card (HitPay)',
};

function money(cents: number, currency: string) {
  return `${currency === 'SGD' ? 'S$' : '$'}${(cents / 100).toFixed(2)}`;
}

function SummaryCard({ order }: { order: OrderRow }) {
  return (
    <div className="mt-6 rounded-xl bg-orange-50 p-5 text-left">
      <p className="font-medium text-gray-900">{order.menuName}</p>
      {order.chefName && <p className="text-sm text-gray-600">by {order.chefName}</p>}
      <p className="mt-1 text-sm text-gray-600">
        {order.scheduledDate} at {order.scheduledTime} · {order.guestCount} guest
        {order.guestCount > 1 ? 's' : ''}
      </p>
      <dl className="mt-4 space-y-1 border-t border-orange-100 pt-3 text-sm">
        <div className="flex justify-between text-gray-600">
          <dt>Subtotal</dt>
          <dd>{money(order.subtotal, order.currency)}</dd>
        </div>
        <div className="flex justify-between text-gray-600">
          <dt>Platform fee (4%)</dt>
          <dd>{money(order.platformFee, order.currency)}</dd>
        </div>
        <div className="flex justify-between text-base font-semibold text-gray-900">
          <dt>Total</dt>
          <dd className="text-orange-500">{money(order.total, order.currency)}</dd>
        </div>
        <div className="flex justify-between pt-2 text-gray-500">
          <dt>Payment method</dt>
          <dd>{PROVIDER_LABELS[order.provider] ?? order.provider}</dd>
        </div>
      </dl>
    </div>
  );
}

export default async function CheckoutResultPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const orderId = typeof params.order === 'string' ? params.order : '';
  const platform = typeof params.platform === 'string' ? params.platform : 'web';
  const wasCancelled = params.cancelled === '1';

  let order = orderId ? await getOrder(orderId) : null;
  if (order) {
    if (wasCancelled && order.status === 'pending_payment') {
      order = (await markOrderFailed(order.id, 'Cancelled by customer', 'cancelled')) ?? order;
    } else {
      order = await reconcileOrder(order);
    }
  }

  const appReturnHref = order
    ? `potluck://checkout/result?order=${order.id}&status=${order.status}`
    : null;
  const showAppButton = platform === 'ios' || platform === 'android';

  return (
    <div className="min-h-screen bg-gray-50">
      <SiteNav active="/explore" />
      <div className="mx-auto flex min-h-[60vh] max-w-lg items-center px-4 py-16">
        <div className="w-full rounded-2xl bg-white p-8 text-center shadow-sm">
          {!order ? (
            <>
              <h1 className="text-2xl font-bold text-gray-900">Order not found</h1>
              <p className="mt-3 text-gray-600">
                We couldn&apos;t find this checkout. If you were charged, please contact us and we&apos;ll
                sort it out right away.
              </p>
              <Link
                href="/explore"
                className="mt-6 inline-block rounded-lg bg-orange-500 px-6 py-3 font-semibold text-white hover:bg-orange-600"
              >
                Back to Explore
              </Link>
            </>
          ) : order.status === 'paid' ? (
            <>
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-4xl">
                ✓
              </div>
              <h1 className="mt-4 text-2xl font-bold text-gray-900">Payment received!</h1>
              <p className="mt-2 text-gray-600">
                Booking <span className="font-semibold text-gray-900">{order.orderNumber}</span> is
                now with {order.chefName ?? 'your chef'} — you&apos;ll get a confirmation shortly at{' '}
                {order.customerEmail}.
              </p>
              <SummaryCard order={order} />
              {showAppButton && appReturnHref ? (
                <a
                  href={appReturnHref}
                  className="mt-6 inline-block w-full rounded-lg bg-orange-500 px-6 py-3 font-semibold text-white hover:bg-orange-600"
                >
                  Return to Potluck app
                </a>
              ) : (
                <Link
                  href="/explore"
                  className="mt-6 inline-block w-full rounded-lg bg-orange-500 px-6 py-3 font-semibold text-white hover:bg-orange-600"
                >
                  Explore more home chefs
                </Link>
              )}
            </>
          ) : order.status === 'pending_payment' ? (
            <>
              <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-orange-200 border-t-orange-500" />
              <h1 className="mt-4 text-2xl font-bold text-gray-900">Confirming your payment…</h1>
              <p className="mt-2 text-gray-600">
                Hang tight — we&apos;re checking with your payment provider. This page updates
                automatically.
              </p>
              <SummaryCard order={order} />
              <PollRefresh orderId={order.id} />
            </>
          ) : (
            <>
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-100 text-3xl">
                ✕
              </div>
              <h1 className="mt-4 text-2xl font-bold text-gray-900">
                {order.status === 'cancelled' ? 'Payment cancelled' : 'Payment unsuccessful'}
              </h1>
              <p className="mt-2 text-gray-600">
                {order.status === 'cancelled'
                  ? 'No charge was made. You can restart the booking whenever you’re ready.'
                  : 'Your payment didn’t go through and no booking was made. Please try again or use another payment method.'}
              </p>
              {showAppButton && appReturnHref ? (
                <a
                  href={appReturnHref}
                  className="mt-6 inline-block w-full rounded-lg bg-orange-500 px-6 py-3 font-semibold text-white hover:bg-orange-600"
                >
                  Return to Potluck app
                </a>
              ) : (
                <Link
                  href={
                    // Static marketing chefs have slug ids → deep-link back to their page;
                    // DB chefs (uuid) only exist in the apps, so fall back to Explore.
                    order.chefId && !/^[0-9a-f-]{36}$/i.test(order.chefId)
                      ? `/chef/${order.chefId}`
                      : '/explore'
                  }
                  className="mt-6 inline-block w-full rounded-lg bg-orange-500 px-6 py-3 font-semibold text-white hover:bg-orange-600"
                >
                  Try again
                </Link>
              )}
            </>
          )}
        </div>
      </div>
      <SiteFooter />
    </div>
  );
}
