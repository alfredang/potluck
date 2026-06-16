'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Logo } from '../components/Logo';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-orange-50 to-white">
      <header className="border-b border-gray-100 bg-white">
        <div className="mx-auto flex h-16 max-w-7xl items-center px-4 sm:px-6 lg:px-8">
          <Logo />
        </div>
      </header>
      <main className="flex flex-1 items-center justify-center px-4 py-16">
        <div className="w-full max-w-md rounded-2xl border border-gray-100 bg-white p-8 shadow-sm">
          {sent ? (
            <div className="text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-green-100 text-3xl">✓</div>
              <h1 className="mt-4 text-2xl font-bold text-gray-900">Check your inbox</h1>
              <p className="mt-2 text-gray-600">
                If an account exists for <span className="font-medium text-gray-900">{email}</span>, we’ve sent a link to
                reset your password.
              </p>
              <Link href="/login" className="mt-6 inline-block font-semibold text-orange-600 hover:text-orange-700">
                ← Back to sign in
              </Link>
            </div>
          ) : (
            <>
              <h1 className="text-2xl font-bold text-gray-900">Reset your password</h1>
              <p className="mt-2 text-sm text-gray-600">
                Enter the email linked to your Potluck account and we’ll send you a reset link.
              </p>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  setSent(true);
                }}
                className="mt-6 space-y-4"
              >
                <div>
                  <label htmlFor="fp-email" className="block text-sm font-medium text-gray-700">Email</label>
                  <input
                    id="fp-email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@email.com"
                    className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full rounded-lg bg-orange-500 py-3 font-semibold text-white transition hover:bg-orange-600"
                >
                  Send reset link
                </button>
              </form>
              <p className="mt-6 text-center text-sm text-gray-600">
                Remembered it?{' '}
                <Link href="/login" className="font-semibold text-orange-600 hover:text-orange-700">Sign in</Link>
              </p>
            </>
          )}
        </div>
      </main>
    </div>
  );
}
