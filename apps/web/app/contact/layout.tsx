import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact Us — Potluck Home Chef Marketplace Singapore',
  description:
    'Get in touch with the Potluck team in Singapore. Questions about booking a home chef, becoming a chef, payments or feedback? We respond within 24 hours.',
  keywords: [
    'contact Potluck',
    'Potluck support Singapore',
    'home chef marketplace contact',
    'home chef help Singapore',
    'private dining enquiry Singapore',
  ],
  alternates: { canonical: '/contact' },
  openGraph: {
    type: 'website',
    title: 'Contact Us — Potluck Home Chef Marketplace Singapore',
    description:
      'Get in touch with the Potluck team in Singapore. Questions about bookings, becoming a chef or payments? We respond within 24 hours.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Contact Us — Potluck Home Chef Marketplace Singapore',
    description:
      'Get in touch with the Potluck team in Singapore. Questions about bookings, becoming a chef or payments? We respond within 24 hours.',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
