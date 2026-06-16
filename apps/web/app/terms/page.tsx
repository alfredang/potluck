import type { Metadata } from 'next';
import Link from 'next/link';
import { Logo } from '../components/Logo';

export const metadata: Metadata = {
  title: 'Terms of Service',
  description:
    'The terms and conditions governing your use of Potluck — the home-chef marketplace connecting diners with home chefs in Singapore.',
  alternates: { canonical: '/terms' },
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="border-b border-gray-200">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <Logo />
            <div className="hidden md:flex md:items-center md:gap-8">
              <Link href="/explore" className="text-gray-600 hover:text-gray-900">Explore</Link>
              <Link href="/how-it-works" className="text-gray-600 hover:text-gray-900">How it Works</Link>
              <Link href="/become-chef" className="text-gray-600 hover:text-gray-900">Become a Chef</Link>
              <Link href="/blog" className="text-gray-600 hover:text-gray-900">Blog</Link>
            </div>
            <div className="flex items-center gap-4">
              <Link href="/login" className="text-gray-600 hover:text-gray-900">Sign In</Link>
              <Link href="/register" className="rounded-lg bg-orange-500 px-4 py-2 text-white hover:bg-orange-600">Get Started</Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="bg-gradient-to-br from-orange-50 to-white py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
              Terms of Service
            </h1>
            <p className="mt-6 text-lg text-gray-600">
              Please read these terms carefully. By using Potluck, you agree to them.
            </p>
            <p className="mt-2 text-sm text-gray-500">Last updated: June 2026</p>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl space-y-12">

            <div>
              <h2 className="text-2xl font-bold text-gray-900">1. Acceptance of Terms</h2>
              <div className="mt-4 space-y-4 text-gray-600">
                <p>By accessing or using the Potluck website, mobile applications, or services (collectively, the &ldquo;Services&rdquo;), you agree to be bound by these Terms of Service. If you do not agree, please do not use the Services.</p>
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-gray-900">2. What Potluck Is</h2>
              <div className="mt-4 space-y-4 text-gray-600">
                <p>Potluck is a marketplace that connects home chefs with diners for home-cooked meals and home dining experiences in Singapore. Potluck provides the platform; the chefs are independent providers responsible for the food they prepare.</p>
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-gray-900">3. Accounts</h2>
              <div className="mt-4 space-y-4 text-gray-600">
                <ul className="list-disc space-y-2 pl-6">
                  <li>You must be at least 18 years old to create an account.</li>
                  <li>You are responsible for keeping your login credentials secure and for all activity under your account.</li>
                  <li>You agree to provide accurate, current and complete information.</li>
                  <li>You may delete your account at any time — see our <Link href="/delete-account" className="text-orange-600 underline">account deletion page</Link>.</li>
                </ul>
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-gray-900">4. Bookings &amp; Payments</h2>
              <div className="mt-4 space-y-4 text-gray-600">
                <ul className="list-disc space-y-2 pl-6">
                  <li>When you book a meal, you enter into a transaction with the chef; Potluck facilitates the booking and payment.</li>
                  <li>Prices are set by chefs and shown before you confirm. Payment is processed securely through our payment partners.</li>
                  <li>Cancellation and refund terms are shown at the time of booking and may vary by chef.</li>
                  <li>Potluck charges a platform/service fee, which is disclosed before checkout or in your chef subscription plan.</li>
                </ul>
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-gray-900">5. Chef Responsibilities</h2>
              <div className="mt-4 space-y-4 text-gray-600">
                <p>Chefs are responsible for the quality, safety, hygiene and accurate description of the food they prepare, and for complying with all applicable food-safety and licensing requirements. Chefs must disclose allergens and ingredients accurately upon request.</p>
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-gray-900">6. Acceptable Use</h2>
              <div className="mt-4 space-y-4 text-gray-600">
                <p>You agree not to misuse the Services, including by:</p>
                <ul className="list-disc space-y-2 pl-6">
                  <li>Violating any law or the rights of others</li>
                  <li>Posting false, misleading, or harmful content or reviews</li>
                  <li>Attempting to disrupt, reverse-engineer, or gain unauthorised access to the platform</li>
                  <li>Using the Services to harass other users or chefs</li>
                </ul>
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-gray-900">7. Content &amp; Reviews</h2>
              <div className="mt-4 space-y-4 text-gray-600">
                <p>You retain ownership of content you submit (such as reviews and photos) but grant Potluck a non-exclusive, royalty-free licence to use, display and distribute it in connection with the Services. We may remove content that violates these terms.</p>
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-gray-900">8. Disclaimers &amp; Limitation of Liability</h2>
              <div className="mt-4 space-y-4 text-gray-600">
                <p>The Services are provided &ldquo;as is&rdquo; without warranties of any kind. To the maximum extent permitted by law, Potluck is not liable for indirect, incidental or consequential damages arising from your use of the Services or from meals provided by chefs.</p>
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-gray-900">9. Changes to These Terms</h2>
              <div className="mt-4 space-y-4 text-gray-600">
                <p>We may update these Terms from time to time. We will post the updated version on this page and update the &ldquo;Last updated&rdquo; date. Continued use of the Services after changes means you accept the revised Terms.</p>
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-gray-900">10. Governing Law</h2>
              <div className="mt-4 space-y-4 text-gray-600">
                <p>These Terms are governed by the laws of Singapore, and any disputes will be subject to the exclusive jurisdiction of the Singapore courts.</p>
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-gray-900">11. Contact Us</h2>
              <div className="mt-4 space-y-4 text-gray-600">
                <p>Questions about these Terms? Contact us:</p>
                <ul className="list-none space-y-2 pl-0">
                  <li><strong>Email:</strong> hello@potluckhub.io</li>
                  <li><strong>Phone:</strong> +65 9048 0277</li>
                  <li><strong>Address:</strong> 12 Woodlands Square #07-85/86/87, Woods Square Tower 1, Singapore 737715</li>
                </ul>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-white py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <div className="text-center text-sm text-gray-600 sm:text-left">
              © {new Date().getFullYear()} Potluck. All rights reserved.
            </div>
            <div className="flex gap-6">
              <Link href="/privacy" className="text-sm text-gray-600 hover:text-orange-500">Privacy Policy</Link>
              <Link href="/terms" className="text-sm text-gray-600 hover:text-orange-500">Terms</Link>
              <Link href="/delete-account" className="text-sm text-gray-600 hover:text-orange-500">Delete Account</Link>
              <Link href="/contact" className="text-sm text-gray-600 hover:text-orange-500">Contact Us</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
