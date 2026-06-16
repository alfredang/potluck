import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Create Your Account',
  description:
    'Create a Potluck account to book home-cooked meals from home chefs in Singapore, or sign up as a home chef and start earning from your kitchen.',
  alternates: { canonical: '/register' },
  robots: { index: false, follow: true },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
