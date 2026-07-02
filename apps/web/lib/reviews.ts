// Review service backing GET/POST /api/reviews — the shared endpoint used by
// the website and the iOS/Android apps. For DB chefs (uuid ids) the list also
// merges the canonical `reviews` table (seeded diner reviews) so the apps see
// one combined feed.

import { and, desc, eq, sql } from 'drizzle-orm';
import { db } from './db';
import { chefReviews, orders, reviews, users } from './schema';
import { CHEFS } from './chefs-data';

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export interface PublicReview {
  id: string;
  authorName: string;
  rating: number;
  title: string | null;
  body: string;
  createdAt: string;
  verifiedBooking: boolean;
}

// ---------------------------------------------------------------------------
// Self-migrating schema (same pattern as lib/orders.ts ensureOrdersSchema).
// Mirrors apps/api/src/db/schema/chef-reviews.ts; keep in sync.

let schemaReady: Promise<void> | null = null;

export function ensureReviewsSchema(): Promise<void> {
  if (!schemaReady) {
    schemaReady = (async () => {
      await db.execute(sql`CREATE EXTENSION IF NOT EXISTS pgcrypto`);
      await db.execute(sql`DO $$ BEGIN
        CREATE TYPE order_platform AS ENUM ('web','ios','android');
      EXCEPTION WHEN duplicate_object THEN null; END $$;`);
      await db.execute(sql`CREATE TABLE IF NOT EXISTS chef_reviews (
        id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        chef_id text NOT NULL,
        author_name varchar(100) NOT NULL,
        author_email varchar(255),
        rating integer NOT NULL,
        title varchar(200),
        body text NOT NULL,
        order_id uuid,
        verified_booking boolean NOT NULL DEFAULT false,
        platform order_platform NOT NULL DEFAULT 'web',
        is_visible boolean NOT NULL DEFAULT true,
        created_at timestamp NOT NULL DEFAULT now(),
        updated_at timestamp NOT NULL DEFAULT now()
      )`);
      await db.execute(sql`CREATE INDEX IF NOT EXISTS chef_reviews_chef_id_idx ON chef_reviews (chef_id)`);
      await db.execute(sql`CREATE INDEX IF NOT EXISTS chef_reviews_visible_idx ON chef_reviews (is_visible)`);
    })().catch((err) => {
      schemaReady = null;
      throw err;
    });
  }
  return schemaReady;
}

// ---------------------------------------------------------------------------

export function isKnownChefId(chefId: string): boolean {
  return UUID_RE.test(chefId) || CHEFS.some((c) => c.id === chefId);
}

export async function getChefReviews(chefId: string, limit = 50) {
  await ensureReviewsSchema();

  const rows = await db
    .select()
    .from(chefReviews)
    .where(and(eq(chefReviews.chefId, chefId), eq(chefReviews.isVisible, true)))
    .orderBy(desc(chefReviews.createdAt))
    .limit(limit);

  const items: PublicReview[] = rows.map((r) => ({
    id: r.id,
    authorName: r.authorName,
    rating: r.rating,
    title: r.title,
    body: r.body,
    createdAt: r.createdAt.toISOString(),
    verifiedBooking: r.verifiedBooking,
  }));

  // DB chefs: merge the canonical reviews table (seeded diner reviews).
  if (UUID_RE.test(chefId)) {
    try {
      const canonical = await db
        .select({
          id: reviews.id,
          rating: reviews.rating,
          title: reviews.title,
          comment: reviews.comment,
          createdAt: reviews.createdAt,
          firstName: users.firstName,
          lastName: users.lastName,
        })
        .from(reviews)
        .innerJoin(users, eq(reviews.customerId, users.id))
        .where(and(eq(reviews.chefId, chefId), eq(reviews.isVisible, true)))
        .orderBy(desc(reviews.createdAt))
        .limit(limit);
      items.push(
        ...canonical.map((r) => ({
          id: r.id,
          authorName: `${r.firstName} ${r.lastName.charAt(0)}.`.trim(),
          rating: r.rating,
          title: r.title,
          body: r.comment ?? '',
          createdAt: r.createdAt.toISOString(),
          verifiedBooking: true,
        }))
      );
      items.sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
    } catch (err) {
      console.error('[reviews] canonical merge failed:', err);
    }
  }

  const total = items.length;
  const average = total
    ? Math.round((items.reduce((s, r) => s + r.rating, 0) / total) * 10) / 10
    : null;
  return { reviews: items.slice(0, limit), total, average };
}

export interface NewReview {
  chefId: string;
  authorName: string;
  authorEmail: string | null;
  rating: number;
  title: string | null;
  body: string;
  platform: 'web' | 'ios' | 'android';
}

export async function addChefReview(input: NewReview): Promise<PublicReview> {
  await ensureReviewsSchema();

  // Mark as a verified booking when this email has a paid order with the chef.
  let verifiedBooking = false;
  let orderId: string | null = null;
  if (input.authorEmail) {
    try {
      const [order] = await db
        .select({ id: orders.id })
        .from(orders)
        .where(
          and(
            eq(orders.customerEmail, input.authorEmail.toLowerCase()),
            eq(orders.chefId, input.chefId),
            eq(orders.status, 'paid')
          )
        )
        .limit(1);
      if (order) {
        verifiedBooking = true;
        orderId = order.id;
      }
    } catch (err) {
      console.error('[reviews] verified-booking lookup failed:', err);
    }
  }

  const [row] = await db
    .insert(chefReviews)
    .values({
      chefId: input.chefId,
      authorName: input.authorName,
      authorEmail: input.authorEmail,
      rating: input.rating,
      title: input.title,
      body: input.body,
      platform: input.platform,
      verifiedBooking,
      orderId,
    })
    .returning();

  return {
    id: row.id,
    authorName: row.authorName,
    rating: row.rating,
    title: row.title,
    body: row.body,
    createdAt: row.createdAt.toISOString(),
    verifiedBooking: row.verifiedBooking,
  };
}
