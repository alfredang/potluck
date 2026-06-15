import { NextResponse } from 'next/server';
import { eq, sql } from 'drizzle-orm';
import { db } from '../../../../lib/db';
import { blogPosts } from '../../../../lib/schema';

export const dynamic = 'force-dynamic';

// The post slug is passed as `id` to keep the generic LikeButton contract.
export async function GET(req: Request) {
  const id = new URL(req.url).searchParams.get('id');
  if (!id) return NextResponse.json({ error: 'missing id' }, { status: 400 });
  const [row] = await db
    .select({ likeCount: blogPosts.likeCount })
    .from(blogPosts)
    .where(eq(blogPosts.slug, id));
  return NextResponse.json({ likeCount: row?.likeCount ?? 0 });
}

export async function POST(req: Request) {
  const body = (await req.json().catch(() => null)) as { id?: string; action?: string } | null;
  const slug = body?.id;
  const action = body?.action === 'unlike' ? 'unlike' : 'like';
  if (!slug) return NextResponse.json({ error: 'invalid id' }, { status: 400 });

  const delta =
    action === 'unlike'
      ? sql`GREATEST(${blogPosts.likeCount} - 1, 0)`
      : sql`${blogPosts.likeCount} + 1`;

  const [row] = await db
    .update(blogPosts)
    .set({ likeCount: delta })
    .where(eq(blogPosts.slug, slug))
    .returning({ likeCount: blogPosts.likeCount });

  if (!row) return NextResponse.json({ error: 'not_found' }, { status: 404 });
  return NextResponse.json({ likeCount: row.likeCount });
}
