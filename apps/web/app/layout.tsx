import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'HomeChef - Authentic Home Dining Experiences',
  description:
    'Discover and book authentic home dining experiences with talented home chefs in Singapore.',
  keywords: ['home chef', 'home dining', 'singapore', 'food', 'booking'],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
