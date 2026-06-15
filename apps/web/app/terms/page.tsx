import type { Metadata } from 'next';
import { SiteNav } from '../components/SiteNav';
import { SiteFooter } from '../components/SiteFooter';

export const metadata: Metadata = {
  title: 'Terms of Service - Potluck',
  description:
    'The terms and conditions that govern your use of the Potluck home dining platform.',
};

const LAST_UPDATED = 'June 15, 2026';
const CONTACT_EMAIL = 'support@potluckhub.io';

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-10">
      <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
      <div className="mt-4 space-y-4 text-gray-600">{children}</div>
    </section>
  );
}

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-white">
      <SiteNav />

      {/* Hero */}
      <section className="bg-gradient-to-br from-orange-50 to-white py-16">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
            Terms of Service
          </h1>
          <p className="mt-6 text-lg text-gray-600">
            Please read these terms carefully before using Potluck.
          </p>
          <p className="mt-2 text-sm text-gray-500">Last updated: {LAST_UPDATED}</p>
        </div>
      </section>

      {/* Content */}
      <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
        <p className="text-gray-600">
          These Terms of Service (&quot;Terms&quot;) govern your access to and use of the Potluck
          website and mobile applications (collectively, the &quot;Service&quot;), operated by Potluck
          (&quot;Potluck&quot;, &quot;we&quot;, &quot;us&quot;, or &quot;our&quot;). By creating an
          account or using the Service, you agree to be bound by these Terms. If you do not agree,
          please do not use the Service.
        </p>

        <Section title="1. The Potluck Platform">
          <p>
            Potluck is a marketplace that connects independent home chefs (&quot;Chefs&quot;) with
            diners (&quot;Diners&quot;) who wish to book home dining experiences in Singapore. Potluck
            provides the platform that enables these bookings but is not a party to the actual dining
            arrangement between a Chef and a Diner, and does not prepare, serve, or supply food.
          </p>
        </Section>

        <Section title="2. Eligibility and Accounts">
          <ul className="list-disc space-y-2 pl-6">
            <li>You must be at least 18 years old to use the Service.</li>
            <li>
              You agree to provide accurate, current, and complete information and to keep it up to
              date.
            </li>
            <li>
              You are responsible for safeguarding your account credentials and for all activity under
              your account.
            </li>
            <li>You may not share your account or impersonate any other person or entity.</li>
          </ul>
        </Section>

        <Section title="3. Bookings and Payments">
          <ul className="list-disc space-y-2 pl-6">
            <li>
              Diners book experiences at the prices listed by Chefs. Payments are processed securely
              through our third-party payment provider (Stripe).
            </li>
            <li>
              Confirmed bookings form an agreement directly between the Diner and the Chef. Potluck
              charges a service fee, which is disclosed before checkout.
            </li>
            <li>
              Chefs are responsible for setting their menus, pricing, availability, and for complying
              with applicable food safety and hygiene requirements.
            </li>
            <li>
              Payouts to Chefs are made through Stripe in accordance with our payout schedule, net of
              applicable fees.
            </li>
          </ul>
        </Section>

        <Section title="4. Cancellations and Refunds">
          <p>
            Cancellation and refund eligibility depend on the timing of the cancellation and the Chef&apos;s
            stated policy at the time of booking. Where a Chef cancels a confirmed booking, the Diner is
            entitled to a full refund of amounts paid for that booking. Refunds are returned to the
            original payment method.
          </p>
        </Section>

        <Section title="5. User Conduct">
          <p>You agree not to:</p>
          <ul className="list-disc space-y-2 pl-6">
            <li>Violate any law or third-party rights.</li>
            <li>Post false, misleading, offensive, or fraudulent content or reviews.</li>
            <li>Circumvent the platform to arrange or pay for bookings off-platform.</li>
            <li>Interfere with, disrupt, or attempt to gain unauthorised access to the Service.</li>
            <li>Use the Service to harass, harm, or endanger others.</li>
          </ul>
        </Section>

        <Section title="6. Chef Responsibilities">
          <p>
            Chefs are independent operators and are solely responsible for the food they prepare and
            serve, including ingredient sourcing, allergen disclosure, hygiene, and compliance with all
            applicable Singapore regulations. Chefs represent that they have the right and ability to
            host the experiences they list.
          </p>
        </Section>

        <Section title="7. Reviews and Content">
          <p>
            You retain ownership of content you submit (such as reviews, photos, and listings) but grant
            Potluck a non-exclusive, worldwide, royalty-free licence to use, display, and distribute
            that content in connection with operating and promoting the Service. You are responsible for
            ensuring your content does not infringe the rights of others.
          </p>
        </Section>

        <Section title="8. Disclaimers">
          <p>
            The Service is provided &quot;as is&quot; and &quot;as available&quot; without warranties of
            any kind. Potluck does not guarantee the quality, safety, or legality of experiences offered
            by Chefs, the accuracy of listings, or that the Service will be uninterrupted or error-free.
          </p>
        </Section>

        <Section title="9. Limitation of Liability">
          <p>
            To the maximum extent permitted by law, Potluck and its affiliates will not be liable for
            any indirect, incidental, special, or consequential damages, or for any loss arising from
            your use of the Service or any dining experience booked through it. Our total liability for
            any claim is limited to the amount of fees you paid to Potluck in the six months preceding
            the claim.
          </p>
        </Section>

        <Section title="10. Termination">
          <p>
            We may suspend or terminate your access to the Service at any time if you breach these Terms
            or use the Service in a manner that may cause harm. You may close your account at any time by
            contacting us.
          </p>
        </Section>

        <Section title="11. Governing Law">
          <p>
            These Terms are governed by the laws of Singapore, and you submit to the exclusive
            jurisdiction of the courts of Singapore for any dispute arising out of or relating to the
            Service.
          </p>
        </Section>

        <Section title="12. Changes to These Terms">
          <p>
            We may update these Terms from time to time. We will post the updated version on this page
            and revise the &quot;Last updated&quot; date. Your continued use of the Service after changes
            take effect constitutes acceptance of the revised Terms.
          </p>
        </Section>

        <Section title="13. Contact Us">
          <p>
            Questions about these Terms? Contact us at{' '}
            <a href={`mailto:${CONTACT_EMAIL}`} className="text-orange-500 hover:text-orange-600">
              {CONTACT_EMAIL}
            </a>{' '}
            or write to Potluck, 71 Robinson Road, Singapore 068895.
          </p>
        </Section>
      </div>

      <SiteFooter />
    </div>
  );
}
