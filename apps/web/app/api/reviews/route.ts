import { NextResponse } from 'next/server';
import { addChefReview, getChefReviews, isKnownChefId } from '../../../lib/reviews';

export const dynamic = 'force-dynamic';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PLATFORMS = new Set(['web', 'ios', 'android']);

// Shared reviews endpoint — used by the website chef pages AND the iOS /
// Android apps. Accepts both static chef slugs and DB chef uuids.

export async function GET(req: Request) {
  const chefId = new URL(req.url).searchParams.get('chefId');
  if (!chefId) return NextResponse.json({ error: 'chefId is required' }, { status: 400 });
  const data = await getChefReviews(chefId);
  return NextResponse.json(data);
}

interface ReviewBody {
  chefId?: string;
  authorName?: string;
  authorEmail?: string | null;
  rating?: number;
  title?: string | null;
  body?: string;
  platform?: string;
}

export async function POST(req: Request) {
  const body = (await req.json().catch(() => null)) as ReviewBody | null;
  if (!body) return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });

  const chefId = body.chefId?.trim();
  if (!chefId || !isKnownChefId(chefId)) {
    return NextResponse.json({ error: 'Unknown chef' }, { status: 404 });
  }
  const authorName = body.authorName?.trim();
  if (!authorName || authorName.length > 100) {
    return NextResponse.json({ error: 'Name is required (max 100 chars)' }, { status: 400 });
  }
  const authorEmail = body.authorEmail?.trim().toLowerCase() || null;
  if (authorEmail && (authorEmail.length > 255 || !EMAIL_RE.test(authorEmail))) {
    return NextResponse.json({ error: 'Invalid email' }, { status: 400 });
  }
  const rating = Number(body.rating);
  if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
    return NextResponse.json({ error: 'Rating must be 1-5' }, { status: 400 });
  }
  const title = body.title?.trim().slice(0, 200) || null;
  const text = body.body?.trim();
  if (!text || text.length < 10 || text.length > 2000) {
    return NextResponse.json({ error: 'Review must be 10-2000 characters' }, { status: 400 });
  }
  const platform = PLATFORMS.has(body.platform ?? '') ? (body.platform as 'web' | 'ios' | 'android') : 'web';

  const review = await addChefReview({
    chefId,
    authorName,
    authorEmail,
    rating,
    title,
    body: text,
    platform,
  });
  return NextResponse.json({ review }, { status: 201 });
}
