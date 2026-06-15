import Link from 'next/link';

const LINKS = [
  { href: '/explore', label: 'Explore' },
  { href: '/how-it-works', label: 'How it Works' },
  { href: '/become-chef', label: 'Become a Chef' },
  { href: '/blog', label: 'Blog' },
];

export function SiteNav({ active }: { active?: string }) {
  return (
    <nav className="border-b border-gray-200 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <img src="/logo.png" alt="Potluck" className="h-10 w-auto" />
          </Link>
          <div className="hidden md:flex md:items-center md:gap-8">
            {LINKS.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className={
                  active === l.href
                    ? 'font-medium text-orange-500'
                    : 'text-gray-600 hover:text-gray-900'
                }
              >
                {l.label}
              </Link>
            ))}
          </div>
          <div className="flex items-center gap-4">
            <Link href="/login" className="text-gray-600 hover:text-gray-900">
              Sign In
            </Link>
            <Link
              href="/register"
              className="rounded-lg bg-orange-500 px-4 py-2 text-white hover:bg-orange-600"
            >
              Get Started
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
