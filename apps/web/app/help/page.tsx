'use client';

import Link from 'next/link';
import { useState } from 'react';

const faqs = [
  {
    category: 'For Diners',
    questions: [
      {
        q: 'How do I book a meal with a chef?',
        a: 'Browse our chefs on the Explore page, select a chef you like, choose a menu item, pick an available date and time, and submit your booking request. The chef will confirm within 24 hours.'
      },
      {
        q: 'What is the cancellation policy?',
        a: 'You can cancel up to 48 hours before your booking for a full refund. Cancellations within 48 hours may receive a 50% refund at the chef\'s discretion.'
      },
      {
        q: 'How do I pay for my meal?',
        a: 'Payment is made securely through our platform. You\'ll be charged when the chef confirms your booking. We accept credit cards, debit cards, and PayNow.'
      },
      {
        q: 'What if I have dietary restrictions?',
        a: 'You can specify dietary restrictions and allergies when making your booking. Chefs will accommodate your needs where possible, or let you know if they cannot.'
      },
      {
        q: 'Is it safe to dine at a stranger\'s home?',
        a: 'All our chefs are verified with identity checks. You can read reviews from other diners, and our support team is available if any issues arise.'
      }
    ]
  },
  {
    category: 'For Chefs',
    questions: [
      {
        q: 'How do I become a chef on Potluck?',
        a: 'Sign up on our website, complete your chef profile with your story and specialties, add menu items with photos and pricing, and set your availability. Our team will review and verify your profile.'
      },
      {
        q: 'What are the requirements to become a chef?',
        a: 'You need a valid ID, food safety certification (we can help you get one), and a clean kitchen space for hosting guests. No professional culinary training required!'
      },
      {
        q: 'How much does Potluck charge?',
        a: 'We charge a platform fee of 2-5% depending on your subscription plan. There are no hidden fees. You keep the rest of your earnings.'
      },
      {
        q: 'When do I get paid?',
        a: 'Earnings are transferred to your bank account every Tuesday for bookings completed the previous week.'
      },
      {
        q: 'Can I set my own prices?',
        a: 'Yes! You have full control over your menu prices, availability, and guest capacity.'
      }
    ]
  },
  {
    category: 'Account & Payments',
    questions: [
      {
        q: 'How do I reset my password?',
        a: 'Click "Forgot Password" on the login page and enter your email. We\'ll send you a link to reset your password.'
      },
      {
        q: 'How do I update my payment method?',
        a: 'Go to Settings > Payment Methods in your account to add, remove, or update your payment cards.'
      },
      {
        q: 'Is my payment information secure?',
        a: 'Yes, we use industry-standard encryption and never store your full card details. Payments are processed through secure payment providers.'
      }
    ]
  }
];

export default function HelpPage() {
  const [openFaq, setOpenFaq] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredFaqs = faqs.map(category => ({
    ...category,
    questions: category.questions.filter(
      q => q.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
           q.a.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })).filter(category => category.questions.length > 0);

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
              Help Center
            </h1>
            <p className="mt-6 text-lg text-gray-600">
              Find answers to frequently asked questions
            </p>
            <div className="mt-8">
              <input
                type="text"
                placeholder="Search for help..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full max-w-md rounded-lg border border-gray-300 px-4 py-3 focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Quick Links */}
      <section className="border-b border-gray-200 py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-4 sm:grid-cols-3">
            <Link href="/how-it-works" className="flex items-center gap-4 rounded-lg border border-gray-200 p-4 hover:border-orange-300 hover:bg-orange-50">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-orange-100 text-2xl">
                📖
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">How It Works</h3>
                <p className="text-sm text-gray-600">Learn the basics</p>
              </div>
            </Link>
            <Link href="/contact" className="flex items-center gap-4 rounded-lg border border-gray-200 p-4 hover:border-orange-300 hover:bg-orange-50">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-orange-100 text-2xl">
                💬
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Contact Support</h3>
                <p className="text-sm text-gray-600">Get personalized help</p>
              </div>
            </Link>
            <Link href="/become-chef" className="flex items-center gap-4 rounded-lg border border-gray-200 p-4 hover:border-orange-300 hover:bg-orange-50">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-orange-100 text-2xl">
                👨‍🍳
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Become a Chef</h3>
                <p className="text-sm text-gray-600">Start earning</p>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section className="py-16">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          {filteredFaqs.length === 0 ? (
            <div className="text-center">
              <p className="text-gray-600">No results found for &quot;{searchQuery}&quot;</p>
              <button
                onClick={() => setSearchQuery('')}
                className="mt-4 text-orange-500 hover:text-orange-600"
              >
                Clear search
              </button>
            </div>
          ) : (
            filteredFaqs.map((category) => (
              <div key={category.category} className="mb-12">
                <h2 className="text-xl font-bold text-gray-900">{category.category}</h2>
                <div className="mt-4 space-y-2">
                  {category.questions.map((faq, index) => {
                    const faqId = `${category.category}-${index}`;
                    const isOpen = openFaq === faqId;
                    return (
                      <div key={index} className="rounded-lg border border-gray-200">
                        <button
                          onClick={() => setOpenFaq(isOpen ? null : faqId)}
                          className="flex w-full items-center justify-between px-4 py-4 text-left"
                        >
                          <span className="font-medium text-gray-900">{faq.q}</span>
                          <svg
                            className={`h-5 w-5 text-gray-500 transition ${isOpen ? 'rotate-180' : ''}`}
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </button>
                        {isOpen && (
                          <div className="border-t border-gray-200 px-4 py-4">
                            <p className="text-gray-600">{faq.a}</p>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))
          )}
        </div>
      </section>

      {/* Still Need Help */}
      <section className="bg-gray-50 py-16">
        <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-900">Still need help?</h2>
          <p className="mt-4 text-gray-600">
            Our support team is here to assist you
          </p>
          <Link
            href="/contact"
            className="mt-6 inline-block rounded-lg bg-orange-500 px-6 py-3 font-semibold text-white hover:bg-orange-600"
          >
            Contact Support
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
