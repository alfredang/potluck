import Link from 'next/link';
import { notFound } from 'next/navigation';
import { eq } from 'drizzle-orm';
import { db } from '../../../../lib/db';
import { blogPosts, blogCategories } from '../../../../lib/schema';
import { savePost } from '../actions';

export const dynamic = 'force-dynamic';

export default async function PostEditor({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const isNew = id === 'new';

  const categories = await db
    .select({ id: blogCategories.id, name: blogCategories.name })
    .from(blogCategories)
    .orderBy(blogCategories.name)
    .catch(() => []);

  let post: typeof blogPosts.$inferSelect | null = null;
  if (!isNew) {
    const [row] = await db.select().from(blogPosts).where(eq(blogPosts.id, id));
    if (!row) notFound();
    post = row;
  }

  const input =
    'w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500';
  const label = 'block text-sm font-medium text-gray-700';

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">{isNew ? 'New Post' : 'Edit Post'}</h1>
        <Link href="/admin/posts" className="text-sm text-gray-500 hover:text-gray-700">
          ← Back to posts
        </Link>
      </div>

      <form action={savePost} className="mt-6 grid gap-6 lg:grid-cols-[2fr_1fr]">
        <input type="hidden" name="id" value={isNew ? 'new' : id} />

        {/* Main column */}
        <div className="space-y-4">
          <div>
            <label className={label}>Title</label>
            <input name="title" required defaultValue={post?.title ?? ''} className={input} />
          </div>
          <div>
            <label className={label}>Slug <span className="text-gray-400">(auto if blank)</span></label>
            <input name="slug" defaultValue={post?.slug ?? ''} placeholder="my-post-title" className={input} />
          </div>
          <div>
            <label className={label}>Excerpt</label>
            <textarea name="excerpt" rows={2} defaultValue={post?.excerpt ?? ''} className={input} />
          </div>
          <div>
            <label className={label}>Content (HTML)</label>
            <textarea
              name="contentHtml"
              rows={18}
              defaultValue={post?.contentHtml ?? ''}
              placeholder="<p>Write your article in HTML…</p>"
              className={`${input} font-mono`}
            />
            <p className="mt-1 text-xs text-gray-400">
              Use <code>&lt;h2&gt;</code>, <code>&lt;p&gt;</code>, <code>&lt;ul&gt;</code>,{' '}
              <code>&lt;blockquote&gt;</code>, <code>&lt;a&gt;</code>, <code>&lt;img&gt;</code>.
            </p>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          <div className="rounded-2xl border border-gray-200 bg-white p-5">
            <h2 className="text-sm font-semibold text-gray-900">Publish</h2>
            <div className="mt-3 space-y-3">
              <div>
                <label className={label}>Status</label>
                <select name="status" defaultValue={post?.status ?? 'draft'} className={input}>
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                </select>
              </div>
              <label className="flex items-center gap-2 text-sm text-gray-700">
                <input type="checkbox" name="featured" defaultChecked={post?.featured ?? false} />
                Featured post
              </label>
              <button className="w-full rounded-lg bg-orange-500 py-2.5 text-sm font-semibold text-white hover:bg-orange-600">
                {isNew ? 'Create Post' : 'Save Changes'}
              </button>
            </div>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-5">
            <h2 className="text-sm font-semibold text-gray-900">Details</h2>
            <div className="mt-3 space-y-3">
              <div>
                <label className={label}>Category</label>
                <select name="categoryId" defaultValue={post?.categoryId ?? ''} className={input}>
                  <option value="">— None —</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className={label}>Author</label>
                <input name="authorName" defaultValue={post?.authorName ?? 'Potluck Team'} className={input} />
              </div>
              <div>
                <label className={label}>Featured image URL</label>
                <input name="featuredImage" defaultValue={post?.featuredImage ?? ''} placeholder="https://…" className={input} />
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-5">
            <h2 className="text-sm font-semibold text-gray-900">SEO</h2>
            <div className="mt-3 space-y-3">
              <div>
                <label className={label}>SEO title</label>
                <input name="seoTitle" defaultValue={post?.seoTitle ?? ''} className={input} />
              </div>
              <div>
                <label className={label}>Meta description</label>
                <textarea name="seoDescription" rows={2} defaultValue={post?.seoDescription ?? ''} className={input} />
              </div>
              <div>
                <label className={label}>Keywords</label>
                <input name="seoKeywords" defaultValue={post?.seoKeywords ?? ''} placeholder="comma, separated" className={input} />
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
