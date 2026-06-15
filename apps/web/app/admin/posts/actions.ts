'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { eq } from 'drizzle-orm';
import { db } from '../../../lib/db';
import { blogPosts } from '../../../lib/schema';
import { slugify, estimateReadingTime } from '../../../lib/slug';

export async function savePost(formData: FormData) {
  const id = String(formData.get('id') ?? '').trim();
  const title = String(formData.get('title') ?? '').trim();
  if (!title) return;

  const contentHtml = String(formData.get('contentHtml') ?? '');
  const status = formData.get('status') === 'published' ? 'published' : 'draft';
  const categoryRaw = String(formData.get('categoryId') ?? '');
  const categoryId = categoryRaw ? categoryRaw : null;

  const values = {
    title,
    slug: slugify(String(formData.get('slug') || title)),
    excerpt: String(formData.get('excerpt') ?? '') || null,
    contentHtml: contentHtml || null,
    featuredImage: String(formData.get('featuredImage') ?? '') || null,
    categoryId,
    authorName: String(formData.get('authorName') ?? '').trim() || 'Potluck Team',
    status: status as 'draft' | 'published',
    featured: formData.get('featured') === 'on',
    readingTime: estimateReadingTime(contentHtml),
    seoTitle: String(formData.get('seoTitle') ?? '') || null,
    seoDescription: String(formData.get('seoDescription') ?? '') || null,
    seoKeywords: String(formData.get('seoKeywords') ?? '') || null,
    updatedAt: new Date(),
  };

  if (id && id !== 'new') {
    // Preserve existing publishedAt; set it the first time it goes live.
    const [existing] = await db
      .select({ publishedAt: blogPosts.publishedAt })
      .from(blogPosts)
      .where(eq(blogPosts.id, id));
    const publishedAt =
      status === 'published' ? existing?.publishedAt ?? new Date() : existing?.publishedAt ?? null;
    await db.update(blogPosts).set({ ...values, publishedAt }).where(eq(blogPosts.id, id));
  } else {
    await db.insert(blogPosts).values({
      ...values,
      publishedAt: status === 'published' ? new Date() : null,
    });
  }

  revalidatePath('/admin/posts');
  revalidatePath('/blog');
  revalidatePath(`/blog/${values.slug}`);
  redirect('/admin/posts');
}

export async function deletePost(formData: FormData) {
  const id = String(formData.get('id') ?? '');
  if (!id) return;
  await db.delete(blogPosts).where(eq(blogPosts.id, id));
  revalidatePath('/admin/posts');
  revalidatePath('/blog');
}
