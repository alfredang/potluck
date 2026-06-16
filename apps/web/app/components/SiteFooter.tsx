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
