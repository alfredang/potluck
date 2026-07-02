'use server';

import { revalidatePath } from 'next/cache';
import { eq } from 'drizzle-orm';
import { db } from '../../../lib/db';
import { chefReviews } from '../../../lib/schema';

export async function toggleReviewVisibility(formData: FormData) {
  const id = String(formData.get('id') ?? '');
  const visible = String(formData.get('visible') ?? '') === '1';
  if (!id) return;
  await db
    .update(chefReviews)
    .set({ isVisible: visible, updatedAt: new Date() })
    .where(eq(chefReviews.id, id));
  revalidatePath('/admin/reviews');
}

export async function deleteReview(formData: FormData) {
  const id = String(formData.get('id') ?? '');
  if (!id) return;
  await db.delete(chefReviews).where(eq(chefReviews.id, id));
  revalidatePath('/admin/reviews');
}
