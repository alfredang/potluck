import type { Metadata } from 'next';
import Link from 'next/link';
import { Logo } from '../components/Logo';

export const metadata: Metadata = {
  title: 'Delete Your Account & Data',
  description:
    'How to request deletion of your Potluck account and associated personal data, what is removed, and what may be retained for legal reasons.',
  alternates: { canonical: '/delete-account' },
};

const DELETE_SUBJECT = encodeURIComponent('Account & Data Deletion Request');
const DELETE_BODY = encodeURIComponent(
  'Hello Potluck team,\n\nI would like to request deletion of my Potluck account and associated personal data.\n\nAccount email: \nAccount name: \n\nThank you.',
);

export default function DeleteAccountPage() {
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
              Delete Your Account &amp; Data
            </h1>
            <p className="mt-6 text-lg text-gray-600">
              You can request deletion of your Potluck account and personal data at any time. This
              page explains how, what gets deleted, and what we may need to keep.
            </p>
            <p className="mt-2 text-sm text-gray-500">Applies to the Potluck app and potluckhub.io</p>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl space-y-12">

            {/* Primary CTA */}
            <div className="rounded-2xl border border-orange-200 bg-orange-50 p-6">
              <h2 className="text-2xl font-bold text-gray-900">Request deletion now</h2>
              <p className="mt-3 text-gray-600">
                The fastest way is to email us from the address linked to your account. We verify
                ownership and complete deletion within 30 days.
              </p>
              <a
                href={`mailto:privacy@potluckhub.io?subject=${DELETE_SUBJECT}&body=${DELETE_BODY}`}
                className="mt-5 inline-block rounded-lg bg-orange-500 px-6 py-3 font-semibold text-white hover:bg-orange-600"
              >
                Email a deletion request
              </a>
              <p className="mt-3 text-sm text-gray-500">
                Or write to us directly at <strong>privacy@potluckhub.io</strong> with the subject
                &ldquo;Account &amp; Data Deletion Request&rdquo;.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-gray-900">Option 1 — Delete from the app</h2>
              <div className="mt-4 space-y-4 text-gray-600">
                <ol className="list-decimal space-y-2 pl-6">
                  <li>Open the Potluck app and sign in.</li>
                  <li>Go to <strong>Profile → Settings → Account</strong>.</li>
                  <li>Tap <strong>Delete Account</strong> and confirm.</li>
                  <li>Your account is deactivated immediately and permanently deleted within 30 days.</li>
                </ol>
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-gray-900">Option 2 — Request by email</h2>
              <div className="mt-4 space-y-4 text-gray-600">
                <p>
                  Send an email to <strong>privacy@potluckhub.io</strong> from your account email
                  address with the subject &ldquo;Account &amp; Data Deletion Request&rdquo;. Include
                  your account name so we can verify your identity. We will confirm once your data
                  has been removed.
                </p>
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-gray-900">What data is deleted</h2>
              <div className="mt-4 space-y-4 text-gray-600">
                <p>When your deletion request is processed, we permanently remove:</p>
                <ul className="list-disc space-y-2 pl-6">
                  <li>Your profile information (name, email, phone number, profile photo)</li>
                  <li>Your account credentials and login identifiers</li>
                  <li>Saved preferences, favourites and likes</li>
                  <li>Chef profile, menus and listings (for chef accounts)</li>
                  <li>Messages and reviews associated with your account</li>
                </ul>
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-gray-900">What we may retain (and for how long)</h2>
              <div className="mt-4 space-y-4 text-gray-600">
                <p>
                  Some records must be kept to meet legal, tax, accounting and fraud-prevention
                  obligations, even after your account is deleted:
                </p>
                <ul className="list-disc space-y-2 pl-6">
                  <li><strong>Transaction &amp; payment records:</strong> retained up to 5 years as required by Singapore law.</li>
                  <li><strong>Fraud / safety records:</strong> retained only as long as necessary to protect our users and platform.</li>
                </ul>
                <p>
                  Retained records are access-restricted and are not used for any other purpose. They
                  are deleted once the legal retention period ends.
                </p>
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-gray-900">Questions</h2>
              <div className="mt-4 space-y-4 text-gray-600">
                <p>For anything related to your data, contact us:</p>
                <ul className="list-none space-y-2 pl-0">
                  <li><strong>Email:</strong> hello@potluckhub.io</li>
                  <li><strong>Phone:</strong> +65 8121 3280</li>
                  <li><strong>Address:</strong> 12 Woodlands Square #07-85/86/87, Woods Square Tower 1, Singapore 737715</li>
                </ul>
                <p>
                  See our <Link href="/privacy" className="text-orange-600 underline">Privacy Policy</Link> for
                  full details on how we handle your data.
                </p>
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
