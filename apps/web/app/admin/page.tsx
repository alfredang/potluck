import Link from 'next/link';
import { sql, eq } from 'drizzle-orm';
import { db } from '../../lib/db';
import { blogPosts, blogCategories } from '../../lib/schema';

export const dynamic = 'force-dynamic';

async function getStats() {
  try {
    const [[posts], [published], [cats]] = await Promise.all([
      db.select({ c: sql<number>`count(*)::int` }).from(blogPosts),
      db
        .select({ c: sql<number>`count(*)::int` })
        .from(blogPosts)
        .where(eq(blogPosts.status, 'published')),
      db.select({ c: sql<number>`count(*)::int` }).from(blogCategories),
    ]);
    return { posts: posts?.c ?? 0, published: published?.c ?? 0, categories: cats?.c ?? 0, ok: true };
  } catch {
    return { posts: 0, published: 0, categories: 0, ok: false };
  }
}

export default async function AdminDashboard() {
  const stats = await getStats();

  const cards = [
    { label: 'Total Posts', value: stats.posts, href: '/admin/posts' },
    { label: 'Published', value: stats.published, href: '/admin/posts' },
    { label: 'Categories', value: stats.categories, href: '/admin/categories' },
  ];

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <Link
          href="/admin/posts/new"
          className="rounded-lg bg-orange-500 px-4 py-2 text-sm font-semibold text-white hover:bg-orange-600"
        >
          + New Post
        </Link>
      </div>

      {!stats.ok && (
        <p className="mt-4 rounded-lg bg-amber-50 px-3 py-2 text-sm text-amber-700">
          Could not reach the database. Check <code>DATABASE_URL</code>.
        </p>
      )}

      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        {cards.map((c) => (
          <Link
            key={c.label}
            href={c.href}
            className="rounded-2xl border border-gray-200 bg-white p-6 transition hover:border-orange-300 hover:shadow-sm"
          >
            <p className="text-sm text-gray-500">{c.label}</p>
            <p className="mt-2 text-3xl font-bold text-gray-900">{c.value}</p>
          </Link>
        ))}
      </div>

      <div className="mt-8 rounded-2xl border border-gray-200 bg-white p-6">
        <h2 className="font-semibold text-gray-900">Quick actions</h2>
        <div className="mt-4 flex flex-wrap gap-3">
          <Link href="/admin/posts" className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
            Manage posts
          </Link>
          <Link href="/admin/categories" className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
            Manage categories
          </Link>
          <Link href="/blog" className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
            View blog
          </Link>
        </div>
      </div>
    </div>
  );
}
