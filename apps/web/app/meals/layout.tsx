import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Home-Cooked Meals & Dishes in Singapore — Order from Home Chefs',
  description:
    'Browse home-cooked meals and dishes from talented home chefs across Singapore. Explore menus by cuisine, find your favourites, and book a home dining experience.',
  keywords: [
    'home cooked meals Singapore',
    'home cooked food Singapore',
    'home chef menus Singapore',
    'order home cooked food Singapore',
    'private dining menus Singapore',
    'authentic local dishes Singapore',
  ],
  alternates: { canonical: '/meals' },
  openGraph: {
    type: 'website',
    title: 'Home-Cooked Meals & Dishes in Singapore — Order from Home Chefs',
    description:
      'Browse home-cooked meals and dishes from home chefs across Singapore. Explore menus by cuisine and book a home dining experience.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Home-Cooked Meals & Dishes in Singapore — Order from Home Chefs',
    description:
      'Browse home-cooked meals and dishes from home chefs across Singapore. Explore menus by cuisine and book a home dining experience.',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
