import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Explore Home Chefs in Singapore — Book Private Dining Near You',
  description:
    'Discover talented home chefs across Singapore. Browse menus by cuisine and neighbourhood, read reviews, and book a home-cooked meal or private dining experience near you.',
  keywords: [
    'home chef Singapore',
    'private dining Singapore',
    'book a home chef',
    'home cooked food Singapore',
    'personal chef Singapore',
    'halal home chef Singapore',
    'Korean home chef Singapore',
    'Peranakan home cook',
    'find a home chef near me',
  ],
  alternates: { canonical: '/explore' },
  openGraph: {
    type: 'website',
    title: 'Explore Home Chefs in Singapore — Book Private Dining Near You',
    description:
      'Discover home chefs across Singapore by cuisine and neighbourhood. Book an authentic home-cooked meal or private dining experience near you.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Explore Home Chefs in Singapore — Book Private Dining Near You',
    description:
      'Discover home chefs across Singapore by cuisine and neighbourhood. Book an authentic home-cooked meal or private dining experience near you.',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
