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
  tags: blogPosts.tags,
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

// Self-healing migration: the `tags` column is added by the seeder, but production may be
// running the new (tags-aware) code before `seed:blog` has run. Add the column on first
// blog read so queries don't 500. Idempotent + cached to one execution per process;
// best-effort (a fresh DB without the table just falls through to the page's empty state).
let blogColumnsEnsured: Promise<void> | null = null;
function ensureBlogColumns(): Promise<void> {
  if (!blogColumnsEnsured) {
    blogColumnsEnsured = db
      .execute(sql`ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS tags text[]`)
      .then(() => undefined)
      .catch(() => undefined);
  }
  return blogColumnsEnsured;
}

export async function getActiveCategories() {
  return db
    .select()
    .from(blogCategories)
    .where(eq(blogCategories.isActive, true))
    .orderBy(blogCategories.displayOrder, blogCategories.name);
}

export async function getFeaturedPosts(limit = 3): Promise<PostWithCategory[]> {
  await ensureBlogColumns();
  return db
    .select(postSelect)
    .from(blogPosts)
    .leftJoin(blogCategories, eq(blogPosts.categoryId, blogCategories.id))
    .where(and(eq(blogPosts.status, 'published'), eq(blogPosts.featured, true)))
    .orderBy(desc(blogPosts.publishedAt))
    .limit(limit) as Promise<PostWithCategory[]>;
}

export async function getLatestPosts(limit = 12, offset = 0): Promise<PostWithCategory[]> {
  await ensureBlogColumns();
  return db
    .select(postSelect)
    .from(blogPosts)
    .leftJoin(blogCategories, eq(blogPosts.categoryId, blogCategories.id))
    .where(eq(blogPosts.status, 'published'))
    .orderBy(desc(blogPosts.publishedAt))
    .limit(limit)
    .offset(offset) as Promise<PostWithCategory[]>;
}

export const BLOG_PAGE_SIZE = 9;

export type PagedPosts = {
  posts: PostWithCategory[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
};

/** Paginated published posts (newest first), with a total count for pager UI. */
export async function getPublishedPostsPage(
  page = 1,
  pageSize = BLOG_PAGE_SIZE,
): Promise<PagedPosts> {
  await ensureBlogColumns();
  const safePage = Math.max(1, Math.floor(page) || 1);
  const offset = (safePage - 1) * pageSize;
  const [posts, countRows] = await Promise.all([
    db
      .select(postSelect)
      .from(blogPosts)
      .leftJoin(blogCategories, eq(blogPosts.categoryId, blogCategories.id))
      .where(eq(blogPosts.status, 'published'))
      .orderBy(desc(blogPosts.publishedAt))
      .limit(pageSize)
      .offset(offset) as Promise<PostWithCategory[]>,
    db
      .select({ c: sql<number>`count(*)::int` })
      .from(blogPosts)
      .where(eq(blogPosts.status, 'published')),
  ]);
  const total = Number(countRows[0]?.c ?? 0);
  return { posts, total, page: safePage, pageSize, totalPages: Math.max(1, Math.ceil(total / pageSize)) };
}

/** Paginated published posts within a category slug. */
export async function getPostsByCategorySlugPage(
  slug: string,
  page = 1,
  pageSize = BLOG_PAGE_SIZE,
): Promise<PagedPosts> {
  await ensureBlogColumns();
  const safePage = Math.max(1, Math.floor(page) || 1);
  const offset = (safePage - 1) * pageSize;
  const where = and(eq(blogPosts.status, 'published'), eq(blogCategories.slug, slug));
  const [posts, countRows] = await Promise.all([
    db
      .select(postSelect)
      .from(blogPosts)
      .leftJoin(blogCategories, eq(blogPosts.categoryId, blogCategories.id))
      .where(where)
      .orderBy(desc(blogPosts.publishedAt))
      .limit(pageSize)
      .offset(offset) as Promise<PostWithCategory[]>,
    db
      .select({ c: sql<number>`count(*)::int` })
      .from(blogPosts)
      .leftJoin(blogCategories, eq(blogPosts.categoryId, blogCategories.id))
      .where(where),
  ]);
  const total = Number(countRows[0]?.c ?? 0);
  return { posts, total, page: safePage, pageSize, totalPages: Math.max(1, Math.ceil(total / pageSize)) };
}

export async function getPostsByCategorySlug(slug: string): Promise<PostWithCategory[]> {
  await ensureBlogColumns();
  return db
    .select(postSelect)
    .from(blogPosts)
    .leftJoin(blogCategories, eq(blogPosts.categoryId, blogCategories.id))
    .where(and(eq(blogPosts.status, 'published'), eq(blogCategories.slug, slug)))
    .orderBy(desc(blogPosts.publishedAt)) as Promise<PostWithCategory[]>;
}

export async function getPostBySlug(slug: string): Promise<PostWithCategory | null> {
  await ensureBlogColumns();
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
