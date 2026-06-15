import Link from 'next/link';
import { desc, eq } from 'drizzle-orm';
import { db } from '../../../lib/db';
import { blogPosts, blogCategories } from '../../../lib/schema';
import { formatDate } from '../../../lib/blog';
import { deletePost } from './actions';

export const dynamic = 'force-dynamic';

export default async function AdminPosts() {
  const posts = await db
    .select({
      id: blogPosts.id,
      title: blogPosts.title,
      slug: blogPosts.slug,
      status: blogPosts.status,
      featured: blogPosts.featured,
      likeCount: blogPosts.likeCount,
      viewCount: blogPosts.viewCount,
      publishedAt: blogPosts.publishedAt,
      updatedAt: blogPosts.updatedAt,
      categoryName: blogCategories.name,
    })
    .from(blogPosts)
    .leftJoin(blogCategories, eq(blogPosts.categoryId, blogCategories.id))
    .orderBy(desc(blogPosts.updatedAt))
    .catch(() => []);

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Blog Posts</h1>
          <p className="mt-1 text-sm text-gray-500">{posts.length} posts</p>
        </div>
        <Link
          href="/admin/posts/new"
          className="rounded-lg bg-orange-500 px-4 py-2 text-sm font-semibold text-white hover:bg-orange-600"
        >
          + New Post
        </Link>
      </div>

      <div className="mt-6 overflow-hidden rounded-2xl border border-gray-200 bg-white">
        {posts.length === 0 ? (
          <p className="py-12 text-center text-gray-500">No posts yet. Create your first one.</p>
        ) : (
          <table className="w-full text-left text-sm">
            <thead className="border-b border-gray-200 bg-gray-50 text-xs uppercase text-gray-500">
              <tr>
                <th className="px-4 py-3">Title</th>
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Stats</th>
                <th className="px-4 py-3">Updated</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {posts.map((p) => (
                <tr key={p.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <Link href={`/admin/posts/${p.id}`} className="font-medium text-gray-900 hover:text-orange-600">
                      {p.title}
                    </Link>
                    {p.featured && (
                      <span className="ml-2 rounded bg-orange-100 px-1.5 py-0.5 text-[10px] font-semibold text-orange-700">
                        FEATURED
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-gray-600">{p.categoryName ?? '—'}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                        p.status === 'published'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-gray-100 text-gray-600'
                      }`}
                    >
                      {p.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-500">♥ {p.likeCount} · 👁 {p.viewCount}</td>
                  <td className="px-4 py-3 text-gray-500">{formatDate(p.updatedAt)}</td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex justify-end gap-2">
                      <Link
                        href={`/admin/posts/${p.id}`}
                        className="rounded-lg border border-gray-300 px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50"
                      >
                        Edit
                      </Link>
                      <form action={deletePost}>
                        <input type="hidden" name="id" value={p.id} />
                        <button className="rounded-lg border border-red-200 px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50">
                          Delete
                        </button>
                      </form>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
