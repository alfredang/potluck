import Link from 'next/link';
import { FOOD_CATEGORIES } from '@homechef/shared';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="border-b border-gray-200">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <img src="/logo.png" alt="Potluck" className="h-10 w-auto" />
            </Link>
            <div className="hidden md:flex md:items-center md:gap-8">
              <Link href="/explore" className="text-gray-600 hover:text-gray-900">
                Explore
              </Link>
              <Link href="/how-it-works" className="text-gray-600 hover:text-gray-900">
                How it Works
              </Link>
              <Link href="/become-chef" className="text-gray-600 hover:text-gray-900">
                Become a Chef
              </Link>
            </div>
            <div className="flex items-center gap-4">
              {/* Contact Buttons */}
              <a
                href="mailto:hello@potluckhub.io"
                className="text-gray-600 hover:text-orange-500 flex items-center gap-1"
                title="Email us"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </a>
              <a
                href="https://wa.me/6590480277"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-green-500 flex items-center gap-1"
                title="WhatsApp us"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
              </a>
              <Link
                href="/login"
                className="text-gray-600 hover:text-gray-900"
              >
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

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-orange-50 to-white py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl md:text-6xl">
              Authentic Home Dining
              <span className="block text-orange-500">Experiences in Singapore</span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-600">
              Discover talented home chefs in your neighborhood. Book a seat at their table
              and enjoy authentic, homemade cuisine in a warm, personal setting.
            </p>
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link
                href="/explore"
                className="rounded-lg bg-orange-500 px-8 py-3 text-lg font-semibold text-white shadow-lg hover:bg-orange-600"
              >
                Find a Chef
              </Link>
              <Link
                href="/become-chef"
                className="rounded-lg border border-gray-300 bg-white px-8 py-3 text-lg font-semibold text-gray-700 hover:bg-gray-50"
              >
                Become a Chef
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-center text-3xl font-bold text-gray-900">Browse by Cuisine</h2>
          <p className="mt-4 text-center text-gray-600">
            Explore diverse cuisines from home chefs across Singapore
          </p>
          <div className="mt-10 grid grid-cols-3 gap-4 sm:grid-cols-5 lg:grid-cols-9">
            {FOOD_CATEGORIES.map((category) => (
              <Link
                key={category.slug}
                href={`/explore?category=${category.slug}`}
                className="flex flex-col items-center rounded-xl bg-orange-50 p-4 transition hover:bg-orange-100"
              >
                <span className="text-3xl">{category.emoji}</span>
                <span className="mt-2 text-sm font-medium text-gray-700">{category.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="bg-gray-50 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-center text-3xl font-bold text-gray-900">How It Works</h2>
          <div className="mt-12 grid gap-8 md:grid-cols-3">
            <div className="text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-orange-100 text-3xl">
                🔍
              </div>
              <h3 className="mt-4 text-xl font-semibold">Discover</h3>
              <p className="mt-2 text-gray-600">
                Browse home chefs by cuisine, location, and availability. Read reviews and explore
                their menus.
              </p>
            </div>
            <div className="text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-orange-100 text-3xl">
                📅
              </div>
              <h3 className="mt-4 text-xl font-semibold">Book</h3>
              <p className="mt-2 text-gray-600">
                Select your preferred date, time, and menu. Pay securely online with your
                booking confirmation.
              </p>
            </div>
            <div className="text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-orange-100 text-3xl">
                🍽️
              </div>
              <h3 className="mt-4 text-xl font-semibold">Dine</h3>
              <p className="mt-2 text-gray-600">
                Visit the chef&apos;s home and enjoy an authentic, home-cooked meal in a warm, personal
                atmosphere.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-2xl bg-orange-500 p-8 text-center text-white md:p-12">
            <h2 className="text-3xl font-bold">Ready to Share Your Cuisine?</h2>
            <p className="mt-4 text-lg text-orange-100">
              Join Potluck as a home chef and share your passion for cooking with food lovers in
              your neighborhood.
            </p>
            <Link
              href="/become-chef"
              className="mt-8 inline-block rounded-lg bg-white px-8 py-3 font-semibold text-orange-500 hover:bg-orange-50"
            >
              Become a Chef
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-white py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 md:grid-cols-4">
            <div>
              <span className="text-xl font-bold text-orange-500">Potluck</span>
              <p className="mt-4 text-sm text-gray-600">
                Connecting home chefs with food lovers in Singapore.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900">For Diners</h4>
              <ul className="mt-4 space-y-2 text-sm text-gray-600">
                <li>
                  <Link href="/explore" className="hover:text-orange-500">
                    Find a Chef
                  </Link>
                </li>
                <li>
                  <Link href="/how-it-works" className="hover:text-orange-500">
                    How it Works
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900">For Chefs</h4>
              <ul className="mt-4 space-y-2 text-sm text-gray-600">
                <li>
                  <Link href="/become-chef" className="hover:text-orange-500">
                    Become a Chef
                  </Link>
                </li>
                <li>
                  <Link href="/pricing" className="hover:text-orange-500">
                    Pricing
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900">Support</h4>
              <ul className="mt-4 space-y-2 text-sm text-gray-600">
                <li>
                  <Link href="/help" className="hover:text-orange-500">
                    Help Center
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="hover:text-orange-500">
                    Contact Us
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-8 border-t border-gray-200 pt-8 text-center text-sm text-gray-600">
            © {new Date().getFullYear()} Potluck. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
