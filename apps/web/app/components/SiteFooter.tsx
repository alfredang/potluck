import Link from 'next/link';

export function SiteFooter() {
  return (
    <footer className="border-t border-gray-200 bg-white py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-8 md:grid-cols-4">
          <div>
            <span className="flex items-center gap-2">
              <LogoMark className="h-7 w-7" />
              <span className="text-xl font-bold text-orange-500">Potluck</span>
            </span>
            <p className="mt-4 text-sm text-gray-600">
              Connecting home chefs with food lovers in Singapore.
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-gray-900">For Diners</h4>
            <ul className="mt-4 space-y-2 text-sm text-gray-600">
              <li><Link href="/explore" className="hover:text-orange-500">Explore Chefs</Link></li>
              <li><Link href="/how-it-works" className="hover:text-orange-500">How it Works</Link></li>
              <li><Link href="/blog" className="hover:text-orange-500">Blog</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-gray-900">For Chefs</h4>
            <ul className="mt-4 space-y-2 text-sm text-gray-600">
              <li><Link href="/become-chef" className="hover:text-orange-500">Become a Chef</Link></li>
              <li><Link href="/pricing" className="hover:text-orange-500">Pricing</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-gray-900">Support</h4>
            <ul className="mt-4 space-y-2 text-sm text-gray-600">
              <li><Link href="/help" className="hover:text-orange-500">Help Center</Link></li>
              <li><Link href="/contact" className="hover:text-orange-500">Contact</Link></li>
              <li><Link href="/privacy" className="hover:text-orange-500">Privacy Policy</Link></li>
              <li><Link href="/terms" className="hover:text-orange-500">Terms of Service</Link></li>
            </ul>
          </div>
        </div>
        <div className="mt-8 border-t border-gray-200 pt-8 text-center text-sm text-gray-500">
          © {new Date().getFullYear()} Potluck. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
