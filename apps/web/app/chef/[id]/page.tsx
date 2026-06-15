import type { Metadata } from 'next';
import { getChef, CHEFS } from '../../../lib/chefs-data';
import ChefPageClient from './ChefPageClient';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://potluckhub.io';

// Pre-render all chef routes for SEO.
export function generateStaticParams() {
  return CHEFS.map((c) => ({ id: c.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const chef = getChef(id);
  if (!chef) return { title: 'Chef Not Found' };
  const title = `${chef.name} — ${chef.specialty} Home Chef in ${chef.location}`;
  const description = chef.bio;
  const url = `${SITE_URL}/chef/${chef.id}`;
  return {
    title,
    description,
    keywords: [...chef.cuisines, chef.location, 'home chef', 'Singapore', 'private dining'],
    alternates: { canonical: `/chef/${chef.id}` },
    openGraph: {
      type: 'profile',
      url,
      title,
      description,
      images: [{ url: chef.image, alt: chef.name }],
      locale: 'en_SG',
      siteName: 'Potluck',
    },
    twitter: { card: 'summary_large_image', title, description, images: [chef.image] },
  };
}

export default async function ChefPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const chef = getChef(id);

  const jsonLd = chef
    ? {
        '@context': 'https://schema.org',
        '@type': 'Restaurant',
        name: chef.name,
        description: chef.bio,
        image: chef.image,
        servesCuisine: chef.cuisines,
        url: `${SITE_URL}/chef/${chef.id}`,
        address: {
          '@type': 'PostalAddress',
          addressLocality: chef.location,
          addressCountry: 'SG',
        },
        aggregateRating: {
          '@type': 'AggregateRating',
          ratingValue: chef.rating,
          reviewCount: chef.reviewCount,
        },
        hasMenu: {
          '@type': 'Menu',
          hasMenuItem: chef.menus.map((m) => ({
            '@type': 'MenuItem',
            name: m.name,
            description: m.description,
            offers: { '@type': 'Offer', price: (m.price / 100).toFixed(2), priceCurrency: 'SGD' },
          })),
        },
      }
    : null;

  return (
    <>
      {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}
      <ChefPageClient id={id} />
    </>
  );
}
