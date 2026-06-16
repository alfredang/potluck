import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Home Chefs in Singapore — Meet the Cooks Behind the Meals',
  description:
    'Browse verified home chefs across Singapore. Discover their cuisines, specialties and neighbourhoods, read reviews, and book an authentic home-cooked meal near you.',
  keywords: [
    'home chefs Singapore',
    'home chef directory Singapore',
    'private chefs Singapore',
    'book a home chef',
    'home cooked food Singapore',
    'local home cooks Singapore',
  ],
  alternates: { canonical: '/chefs' },
  openGraph: {
    type: 'website',
    title: 'Home Chefs in Singapore — Meet the Cooks Behind the Meals',
    description:
      'Browse verified home chefs across Singapore by cuisine and neighbourhood, and book an authentic home-cooked meal near you.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Home Chefs in Singapore — Meet the Cooks Behind the Meals',
    description:
      'Browse verified home chefs across Singapore by cuisine and neighbourhood, and book an authentic home-cooked meal near you.',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
