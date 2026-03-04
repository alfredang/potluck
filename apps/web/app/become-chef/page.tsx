import Link from 'next/link';

export default function BecomeChefPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="border-b border-gray-200">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
                        <Link href="/" className="flex items-center gap-2">
              <img src="/logo.png" alt="Potluck" className="h-10 w-auto" />
              Potluck
            </Link>
            <div className="hidden md:flex md:items-center md:gap-8">
              <Link href="/explore" className="text-gray-600 hover:text-gray-900">
                Explore
              </Link>
              <Link href="/how-it-works" className="text-gray-600 hover:text-gray-900">
                How it Works
              </Link>
              <Link href="/become-chef" className="text-orange-500 font-medium">
                Become a Chef
              </Link>
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

      {/* Hero */}
      <section className="bg-gradient-to-br from-orange-50 to-white py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
              Share Your Culinary Passion
            </h1>
            <p className="mt-6 text-lg text-gray-600">
              Turn your love for cooking into a rewarding experience. Join Potluck as a home chef
              and connect with food lovers in your neighborhood.
            </p>
            <div className="mt-10">
              <Link
                href="/register?role=chef"
                className="rounded-lg bg-orange-500 px-8 py-3 text-lg font-semibold text-white shadow-lg hover:bg-orange-600"
              >
                Start Your Journey
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-center text-3xl font-bold text-gray-900">Why Cook with Potluck?</h2>
          <div className="mt-12 grid gap-8 md:grid-cols-3">
            <div className="rounded-xl bg-orange-50 p-6 text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-orange-100 text-3xl">
                💰
              </div>
              <h3 className="mt-4 text-xl font-semibold">Earn Extra Income</h3>
              <p className="mt-2 text-gray-600">
                Set your own prices and schedule. Keep 96% of your earnings with our low platform
                fee.
              </p>
            </div>
            <div className="rounded-xl bg-orange-50 p-6 text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-orange-100 text-3xl">
                🏠
              </div>
              <h3 className="mt-4 text-xl font-semibold">Cook from Home</h3>
              <p className="mt-2 text-gray-600">
                No restaurant overheads. Share your authentic recipes from the comfort of your own
                kitchen.
              </p>
            </div>
            <div className="rounded-xl bg-orange-50 p-6 text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-orange-100 text-3xl">
                👥
              </div>
              <h3 className="mt-4 text-xl font-semibold">Build Community</h3>
              <p className="mt-2 text-gray-600">
                Connect with food enthusiasts who appreciate authentic, homemade cuisine and
                cultural experiences.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works for Chefs */}
      <section className="bg-gray-50 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-center text-3xl font-bold text-gray-900">How It Works</h2>
          <div className="mt-12">
            <div className="grid gap-8 md:grid-cols-4">
              <div className="text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-orange-500 text-xl font-bold text-white">
                  1
                </div>
                <h3 className="mt-4 font-semibold">Sign Up</h3>
                <p className="mt-2 text-sm text-gray-600">
                  Create your chef profile and tell us about your culinary background
                </p>
              </div>
              <div className="text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-orange-500 text-xl font-bold text-white">
                  2
                </div>
                <h3 className="mt-4 font-semibold">Create Menus</h3>
                <p className="mt-2 text-sm text-gray-600">
                  Design your menu offerings with photos, descriptions, and pricing
                </p>
              </div>
              <div className="text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-orange-500 text-xl font-bold text-white">
                  3
                </div>
                <h3 className="mt-4 font-semibold">Set Availability</h3>
                <p className="mt-2 text-sm text-gray-600">
                  Choose when you want to cook and how many guests you can host
                </p>
              </div>
              <div className="text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-orange-500 text-xl font-bold text-white">
                  4
                </div>
                <h3 className="mt-4 font-semibold">Start Hosting</h3>
                <p className="mt-2 text-sm text-gray-600">
                  Receive bookings, prepare delicious meals, and earn money
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-center text-3xl font-bold text-gray-900">Simple, Fair Pricing</h2>
          <p className="mt-4 text-center text-gray-600">
            Start for free. Pay only when you earn.
          </p>
          <div className="mx-auto mt-12 grid max-w-4xl gap-8 md:grid-cols-3">
            <div className="rounded-xl border border-gray-200 p-6">
              <h3 className="text-lg font-semibold">Free</h3>
              <p className="mt-2 text-3xl font-bold">$0<span className="text-lg font-normal text-gray-500">/mo</span></p>
              <ul className="mt-6 space-y-3 text-sm text-gray-600">
                <li className="flex items-center gap-2">
                  <span className="text-green-500">✓</span> 1 menu listing
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-green-500">✓</span> Basic analytics
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-green-500">✓</span> 4% platform fee
                </li>
              </ul>
              <button className="mt-6 w-full rounded-lg border border-orange-500 px-4 py-2 font-medium text-orange-500 hover:bg-orange-50">
                Get Started
              </button>
            </div>
            <div className="rounded-xl border-2 border-orange-500 bg-orange-50 p-6">
              <div className="mb-2 text-xs font-semibold uppercase text-orange-500">Popular</div>
              <h3 className="text-lg font-semibold">Pro</h3>
              <p className="mt-2 text-3xl font-bold">$19<span className="text-lg font-normal text-gray-500">/mo</span></p>
              <ul className="mt-6 space-y-3 text-sm text-gray-600">
                <li className="flex items-center gap-2">
                  <span className="text-green-500">✓</span> 10 menu listings
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-green-500">✓</span> Advanced analytics
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-green-500">✓</span> 4% platform fee
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-green-500">✓</span> Priority support
                </li>
              </ul>
              <button className="mt-6 w-full rounded-lg bg-orange-500 px-4 py-2 font-medium text-white hover:bg-orange-600">
                Upgrade
              </button>
            </div>
            <div className="rounded-xl border border-gray-200 p-6">
              <h3 className="text-lg font-semibold">Unlimited</h3>
              <p className="mt-2 text-3xl font-bold">$49<span className="text-lg font-normal text-gray-500">/mo</span></p>
              <ul className="mt-6 space-y-3 text-sm text-gray-600">
                <li className="flex items-center gap-2">
                  <span className="text-green-500">✓</span> Unlimited menus
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-green-500">✓</span> Full analytics suite
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-green-500">✓</span> 4% platform fee
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-green-500">✓</span> Featured placement
                </li>
              </ul>
              <button className="mt-6 w-full rounded-lg border border-orange-500 px-4 py-2 font-medium text-orange-500 hover:bg-orange-50">
                Upgrade
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-orange-500 py-16">
        <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white">Ready to Start Cooking?</h2>
          <p className="mt-4 text-lg text-orange-100">
            Join hundreds of home chefs already sharing their passion on Potluck
          </p>
          <Link
            href="/register?role=chef"
            className="mt-8 inline-block rounded-lg bg-white px-8 py-3 font-semibold text-orange-500 hover:bg-orange-50"
          >
            Create Your Chef Profile
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-white py-8">
        <div className="mx-auto max-w-7xl px-4 text-center text-sm text-gray-600 sm:px-6 lg:px-8">
          © {new Date().getFullYear()} Potluck. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
