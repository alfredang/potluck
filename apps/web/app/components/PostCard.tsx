import Link from 'next/link';
import { formatDate, snippetFromHtml, type PostWithCategory } from '../../lib/blog';

export function PostCard({ post, featured = false }: { post: PostWithCategory; featured?: boolean }) {
  const teaser = post.excerpt || snippetFromHtml(post.contentHtml, featured ? 200 : 130);
  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl border border-orange-100 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-warm">
      <Link href={`/blog/${post.slug}`} className="block overflow-hidden bg-gray-100">
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
        <div className="flex items-center gap-2 text-xs text-gray-500">
          {post.categorySlug && (
            <Link
              href={`/blog/category/${post.categorySlug}`}
              className="rounded-full bg-orange-50 px-2.5 py-1 font-medium text-orange-600 hover:bg-orange-100"
            >
              {post.categoryName}
            </Link>
          )}
          <span>{formatDate(post.publishedAt)}</span>
          <span>·</span>
          <span>{post.readingTime} min read</span>
        </div>
        <h3 className={`font-display mt-3 font-bold text-gray-900 group-hover:text-orange-600 ${featured ? 'text-2xl' : 'text-lg'}`}>
          <Link href={`/blog/${post.slug}`}>{post.title}</Link>
        </h3>
        <p className="mt-2 flex-1 text-sm text-gray-600 line-clamp-3">{teaser}</p>
        <div className="mt-4 flex items-center gap-3 text-sm text-gray-500">
          <span>By {post.authorName}</span>
          <span className="ml-auto inline-flex items-center gap-1">
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
              <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" />
            </svg>
            {post.likeCount}
          </span>
        </div>
      </div>
    </article>
  );
}
