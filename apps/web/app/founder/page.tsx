import type { Metadata } from 'next';
import Link from 'next/link';
import { SiteNav } from '../components/SiteNav';
import { SiteFooter } from '../components/SiteFooter';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://potluckhub.io';

export const metadata: Metadata = {
  title: "Our Story — Meet Founder Ang Ming Xuan",
  description:
    "Potluck was founded by Ang Ming Xuan, a 2025 NUS Mathematics graduate who loves food and travel. Read the story behind Singapore's home-chef marketplace.",
  keywords: [
    'Potluck founder',
    'Ang Ming Xuan',
    'home chef marketplace Singapore',
    'about Potluck',
    'Potluck story',
    'NUS Mathematics',
  ],
  alternates: { canonical: '/founder' },
  openGraph: {
    type: 'profile',
    title: 'Our Story — Meet Founder Ang Ming Xuan',
    description:
      "The story behind Potluck, Singapore's home-chef marketplace, and its founder Ang Ming Xuan.",
    images: [{ url: '/founder.jpeg', width: 960, height: 1280, alt: 'Ang Ming Xuan, founder of Potluck' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Our Story — Meet Founder Ang Ming Xuan',
    description:
      "The story behind Potluck, Singapore's home-chef marketplace, and its founder Ang Ming Xuan.",
    images: ['/founder.jpeg'],
  },
};

const personJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: 'Ang Ming Xuan',
  jobTitle: 'Founder',
  worksFor: { '@type': 'Organization', name: 'Potluck', url: SITE_URL },
  image: `${SITE_URL}/founder.jpeg`,
  alumniOf: {
    '@type': 'CollegeOrUniversity',
    name: 'National University of Singapore',
  },
  knowsAbout: ['Mathematics', 'Food', 'Travel', 'Home dining'],
  url: `${SITE_URL}/founder`,
};

export default function FounderPage() {
  return (
    <div className="min-h-screen bg-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
      />
      <SiteNav />

      {/* Hero */}
      <section className="bg-gradient-to-br from-orange-100/70 via-amber-50/60 to-[var(--cream)] py-12 sm:py-16">
        <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8">
          <div className="mx-auto grid max-w-5xl items-center gap-10 md:grid-cols-2">
            <div>
              <p className="font-semibold uppercase tracking-wide text-orange-600">Our Story</p>
              <h1 className="mt-3 font-display text-4xl font-black tracking-tight text-gray-900 sm:text-5xl">
                A table for everyone, <span className="italic text-orange-600">one home at a time</span>
              </h1>
              <p className="mt-5 text-lg leading-relaxed text-gray-600">
                Potluck was born from a simple belief — that the best meals in Singapore aren&apos;t
                found in restaurants, but in the kitchens of the people around us. Our founder set out
                to give those home cooks a stage, and to give all of us a seat at their table.
              </p>
            </div>
            <div className="relative mx-auto w-full max-w-sm">
              <div className="overflow-hidden rounded-3xl shadow-warm ring-1 ring-orange-100">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/founder.jpeg"
                  alt="Ang Ming Xuan, founder of Potluck"
                  className="aspect-[3/4] w-full object-cover"
                />
              </div>
              <div className="mt-4 text-center">
                <p className="font-display text-xl font-bold text-gray-900">Ang Ming Xuan</p>
                <p className="text-sm text-gray-500">Founder · Potluck</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Write-up */}
      <section className="py-14 sm:py-16">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <div className="space-y-8 text-lg leading-relaxed text-gray-700">
            <p>
              <strong className="text-gray-900">Ang Ming Xuan</strong> founded Potluck in 2025, the
              same year he graduated with a degree in <strong className="text-gray-900">Mathematics
              from the National University of Singapore</strong>. Mathematics taught him to see the
              hidden structure in messy, real-world problems — and few problems are messier, or more
              joyful, than getting good food from a passionate cook to a hungry table.
            </p>
            <p>
              Ming Xuan has always been led by his stomach and his feet. A lifelong{' '}
              <strong className="text-gray-900">food lover</strong>, he grew up convinced that the
              most memorable dishes are the ones made at home — the recipes passed down through
              families, cooked with a kind of care that a commercial kitchen can rarely match. And as
              an avid <strong className="text-gray-900">traveller</strong>, he saw the same truth
              everywhere he went: the fastest way to understand a place is to eat where its people
              eat, in their homes, around their tables.
            </p>
            <p>
              On his journeys — from neighbourhood hawker stalls to remote mountain villages — he kept
              meeting extraordinary home cooks with no way to share their food beyond their own
              circle. Back home in Singapore, he realised how many talented home chefs were cooking
              for nothing more than friends and family, their gift quietly going untasted by the rest
              of the city.
            </p>
            <p>
              Potluck is his answer: a home-chef marketplace that turns Singapore&apos;s living rooms
              into the city&apos;s most exciting dining scene. It gives home chefs the tools to earn
              from what they love, and gives diners a way to discover real, home-cooked meals near
              them — Peranakan, Malay, Indian, Japanese, Korean and more, made by real people in real
              homes.
            </p>
            <blockquote className="border-l-4 border-orange-500 bg-orange-50/60 py-4 pl-6 pr-4 font-display text-xl italic text-gray-800">
              &ldquo;Everyone has a dish worth sharing. Potluck is simply the table where we all sit
              down together.&rdquo;
              <span className="mt-2 block text-base not-italic text-gray-500">— Ang Ming Xuan, Founder</span>
            </blockquote>
          </div>

          {/* CTAs */}
          <div className="mt-12 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/explore"
              className="inline-flex items-center justify-center rounded-lg bg-orange-500 px-6 py-3 text-base font-semibold text-white shadow-warm transition hover:-translate-y-0.5 hover:bg-orange-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2"
            >
              Find a home chef
            </Link>
            <Link
              href="/become-chef"
              className="inline-flex items-center justify-center rounded-lg border border-orange-200 bg-white px-6 py-3 text-base font-semibold text-gray-800 transition hover:border-orange-300 hover:text-orange-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2"
            >
              Become a chef
            </Link>
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
