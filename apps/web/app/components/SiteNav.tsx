'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Logo } from './Logo';

const LINKS = [
  { href: '/explore', label: 'Find Chefs' },
  { href: '/explore?view=cuisines', label: 'Cuisines' },
  { href: '/how-it-works', label: 'How it Works' },
  { href: '/become-chef', label: 'Become a Chef' },
  { href: '/blog', label: 'Blog' },
  { href: '/contact', label: 'Contact' },
];

export function SiteNav({ active }: { active?: string }) {
  const [open, setOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-40 border-b border-orange-100/80 bg-white/85 backdrop-blur supports-[backdrop-filter]:bg-white/70">
      <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Logo />

          {/* Desktop links */}
          <div className="hidden md:flex md:items-center md:gap-8">
            {LINKS.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className={
                  active === l.href
                    ? 'font-semibold text-orange-600'
                    : 'font-medium text-gray-600 transition hover:text-orange-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2 rounded'
                }
              >
                {l.label}
              </Link>
            ))}
          </div>

          {/* Desktop auth */}
          <div className="hidden items-center gap-3 sm:flex sm:gap-4">
            <Link
              href="/login"
              className="hidden text-sm font-medium text-gray-600 transition hover:text-orange-600 sm:block"
            >
              Sign In
            </Link>
            <Link
              href="/register"
              className="rounded-lg bg-orange-500 px-4 py-2 text-sm font-semibold text-white shadow-warm transition hover:-translate-y-0.5 hover:bg-orange-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2"
            >
              Get Started
            </Link>
          </div>

          {/* Mobile hamburger */}
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? 'Close menu' : 'Open menu'}
            className="-mr-2 inline-flex h-11 w-11 items-center justify-center rounded-lg text-gray-700 transition hover:bg-orange-50 hover:text-orange-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2 sm:hidden"
          >
            {open ? (
              <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 6 6 18M6 6l12 12" />
              </svg>
            ) : (
              <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 12h18M3 6h18M3 18h18" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile menu panel */}
      {open && (
        <div id="mobile-menu" className="border-t border-orange-100 bg-cream sm:hidden">
          <div className="mx-auto max-w-[1440px] space-y-1 px-4 py-3">
            {LINKS.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className={`flex min-h-11 items-center rounded-xl px-3 text-base transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 ${
                  active === l.href
                    ? 'bg-orange-100 font-semibold text-orange-700'
                    : 'font-medium text-gray-700 hover:bg-orange-50 hover:text-orange-600'
                }`}
              >
                {l.label}
              </Link>
            ))}
            <div className="flex flex-col gap-2 pt-2">
              <Link
                href="/login"
                onClick={() => setOpen(false)}
                className="flex min-h-11 items-center justify-center rounded-xl border border-orange-200 bg-white px-4 text-base font-semibold text-gray-800 transition hover:border-orange-300 hover:text-orange-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500"
              >
                Sign In
              </Link>
              <Link
                href="/register"
                onClick={() => setOpen(false)}
                className="flex min-h-11 items-center justify-center rounded-xl bg-orange-500 px-4 text-base font-semibold text-white shadow-warm transition hover:bg-orange-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
