import {
  pgTable,
  pgEnum,
  uuid,
  varchar,
  text,
  integer,
  boolean,
  timestamp,
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

export const blogStatusEnum = pgEnum('blog_status', ['draft', 'published']);

export const blogCategories = pgTable('blog_categories', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: varchar('name', { length: 120 }).notNull(),
  slug: varchar('slug', { length: 120 }).unique().notNull(),
  description: text('description'),
  displayOrder: integer('display_order').default(0).notNull(),
  isActive: boolean('is_active').default(true).notNull(),
  createdAt: timestamp('created_at', { mode: 'date' }).defaultNow().notNull(),
});

export const blogPosts = pgTable('blog_posts', {
  id: uuid('id').defaultRandom().primaryKey(),
  title: varchar('title', { length: 250 }).notNull(),
  slug: varchar('slug', { length: 250 }).unique().notNull(),
  excerpt: text('excerpt'),
  contentHtml: text('content_html'),
  featuredImage: text('featured_image'),
  categoryId: uuid('category_id').references(() => blogCategories.id, {
    onDelete: 'set null',
  }),
  authorName: varchar('author_name', { length: 120 }).default('Potluck Team').notNull(),

  status: blogStatusEnum('status').default('draft').notNull(),
  featured: boolean('featured').default(false).notNull(),
  readingTime: integer('reading_time').default(3).notNull(),
  viewCount: integer('view_count').default(0).notNull(),
  likeCount: integer('like_count').default(0).notNull(),

  // SEO
  seoTitle: varchar('seo_title', { length: 250 }),
  seoDescription: text('seo_description'),
  seoKeywords: text('seo_keywords'),

  publishedAt: timestamp('published_at', { mode: 'date' }),
  createdAt: timestamp('created_at', { mode: 'date' }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { mode: 'date' }).defaultNow().notNull(),
});

export const blogCategoriesRelations = relations(blogCategories, ({ many }) => ({
  posts: many(blogPosts),
}));

export const blogPostsRelations = relations(blogPosts, ({ one }) => ({
  category: one(blogCategories, {
    fields: [blogPosts.categoryId],
    references: [blogCategories.id],
  }),
}));

/**
 * Like counters for the statically-defined chef menu items. Keyed by the
 * stable menu id from apps/web/lib/chefs-data.ts so we can persist likes
 * without a full menus table on the marketing site.
 */
export const menuLikes = pgTable('menu_likes', {
  menuId: varchar('menu_id', { length: 120 }).primaryKey(),
  likeCount: integer('like_count').default(0).notNull(),
  updatedAt: timestamp('updated_at', { mode: 'date' }).defaultNow().notNull(),
});
