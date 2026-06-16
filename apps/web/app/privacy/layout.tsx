import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description:
    'How Potluck collects, uses and protects your personal data under Singapore’s PDPA. Learn about your rights, data security, and how we handle information.',
  keywords: [
    'Potluck privacy policy',
    'PDPA Singapore',
    'data protection home chef marketplace',
    'personal data Potluck',
  ],
  alternates: { canonical: '/privacy' },
  openGraph: {
    type: 'website',
    title: 'Privacy Policy — Potluck',
    description:
      'How Potluck collects, uses and protects your personal data under Singapore’s PDPA.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Privacy Policy — Potluck',
    description:
      'How Potluck collects, uses and protects your personal data under Singapore’s PDPA.',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
