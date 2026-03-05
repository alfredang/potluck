'use client';

import Link from 'next/link';

export default function PrivacyPage() {
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
              Privacy Policy
            </h1>
            <p className="mt-6 text-lg text-gray-600">
              Your privacy is important to us. This policy explains how we collect, use, and protect your information.
            </p>
            <p className="mt-2 text-sm text-gray-500">
              Last updated: March 2026
            </p>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl space-y-12">
            
            <div>
              <h2 className="text-2xl font-bold text-gray-900">1. Information We Collect</h2>
              <div className="mt-4 space-y-4 text-gray-600">
                <p>We collect information you provide directly to us, including:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li><strong>Account Information:</strong> Name, email address, phone number, and profile picture when you create an account</li>
                  <li><strong>Payment Information:</strong> Payment method details (processed securely through our payment partners)</li>
                  <li><strong>Order Information:</strong> Order history, preferences, and communication with chefs</li>
                  <li><strong>Chef Information:</strong> If you register as a chef, we may collect additional information such as your location, menu details, and verification documents</li>
                </ul>
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-gray-900">2. How We Use Your Information</h2>
              <div className="mt-4 space-y-4 text-gray-600">
                <p>We use the information we collect to:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Provide, maintain, and improve our services</li>
                  <li>Process your orders and transactions</li>
                  <li>Communicate with you about orders, updates, and promotions</li>
                  <li>Verify your identity and prevent fraud</li>
                  <li>Comply with legal obligations</li>
                </ul>
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-gray-900">3. Information Sharing</h2>
              <div className="mt-4 space-y-4 text-gray-600">
                <p>We may share your information with:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li><strong>Chefs:</strong> When you place an order, we share necessary order details with the chef preparing your meal</li>
                  <li><strong>Service Providers:</strong> Companies that help us operate our platform (payment processing, delivery, marketing)</li>
                  <li><strong>Legal Requirements:</strong> When required by law or to protect our rights and safety</li>
                </ul>
                <p className="mt-4">We <strong>do not sell</strong> your personal information to third parties.</p>
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-gray-900">4. Data Security</h2>
              <div className="mt-4 space-y-4 text-gray-600">
                <p>We implement appropriate technical and organizational measures to protect your personal information, including:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Encryption of data in transit and at rest</li>
                  <li>Secure payment processing through certified partners</li>
                  <li>Regular security assessments and updates</li>
                  <li>Access controls and authentication requirements</li>
                </ul>
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-gray-900">5. Your Rights</h2>
              <div className="mt-4 space-y-4 text-gray-600">
                <p>Under Singapore's Personal Data Protection Act (PDPA), you have the right to:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li><strong>Access:</strong> Request a copy of your personal data</li>
                  <li><strong>Correction:</strong> Request correction of inaccurate personal data</li>
                  <li><strong>Withdrawal:</strong> Withdraw consent for data processing</li>
                  <li><strong>Deletion:</strong> Request deletion of your personal data (subject to legal requirements)</li>
                </ul>
                <p className="mt-4">To exercise these rights, please contact us at <strong>hello@potluckhub.io</strong></p>
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-gray-900">6. Data Retention</h2>
              <div className="mt-4 space-y-4 text-gray-600">
                <p>We retain your personal information for as long as your account is active or as needed to provide you services. After account closure, we may retain certain information for legal, accounting, or fraud prevention purposes.</p>
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-gray-900">7. Children's Privacy</h2>
              <div className="mt-4 space-y-4 text-gray-600">
                <p>Our services are not intended for children under 18 years old. We do not knowingly collect personal information from children. If you become aware that a child has provided us with personal information, please contact us.</p>
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-gray-900">8. Changes to This Policy</h2>
              <div className="mt-4 space-y-4 text-gray-600">
                <p>We may update this Privacy Policy from time to time. We will notify you of any material changes by posting the new policy on this page and updating the "Last updated" date. Your continued use of our services after any changes constitutes acceptance of the new policy.</p>
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-gray-900">9. Contact Us</h2>
              <div className="mt-4 space-y-4 text-gray-600">
                <p>If you have any questions about this Privacy Policy, please contact us:</p>
                <ul className="list-none pl-0 space-y-2">
                  <li><strong>Email:</strong> hello@potluckhub.io</li>
                  <li><strong>Phone:</strong> +65 9048 0277</li>
                  <li><strong>Address:</strong> 71 Robinson Road, Singapore 068895</li>
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
              <Link href="/privacy" className="text-sm text-gray-600 hover:text-orange-500">
                Privacy Policy
              </Link>
              <Link href="/contact" className="text-sm text-gray-600 hover:text-orange-500">
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
