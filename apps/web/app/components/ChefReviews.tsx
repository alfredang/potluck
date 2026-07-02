'use client';

import { useCallback, useEffect, useState } from 'react';

// Live reviews for a chef, backed by GET/POST /api/reviews. Works for both
// static marketing chefs (slug ids) and DB chefs (uuids) — same endpoint the
// iOS/Android apps use.

export interface ChefReview {
  id: string;
  authorName: string;
  rating: number;
  title: string | null;
  body: string;
  createdAt: string;
  verifiedBooking: boolean;
}

function Stars({ value, size = 'text-sm' }: { value: number; size?: string }) {
  return (
    <span className={`${size} text-yellow-500`} aria-label={`${value} out of 5 stars`}>
      {'★'.repeat(Math.round(value))}
      <span className="text-gray-300">{'★'.repeat(5 - Math.round(value))}</span>
    </span>
  );
}

function timeAgo(iso: string): string {
  const days = Math.floor((Date.now() - new Date(iso).getTime()) / 86400000);
  if (days < 1) return 'today';
  if (days < 7) return `${days} day${days > 1 ? 's' : ''} ago`;
  if (days < 30) return `${Math.floor(days / 7)} week${days >= 14 ? 's' : ''} ago`;
  if (days < 365) return `${Math.floor(days / 30)} month${days >= 60 ? 's' : ''} ago`;
  return `${Math.floor(days / 365)} year${days >= 730 ? 's' : ''} ago`;
}

export function ChefReviews({ chefId, chefName }: { chefId: string; chefName: string }) {
  const [reviews, setReviews] = useState<ChefReview[]>([]);
  const [total, setTotal] = useState(0);
  const [average, setAverage] = useState<number | null>(null);
  const [loaded, setLoaded] = useState(false);

  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [rating, setRating] = useState(5);
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [thanks, setThanks] = useState(false);

  const load = useCallback(async () => {
    try {
      const res = await fetch(`/api/reviews?chefId=${encodeURIComponent(chefId)}`, { cache: 'no-store' });
      if (res.ok) {
        const data = (await res.json()) as { reviews: ChefReview[]; total: number; average: number | null };
        setReviews(data.reviews);
        setTotal(data.total);
        setAverage(data.average);
      }
    } catch {
      // leave empty state
    } finally {
      setLoaded(true);
    }
  }, [chefId]);

  useEffect(() => {
    void load();
  }, [load]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return;
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chefId,
          authorName: name,
          authorEmail: email || null,
          rating,
          title: title || null,
          body,
          platform: 'web',
        }),
      });
      const data = (await res.json().catch(() => ({}))) as { review?: ChefReview; error?: string };
      if (!res.ok || !data.review) {
        setError(data.error || 'Could not submit your review. Please try again.');
        return;
      }
      setReviews((prev) => [data.review!, ...prev]);
      setTotal((t) => t + 1);
      setShowForm(false);
      setThanks(true);
      setTitle('');
      setBody('');
      setTimeout(() => setThanks(false), 4000);
    } catch {
      setError('Network error — please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Reviews</h2>
          {total > 0 && average !== null && (
            <p className="mt-1 flex items-center gap-2 text-sm text-gray-600">
              <Stars value={average} />
              <span className="font-medium text-gray-900">{average.toFixed(1)}</span>
              <span>· {total} review{total > 1 ? 's' : ''}</span>
            </p>
          )}
        </div>
        <button
          onClick={() => setShowForm((s) => !s)}
          className="rounded-lg bg-orange-500 px-4 py-2 text-sm font-semibold text-white hover:bg-orange-600"
        >
          {showForm ? 'Close' : 'Write a Review'}
        </button>
      </div>

      {thanks && (
        <p className="mt-4 rounded-lg bg-green-50 px-4 py-3 text-sm text-green-700">
          Thanks for sharing your experience — your review is live!
        </p>
      )}

      {showForm && (
        <form onSubmit={submit} className="mt-6 space-y-4 rounded-2xl border border-orange-100 bg-orange-50/50 p-5">
          <div>
            <label className="block text-sm font-medium text-gray-700">Your rating</label>
            <div className="mt-1 flex gap-1">
              {[1, 2, 3, 4, 5].map((n) => (
                <button
                  key={n}
                  type="button"
                  onClick={() => setRating(n)}
                  className={`text-2xl transition ${n <= rating ? 'text-yellow-500' : 'text-gray-300 hover:text-yellow-300'}`}
                  aria-label={`${n} star${n > 1 ? 's' : ''}`}
                >
                  ★
                </button>
              ))}
            </div>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-700">Your name</label>
              <input
                type="text"
                required
                maxLength={100}
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Email (optional, not shown)</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Title (optional)</label>
            <input
              type="text"
              maxLength={200}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Best laksa in Singapore"
              className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Your review</label>
            <textarea
              required
              minLength={10}
              maxLength={2000}
              rows={4}
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder="Share your experience — the food, the host, the vibe…"
              className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
            />
          </div>
          {error && <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>}
          <button
            type="submit"
            disabled={submitting}
            className="rounded-lg bg-orange-500 px-6 py-2.5 font-semibold text-white hover:bg-orange-600 disabled:bg-orange-300"
          >
            {submitting ? 'Submitting…' : 'Submit Review'}
          </button>
        </form>
      )}

      <div className="mt-6 space-y-6">
        {!loaded ? (
          <p className="text-gray-500">Loading reviews…</p>
        ) : reviews.length === 0 ? (
          <p className="rounded-xl bg-gray-50 px-4 py-6 text-center text-gray-500">
            No reviews yet — be the first to review {chefName}!
          </p>
        ) : (
          reviews.map((r) => (
            <div key={r.id} className="border-b border-gray-200 pb-6 last:border-0">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-100 font-semibold text-orange-500">
                  {r.authorName
                    .split(' ')
                    .map((w) => w[0])
                    .join('')
                    .slice(0, 2)
                    .toUpperCase()}
                </div>
                <div>
                  <p className="flex items-center gap-2 font-medium">
                    {r.authorName}
                    {r.verifiedBooking && (
                      <span className="rounded-full bg-teal-50 px-2 py-0.5 text-[11px] font-semibold text-teal-700">
                        Verified booking
                      </span>
                    )}
                  </p>
                  <Stars value={r.rating} />
                </div>
                <span className="ml-auto text-sm text-gray-500">{timeAgo(r.createdAt)}</span>
              </div>
              {r.title && <p className="mt-3 font-semibold text-gray-900">{r.title}</p>}
              <p className={`${r.title ? 'mt-1' : 'mt-3'} text-gray-700`}>{r.body}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
