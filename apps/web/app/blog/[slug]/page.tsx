import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { SiteNav } from '../../components/SiteNav';
import { SiteFooter } from '../../components/SiteFooter';
import { PostCard } from '../../components/PostCard';
import { LikeButton } from '../../components/LikeButton';
import { ShareButtons } from '../../components/ShareButtons';
import { LeadMagnetCTA } from '../../components/LeadMagnetCTA';
import {
  getPostBySlug,
  getLatestPosts,
  incrementViewCount,
  formatDate,
  snippetFromHtml,
  SITE_URL,
} from '../../../lib/blog';

export const dynamic = 'force-dynamic';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug).catch(() => null);
  if (!post || post.status !== 'published') return { title: 'Post Not Found | Potluck Blog' };

  const description = post.seoDescription || post.excerpt || snippetFromHtml(post.contentHtml, 160);
  const title = post.seoTitle || post.title;
  const url = `${SITE_URL}/blog/${post.slug}`;
  const images = post.featuredImage ? [{ url: post.featuredImage, alt: post.title }] : undefined;

  return {
    title,
    description,
    keywords: post.seoKeywords ?? undefined,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: {
      type: 'article',
      url,
      title,
      description,
      images,
      publishedTime: post.publishedAt?.toISOString(),
      authors: [post.authorName],
      locale: 'en_SG',
      siteName: 'Potluck',
    },
    twitter: { card: 'summary_large_image', title, description, images: post.featuredImage ? [post.featuredImage] : undefined },
  };
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getPostBySlug(slug).catch(() => null);
  if (!post || post.status !== 'published') notFound();

  // Fire-and-forget view increment.
  incrementViewCount(slug).catch(() => {});

  const url = `${SITE_URL}/blog/${post.slug}`;
  const related = (await getLatestPosts(4).catch(() => [])).filter((p) => p.slug !== slug).slice(0, 3);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.seoDescription || post.excerpt || snippetFromHtml(post.contentHtml, 160),
    image: post.featuredImage ? [post.featuredImage] : undefined,
    datePublished: post.publishedAt?.toISOString(),
    dateModified: post.updatedAt?.toISOString(),
    author: { '@type': 'Person', name: post.authorName },
    publisher: {
      '@type': 'Organization',
      name: 'Potluck',
      logo: { '@type': 'ImageObject', url: `${SITE_URL}/icon.png` },
    },
    mainEntityOfPage: { '@type': 'WebPage', '@id': url },
  };

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
      { '@type': 'ListItem', position: 2, name: 'Blog', item: `${SITE_URL}/blog` },
      ...(post.categoryName && post.categorySlug
        ? [{ '@type': 'ListItem', position: 3, name: post.categoryName, item: `${SITE_URL}/blog/category/${post.categorySlug}` }]
        : []),
      {
        '@type': 'ListItem',
        position: post.categoryName ? 4 : 3,
        name: post.title,
        item: url,
      },
    ],
  };

  return (
    <div className="min-h-screen bg-white">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <SiteNav active="/blog" />

      <article className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
        <Link href="/blog" className="inline-flex items-center text-sm text-gray-600 hover:text-orange-500">
          ← Back to Blog
        </Link>

        <div className="mt-4 flex flex-wrap items-center gap-2 text-sm text-gray-500">
          {post.categorySlug && (
            <Link
              href={`/blog/category/${post.categorySlug}`}
              className="rounded-full bg-orange-50 px-3 py-1 font-medium text-orange-600 hover:bg-orange-100"
            >
              {post.categoryName}
            </Link>
          )}
          <span>{formatDate(post.publishedAt)}</span>
          <span>·</span>
          <span>{post.readingTime} min read</span>
        </div>

        <h1 className="font-display mt-3 text-4xl font-bold leading-tight text-gray-900">{post.title}</h1>
        {post.excerpt && <p className="mt-4 text-lg text-gray-600">{post.excerpt}</p>}

        {(post.tags ?? []).filter(Boolean).length > 0 && (
          <ul className="mt-4 flex flex-wrap gap-2">
            {(post.tags ?? []).filter(Boolean).map((tag) => (
              <li
                key={tag}
                className="rounded-full bg-orange-50 px-2.5 py-1 text-xs font-medium text-orange-600"
              >
                #{tag}
              </li>
            ))}
          </ul>
        )}

        <div className="mt-5 flex items-center justify-between border-y border-gray-100 py-3">
          <span className="text-sm text-gray-500">By {post.authorName}</span>
          <LikeButton id={post.slug} endpoint="/api/blog/like" initialCount={post.likeCount} />
        </div>

        {post.featuredImage && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={post.featuredImage}
            alt={post.title}
            className="mt-6 aspect-[16/9] w-full rounded-2xl object-cover"
          />
        )}

        <div
          className="blog-content mt-8"
          dangerouslySetInnerHTML={{ __html: post.contentHtml || '' }}
        />

        <LeadMagnetCTA />

        <div className="mt-10 flex flex-col gap-4 border-t border-gray-200 pt-6 sm:flex-row sm:items-center sm:justify-between">
          <ShareButtons url={url} title={post.title} />
          <LikeButton id={post.slug} endpoint="/api/blog/like" initialCount={post.likeCount} size="md" />
        </div>
      </article>

      {related.length > 0 && (
        <section className="border-t border-orange-100 bg-cream py-12">
          <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-gray-900">More from the Journal</h2>
            <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((p) => (
                <PostCard key={p.id} post={p} />
              ))}
            </div>
          </div>
        </section>
      )}

      <SiteFooter />
    </div>
  );
}
