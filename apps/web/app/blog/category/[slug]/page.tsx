import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { SiteNav } from '../../../components/SiteNav';
import { SiteFooter } from '../../../components/SiteFooter';
import { PostCard } from '../../../components/PostCard';
import { Pager } from '../../../components/Pager';
import {
  getCategoryBySlug,
  getPostsByCategorySlugPage,
  getActiveCategories,
  SITE_URL,
} from '../../../../lib/blog';

export const dynamic = 'force-dynamic';

function parsePage(value: string | string[] | undefined): number {
  const raw = Array.isArray(value) ? value[0] : value;
  const n = Number(raw);
  return Number.isFinite(n) && n > 1 ? Math.floor(n) : 1;
}

export async function generateMetadata({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ page?: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const page = parsePage((await searchParams).page);
  const category = await getCategoryBySlug(slug).catch(() => null);
  if (!category) return { title: 'Category Not Found | Potluck Blog' };

  const isPaged = page > 1;
  const base = `/blog/category/${category.slug}`;
  const title = isPaged ? `${category.name} — Page ${page} | Potluck Blog` : `${category.name} — Potluck Blog`;
  const description = category.description || `Articles about ${category.name} from the Potluck Journal.`;
  const canonical = isPaged ? `${base}?page=${page}` : base;

  return {
    title,
    description,
    alternates: { canonical },
    openGraph: {
      type: 'website',
      url: `${SITE_URL}${canonical}`,
      title,
      description,
      siteName: 'Potluck',
      locale: 'en_SG',
    },
  };
}

export default async function CategoryPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ page?: string }>;
}) {
  const { slug } = await params;
  const page = parsePage((await searchParams).page);
  const [category, paged, categories] = await Promise.all([
    getCategoryBySlug(slug).catch(() => null),
    getPostsByCategorySlugPage(slug, page).catch(() => ({ posts: [], total: 0, page: 1, pageSize: 9, totalPages: 1 })),
    getActiveCategories().catch(() => []),
  ]);
  if (!category) notFound();

  return (
    <div className="min-h-screen bg-cream">
      <SiteNav active="/blog" />

      <header className="border-b border-orange-100 bg-gradient-to-br from-orange-100/60 via-amber-50/50 to-[var(--cream)]">
        <div className="mx-auto max-w-[1440px] px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
          <Link href="/blog" className="text-sm text-gray-600 hover:text-orange-500">
            ← All Articles
          </Link>
          <h1 className="font-display mt-3 text-3xl font-black tracking-tight text-gray-900 sm:text-4xl">{category.name}</h1>
          {category.description && <p className="mt-3 max-w-2xl text-lg text-gray-600">{category.description}</p>}

          <div className="mt-6 flex flex-wrap gap-2">
            <Link href="/blog" className="rounded-full border border-orange-200 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 hover:border-orange-300 hover:text-orange-600">
              All
            </Link>
            {categories.map((c) => (
              <Link
                key={c.id}
                href={`/blog/category/${c.slug}`}
                className={`rounded-full px-3 py-1.5 text-sm font-medium ${
                  c.slug === slug
                    ? 'bg-orange-500 text-white'
                    : 'border border-orange-200 bg-white text-gray-700 hover:border-orange-300 hover:text-orange-600'
                }`}
              >
                {c.name}
              </Link>
            ))}
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-[1440px] px-4 py-12 sm:px-6 sm:py-14 lg:px-8">
        {paged.posts.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-orange-200 bg-white py-20 text-center">
            <p className="text-gray-600">No articles in this category yet.</p>
          </div>
        ) : (
          <>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {paged.posts.map((p) => (
                <PostCard key={p.id} post={p} />
              ))}
            </div>
            <Pager basePath={`/blog/category/${category.slug}`} page={paged.page} totalPages={paged.totalPages} />
          </>
        )}
      </main>

      <SiteFooter />
    </div>
  );
}
