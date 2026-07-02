import { desc } from 'drizzle-orm';
import { db } from '../../../lib/db';
import { orders } from '../../../lib/schema';
import { ensureOrdersSchema } from '../../../lib/orders';

export const dynamic = 'force-dynamic';

const STATUS_STYLES: Record<string, string> = {
  paid: 'bg-green-100 text-green-700',
  pending_payment: 'bg-amber-100 text-amber-700',
  failed: 'bg-red-100 text-red-700',
  cancelled: 'bg-gray-100 text-gray-600',
  refunded: 'bg-blue-100 text-blue-700',
};

const PROVIDER_LABELS: Record<string, string> = {
  stripe: 'Stripe',
  paypal: 'PayPal',
  hitpay: 'HitPay',
};

async function getOrders() {
  try {
    await ensureOrdersSchema();
    const rows = await db.select().from(orders).orderBy(desc(orders.createdAt)).limit(100);
    return { rows, ok: true };
  } catch {
    return { rows: [], ok: false };
  }
}

export default async function AdminOrdersPage() {
  const { rows, ok } = await getOrders();

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900">Orders</h1>
      <p className="mt-1 text-sm text-gray-500">
        Checkout orders across web, iOS and Android (latest 100).
      </p>

      {!ok && (
        <p className="mt-4 rounded-lg bg-amber-50 px-3 py-2 text-sm text-amber-700">
          Could not reach the database. Check <code>DATABASE_URL</code> (and run{' '}
          <code>pnpm db:push</code> if the orders table doesn&apos;t exist yet).
        </p>
      )}

      <div className="mt-6 overflow-x-auto rounded-2xl border border-gray-200 bg-white">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-gray-200 text-xs uppercase tracking-wide text-gray-500">
            <tr>
              <th className="px-4 py-3">Order</th>
              <th className="px-4 py-3">Menu / Chef</th>
              <th className="px-4 py-3">Customer</th>
              <th className="px-4 py-3">Scheduled</th>
              <th className="px-4 py-3 text-right">Total</th>
              <th className="px-4 py-3">Provider</th>
              <th className="px-4 py-3">Platform</th>
              <th className="px-4 py-3">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {rows.length === 0 ? (
              <tr>
                <td colSpan={8} className="px-4 py-10 text-center text-gray-500">
                  No orders yet.
                </td>
              </tr>
            ) : (
              rows.map((o) => (
                <tr key={o.id} className="hover:bg-orange-50/40">
                  <td className="px-4 py-3">
                    <span className="font-medium text-gray-900">{o.orderNumber}</span>
                    <span className="block text-xs text-gray-400">
                      {o.createdAt.toLocaleString('en-SG', { timeZone: 'Asia/Singapore' })}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-gray-900">{o.menuName}</span>
                    {o.chefName && <span className="block text-xs text-gray-500">{o.chefName}</span>}
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-gray-900">{o.customerName}</span>
                    <span className="block text-xs text-gray-500">{o.customerEmail}</span>
                  </td>
                  <td className="px-4 py-3 text-gray-600">
                    {o.scheduledDate} {o.scheduledTime}
                    <span className="block text-xs text-gray-400">
                      {o.guestCount} guest{o.guestCount > 1 ? 's' : ''}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right font-medium text-gray-900">
                    S${(o.total / 100).toFixed(2)}
                  </td>
                  <td className="px-4 py-3 text-gray-600">{PROVIDER_LABELS[o.provider] ?? o.provider}</td>
                  <td className="px-4 py-3 text-gray-600 capitalize">{o.platform}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-block rounded-full px-2.5 py-1 text-xs font-medium ${
                        STATUS_STYLES[o.status] ?? 'bg-gray-100 text-gray-600'
                      }`}
                    >
                      {o.status.replace('_', ' ')}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
