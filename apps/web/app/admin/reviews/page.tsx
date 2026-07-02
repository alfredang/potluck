import { desc } from 'drizzle-orm';
import { db } from '../../../lib/db';
import { chefReviews } from '../../../lib/schema';
import { ensureReviewsSchema } from '../../../lib/reviews';
import { deleteReview, toggleReviewVisibility } from './actions';

export const dynamic = 'force-dynamic';

async function getReviews() {
  try {
    await ensureReviewsSchema();
    const rows = await db.select().from(chefReviews).orderBy(desc(chefReviews.createdAt)).limit(200);
    return { rows, ok: true };
  } catch {
    return { rows: [], ok: false };
  }
}

export default async function AdminReviewsPage() {
  const { rows, ok } = await getReviews();

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900">Reviews</h1>
      <p className="mt-1 text-sm text-gray-500">
        Guest reviews from web, iOS and Android (latest 200). Hide spam or abuse; hidden reviews
        disappear everywhere instantly.
      </p>

      {!ok && (
        <p className="mt-4 rounded-lg bg-amber-50 px-3 py-2 text-sm text-amber-700">
          Could not reach the database. Check <code>DATABASE_URL</code>.
        </p>
      )}

      <div className="mt-6 space-y-4">
        {rows.length === 0 ? (
          <p className="rounded-2xl border border-gray-200 bg-white px-4 py-10 text-center text-gray-500">
            No reviews yet.
          </p>
        ) : (
          rows.map((r) => (
            <div
              key={r.id}
              className={`rounded-2xl border bg-white p-5 ${r.isVisible ? 'border-gray-200' : 'border-red-200 opacity-60'}`}
            >
              <div className="flex flex-wrap items-center gap-2 text-sm">
                <span className="font-semibold text-gray-900">{r.authorName}</span>
                <span className="text-yellow-500">{'★'.repeat(r.rating)}</span>
                <span className="text-gray-400">·</span>
                <span className="text-gray-600">chef: {r.chefId}</span>
                <span className="text-gray-400">·</span>
                <span className="capitalize text-gray-500">{r.platform}</span>
                {r.verifiedBooking && (
                  <span className="rounded-full bg-teal-50 px-2 py-0.5 text-xs font-semibold text-teal-700">
                    Verified booking
                  </span>
                )}
                {!r.isVisible && (
                  <span className="rounded-full bg-red-50 px-2 py-0.5 text-xs font-semibold text-red-600">
                    Hidden
                  </span>
                )}
                <span className="ml-auto text-gray-400">
                  {r.createdAt.toLocaleString('en-SG', { timeZone: 'Asia/Singapore' })}
                </span>
              </div>
              {r.title && <p className="mt-2 font-medium text-gray-900">{r.title}</p>}
              <p className="mt-1 text-gray-700">{r.body}</p>
              <div className="mt-3 flex gap-2">
                <form action={toggleReviewVisibility}>
                  <input type="hidden" name="id" value={r.id} />
                  <input type="hidden" name="visible" value={r.isVisible ? '0' : '1'} />
                  <button className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50">
                    {r.isVisible ? 'Hide' : 'Unhide'}
                  </button>
                </form>
                <form action={deleteReview}>
                  <input type="hidden" name="id" value={r.id} />
                  <button className="rounded-lg border border-red-200 px-3 py-1.5 text-sm font-medium text-red-600 hover:bg-red-50">
                    Delete
                  </button>
                </form>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
