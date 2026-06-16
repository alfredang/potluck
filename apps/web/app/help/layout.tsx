import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Help Center & FAQ — Booking Home Chefs in Singapore',
  description:
    'Answers to common questions about Potluck: how to book a home chef, cancellation and refund policies, payments, and becoming a home chef in Singapore.',
  keywords: [
    'Potluck help',
    'home chef FAQ Singapore',
    'how to book a home chef',
    'home dining cancellation policy',
    'become a home chef Singapore',
    'home chef payments Singapore',
  ],
  alternates: { canonical: '/help' },
  openGraph: {
    type: 'website',
    title: 'Help Center & FAQ — Booking Home Chefs in Singapore',
    description:
      'Answers to common questions about booking home chefs, cancellations, payments and becoming a home chef in Singapore.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Help Center & FAQ — Booking Home Chefs in Singapore',
    description:
      'Answers to common questions about booking home chefs, cancellations, payments and becoming a home chef in Singapore.',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
