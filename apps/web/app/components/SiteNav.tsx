import Link from 'next/link';
import { Logo } from './Logo';

const LINKS = [
  { href: '/explore', label: 'Explore' },
  { href: '/how-it-works', label: 'How it Works' },
  { href: '/become-chef', label: 'Become a Chef' },
  { href: '/blog', label: 'Blog' },
];

export function SiteNav({ active }: { active?: string }) {
  return (
    <nav className="sticky top-0 z-40 border-b border-orange-100/80 bg-white/85 backdrop-blur supports-[backdrop-filter]:bg-white/70">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Logo />
          <div className="hidden md:flex md:items-center md:gap-8">
            {LINKS.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className={
                  active === l.href
                    ? 'font-semibold text-orange-600'
                    : 'font-medium text-gray-600 transition hover:text-orange-600'
                }
              >
                {l.label}
              </Link>
            ))}
          </div>
          <div className="flex items-center gap-3 sm:gap-4">
            <Link href="/login" className="hidden text-sm font-medium text-gray-600 transition hover:text-orange-600 sm:block">
              Sign In
            </Link>
            <Link
              href="/register"
              className="rounded-lg bg-orange-500 px-4 py-2 text-sm font-semibold text-white shadow-warm transition hover:-translate-y-0.5 hover:bg-orange-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2"
            >
              Get Started
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
