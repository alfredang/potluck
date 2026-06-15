'use server';

import { revalidatePath } from 'next/cache';
import { eq } from 'drizzle-orm';
import { db } from '../../../lib/db';
import { blogCategories } from '../../../lib/schema';
import { slugify } from '../../../lib/slug';

export async function createCategory(formData: FormData) {
  const name = String(formData.get('name') ?? '').trim();
  if (!name) return;
  const slug = slugify(String(formData.get('slug') || name));
  await db
    .insert(blogCategories)
    .values({
      name,
      slug,
      description: String(formData.get('description') ?? '') || null,
      displayOrder: Number(formData.get('displayOrder') ?? 0) || 0,
    })
    .onConflictDoNothing({ target: blogCategories.slug });
  revalidatePath('/admin/categories');
  revalidatePath('/blog');
}

export async function updateCategory(formData: FormData) {
  const id = String(formData.get('id') ?? '');
  const name = String(formData.get('name') ?? '').trim();
  if (!id || !name) return;
  await db
    .update(blogCategories)
    .set({
      name,
      slug: slugify(String(formData.get('slug') || name)),
      description: String(formData.get('description') ?? '') || null,
      displayOrder: Number(formData.get('displayOrder') ?? 0) || 0,
      isActive: formData.get('isActive') === 'on',
    })
    .where(eq(blogCategories.id, id));
  revalidatePath('/admin/categories');
  revalidatePath('/blog');
}

export async function deleteCategory(formData: FormData) {
  const id = String(formData.get('id') ?? '');
  if (!id) return;
  await db.delete(blogCategories).where(eq(blogCategories.id, id));
  revalidatePath('/admin/categories');
  revalidatePath('/blog');
}
