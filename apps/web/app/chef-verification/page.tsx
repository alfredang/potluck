import Link from 'next/link';
import type { Metadata } from 'next';
import { SiteNav } from '../components/SiteNav';
import { SiteFooter } from '../components/SiteFooter';
import { VerifiedBadge } from '../components/ChefBadges';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://potluckhub.io';

export const metadata: Metadata = {
  title: 'Chef Verification — How Potluck Verifies Home Chefs',
  description:
    'Every Verified badge on Potluck is earned through an in-person site visit: identity checks, a home-kitchen hygiene walkthrough, and a tasting. Here is exactly how our chef verification process works in Singapore.',
  alternates: { canonical: `${SITE_URL}/chef-verification` },
  openGraph: {
    title: 'Chef Verification — How Potluck Verifies Home Chefs',
    description:
      'Identity checks, a home-kitchen site visit, and a tasting — how every Potluck chef earns the Verified badge.',
    url: `${SITE_URL}/chef-verification`,
    type: 'website',
  },
};

const STEPS = [
  {
    title: '1 · Application & identity check',
    body: 'The chef applies with their NRIC/FIN identity, contact details, and food story. We verify identity documents and confirm the kitchen address before anything else moves forward.',
    icon: '🪪',
  },
  {
    title: '2 · Food safety credentials',
    body: 'We check for the WSQ Food Safety Course Level 1 certificate (or equivalent) and walk through SFA home-based food business guidelines together, so every chef operates within Singapore’s rules.',
    icon: '📋',
  },
  {
    title: '3 · Home-kitchen site visit',
    body: 'A Potluck team member visits the chef’s actual kitchen. We look at cleanliness, food storage and chilling practices, pest control, separation of raw and cooked ingredients, and the dining space guests will sit in.',
    icon: '🏠',
  },
  {
    title: '4 · Tasting & hosting review',
    body: 'We eat the food. The signature dishes on the chef’s menu are tasted during the visit, and we review portioning, pricing honesty, and how the chef plans to host guests.',
    icon: '🍽️',
  },
  {
    title: '5 · Verified badge & ongoing checks',
    body: 'Chefs who pass earn the Verified badge across the website and mobile apps. Verification isn’t forever-once: we re-visit periodically and act on every guest report — badges are removed if standards slip.',
    icon: '✅',
  },
];

export default function ChefVerificationPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <SiteNav active="/become-chef" />

      <div className="bg-white">
        <div className="mx-auto max-w-4xl px-4 py-14 text-center sm:px-6">
          <div className="flex justify-center">
            <VerifiedBadge className="!text-sm !px-3 !py-1" />
          </div>
          <h1 className="mt-4 text-4xl font-bold text-gray-900">
            Every Verified badge is earned in person
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-600">
            Potluck is built on trust: strangers eating in someone&apos;s home. That&apos;s why we
            don&apos;t verify chefs with a form — we verify them with a <strong>site visit</strong>.
            Here&apos;s exactly what happens before a chef gets the badge you see on our website and
            apps.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
        <div className="space-y-6">
          {STEPS.map((s) => (
            <div key={s.title} className="flex gap-5 rounded-2xl border border-orange-100 bg-white p-6 shadow-sm">
              <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-orange-50 text-2xl">
                {s.icon}
              </div>
              <div>
                <h2 className="font-semibold text-gray-900">{s.title}</h2>
                <p className="mt-1 text-gray-600">{s.body}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 rounded-2xl bg-teal-50 p-6">
          <h2 className="font-semibold text-gray-900">What the badge means for diners</h2>
          <ul className="mt-3 space-y-2 text-gray-700">
            <li>✓ The chef&apos;s identity and kitchen address are confirmed real</li>
            <li>✓ Their kitchen passed an in-person hygiene walkthrough</li>
            <li>✓ Their signature dishes were tasted by our team</li>
            <li>✓ They stay accountable — badges are re-checked and can be removed</li>
          </ul>
          <p className="mt-3 text-sm text-gray-500">
            Chefs without a badge yet are typically new applicants whose site visit is still being
            scheduled — they appear in the catalog but earn the badge only after the visit.
          </p>
        </div>

        <div className="mt-12 text-center">
          <h2 className="text-2xl font-bold text-gray-900">Cooking from home? Get verified.</h2>
          <p className="mt-2 text-gray-600">
            Join Singapore&apos;s home-chef marketplace — we&apos;ll guide you through every step.
          </p>
          <div className="mt-6 flex justify-center gap-4">
            <Link
              href="/become-chef"
              className="rounded-lg bg-orange-500 px-6 py-3 font-semibold text-white hover:bg-orange-600"
            >
              Become a Chef
            </Link>
            <Link
              href="/explore"
              className="rounded-lg border border-gray-300 px-6 py-3 font-semibold text-gray-700 hover:bg-gray-50"
            >
              Explore Verified Chefs
            </Link>
          </div>
        </div>
      </div>

      <SiteFooter />
    </div>
  );
}
