'use client';

import { useState } from 'react';

type Interest = 'book' | 'chef' | 'event' | 'other';

const INTERESTS: { value: Interest; label: string }[] = [
  { value: 'book', label: 'Book a home chef' },
  { value: 'chef', label: 'Become a home chef' },
  { value: 'event', label: 'Plan a private event' },
  { value: 'other', label: 'Something else' },
];

export function EnquiryForm() {
  const [form, setForm] = useState({ name: '', email: '', interest: 'book' as Interest, message: '' });
  const [status, setStatus] = useState<'idle' | 'sending' | 'done' | 'error'>('idle');
  const [error, setError] = useState('');

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus('sending');
    setError('');
    try {
      const res = await fetch('/api/enquiry', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) throw new Error(data.error || 'Something went wrong.');
      setStatus('done');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong.');
      setStatus('error');
    }
  }

  return (
    <section id="enquiry" className="bg-orange-500 py-14 sm:py-16">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="overflow-hidden rounded-3xl bg-white shadow-xl md:grid md:grid-cols-5">
          {/* Pitch */}
          <div className="bg-gradient-to-br from-orange-500 to-amber-500 p-8 text-white md:col-span-2 md:p-10">
            <p className="text-sm font-semibold uppercase tracking-wide text-orange-100">Get in touch</p>
            <h2 className="font-display mt-2 text-3xl font-bold leading-tight">Hungry for home-cooked? Let&apos;s talk.</h2>
            <p className="mt-4 text-orange-50">
              Tell us what you&apos;re craving — chicken rice, laksa, a full Peranakan spread — or what
              you cook. We&apos;ll match you with the right home chef, or help you start earning from
              your own kitchen.
            </p>
            <ul className="mt-6 space-y-3 text-sm text-orange-50">
              {['Personal chef matching across Singapore', 'Halal, vegetarian & dietary-friendly options', 'Replies within hours, not days'].map((t) => (
                <li key={t} className="flex items-start gap-2">
                  <svg className="mt-0.5 h-5 w-5 shrink-0 text-white" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.704 5.29a1 1 0 010 1.42l-7.5 7.5a1 1 0 01-1.42 0l-3.5-3.5a1 1 0 111.42-1.42l2.79 2.79 6.79-6.79a1 1 0 011.42 0z" clipRule="evenodd" />
                  </svg>
                  {t}
                </li>
              ))}
            </ul>
          </div>

          {/* Form */}
          <div className="p-8 md:col-span-3 md:p-10">
            {status === 'done' ? (
              <div className="flex h-full flex-col items-center justify-center text-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-green-100 text-3xl">✓</div>
                <h3 className="mt-4 text-xl font-bold text-gray-900">Thanks, {form.name.split(' ')[0] || 'friend'}!</h3>
                <p className="mt-2 max-w-sm text-gray-600">
                  Your enquiry is in. Our team will be in touch shortly. For a faster reply, message us
                  on WhatsApp using the chat button.
                </p>
                <button
                  onClick={() => {
                    setForm({ name: '', email: '', interest: 'book', message: '' });
                    setStatus('idle');
                  }}
                  className="mt-5 text-sm font-semibold text-orange-600 hover:text-orange-700"
                >
                  Send another enquiry
                </button>
              </div>
            ) : (
              <form onSubmit={onSubmit} className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label htmlFor="enq-name" className="block text-sm font-medium text-gray-700">Name</label>
                    <input
                      id="enq-name"
                      type="text"
                      required
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
                      placeholder="Your name"
                    />
                  </div>
                  <div>
                    <label htmlFor="enq-email" className="block text-sm font-medium text-gray-700">Email</label>
                    <input
                      id="enq-email"
                      type="email"
                      required
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
                      placeholder="you@email.com"
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="enq-interest" className="block text-sm font-medium text-gray-700">I&apos;m interested in</label>
                  <select
                    id="enq-interest"
                    value={form.interest}
                    onChange={(e) => setForm({ ...form, interest: e.target.value as Interest })}
                    className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
                  >
                    {INTERESTS.map((i) => (
                      <option key={i.value} value={i.value}>{i.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label htmlFor="enq-message" className="block text-sm font-medium text-gray-700">Message <span className="font-normal text-gray-400">(optional)</span></label>
                  <textarea
                    id="enq-message"
                    rows={3}
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
                    placeholder="Cuisine, date, number of guests, dietary needs…"
                  />
                </div>
                {status === 'error' && <p className="text-sm text-red-600">{error}</p>}
                <button
                  type="submit"
                  disabled={status === 'sending'}
                  className="w-full rounded-lg bg-orange-500 py-3 font-semibold text-white shadow-sm transition hover:bg-orange-600 disabled:bg-orange-300"
                >
                  {status === 'sending' ? 'Sending…' : 'Send enquiry'}
                </button>
                <p className="text-center text-xs text-gray-400">No spam — we&apos;ll only use this to reply to you.</p>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
