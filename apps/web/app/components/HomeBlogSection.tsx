import Link from 'next/link';
import { PostCard } from './PostCard';
import { getFeaturedPosts, getLatestPosts, type PostWithCategory } from '../../lib/blog';

/**
 * Async server component. Renders the "From the Blog" teaser on the homepage.
 * Fails soft: if the DB is unavailable (e.g. at build time) it renders nothing.
 */
export async function HomeBlogSection() {
  let posts: PostWithCategory[] = [];
  try {
    const [featured, latest] = await Promise.all([getFeaturedPosts(3), getLatestPosts(6)]);
    const seen = new Set<string>();
    posts = [...featured, ...latest].filter((p) => {
      if (seen.has(p.id)) return false;
      seen.add(p.id);
      return true;
    }).slice(0, 3);
  } catch {
    return null;
  }

  if (posts.length === 0) return null;

  return (
    <section className="bg-white py-14 sm:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-orange-500">The Kitchen Table</p>
            <h2 className="font-display mt-2 text-3xl font-bold text-gray-900">Stories & guides from the blog</h2>
          </div>
          <Link href="/blog" className="hidden text-sm font-medium text-orange-500 hover:text-orange-600 sm:block">
            View all articles →
          </Link>
        </div>
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((p) => (
            <PostCard key={p.id} post={p} />
          ))}
        </div>
        <div className="mt-8 text-center sm:hidden">
          <Link href="/blog" className="text-sm font-medium text-orange-500 hover:text-orange-600">
            View all articles →
          </Link>
        </div>
      </div>
    </section>
  );
}
