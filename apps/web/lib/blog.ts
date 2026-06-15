import { and, desc, eq, sql } from 'drizzle-orm';
import { db } from './db';
import { blogPosts, blogCategories } from './schema';

export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://potluckhub.io';

export type PostWithCategory = typeof blogPosts.$inferSelect & {
  categoryName: string | null;
  categorySlug: string | null;
};

const postSelect = {
  id: blogPosts.id,
  title: blogPosts.title,
  slug: blogPosts.slug,
  excerpt: blogPosts.excerpt,
  contentHtml: blogPosts.contentHtml,
  featuredImage: blogPosts.featuredImage,
  categoryId: blogPosts.categoryId,
  authorName: blogPosts.authorName,
  status: blogPosts.status,
  featured: blogPosts.featured,
  readingTime: blogPosts.readingTime,
  viewCount: blogPosts.viewCount,
  likeCount: blogPosts.likeCount,
  seoTitle: blogPosts.seoTitle,
  seoDescription: blogPosts.seoDescription,
  seoKeywords: blogPosts.seoKeywords,
  publishedAt: blogPosts.publishedAt,
  createdAt: blogPosts.createdAt,
  updatedAt: blogPosts.updatedAt,
  categoryName: blogCategories.name,
  categorySlug: blogCategories.slug,
};

export async function getActiveCategories() {
  return db
    .select()
    .from(blogCategories)
    .where(eq(blogCategories.isActive, true))
    .orderBy(blogCategories.displayOrder, blogCategories.name);
}

export async function getFeaturedPosts(limit = 3): Promise<PostWithCategory[]> {
  return db
    .select(postSelect)
    .from(blogPosts)
    .leftJoin(blogCategories, eq(blogPosts.categoryId, blogCategories.id))
    .where(and(eq(blogPosts.status, 'published'), eq(blogPosts.featured, true)))
    .orderBy(desc(blogPosts.publishedAt))
    .limit(limit) as Promise<PostWithCategory[]>;
}

export async function getLatestPosts(limit = 12, offset = 0): Promise<PostWithCategory[]> {
  return db
    .select(postSelect)
    .from(blogPosts)
    .leftJoin(blogCategories, eq(blogPosts.categoryId, blogCategories.id))
    .where(eq(blogPosts.status, 'published'))
    .orderBy(desc(blogPosts.publishedAt))
    .limit(limit)
    .offset(offset) as Promise<PostWithCategory[]>;
}

export async function getPostsByCategorySlug(slug: string): Promise<PostWithCategory[]> {
  return db
    .select(postSelect)
    .from(blogPosts)
    .leftJoin(blogCategories, eq(blogPosts.categoryId, blogCategories.id))
    .where(and(eq(blogPosts.status, 'published'), eq(blogCategories.slug, slug)))
    .orderBy(desc(blogPosts.publishedAt)) as Promise<PostWithCategory[]>;
}

export async function getPostBySlug(slug: string): Promise<PostWithCategory | null> {
  const rows = (await db
    .select(postSelect)
    .from(blogPosts)
    .leftJoin(blogCategories, eq(blogPosts.categoryId, blogCategories.id))
    .where(eq(blogPosts.slug, slug))
    .limit(1)) as PostWithCategory[];
  return rows[0] ?? null;
}

export async function incrementViewCount(slug: string) {
  await db
    .update(blogPosts)
    .set({ viewCount: sql`${blogPosts.viewCount} + 1` })
    .where(eq(blogPosts.slug, slug));
}

export async function getCategoryBySlug(slug: string) {
  const [row] = await db
    .select()
    .from(blogCategories)
    .where(eq(blogCategories.slug, slug))
    .limit(1);
  return row ?? null;
}

/** Strip HTML to a plain-text teaser. */
export function snippetFromHtml(html: string | null | undefined, max = 160): string {
  if (!html) return '';
  const text = html
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/\s+/g, ' ')
    .trim();
  if (text.length <= max) return text;
  return text.slice(0, max).replace(/\s+\S*$/, '') + '…';
}

export function formatDate(d: Date | string | null | undefined): string {
  if (!d) return '';
  const date = typeof d === 'string' ? new Date(d) : d;
  return date.toLocaleDateString('en-SG', { year: 'numeric', month: 'long', day: 'numeric' });
}
