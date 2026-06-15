import type { MetadataRoute } from 'next';
import { eq } from 'drizzle-orm';
import { db } from '../lib/db';
import { blogPosts, blogCategories } from '../lib/schema';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://potluckhub.io';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = (
    [
      { url: `${SITE_URL}/`, changeFrequency: 'daily', priority: 1 },
      { url: `${SITE_URL}/explore`, changeFrequency: 'daily', priority: 0.9 },
      { url: `${SITE_URL}/how-it-works`, changeFrequency: 'monthly', priority: 0.6 },
      { url: `${SITE_URL}/become-chef`, changeFrequency: 'monthly', priority: 0.7 },
      { url: `${SITE_URL}/pricing`, changeFrequency: 'monthly', priority: 0.6 },
      { url: `${SITE_URL}/blog`, changeFrequency: 'daily', priority: 0.8 },
      { url: `${SITE_URL}/contact`, changeFrequency: 'yearly', priority: 0.4 },
      { url: `${SITE_URL}/help`, changeFrequency: 'monthly', priority: 0.4 },
      { url: `${SITE_URL}/login`, changeFrequency: 'yearly', priority: 0.2 },
      { url: `${SITE_URL}/register`, changeFrequency: 'yearly', priority: 0.3 },
      { url: `${SITE_URL}/privacy`, changeFrequency: 'yearly', priority: 0.3 },
      { url: `${SITE_URL}/terms`, changeFrequency: 'yearly', priority: 0.3 },
      { url: `${SITE_URL}/delete-account`, changeFrequency: 'yearly', priority: 0.3 },
    ] as const
  ).map((r) => ({ ...r, lastModified: now }));

  let blogRoutes: MetadataRoute.Sitemap = [];
  try {
    const [posts, cats] = await Promise.all([
      db
        .select({ slug: blogPosts.slug, updatedAt: blogPosts.updatedAt })
        .from(blogPosts)
        .where(eq(blogPosts.status, 'published')),
      db.select({ slug: blogCategories.slug }).from(blogCategories).where(eq(blogCategories.isActive, true)),
    ]);
    blogRoutes = [
      ...posts.map((p) => ({
        url: `${SITE_URL}/blog/${p.slug}`,
        lastModified: p.updatedAt ?? now,
        changeFrequency: 'weekly' as const,
        priority: 0.6,
      })),
      ...cats.map((c) => ({
        url: `${SITE_URL}/blog/category/${c.slug}`,
        lastModified: now,
        changeFrequency: 'weekly' as const,
        priority: 0.5,
      })),
    ];
  } catch {
    // DB unavailable at build — ship the static + chef routes.
  }

  return [...staticRoutes, ...blogRoutes];
}
