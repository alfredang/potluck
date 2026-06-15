import type { Metadata } from 'next';
import './globals.css';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://potluckhub.io';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'Potluck — Authentic Home Dining Experiences in Singapore',
    template: '%s | Potluck',
  },
  description:
    'Discover and book authentic home dining experiences with talented home chefs in Singapore. Real food, real people, real homes.',
  applicationName: 'Potluck',
  keywords: [
    'potluck',
    'home chef',
    'home dining',
    'private dining Singapore',
    'home cooked food Singapore',
    'home chef marketplace',
    'book a chef',
    'food',
    'Singapore',
  ],
  authors: [{ name: 'Potluck' }],
  creator: 'Potluck',
  publisher: 'Potluck',
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    url: SITE_URL,
    siteName: 'Potluck',
    title: 'Potluck — Authentic Home Dining Experiences in Singapore',
    description:
      'Discover and book authentic home dining experiences with talented home chefs in Singapore.',
    locale: 'en_SG',
    images: [{ url: '/icon.png', width: 1024, height: 1024, alt: 'Potluck' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Potluck — Authentic Home Dining in Singapore',
    description: 'Book authentic home-cooked meals from talented home chefs near you.',
    images: ['/icon.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large' },
  },
};

const organizationJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Potluck',
  url: SITE_URL,
  logo: `${SITE_URL}/icon.png`,
  description:
    'A marketplace connecting home chefs with food lovers for authentic home dining experiences in Singapore.',
  areaServed: { '@type': 'Country', name: 'Singapore' },
  sameAs: [
    'https://www.instagram.com/potluckhub',
    'https://www.facebook.com/potluckhub',
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en-SG">
      <body className="antialiased">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
        {children}
      </body>
    </html>
  );
}
