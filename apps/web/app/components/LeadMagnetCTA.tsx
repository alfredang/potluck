'use client';

import Link from 'next/link';
import { useState } from 'react';

/**
 * End-of-post lead magnet: an email content-upgrade capture that turns blog readers
 * (top-of-funnel SEO traffic) into leads, plus a direct path to the marketplace. Posts
 * introduce a chef's food, so the CTA nudges readers to taste it for real.
 */
export function LeadMagnetCTA({
  heading = 'Get the taste, not just the read',
  blurb = 'Join our weekly Home-Table newsletter — neighbourhood chef spotlights, seasonal menus and members-only dining deals across Singapore.',
  ctaHref = '/explore',
  ctaLabel = 'Explore home chefs',
}: {
  heading?: string;
  blurb?: string;
  ctaHref?: string;
  ctaLabel?: string;
}) {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'sending' | 'done' | 'error'>('idle');

  async function subscribe(e: React.FormEvent) {
    e.preventDefault();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setStatus('error');
      return;
    }
    setStatus('sending');
    try {
      const res = await fetch('/api/enquiry', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ name: 'Newsletter subscriber', email, interest: 'newsletter', message: 'Subscribed from blog lead magnet' }),
      });
      if (!res.ok) throw new Error();
      setStatus('done');
      setEmail('');
    } catch {
      setStatus('error');
    }
  }

  return (
    <aside className="not-prose my-10 overflow-hidden rounded-3xl border border-orange-100 bg-gradient-to-br from-orange-50 to-amber-50 p-6 sm:p-8">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="max-w-md">
          <p className="text-sm font-semibold uppercase tracking-wide text-orange-600">Hungry yet?</p>
          <h3 className="mt-1 text-xl font-bold text-gray-900 sm:text-2xl">{heading}</h3>
          <p className="mt-2 text-sm text-gray-600">{blurb}</p>
          <Link
            href={ctaHref}
            className="mt-4 inline-flex items-center gap-1 rounded-xl bg-orange-500 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-orange-600"
          >
            {ctaLabel}
            <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M7.293 4.293a1 1 0 011.414 0l5 5a1 1 0 010 1.414l-5 5a1 1 0 01-1.414-1.414L11.586 10 7.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </Link>
        </div>

        <form onSubmit={subscribe} className="w-full max-w-xs shrink-0">
          {status === 'done' ? (
            <div className="rounded-xl bg-white p-4 text-center shadow-sm">
              <p className="text-2xl">🎉</p>
              <p className="mt-1 text-sm font-semibold text-gray-900">You&apos;re on the list!</p>
              <p className="mt-1 text-xs text-gray-500">Check your inbox for a warm welcome.</p>
            </div>
          ) : (
            <div className="rounded-xl bg-white p-4 shadow-sm">
              <label htmlFor="lm-email" className="block text-xs font-medium text-gray-700">
                Free weekly newsletter
              </label>
              <input
                id="lm-email"
                type="email"
                required
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (status === 'error') setStatus('idle');
                }}
                placeholder="you@email.com"
                className="mt-1.5 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
              />
              <button
                type="submit"
                disabled={status === 'sending'}
                className="mt-2 w-full rounded-lg bg-gray-900 py-2 text-sm font-semibold text-white transition hover:bg-gray-800 disabled:opacity-60"
              >
                {status === 'sending' ? 'Joining…' : 'Get free recipes & deals'}
              </button>
              {status === 'error' && <p className="mt-1.5 text-xs text-red-600">Please enter a valid email.</p>}
              <p className="mt-1.5 text-center text-[11px] text-gray-400">No spam. Unsubscribe anytime.</p>
            </div>
          )}
        </form>
      </div>
    </aside>
  );
}
