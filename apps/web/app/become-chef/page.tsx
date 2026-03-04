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
                <h3 className="mt-4 font-semibold">Verify Identity</h3>
                <p className="mt-2 text-sm text-gray-600">
                  Submit ID verification and food safety documents
                </p>
              </div>
              <div className="text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-orange-500 text-xl font-bold text-white">
                  3
                </div>
                <h3 className="mt-4 font-semibold">Create Menus</h3>
                <p className="mt-2 text-sm text-gray-600">
                  Design your menu offerings with photos, descriptions, and pricing
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

      {/* Step-by-Step Guide */}
      <section className="py-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-center text-3xl font-bold text-gray-900">Step-by-Step Guide</h2>
          
          <div className="mt-12 space-y-8">
            {/* Step 1 */}
            <div className="flex gap-6 rounded-xl border border-gray-200 p-6">
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-orange-100 text-xl font-bold text-orange-600">
                1
              </div>
              <div>
                <h3 className="text-xl font-semibold">Create Your Account</h3>
                <p className="mt-2 text-gray-600">
                  Sign up with your email and create a password. You'll receive a verification email to confirm your account.
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="flex gap-6 rounded-xl border border-gray-200 p-6">
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-orange-100 text-xl font-bold text-orange-600">
                2
              </div>
              <div>
                <h3 className="text-xl font-semibold">Complete Your Chef Profile</h3>
                <ul className="mt-2 list-inside list-disc text-gray-600">
                  <li>Add a profile photo</li>
                  <li>Write your chef story</li>
                  <li>List your specialties and cuisine types</li>
                  <li>Set your location and service area</li>
                </ul>
              </div>
            </div>

            {/* Step 3 */}
            <div className="flex gap-6 rounded-xl border border-gray-200 p-6">
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-orange-100 text-xl font-bold text-orange-600">
                3
              </div>
              <div>
                <h3 className="text-xl font-semibold">Verify Your Identity</h3>
                <ul className="mt-2 list-inside list-disc text-gray-600">
                  <li>Upload a government-issued ID (NRIC or passport)</li>
                  <li>Provide food safety certification (if available)</li>
                  <li>Verification typically takes 24-48 hours</li>
                </ul>
              </div>
            </div>

            {/* Step 4 */}
            <div className="flex gap-6 rounded-xl border border-gray-200 p-6">
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-orange-100 text-xl font-bold text-orange-600">
                4
              </div>
              <div>
                <h3 className="text-xl font-semibold">Create Your First Menu</h3>
                <ul className="mt-2 list-inside list-disc text-gray-600">
                  <li>Add high-quality photos of your dishes</li>
                  <li>List all dishes included in the menu</li>
                  <li>Set your price per person</li>
                  <li>Specify available dates and time slots</li>
                </ul>
              </div>
            </div>

            {/* Step 5 */}
            <div className="flex gap-6 rounded-xl border border-gray-200 p-6">
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-orange-100 text-xl font-bold text-orange-600">
                5
              </div>
              <div>
                <h3 className="text-xl font-semibold">Set Up Payment</h3>
                <ul className="mt-2 list-inside list-disc text-gray-600">
                  <li>Connect your Stripe account</li>
                  <li>Enter your bank account details</li>
                  <li>Set your payout schedule (weekly)</li>
                </ul>
              </div>
            </div>

            {/* Step 6 */}
            <div className="flex gap-6 rounded-xl border border-gray-200 p-6">
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-orange-100 text-xl font-bold text-orange-600">
                6
              </div>
              <div>
                <h3 className="text-xl font-semibold">Go Live!</h3>
                <p className="mt-2 text-gray-600">
                  Publish your chef profile and menu. Start receiving booking requests from diners in your area!
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Requirements */}
      <section className="bg-gray-50 py-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-center text-3xl font-bold text-gray-900">Requirements</h2>
          <div className="mt-8 grid gap-6 md:grid-cols-2">
            <div className="rounded-lg bg-white p-6 shadow-sm">
              <h3 className="text-lg font-semibold">For All Chefs</h3>
              <ul className="mt-4 space-y-3 text-gray-600">
                <li className="flex items-center gap-2">
                  <span className="text-green-500">✓</span> Valid government-issued ID
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-green-500">✓</span> Clean kitchen space
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-green-500">✓</span> Bank account for payouts
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-green-500">✓</span> Singapore-registered mobile number
                </li>
              </ul>
            </div>
            <div className="rounded-lg bg-white p-6 shadow-sm">
              <h3 className="text-lg font-semibold">Recommended</h3>
              <ul className="mt-4 space-y-3 text-gray-600">
                <li className="flex items-center gap-2">
                  <span className="text-green-500">✓</span> Food safety certification (WSQ-FSN)
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-green-500">✓</span> Professional food photos
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-green-500">✓</span> Public liability insurance
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-green-500">✓</span> Experience in hospitality/food
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-center text-3xl font-bold text-gray-900">Frequently Asked Questions</h2>
          <div className="mt-8 space-y-6">
            <div>
              <h3 className="text-lg font-semibold">How much can I earn?</h3>
              <p className="mt-2 text-gray-600">
                Earnings depend on your pricing and number of bookings. Many chefs earn $500-2000+ per month. You keep 95-96% of each booking after platform fees.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold">When do I get paid?</h3>
              <p className="mt-2 text-gray-600">
                Payouts are processed weekly (every Tuesday) for the previous week's completed bookings.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold">Do I need a food safety certificate?</h3>
              <p className="mt-2 text-gray-600">
                Not required to start, but recommended. We can help you obtain WSQ-FSN certification if needed.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold">What if I have no cooking experience?</h3>
              <p className="mt-2 text professional-gray-600">
                No problem! Many successful Potluck chefs are home cooks with a passion for cooking. Authenticity and passion matter more than professional training.
              </p>
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
