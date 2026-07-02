import type { Metadata } from 'next';
import Link from 'next/link';
import { SiteNav } from '../components/SiteNav';
import { SiteFooter } from '../components/SiteFooter';

export const metadata: Metadata = {
  title: 'Become a Home Chef in Singapore — Earn Cooking From Home',
  description:
    'Turn your cooking into income. Join Potluck as a home chef in Singapore, sell home-cooked food, set your own prices and schedule, and keep up to 96% of earnings.',
  keywords: [
    'become a home chef Singapore',
    'sell home cooked food Singapore',
    'earn cooking from home',
    'home chef jobs Singapore',
    'make money cooking Singapore',
    'home based food business Singapore',
    'private chef income',
    'home chef marketplace',
  ],
  alternates: { canonical: '/become-chef' },
  openGraph: {
    type: 'website',
    title: 'Become a Home Chef in Singapore — Earn Cooking From Home',
    description:
      'Join Potluck as a home chef in Singapore. Sell home-cooked food, set your own prices, and earn from your kitchen.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Become a Home Chef in Singapore — Earn Cooking From Home',
    description:
      'Join Potluck as a home chef in Singapore. Sell home-cooked food, set your own prices, and earn from your kitchen.',
  },
};

export default function BecomeChefPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <SiteNav active="/become-chef" />

      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-orange-100/70 via-amber-50/60 to-[var(--cream)] py-12 sm:py-14">
        <div className="pointer-events-none absolute -right-24 top-0 h-72 w-72 rounded-full bg-amber-200/40 blur-3xl" />
        <div className="relative mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/85 px-3.5 py-1.5 text-sm font-semibold text-orange-700 shadow-sm ring-1 ring-orange-200/70">
              Earn ~$2,000/month from your own kitchen
            </span>
            <h1 className="font-display mt-5 text-4xl font-black tracking-tight text-gray-900 sm:text-5xl">
              Turn your home cooking into income
            </h1>
            <p className="mt-5 text-lg text-gray-600">
              From your auntie&apos;s rendang recipe to your weekend laksa pot — share what you cook
              best. Join Potluck as a home chef and connect with hungry neighbours across Singapore.
            </p>
            <div className="mt-8">
              <Link
                href="/register?role=chef"
                className="inline-block rounded-xl bg-orange-500 px-8 py-3.5 text-lg font-semibold text-white shadow-warm transition hover:-translate-y-0.5 hover:bg-orange-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2"
              >
                Start Your Journey
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="bg-white py-12 sm:py-14">
        <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8">
          <h2 className="font-display text-center text-3xl font-bold text-gray-900">Why Cook with Potluck?</h2>
          <div className="mt-12 grid gap-8 md:grid-cols-3">
            <div className="rounded-2xl border border-orange-100 bg-cream p-6 text-center shadow-sm transition hover:-translate-y-1 hover:shadow-warm">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-orange-100 text-3xl">
                💰
              </div>
              <h3 className="mt-4 text-xl font-semibold">Earn Extra Income</h3>
              <p className="mt-2 text-gray-600">
                Set your own prices and schedule. Keep 96% of your earnings with our low platform
                fee.
              </p>
            </div>
            <div className="rounded-2xl border border-orange-100 bg-cream p-6 text-center shadow-sm transition hover:-translate-y-1 hover:shadow-warm">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-orange-100 text-3xl">
                🏠
              </div>
              <h3 className="mt-4 text-xl font-semibold">Cook from Home</h3>
              <p className="mt-2 text-gray-600">
                No restaurant overheads. Share your authentic recipes from the comfort of your own
                kitchen.
              </p>
            </div>
            <div className="rounded-2xl border border-orange-100 bg-cream p-6 text-center shadow-sm transition hover:-translate-y-1 hover:shadow-warm">
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
      <section className="bg-cream py-12 sm:py-14">
        <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8">
          <h2 className="font-display text-center text-3xl font-bold text-gray-900">How It Works</h2>
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
                  Submit ID verification and food safety documents, then pass our{' '}
                  <Link href="/chef-verification" className="text-orange-500 hover:text-orange-600">
                    site-visit verification
                  </Link>
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
      <section className="bg-white py-12 sm:py-14">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <h2 className="font-display text-center text-3xl font-bold text-gray-900">Step-by-Step Guide</h2>
          
          <div className="mt-12 space-y-8">
            {/* Step 1 */}
            <div className="flex gap-6 rounded-2xl border border-orange-100 bg-orange-50/40 p-6 transition hover:shadow-warm">
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
            <div className="flex gap-6 rounded-2xl border border-orange-100 bg-orange-50/40 p-6 transition hover:shadow-warm">
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
            <div className="flex gap-6 rounded-2xl border border-orange-100 bg-orange-50/40 p-6 transition hover:shadow-warm">
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
            <div className="flex gap-6 rounded-2xl border border-orange-100 bg-orange-50/40 p-6 transition hover:shadow-warm">
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
            <div className="flex gap-6 rounded-2xl border border-orange-100 bg-orange-50/40 p-6 transition hover:shadow-warm">
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
            <div className="flex gap-6 rounded-2xl border border-orange-100 bg-orange-50/40 p-6 transition hover:shadow-warm">
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
      <section className="bg-cream py-12 sm:py-14">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <h2 className="font-display text-center text-3xl font-bold text-gray-900">Requirements</h2>
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
      <section className="bg-cream py-12 sm:py-14">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <h2 className="font-display text-center text-3xl font-bold text-gray-900">Frequently Asked Questions</h2>
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
              <p className="mt-2 text-gray-600">
                No problem! Many successful Potluck chefs are home cooks with a passion for cooking. Authenticity and passion matter more than professional training.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="bg-white py-12 sm:py-14">
        <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8">
          <h2 className="font-display text-center text-3xl font-bold text-gray-900">Simple, Fair Pricing</h2>
          <p className="mt-4 text-center text-gray-600">
            Start for free. Pay only when you earn.
          </p>
          <div className="mx-auto mt-12 grid max-w-4xl gap-8 md:grid-cols-3">
            <div className="rounded-2xl border border-orange-100 p-6">
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
            <div className="rounded-2xl border border-orange-100 p-6">
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
      <section className="bg-gradient-to-br from-orange-500 to-amber-500 py-12 sm:py-14">
        <div className="mx-auto max-w-[1440px] px-4 text-center sm:px-6 lg:px-8">
          <h2 className="font-display text-3xl font-bold text-white">Ready to fire up the wok?</h2>
          <p className="mt-4 text-lg text-orange-50">
            Join hundreds of home chefs across Singapore already sharing what they cook best.
          </p>
          <Link
            href="/register?role=chef"
            className="mt-8 inline-block rounded-xl bg-white px-8 py-3 font-semibold text-orange-600 shadow-sm transition hover:-translate-y-0.5 hover:bg-orange-50"
          >
            Create Your Chef Profile
          </Link>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
