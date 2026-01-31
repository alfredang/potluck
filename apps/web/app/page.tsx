import Link from 'next/link';
import { FOOD_CATEGORIES } from '@homechef/shared';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="border-b border-gray-200">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <Link href="/" className="text-2xl font-bold text-orange-500">
              Potluck
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
