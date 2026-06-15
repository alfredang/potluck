import { db } from '../../../lib/db';
import { blogCategories } from '../../../lib/schema';
import { createCategory, updateCategory, deleteCategory } from './actions';

export const dynamic = 'force-dynamic';

export default async function AdminCategories() {
  const categories = await db
    .select()
    .from(blogCategories)
    .orderBy(blogCategories.displayOrder, blogCategories.name)
    .catch(() => []);

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900">Categories</h1>
      <p className="mt-1 text-sm text-gray-500">{categories.length} categories</p>

      {/* New category */}
      <form
        action={createCategory}
        className="mt-6 grid gap-3 rounded-2xl border border-gray-200 bg-white p-5 sm:grid-cols-[1fr_1fr_auto]"
      >
        <input
          name="name"
          placeholder="Category name"
          required
          className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-orange-500 focus:outline-none"
        />
        <input
          name="description"
          placeholder="Short description (optional)"
          className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-orange-500 focus:outline-none"
        />
        <button className="rounded-lg bg-orange-500 px-4 py-2 text-sm font-semibold text-white hover:bg-orange-600">
          Add
        </button>
      </form>

      {/* List */}
      <div className="mt-6 space-y-3">
        {categories.length === 0 && (
          <p className="rounded-xl border border-dashed border-gray-300 bg-white py-10 text-center text-gray-500">
            No categories yet.
          </p>
        )}
        {categories.map((c) => (
          <form
            key={c.id}
            action={updateCategory}
            className="grid items-center gap-3 rounded-2xl border border-gray-200 bg-white p-4 sm:grid-cols-[1fr_1.4fr_5rem_auto_auto]"
          >
            <input type="hidden" name="id" value={c.id} />
            <input
              name="name"
              defaultValue={c.name}
              className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-orange-500 focus:outline-none"
            />
            <input
              name="description"
              defaultValue={c.description ?? ''}
              placeholder="Description"
              className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-orange-500 focus:outline-none"
            />
            <input
              name="displayOrder"
              type="number"
              defaultValue={c.displayOrder}
              title="Display order"
              className="rounded-lg border border-gray-300 px-2 py-2 text-sm focus:border-orange-500 focus:outline-none"
            />
            <label className="flex items-center gap-2 text-sm text-gray-600">
              <input type="checkbox" name="isActive" defaultChecked={c.isActive} /> Active
            </label>
            <div className="flex gap-2">
              <button className="rounded-lg bg-gray-900 px-3 py-2 text-xs font-semibold text-white hover:bg-gray-700">
                Save
              </button>
              <button
                formAction={deleteCategory}
                className="rounded-lg border border-red-200 px-3 py-2 text-xs font-semibold text-red-600 hover:bg-red-50"
              >
                Delete
              </button>
            </div>
            <p className="text-xs text-gray-400 sm:col-span-5">/blog/category/{c.slug}</p>
          </form>
        ))}
      </div>
    </div>
  );
}
