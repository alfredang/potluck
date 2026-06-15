import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { SiteNav } from '../../../components/SiteNav';
import { SiteFooter } from '../../../components/SiteFooter';
import { PostCard } from '../../../components/PostCard';
import {
  getCategoryBySlug,
  getPostsByCategorySlug,
  getActiveCategories,
  SITE_URL,
} from '../../../../lib/blog';

export const dynamic = 'force-dynamic';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const category = await getCategoryBySlug(slug).catch(() => null);
  if (!category) return { title: 'Category Not Found | Potluck Blog' };
  const title = `${category.name} — Potluck Blog`;
  const description = category.description || `Articles about ${category.name} from the Potluck Journal.`;
  return {
    title,
    description,
    alternates: { canonical: `/blog/category/${category.slug}` },
    openGraph: {
      type: 'website',
      url: `${SITE_URL}/blog/category/${category.slug}`,
      title,
      description,
      siteName: 'Potluck',
      locale: 'en_SG',
    },
  };
}

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const [category, posts, categories] = await Promise.all([
    getCategoryBySlug(slug).catch(() => null),
    getPostsByCategorySlug(slug).catch(() => []),
    getActiveCategories().catch(() => []),
  ]);
  if (!category) notFound();

  return (
    <div className="min-h-screen bg-gray-50">
      <SiteNav active="/blog" />

      <header className="bg-white">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <Link href="/blog" className="text-sm text-gray-600 hover:text-orange-500">
            ← All Articles
          </Link>
          <h1 className="mt-3 text-4xl font-bold text-gray-900">{category.name}</h1>
          {category.description && <p className="mt-3 max-w-2xl text-lg text-gray-600">{category.description}</p>}

          <div className="mt-6 flex flex-wrap gap-2">
            <Link href="/blog" className="rounded-full border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 hover:border-orange-300 hover:text-orange-600">
              All
            </Link>
            {categories.map((c) => (
              <Link
                key={c.id}
                href={`/blog/category/${c.slug}`}
                className={`rounded-full px-3 py-1.5 text-sm font-medium ${
                  c.slug === slug
                    ? 'bg-orange-500 text-white'
                    : 'border border-gray-300 bg-white text-gray-700 hover:border-orange-300 hover:text-orange-600'
                }`}
              >
                {c.name}
              </Link>
            ))}
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        {posts.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-gray-300 bg-white py-20 text-center">
            <p className="text-gray-600">No articles in this category yet.</p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((p) => (
              <PostCard key={p.id} post={p} />
            ))}
          </div>
        )}
      </main>

      <SiteFooter />
    </div>
  );
}
