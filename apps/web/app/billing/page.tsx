'use client';

import { useState } from 'react';
import Link from 'next/link';

interface Invoice {
  id: string;
  date: string;
  amount: number;
  status: 'paid' | 'pending' | 'failed';
  description: string;
}

interface Subscription {
  id: string;
  plan: string;
  status: 'active' | 'cancelled' | 'past_due';
  amount: number;
  currentPeriodStart: string;
  currentPeriodEnd: string;
}

export default function BillingPage() {
  const [subscription] = useState<Subscription>({
    id: 'sub_123456',
    plan: 'Pro',
    status: 'active',
    amount: 2000,
    currentPeriodStart: '2026-03-01',
    currentPeriodEnd: '2026-04-01',
  });

  const [invoices] = useState<Invoice[]>([
    { id: 'INV-2026-003', date: '2026-03-01', amount: 2000, status: 'paid', description: 'Pro Plan - March 2026' },
    { id: 'INV-2026-002', date: '2026-02-01', amount: 2000, status: 'paid', description: 'Pro Plan - February 2026' },
    { id: 'INV-2026-001', date: '2026-01-01', amount: 2000, status: 'paid', description: 'Pro Plan - January 2026' },
  ]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-SG', {
      style: 'currency',
      currency: 'SGD',
    }).format(amount / 100);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-SG', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white border-b border-gray-200">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <img src="/logo.png" alt="Potluck" className="h-8 w-auto" />
            </Link>
            <div className="flex items-center gap-4">
              <Link href="/dashboard" className="text-gray-600 hover:text-orange-500">
                Dashboard
              </Link>
              <Link href="/billing" className="text-orange-500 font-medium">
                Billing
              </Link>
              <Link href="/profile" className="text-gray-600 hover:text-orange-500">
                Profile
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900">Billing & Subscription</h1>

        {/* Current Plan */}
        <div className="mt-8 rounded-xl bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Current Plan</h2>
              <p className="mt-1 text-gray-600">
                You are currently on the <span className="font-semibold text-orange-600">{subscription.plan}</span> plan
              </p>
            </div>
            <div className="text-right">
              <p className="text-3xl font-bold text-gray-900">
                {formatCurrency(subscription.amount)}
                <span className="text-lg font-normal text-gray-500">/month</span>
              </p>
              <p className={`mt-1 text-sm ${subscription.status === 'active' ? 'text-green-600' : 'text-red-600'}`}>
                {subscription.status === 'active' ? '✓ Active' : subscription.status}
              </p>
            </div>
          </div>

          <div className="mt-6 border-t border-gray-200 pt-4">
            <div className="flex items-center justify-between text-sm">
              <div>
                <p className="text-gray-500">Current Period</p>
                <p className="font-medium text-gray-900">
                  {formatDate(subscription.currentPeriodStart)} - {formatDate(subscription.currentPeriodEnd)}
                </p>
              </div>
              <div className="flex gap-3">
                <button className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
                  Change Plan
                </button>
                <button className="rounded-lg border border-red-300 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50">
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Plans */}
        <div className="mt-8">
          <h2 className="text-xl font-semibold text-gray-900">Available Plans</h2>
          <div className="mt-4 grid gap-6 md:grid-cols-3">
            <div className={`rounded-xl border-2 p-6 ${subscription.plan === 'Basic' ? 'border-orange-500 bg-orange-50' : 'border-gray-200 bg-white'}`}>
              <h3 className="text-lg font-semibold">Basic</h3>
              <p className="mt-2 text-3xl font-bold">$10<span className="text-sm font-normal text-gray-500">/mo</span></p>
              <ul className="mt-4 space-y-2 text-sm text-gray-600">
                <li>✓ 1 menu listing</li>
                <li>✓ Basic analytics</li>
                <li>✓ Email support</li>
              </ul>
              {subscription.plan !== 'Basic' && (
                <button className="mt-6 w-full rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium hover:bg-gray-50">
                  Downgrade
                </button>
              )}
            </div>

            <div className={`rounded-xl border-2 p-6 ${subscription.plan === 'Pro' ? 'border-orange-500 bg-orange-50' : 'border-gray-200 bg-white'}`}>
              <div className="mb-2 text-xs font-semibold uppercase text-orange-500">Current</div>
              <h3 className="text-lg font-semibold">Pro</h3>
              <p className="mt-2 text-3xl font-bold">$20<span className="text-sm font-normal text-gray-500">/mo</span></p>
              <ul className="mt-4 space-y-2 text-sm text-gray-600">
                <li>✓ 15 menu listings</li>
                <li>✓ Advanced analytics</li>
                <li>✓ Priority support</li>
                <li>✓ Featured placement</li>
              </ul>
            </div>

            <div className={`rounded-xl border-2 p-6 ${subscription.plan === 'Unlimited' ? 'border-orange-500 bg-orange-50' : 'border-gray-200 bg-white'}`}>
              <h3 className="text-lg font-semibold">Unlimited</h3>
              <p className="mt-2 text-3xl font-bold">$50<span className="text-sm font-normal text-gray-500">/mo</span></p>
              <ul className="mt-4 space-y-2 text-sm text-gray-600">
                <li>✓ Unlimited menu listings</li>
                <li>✓ Full analytics suite</li>
                <li>✓ Dedicated support</li>
                <li>✓ Premium placement</li>
              </ul>
              {subscription.plan !== 'Unlimited' && (
                <button className="mt-6 w-full rounded-lg bg-orange-500 px-4 py-2 text-sm font-medium text-white hover:bg-orange-600">
                  Upgrade
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Payment History */}
        <div className="mt-8">
          <h2 className="text-xl font-semibold text-gray-900">Payment History</h2>
          <div className="mt-4 overflow-hidden rounded-xl bg-white shadow-sm">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Invoice
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Description
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Status
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {invoices.map((invoice) => (
                  <tr key={invoice.id}>
                    <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">
                      {invoice.id}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                      {formatDate(invoice.date)}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                      {invoice.description}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">
                      {formatCurrency(invoice.amount)}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">
                      <span className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${
                        invoice.status === 'paid' 
                          ? 'bg-green-100 text-green-800' 
                          : invoice.status === 'pending'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                      <button className="text-orange-600 hover:text-orange-900">
                        Download
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Payment Method */}
        <div className="mt-8 rounded-xl bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-gray-900">Payment Method</h2>
          <div className="mt-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-20 items-center justify-center rounded-lg border border-gray-200">
                <span className="text-xs text-gray-500">Card</span>
              </div>
              <div>
                <p className="font-medium text-gray-900">•••• •••• •••• 4242</p>
                <p className="text-sm text-gray-500">Expires 12/2027</p>
              </div>
            </div>
            <button className="text-sm font-medium text-orange-600 hover:text-orange-700">
              Update
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
