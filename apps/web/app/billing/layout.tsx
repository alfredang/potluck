import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Billing & Subscription',
  description:
    'Manage your Potluck subscription, view invoices, and update your payment details.',
  alternates: { canonical: '/billing' },
  robots: { index: false, follow: false },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
