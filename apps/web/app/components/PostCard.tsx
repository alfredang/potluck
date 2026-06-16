import Link from 'next/link';
import { formatDate, snippetFromHtml, SITE_URL, type PostWithCategory } from '../../lib/blog';
import { LikeButton } from './LikeButton';
import { ShareButtons } from './ShareButtons';

export function PostCard({ post, featured = false }: { post: PostWithCategory; featured?: boolean }) {
  const teaser = post.excerpt || snippetFromHtml(post.contentHtml, featured ? 200 : 130);
  const tags = (post.tags ?? []).filter(Boolean).slice(0, 3);
  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-orange-100 bg-white shadow-sm transition hover:-translate-y-1 hover:border-orange-200 hover:shadow-warm">
      <Link href={`/blog/${post.slug}`} className="block overflow-hidden bg-orange-50/40">
        <div className={featured ? 'aspect-[16/9]' : 'aspect-[3/2]'}>
          {post.featuredImage ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={post.featuredImage}
              alt={post.title}
              className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-orange-50 text-orange-300">
              <span className="text-4xl">🍲</span>
            </div>
          )}
        </div>
      </Link>
      <div className="flex flex-1 flex-col p-5">
        <div className="flex flex-wrap items-center gap-2 text-xs text-gray-500">
          {post.categorySlug && (
            <Link
              href={`/blog/category/${post.categorySlug}`}
              className="rounded-full bg-orange-50 px-2.5 py-1 font-medium text-orange-600 hover:bg-orange-100"
            >
              {post.categoryName}
            </Link>
          )}
          <span>{formatDate(post.publishedAt)}</span>
          <span aria-hidden>·</span>
          <span>{post.readingTime} min read</span>
        </div>

        <h3 className={`font-display mt-3 font-bold text-gray-900 group-hover:text-orange-600 ${featured ? 'text-2xl' : 'text-lg'}`}>
          <Link href={`/blog/${post.slug}`}>{post.title}</Link>
        </h3>
        <p className="mt-2 flex-1 text-sm text-gray-600 line-clamp-3">{teaser}</p>

        {tags.length > 0 && (
          <ul className="mt-3 flex flex-wrap gap-1.5">
            {tags.map((tag) => (
              <li
                key={tag}
                className="rounded-full bg-orange-50 px-2 py-0.5 text-[11px] font-medium text-orange-600"
              >
                #{tag}
              </li>
            ))}
          </ul>
        )}

        <div className="mt-4 flex items-center justify-between gap-2 border-t border-orange-100 pt-3">
          <LikeButton id={post.slug} endpoint="/api/blog/like" initialCount={post.likeCount} />
          <ShareButtons url={`${SITE_URL}/blog/${post.slug}`} title={post.title} compact />
        </div>
        <p className="mt-3 text-xs text-gray-500">By {post.authorName}</p>
      </div>
    </article>
  );
}
