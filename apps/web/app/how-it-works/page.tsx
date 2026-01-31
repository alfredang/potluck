import Link from 'next/link';

export default function HowItWorksPage() {
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
              <Link href="/how-it-works" className="text-orange-500 font-medium">
                How it Works
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
              How Potluck Works
            </h1>
            <p className="mt-6 text-lg text-gray-600">
              Experience authentic home-cooked meals from talented local chefs in just a few simple steps
            </p>
          </div>
        </div>
      </section>

      {/* For Diners */}
      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-center text-3xl font-bold text-gray-900">For Food Lovers</h2>
          <div className="mt-12 grid gap-12 md:grid-cols-3">
            <div className="relative text-center">
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-orange-100 text-4xl">
                🔍
              </div>
              <div className="absolute left-1/2 top-10 hidden h-0.5 w-full bg-orange-200 md:block" />
              <h3 className="mt-6 text-xl font-semibold">1. Discover</h3>
              <p className="mt-3 text-gray-600">
                Browse home chefs by cuisine type, location, ratings, and availability. Read reviews
                from other diners and explore detailed menus with photos.
              </p>
            </div>
            <div className="relative text-center">
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-orange-100 text-4xl">
                📅
              </div>
              <div className="absolute left-1/2 top-10 hidden h-0.5 w-full bg-orange-200 md:block" />
              <h3 className="mt-6 text-xl font-semibold">2. Book</h3>
              <p className="mt-3 text-gray-600">
                Select your preferred date, time, number of guests, and menu. Pay securely online
                and receive instant confirmation with all the details.
              </p>
            </div>
            <div className="text-center">
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-orange-100 text-4xl">
                🍽️
              </div>
              <h3 className="mt-6 text-xl font-semibold">3. Dine</h3>
              <p className="mt-3 text-gray-600">
                Visit the chef&apos;s home at the scheduled time. Enjoy an authentic, home-cooked meal in
                a warm, personal setting with like-minded food lovers.
              </p>
            </div>
          </div>
          <div className="mt-12 text-center">
            <Link
              href="/explore"
              className="rounded-lg bg-orange-500 px-8 py-3 font-semibold text-white hover:bg-orange-600"
            >
              Find a Chef
            </Link>
          </div>
        </div>
      </section>

      {/* For Chefs */}
      <section className="bg-gray-50 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-center text-3xl font-bold text-gray-900">For Home Chefs</h2>
          <div className="mt-12 grid gap-12 md:grid-cols-4">
            <div className="text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-orange-500 text-2xl font-bold text-white">
                1
              </div>
              <h3 className="mt-4 font-semibold">Create Profile</h3>
              <p className="mt-2 text-sm text-gray-600">
                Sign up and create your chef profile with your story, specialties, and cooking style
              </p>
            </div>
            <div className="text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-orange-500 text-2xl font-bold text-white">
                2
              </div>
              <h3 className="mt-4 font-semibold">Add Menus</h3>
              <p className="mt-2 text-sm text-gray-600">
                Create menu items with descriptions, photos, pricing, and dietary information
              </p>
            </div>
            <div className="text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-orange-500 text-2xl font-bold text-white">
                3
              </div>
              <h3 className="mt-4 font-semibold">Set Schedule</h3>
              <p className="mt-2 text-sm text-gray-600">
                Choose your available dates and times, and set maximum guest capacity
              </p>
            </div>
            <div className="text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-orange-500 text-2xl font-bold text-white">
                4
              </div>
              <h3 className="mt-4 font-semibold">Start Earning</h3>
              <p className="mt-2 text-sm text-gray-600">
                Accept bookings, cook delicious meals, and get paid directly to your account
              </p>
            </div>
          </div>
          <div className="mt-12 text-center">
            <Link
              href="/become-chef"
              className="rounded-lg bg-orange-500 px-8 py-3 font-semibold text-white hover:bg-orange-600"
            >
              Become a Chef
            </Link>
          </div>
        </div>
      </section>

      {/* Trust & Safety */}
      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-center text-3xl font-bold text-gray-900">Trust & Safety</h2>
          <p className="mx-auto mt-4 max-w-2xl text-center text-gray-600">
            Your safety and satisfaction are our top priorities
          </p>
          <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-xl bg-gray-50 p-6 text-center">
              <div className="text-3xl">✅</div>
              <h3 className="mt-4 font-semibold">Verified Profiles</h3>
              <p className="mt-2 text-sm text-gray-600">
                All chefs are verified with identity checks and food safety certifications
              </p>
            </div>
            <div className="rounded-xl bg-gray-50 p-6 text-center">
              <div className="text-3xl">⭐</div>
              <h3 className="mt-4 font-semibold">Reviews & Ratings</h3>
              <p className="mt-2 text-sm text-gray-600">
                Authentic reviews from verified diners help you make informed choices
              </p>
            </div>
            <div className="rounded-xl bg-gray-50 p-6 text-center">
              <div className="text-3xl">🔒</div>
              <h3 className="mt-4 font-semibold">Secure Payments</h3>
              <p className="mt-2 text-sm text-gray-600">
                Payments held securely until after your dining experience is complete
              </p>
            </div>
            <div className="rounded-xl bg-gray-50 p-6 text-center">
              <div className="text-3xl">🛡️</div>
              <h3 className="mt-4 font-semibold">Support Team</h3>
              <p className="mt-2 text-sm text-gray-600">
                Dedicated support team available to help resolve any issues
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-gray-50 py-16">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-center text-3xl font-bold text-gray-900">Frequently Asked Questions</h2>
          <div className="mt-12 space-y-6">
            <div className="rounded-lg bg-white p-6 shadow-sm">
              <h3 className="font-semibold text-gray-900">How much does it cost to dine?</h3>
              <p className="mt-2 text-gray-600">
                Prices vary by chef and menu, typically ranging from $30-90 per person. The price
                includes the meal and the unique home dining experience.
              </p>
            </div>
            <div className="rounded-lg bg-white p-6 shadow-sm">
              <h3 className="font-semibold text-gray-900">Is it safe to dine at someone&apos;s home?</h3>
              <p className="mt-2 text-gray-600">
                Yes! All our chefs are verified and reviewed by other diners. Payments are held
                securely until your meal is complete, and our support team is always available.
              </p>
            </div>
            <div className="rounded-lg bg-white p-6 shadow-sm">
              <h3 className="font-semibold text-gray-900">Can I cancel a booking?</h3>
              <p className="mt-2 text-gray-600">
                Yes, you can cancel up to 48 hours before your booking for a full refund.
                Cancellations within 48 hours may be subject to a partial refund.
              </p>
            </div>
            <div className="rounded-lg bg-white p-6 shadow-sm">
              <h3 className="font-semibold text-gray-900">How do I become a chef on Potluck?</h3>
              <p className="mt-2 text-gray-600">
                Simply sign up, complete your chef profile, add your menu items, and set your
                availability. Once verified, you can start accepting bookings!
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-orange-500 py-16">
        <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white">Ready to Try Potluck?</h2>
          <p className="mt-4 text-lg text-orange-100">
            Join our community of food lovers and home chefs today
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="/explore"
              className="rounded-lg bg-white px-8 py-3 font-semibold text-orange-500 hover:bg-orange-50"
            >
              Find a Chef
            </Link>
            <Link
              href="/become-chef"
              className="rounded-lg border-2 border-white px-8 py-3 font-semibold text-white hover:bg-orange-600"
            >
              Become a Chef
            </Link>
          </div>
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
