import Link from 'next/link';

export default function PricingPage() {
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
              <Link href="/pricing" className="text-orange-500 font-medium">
                Pricing
              </Link>
              <Link href="/become-chef" className="text-gray-600 hover:text-gray-900">
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
      <section className="bg-gradient-to-br from-orange-50 to-white py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
              Simple, Transparent Pricing
            </h1>
            <p className="mt-6 text-lg text-gray-600">
              Start for free and scale as you grow. No hidden fees, just a simple platform fee on bookings.
            </p>
            <div className="mt-6 inline-flex items-center gap-2 rounded-full bg-green-100 px-4 py-2 text-green-800">
              <span className="text-xl">🎉</span>
              <span className="font-medium">Chefs sign up FREE - Start earning today!</span>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {/* Free Tier */}
            <div className="rounded-2xl border border-gray-200 p-8">
              <div className="text-center">
                <h3 className="text-lg font-semibold text-gray-900">Starter</h3>
                <p className="mt-2 text-sm text-gray-500">Perfect for trying out</p>
                <div className="mt-6">
                  <span className="text-5xl font-bold text-gray-900">$0</span>
                  <span className="text-gray-500">/month</span>
                </div>
              </div>
              <ul className="mt-8 space-y-4">
                <li className="flex items-center gap-3">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-green-100 text-green-600">✓</span>
                  <span className="text-gray-700">Up to <strong>1 menu</strong> listing</span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-green-100 text-green-600">✓</span>
                  <span className="text-gray-700">Basic chef profile</span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-green-100 text-green-600">✓</span>
                  <span className="text-gray-700">Accept bookings</span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-green-100 text-green-600">✓</span>
                  <span className="text-gray-700">5% platform fee</span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-gray-100 text-gray-400">-</span>
                  <span className="text-gray-400">Basic analytics</span>
                </li>
              </ul>
              <Link
                href="/register?role=chef&plan=free"
                className="mt-8 block w-full rounded-lg border-2 border-orange-500 py-3 text-center font-semibold text-orange-500 hover:bg-orange-50"
              >
                Get Started Free
              </Link>
            </div>

            {/* Basic Tier */}
            <div className="rounded-2xl border border-gray-200 p-8">
              <div className="text-center">
                <h3 className="text-lg font-semibold text-gray-900">Basic</h3>
                <p className="mt-2 text-sm text-gray-500">For growing chefs</p>
                <div className="mt-6">
                  <span className="text-5xl font-bold text-gray-900">$10</span>
                  <span className="text-gray-500">/month</span>
                </div>
              </div>
              <ul className="mt-8 space-y-4">
                <li className="flex items-center gap-3">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-green-100 text-green-600">✓</span>
                  <span className="text-gray-700">Up to <strong>3 menus</strong></span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-green-100 text-green-600">✓</span>
                  <span className="text-gray-700">Enhanced chef profile</span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-green-100 text-green-600">✓</span>
                  <span className="text-gray-700">Accept bookings</span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-green-100 text-green-600">✓</span>
                  <span className="text-gray-700">4% platform fee</span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-green-100 text-green-600">✓</span>
                  <span className="text-gray-700">Basic analytics</span>
                </li>
              </ul>
              <Link
                href="/register?role=chef&plan=basic"
                className="mt-8 block w-full rounded-lg border-2 border-orange-500 py-3 text-center font-semibold text-orange-500 hover:bg-orange-50"
              >
                Start Basic
              </Link>
            </div>

            {/* Pro Tier - Popular */}
            <div className="relative rounded-2xl border-2 border-orange-500 bg-orange-50 p-8">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 rounded-full bg-orange-500 px-4 py-1 text-sm font-semibold text-white">
                Most Popular
              </div>
              <div className="text-center">
                <h3 className="text-lg font-semibold text-gray-900">Pro</h3>
                <p className="mt-2 text-sm text-gray-500">For serious home chefs</p>
                <div className="mt-6">
                  <span className="text-5xl font-bold text-gray-900">$20</span>
                  <span className="text-gray-500">/month</span>
                </div>
              </div>
              <ul className="mt-8 space-y-4">
                <li className="flex items-center gap-3">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-green-100 text-green-600">✓</span>
                  <span className="text-gray-700">Up to <strong>10 menus</strong></span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-green-100 text-green-600">✓</span>
                  <span className="text-gray-700">Featured profile badge</span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-green-100 text-green-600">✓</span>
                  <span className="text-gray-700">Priority in search results</span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-green-100 text-green-600">✓</span>
                  <span className="text-gray-700">3% platform fee</span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-green-100 text-green-600">✓</span>
                  <span className="text-gray-700">Advanced analytics</span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-green-100 text-green-600">✓</span>
                  <span className="text-gray-700">Priority support</span>
                </li>
              </ul>
              <Link
                href="/register?role=chef&plan=pro"
                className="mt-8 block w-full rounded-lg bg-orange-500 py-3 text-center font-semibold text-white hover:bg-orange-600"
              >
                Start Pro
              </Link>
            </div>

            {/* Business Tier */}
            <div className="rounded-2xl border border-gray-200 p-8">
              <div className="text-center">
                <h3 className="text-lg font-semibold text-gray-900">Business</h3>
                <p className="mt-2 text-sm text-gray-500">For professional chefs</p>
                <div className="mt-6">
                  <span className="text-5xl font-bold text-gray-900">$30</span>
                  <span className="text-gray-500">/month</span>
                </div>
              </div>
              <ul className="mt-8 space-y-4">
                <li className="flex items-center gap-3">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-green-100 text-green-600">✓</span>
                  <span className="text-gray-700">Up to <strong>50 menus</strong></span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-green-100 text-green-600">✓</span>
                  <span className="text-gray-700">Premium profile badge</span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-green-100 text-green-600">✓</span>
                  <span className="text-gray-700">Featured placement</span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-green-100 text-green-600">✓</span>
                  <span className="text-gray-700">2% platform fee</span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-green-100 text-green-600">✓</span>
                  <span className="text-gray-700">Full analytics suite</span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-green-100 text-green-600">✓</span>
                  <span className="text-gray-700">Dedicated support</span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-green-100 text-green-600">✓</span>
                  <span className="text-gray-700">Multiple locations</span>
                </li>
              </ul>
              <Link
                href="/register?role=chef&plan=business"
                className="mt-8 block w-full rounded-lg border-2 border-orange-500 py-3 text-center font-semibold text-orange-500 hover:bg-orange-50"
              >
                Start Business
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Platform Fee Explanation */}
      <section className="bg-gray-50 py-16">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900">How Platform Fees Work</h2>
          <p className="mt-4 text-gray-600">
            We only charge a small percentage when you get paid. If you earn $100 from a booking
            on the Pro plan (3% fee), you keep $97. No booking? No fee.
          </p>
          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            <div className="rounded-lg bg-white p-4 shadow-sm">
              <p className="text-2xl font-bold text-orange-500">$0</p>
              <p className="text-sm text-gray-500">Monthly minimum</p>
            </div>
            <div className="rounded-lg bg-white p-4 shadow-sm">
              <p className="text-2xl font-bold text-orange-500">2-5%</p>
              <p className="text-sm text-gray-500">Platform fee only</p>
            </div>
            <div className="rounded-lg bg-white p-4 shadow-sm">
              <p className="text-2xl font-bold text-orange-500">Weekly</p>
              <p className="text-sm text-gray-500">Payouts to your bank</p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-center text-2xl font-bold text-gray-900">Frequently Asked Questions</h2>
          <div className="mt-8 space-y-6">
            <div className="rounded-lg bg-gray-50 p-6">
              <h3 className="font-semibold text-gray-900">Can I change my plan anytime?</h3>
              <p className="mt-2 text-gray-600">
                Yes! You can upgrade or downgrade your plan at any time. Changes take effect on your next billing cycle.
              </p>
            </div>
            <div className="rounded-lg bg-gray-50 p-6">
              <h3 className="font-semibold text-gray-900">Is there a contract or commitment?</h3>
              <p className="mt-2 text-gray-600">
                No long-term contracts. All plans are month-to-month and you can cancel anytime.
              </p>
            </div>
            <div className="rounded-lg bg-gray-50 p-6">
              <h3 className="font-semibold text-gray-900">What payment methods do you accept?</h3>
              <p className="mt-2 text-gray-600">
                We accept all major credit cards, debit cards, and PayNow for Singapore users.
              </p>
            </div>
            <div className="rounded-lg bg-gray-50 p-6">
              <h3 className="font-semibold text-gray-900">How do I get paid for bookings?</h3>
              <p className="mt-2 text-gray-600">
                Earnings are automatically transferred to your linked bank account every week on Tuesday.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-orange-500 py-16">
        <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white">Ready to Start Cooking?</h2>
          <p className="mt-4 text-lg text-orange-100">
            Join thousands of home chefs earning on Potluck
          </p>
          <Link
            href="/register?role=chef"
            className="mt-8 inline-block rounded-lg bg-white px-8 py-3 font-semibold text-orange-500 hover:bg-orange-50"
          >
            Sign Up Free
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
