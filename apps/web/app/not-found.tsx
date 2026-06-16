import Link from 'next/link';
import type { Metadata } from 'next';
import { SiteNav } from './components/SiteNav';
import { SiteFooter } from './components/SiteFooter';

export const metadata: Metadata = {
  title: 'Page not found',
  description:
    'We couldn’t find that page. Explore Singapore home chefs, read the Potluck journal, or head back to the home table.',
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col bg-white">
      <SiteNav />
      <main className="flex flex-1 items-center justify-center bg-gradient-to-b from-orange-50 to-white px-4 py-20">
        <div className="mx-auto max-w-lg text-center">
          <p className="text-7xl">🍽️</p>
          <p className="mt-4 text-sm font-semibold uppercase tracking-wide text-orange-500">Error 404</p>
          <h1 className="mt-2 text-4xl font-extrabold tracking-tight text-gray-900">
            This dish is off the menu
          </h1>
          <p className="mt-4 text-gray-600">
            The page you’re after doesn’t exist or has moved. But there’s plenty more cooking —
            let’s get you back to the good stuff.
          </p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Link
              href="/explore"
              className="rounded-xl bg-orange-500 px-6 py-3 font-semibold text-white shadow-lg shadow-orange-500/25 transition hover:bg-orange-600"
            >
              Explore home chefs
            </Link>
            <Link
              href="/"
              className="rounded-xl border border-gray-200 bg-white px-6 py-3 font-semibold text-gray-800 transition hover:border-orange-300 hover:text-orange-600"
            >
              Back to home
            </Link>
          </div>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-sm text-gray-500">
            <Link href="/blog" className="hover:text-orange-600">Read the journal</Link>
            <Link href="/how-it-works" className="hover:text-orange-600">How it works</Link>
            <Link href="/become-chef" className="hover:text-orange-600">Become a chef</Link>
            <Link href="/contact" className="hover:text-orange-600">Contact us</Link>
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
