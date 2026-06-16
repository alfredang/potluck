import Link from 'next/link';
import { Logo } from './Logo';

export function SiteFooter() {
  return (
    <footer className="border-t border-orange-100 bg-cream py-12">
      <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8">
        <div className="grid gap-8 md:grid-cols-4">
          <div>
            <Logo href={null} size="sm" />
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-gray-600">
              Home-cooked meals from real Singapore kitchens — from kampung classics to private
              dining, brought to your table.
            </p>
            <address className="mt-4 space-y-1 text-sm not-italic leading-relaxed text-gray-600">
              <p>12 Woodlands Square, #07-85/86/87</p>
              <p>Woods Square Tower 1, Singapore 737715</p>
              <p>
                <a href="tel:+6581213280" className="hover:text-orange-500">+65 8121 3280</a>
                {' · WhatsApp '}
                <a href="https://wa.me/6581213280" target="_blank" rel="noopener noreferrer" className="hover:text-orange-500">+65 8121 3280</a>
              </p>
              <p>
                <a href="mailto:hello@potluckhub.io" className="hover:text-orange-500">hello@potluckhub.io</a>
              </p>
            </address>

            {/* App download */}
            <a
              href="https://play.google.com/store/apps/details?id=io.potluckhub.app"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Get Potluck on Google Play"
              className="mt-5 inline-flex items-center gap-3 rounded-xl bg-gray-900 px-4 py-2.5 text-white shadow-warm transition hover:-translate-y-0.5 hover:bg-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2"
            >
              <svg className="h-6 w-6 shrink-0" viewBox="0 0 512 512" aria-hidden="true">
                <path fill="#34A853" d="m271 256-211 211c4 4 9 6 16 6 6 0 11-1 16-4l248-143z" />
                <path fill="#EA4335" d="m271 256 69-70L92 43c-5-3-10-4-16-4-7 0-12 2-16 6z" />
                <path fill="#FBBC04" d="m271 256 69 70 84-48c14-8 22-20 22-34 0-13-8-25-22-33l-84-48z" />
                <path fill="#4285F4" d="M60 45c-3 5-4 11-4 18v386c0 7 1 13 4 18l217-211z" />
              </svg>
              <span className="text-left leading-tight">
                <span className="block text-[10px] uppercase tracking-wide text-gray-300">Get it on</span>
                <span className="block text-base font-semibold">Google Play</span>
              </span>
            </a>
          </div>
          <div>
            <h4 className="font-display font-bold text-gray-900">For Diners</h4>
            <ul className="mt-4 space-y-2 text-sm text-gray-600">
              <li><Link href="/explore" className="hover:text-orange-500">Explore Chefs</Link></li>
              <li><Link href="/how-it-works" className="hover:text-orange-500">How it Works</Link></li>
              <li><Link href="/blog" className="hover:text-orange-500">Blog</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-display font-bold text-gray-900">For Chefs</h4>
            <ul className="mt-4 space-y-2 text-sm text-gray-600">
              <li><Link href="/become-chef" className="hover:text-orange-500">Become a Chef</Link></li>
              <li><Link href="/pricing" className="hover:text-orange-500">Pricing</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-display font-bold text-gray-900">Support</h4>
            <ul className="mt-4 space-y-2 text-sm text-gray-600">
              <li><Link href="/founder" className="hover:text-orange-500">Our Story</Link></li>
              <li><Link href="/help" className="hover:text-orange-500">Help Center</Link></li>
              <li><Link href="/contact" className="hover:text-orange-500">Contact</Link></li>
              <li><Link href="/privacy" className="hover:text-orange-500">Privacy Policy</Link></li>
              <li><Link href="/terms" className="hover:text-orange-500">Terms of Service</Link></li>
            </ul>
          </div>
        </div>
        <div className="mt-8 border-t border-orange-100 pt-8 text-center text-sm text-gray-500">
          © {new Date().getFullYear()} Potluck · Made with love in Singapore 🇸🇬 · All rights reserved.
        </div>
      </div>
    </footer>
  );
}
