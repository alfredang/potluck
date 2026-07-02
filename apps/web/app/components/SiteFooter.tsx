import Link from 'next/link';
import { Logo } from './Logo';

const DINER_LINKS = [
  { href: '/explore', label: 'Explore Chefs' },
  { href: '/how-it-works', label: 'How it Works' },
  { href: '/blog', label: 'Blog' },
];

const CHEF_LINKS = [
  { href: '/become-chef', label: 'Become a Chef' },
  { href: '/pricing', label: 'Pricing' },
];

const SUPPORT_LINKS = [
  { href: '/founder', label: 'Our Story' },
  { href: '/help', label: 'Help Center' },
  { href: '/contact', label: 'Contact' },
  { href: '/privacy', label: 'Privacy' },
  { href: '/terms', label: 'Terms' },
];

function LinkColumn({ title, links }: { title: string; links: { href: string; label: string }[] }) {
  return (
    <div>
      <h4 className="text-xs font-bold uppercase tracking-wider text-gray-900">{title}</h4>
      <ul className="mt-3 space-y-2 text-sm text-gray-600">
        {links.map((l) => (
          <li key={l.href}>
            <Link href={l.href} className="transition hover:text-orange-500">
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function SiteFooter() {
  return (
    <footer className="border-t border-orange-100 bg-cream">
      <div className="mx-auto max-w-[1440px] px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-x-6 gap-y-8 sm:grid-cols-4 lg:grid-cols-12">
          {/* Brand + app download */}
          <div className="col-span-2 sm:col-span-4 lg:col-span-4">
            <Logo href={null} size="sm" />
            <p className="mt-3 max-w-xs text-sm leading-relaxed text-gray-600">
              Home-cooked meals from real Singapore kitchens — kampung classics to private dining.
            </p>
            <div className="mt-4 flex flex-wrap gap-2.5">
              <a
                href="https://apps.apple.com/app/id6759842391"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Download Potluck on the App Store"
                className="inline-flex items-center gap-2 rounded-lg bg-gray-900 px-3 py-2 text-white transition hover:bg-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2"
              >
                <svg className="h-5 w-5 shrink-0" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M16.365 1.43c0 1.14-.42 2.2-1.12 2.98-.84.94-2.2 1.66-3.32 1.57-.14-1.12.42-2.32 1.1-3.06.78-.86 2.16-1.5 3.34-1.49zM20.5 17.1c-.55 1.27-.82 1.84-1.53 2.96-.99 1.57-2.39 3.52-4.12 3.53-1.54.02-1.94-1-4.03-.99-2.09.01-2.53 1.01-4.07.99-1.73-.02-3.05-1.78-4.04-3.34C-.06 16.7-.36 11.5 1.34 8.73c1.2-1.96 3.1-3.11 4.88-3.11 1.82 0 2.96 1 4.46 1 1.46 0 2.35-1 4.46-1 1.59 0 3.28.87 4.48 2.37-3.94 2.16-3.3 7.78.88 9.11z" />
                </svg>
                <span className="text-left leading-tight">
                  <span className="block text-[9px] uppercase tracking-wide text-gray-300">Download on the</span>
                  <span className="block text-sm font-semibold">App Store</span>
                </span>
              </a>
              <a
                href="https://play.google.com/store/apps/details?id=io.potluckhub.app"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Get Potluck on Google Play"
                className="inline-flex items-center gap-2 rounded-lg bg-gray-900 px-3 py-2 text-white transition hover:bg-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2"
              >
                <svg className="h-5 w-5 shrink-0" viewBox="0 0 512 512" aria-hidden="true">
                  <path fill="#34A853" d="m271 256-211 211c4 4 9 6 16 6 6 0 11-1 16-4l248-143z" />
                  <path fill="#EA4335" d="m271 256 69-70L92 43c-5-3-10-4-16-4-7 0-12 2-16 6z" />
                  <path fill="#FBBC04" d="m271 256 69 70 84-48c14-8 22-20 22-34 0-13-8-25-22-33l-84-48z" />
                  <path fill="#4285F4" d="M60 45c-3 5-4 11-4 18v386c0 7 1 13 4 18l217-211z" />
                </svg>
                <span className="text-left leading-tight">
                  <span className="block text-[9px] uppercase tracking-wide text-gray-300">Get it on</span>
                  <span className="block text-sm font-semibold">Google Play</span>
                </span>
              </a>
            </div>
          </div>

          {/* Link columns */}
          <div className="lg:col-span-2">
            <LinkColumn title="For Diners" links={DINER_LINKS} />
          </div>
          <div className="lg:col-span-2">
            <LinkColumn title="For Chefs" links={CHEF_LINKS} />
          </div>
          <div className="lg:col-span-2">
            <LinkColumn title="Support" links={SUPPORT_LINKS} />
          </div>

          {/* Contact — its own column */}
          <div className="col-span-2 sm:col-span-4 lg:col-span-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-900">Contact</h4>
            <address className="mt-3 space-y-3 text-sm not-italic leading-relaxed text-gray-600">
              <div className="flex gap-2.5">
                <svg className="mt-0.5 h-4 w-4 shrink-0 text-orange-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
                <span>
                  12 Woodlands Square, #07-85/86/87
                  <br />
                  Woods Square Tower 1, Singapore 737715
                </span>
              </div>
              <div className="flex items-center gap-2.5">
                <svg className="h-4 w-4 shrink-0 text-orange-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z" />
                </svg>
                <a href="tel:+6581213280" className="transition hover:text-orange-500">+65 8121 3280</a>
              </div>
              <div className="flex items-center gap-2.5">
                <svg className="h-4 w-4 shrink-0 text-green-600" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M12.04 2a9.93 9.93 0 0 0-8.5 15.06L2 22l5.07-1.49A9.93 9.93 0 1 0 12.04 2zm0 1.82a8.1 8.1 0 0 1 6.86 12.4l-.2.32.62 2.27-2.32-.61-.31.18a8.1 8.1 0 1 1-4.65-14.76zm-3.4 4.2c-.16 0-.42.06-.64.3-.22.24-.84.82-.84 2s.86 2.32.98 2.48c.12.16 1.69 2.58 4.1 3.62.57.25 1.02.4 1.37.5.57.18 1.1.16 1.51.1.46-.07 1.42-.58 1.62-1.14.2-.56.2-1.04.14-1.14-.06-.1-.22-.16-.46-.28-.24-.12-1.42-.7-1.64-.78-.22-.08-.38-.12-.54.12-.16.24-.62.78-.76.94-.14.16-.28.18-.52.06-.24-.12-1.01-.37-1.93-1.19-.71-.64-1.19-1.42-1.33-1.66-.14-.24-.01-.37.11-.49.11-.11.24-.28.36-.42.12-.14.16-.24.24-.4.08-.16.04-.3-.02-.42-.06-.12-.54-1.3-.74-1.78-.2-.47-.4-.4-.54-.41h-.46z" />
                </svg>
                <a href="https://wa.me/6581213280" target="_blank" rel="noopener noreferrer" className="transition hover:text-orange-500">+65 8121 3280</a>
              </div>
              <div className="flex items-center gap-2.5">
                <svg className="h-4 w-4 shrink-0 text-orange-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <rect x="2" y="4" width="20" height="16" rx="2" />
                  <path d="m22 7-10 5L2 7" />
                </svg>
                <a href="mailto:hello@potluckhub.io" className="transition hover:text-orange-500">hello@potluckhub.io</a>
              </div>
            </address>
          </div>
        </div>

        <div className="mt-8 border-t border-orange-100 pt-6 text-center text-xs text-gray-500">
          © {new Date().getFullYear()} Potluck · Made with love in Singapore 🇸🇬
          <p className="powered-by mt-1">
            Powered by{' '}
            <a
              href="https://www.tertiaryinfotech.com/"
              target="_blank"
              rel="noopener"
              className="transition hover:text-orange-500"
            >
              Tertiary Infotech Academy Pte Ltd
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
