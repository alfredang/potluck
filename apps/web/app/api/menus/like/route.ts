import { NextResponse } from 'next/server';
import { eq, sql } from 'drizzle-orm';
import { db } from '../../../../lib/db';
import { menuLikes } from '../../../../lib/schema';
import { getAllMenuIds } from '../../../../lib/chefs-data';

export const dynamic = 'force-dynamic';

const VALID_IDS = new Set(getAllMenuIds());

export async function GET(req: Request) {
  const id = new URL(req.url).searchParams.get('id');
  if (!id) return NextResponse.json({ error: 'missing id' }, { status: 400 });
  const [row] = await db
    .select({ likeCount: menuLikes.likeCount })
    .from(menuLikes)
    .where(eq(menuLikes.menuId, id));
  return NextResponse.json({ likeCount: row?.likeCount ?? 0 });
}

export async function POST(req: Request) {
  const body = (await req.json().catch(() => null)) as { id?: string; action?: string } | null;
  const id = body?.id;
  const action = body?.action === 'unlike' ? 'unlike' : 'like';
  if (!id || !VALID_IDS.has(id)) {
    return NextResponse.json({ error: 'invalid id' }, { status: 400 });
  }

  if (action === 'like') {
    const [row] = await db
      .insert(menuLikes)
      .values({ menuId: id, likeCount: 1 })
      .onConflictDoUpdate({
        target: menuLikes.menuId,
        set: { likeCount: sql`${menuLikes.likeCount} + 1`, updatedAt: new Date() },
      })
      .returning({ likeCount: menuLikes.likeCount });
    return NextResponse.json({ likeCount: row?.likeCount ?? 1 });
  }

  // unlike — floor at 0; insert a 0 row if it doesn't exist yet
  const [row] = await db
    .insert(menuLikes)
    .values({ menuId: id, likeCount: 0 })
    .onConflictDoUpdate({
      target: menuLikes.menuId,
      set: { likeCount: sql`GREATEST(${menuLikes.likeCount} - 1, 0)`, updatedAt: new Date() },
    })
    .returning({ likeCount: menuLikes.likeCount });
  return NextResponse.json({ likeCount: row?.likeCount ?? 0 });
}
