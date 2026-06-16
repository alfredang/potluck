import type { Metadata } from 'next';
import Link from 'next/link';
import { SiteNav } from '../components/SiteNav';
import { SiteFooter } from '../components/SiteFooter';
import { PostCard } from '../components/PostCard';
import { Pager } from '../components/Pager';
import {
  getActiveCategories,
  getFeaturedPosts,
  getPublishedPostsPage,
  SITE_URL,
} from '../../lib/blog';

export const dynamic = 'force-dynamic';

function parsePage(value: string | string[] | undefined): number {
  const raw = Array.isArray(value) ? value[0] : value;
  const n = Number(raw);
  return Number.isFinite(n) && n > 1 ? Math.floor(n) : 1;
}

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}): Promise<Metadata> {
  const page = parsePage((await searchParams).page);
  const isPaged = page > 1;
  const title = isPaged
    ? `Blog — Page ${page} | Home Dining Stories, Recipes & Chef Tips`
    : 'Blog — Home Dining Stories, Recipes & Chef Tips';
  const description =
    'Stories from Singapore home chefs, recipes, food culture and tips for hosting and discovering authentic home-cooked meals on Potluck.';
  const canonical = isPaged ? `/blog?page=${page}` : '/blog';
  const ogUrl = isPaged ? `${SITE_URL}/blog?page=${page}` : `${SITE_URL}/blog`;

  return {
    title,
    description,
    keywords: [
      'home dining blog',
      'Singapore home chefs',
      'home cooked food Singapore',
      'recipes',
      'food culture',
      'private dining Singapore',
    ],
    alternates: { canonical },
    openGraph: {
      type: 'website',
      url: ogUrl,
      title: `Potluck Blog${isPaged ? ` — Page ${page}` : ''} — Home Dining Stories, Recipes & Chef Tips`,
      description: 'Stories from Singapore home chefs, recipes, food culture and hosting tips.',
      locale: 'en_SG',
      siteName: 'Potluck',
    },
    twitter: { card: 'summary_large_image', title: 'Potluck Blog', description },
  };
}

export default async function BlogIndex({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const page = parsePage((await searchParams).page);
  const isFirstPage = page === 1;

  let featured: Awaited<ReturnType<typeof getFeaturedPosts>> = [];
  let paged: Awaited<ReturnType<typeof getPublishedPostsPage>> = {
    posts: [],
    total: 0,
    page,
    pageSize: 0,
    totalPages: 1,
  };
  let categories: Awaited<ReturnType<typeof getActiveCategories>> = [];
  try {
    [featured, paged, categories] = await Promise.all([
      isFirstPage ? getFeaturedPosts(3) : Promise.resolve([]),
      getPublishedPostsPage(page),
      getActiveCategories(),
    ]);
  } catch {
    // DB unavailable — fall through to the empty state instead of a 500.
  }

  const featuredIds = new Set(featured.map((p) => p.id));
  const latest = paged.posts.filter((p) => !featuredIds.has(p.id));
  const hasPosts = featured.length > 0 || paged.posts.length > 0;

  const listed = [...featured, ...latest];
  const blogJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Blog',
    name: 'Potluck Blog',
    description:
      'Stories from Singapore home chefs, recipes, food culture and tips for hosting and discovering authentic home-cooked meals.',
    url: `${SITE_URL}/blog`,
    blogPost: listed.map((p) => ({
      '@type': 'BlogPosting',
      headline: p.title,
      url: `${SITE_URL}/blog/${p.slug}`,
      datePublished: p.publishedAt?.toISOString(),
      image: p.featuredImage ?? undefined,
      author: { '@type': 'Person', name: p.authorName },
    })),
  };

  return (
    <div className="min-h-screen bg-cream">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(blogJsonLd) }} />
      <SiteNav active="/blog" />

      {/* Header */}
      <header className="border-b border-orange-100 bg-gradient-to-br from-orange-100/60 via-amber-50/50 to-[var(--cream)]">
        <div className="mx-auto max-w-[1440px] px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
          <p className="text-sm font-semibold uppercase tracking-wide text-orange-500">The Potluck Journal</p>
          <h1 className="font-display mt-2 text-3xl font-black tracking-tight text-gray-900 sm:text-4xl">
            From the Kitchen Table
          </h1>
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
                  className="rounded-full border border-orange-200 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 transition hover:border-orange-300 hover:text-orange-600"
                >
                  {c.name}
                </Link>
              ))}
            </div>
          )}
        </div>
      </header>

      <main className="mx-auto max-w-[1440px] px-4 py-12 sm:px-6 sm:py-14 lg:px-8">
        {!hasPosts && (
          <div className="rounded-2xl border border-dashed border-orange-200 bg-white py-20 text-center">
            <p className="text-5xl">📝</p>
            <h2 className="mt-4 text-xl font-semibold text-gray-900">No posts yet</h2>
            <p className="mt-2 text-gray-600">
              Check back soon — or seed the blog with <code className="rounded bg-orange-50 px-1.5 py-0.5">pnpm --filter @homechef/web seed:blog</code>.
            </p>
          </div>
        )}

        {/* Featured — page 1 only */}
        {isFirstPage && featured.length > 0 && (
          <section>
            <h2 className="font-display text-2xl font-bold text-gray-900">Featured</h2>
            <div className="mt-6 grid gap-6 lg:grid-cols-3">
              {featured.map((p, i) => (
                <div key={p.id} className={i === 0 ? 'lg:col-span-2 lg:row-span-2' : ''}>
                  <PostCard post={p} featured={i === 0} />
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Browse all articles */}
        {latest.length > 0 && (
          <section className={isFirstPage && featured.length > 0 ? 'mt-14' : ''}>
            <h2 className="font-display text-2xl font-bold text-gray-900">
              {isFirstPage ? 'Browse all articles' : `All articles — Page ${page}`}
            </h2>
            <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {latest.map((p) => (
                <PostCard key={p.id} post={p} />
              ))}
            </div>
            <Pager basePath="/blog" page={paged.page} totalPages={paged.totalPages} />
          </section>
        )}
      </main>

      <SiteFooter />
    </div>
  );
}
