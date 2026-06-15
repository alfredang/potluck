import type { Metadata } from 'next';
import Link from 'next/link';
import { SiteNav } from '../components/SiteNav';
import { SiteFooter } from '../components/SiteFooter';
import { PostCard } from '../components/PostCard';
import {
  getActiveCategories,
  getFeaturedPosts,
  getLatestPosts,
  SITE_URL,
} from '../../lib/blog';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Blog — Home Dining Stories, Recipes & Chef Tips',
  description:
    'Stories from Singapore home chefs, recipes, food culture and tips for hosting and discovering authentic home-cooked meals on Potluck.',
  keywords: [
    'home dining blog',
    'Singapore home chefs',
    'home cooked food Singapore',
    'recipes',
    'food culture',
    'private dining Singapore',
  ],
  alternates: { canonical: '/blog' },
  openGraph: {
    type: 'website',
    url: `${SITE_URL}/blog`,
    title: 'Potluck Blog — Home Dining Stories, Recipes & Chef Tips',
    description: 'Stories from Singapore home chefs, recipes, food culture and hosting tips.',
    locale: 'en_SG',
    siteName: 'Potluck',
  },
  twitter: { card: 'summary_large_image', title: 'Potluck Blog' },
};

export default async function BlogIndex() {
  const [featured, latest, categories] = await Promise.all([
    getFeaturedPosts(3),
    getLatestPosts(12),
    getActiveCategories(),
  ]);

  const featuredIds = new Set(featured.map((p) => p.id));
  const latestFiltered = latest.filter((p) => !featuredIds.has(p.id));
  const hasPosts = featured.length > 0 || latest.length > 0;

  return (
    <div className="min-h-screen bg-gray-50">
      <SiteNav active="/blog" />

      {/* Header */}
      <header className="bg-white">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <p className="text-sm font-semibold uppercase tracking-wide text-orange-500">The Potluck Journal</p>
          <h1 className="mt-2 text-4xl font-bold text-gray-900">From the Kitchen Table</h1>
          <p className="mt-3 max-w-2xl text-lg text-gray-600">
            Stories, recipes and tips from Singapore&apos;s home chefs — and everything that makes a
            shared meal special.
          </p>

          {categories.length > 0 && (
            <div className="mt-6 flex flex-wrap gap-2">
              <span className="rounded-full bg-orange-500 px-3 py-1.5 text-sm font-medium text-white">
                All
              </span>
              {categories.map((c) => (
                <Link
                  key={c.id}
                  href={`/blog/category/${c.slug}`}
                  className="rounded-full border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 transition hover:border-orange-300 hover:text-orange-600"
                >
                  {c.name}
                </Link>
              ))}
            </div>
          )}
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        {!hasPosts && (
          <div className="rounded-2xl border border-dashed border-gray-300 bg-white py-20 text-center">
            <p className="text-5xl">📝</p>
            <h2 className="mt-4 text-xl font-semibold text-gray-900">No posts yet</h2>
            <p className="mt-2 text-gray-600">
              Check back soon — or seed the blog with <code className="rounded bg-gray-100 px-1.5 py-0.5">pnpm --filter @homechef/web seed:blog</code>.
            </p>
          </div>
        )}

        {/* Featured */}
        {featured.length > 0 && (
          <section>
            <h2 className="text-2xl font-bold text-gray-900">Featured</h2>
            <div className="mt-6 grid gap-6 lg:grid-cols-3">
              {featured.map((p, i) => (
                <div key={p.id} className={i === 0 ? 'lg:col-span-2 lg:row-span-2' : ''}>
                  <PostCard post={p} featured={i === 0} />
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Latest */}
        {latestFiltered.length > 0 && (
          <section className="mt-14">
            <h2 className="text-2xl font-bold text-gray-900">Latest Articles</h2>
            <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {latestFiltered.map((p) => (
                <PostCard key={p.id} post={p} />
              ))}
            </div>
          </section>
        )}
      </main>

      <SiteFooter />
    </div>
  );
}
