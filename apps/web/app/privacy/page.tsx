import type { Metadata } from 'next';
import { SiteNav } from '../components/SiteNav';
import { SiteFooter } from '../components/SiteFooter';

export const metadata: Metadata = {
  title: 'Privacy Policy - Potluck',
  description:
    'How Potluck collects, uses, and protects your personal data when you use our home dining platform.',
};

const LAST_UPDATED = 'June 15, 2026';
const CONTACT_EMAIL = 'privacy@potluckhub.io';

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-10">
      <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
      <div className="mt-4 space-y-4 text-gray-600">{children}</div>
    </section>
  );
}

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-white">
      <SiteNav />

      {/* Hero */}
      <section className="bg-gradient-to-br from-orange-50 to-white py-16">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
            Privacy Policy
          </h1>
          <p className="mt-6 text-lg text-gray-600">
            Your privacy matters to us. This policy explains what data we collect and how we use it.
          </p>
          <p className="mt-2 text-sm text-gray-500">Last updated: {LAST_UPDATED}</p>
        </div>
      </section>

      {/* Content */}
      <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
        <p className="text-gray-600">
          Potluck (&quot;Potluck&quot;, &quot;we&quot;, &quot;us&quot;, or &quot;our&quot;) operates the
          Potluck website and mobile applications (collectively, the &quot;Service&quot;), a platform
          that connects home chefs with diners in Singapore. This Privacy Policy describes how we
          collect, use, disclose, and safeguard your personal data when you use the Service. We handle
          personal data in accordance with Singapore&apos;s Personal Data Protection Act 2012 (PDPA)
          and other applicable laws. By using the Service, you agree to the practices described in this
          policy.
        </p>

        <Section title="1. Information We Collect">
          <p>We collect the following categories of personal data:</p>
          <ul className="list-disc space-y-2 pl-6">
            <li>
              <strong>Account information</strong> — your name, email address, phone number, password,
              and profile photo when you register as a diner or chef.
            </li>
            <li>
              <strong>Chef information</strong> — for hosts, additional details such as your dining
              location, menus, pricing, food handling information, and bank or payout details.
            </li>
            <li>
              <strong>Booking and transaction data</strong> — the experiences you book or host, dates,
              party sizes, dietary preferences, and order history.
            </li>
            <li>
              <strong>Payment information</strong> — payments are processed by our third-party payment
              provider (Stripe). We do not store full card numbers on our servers; we receive limited
              transaction details needed to confirm and manage your bookings.
            </li>
            <li>
              <strong>Location data</strong> — approximate or precise location (with your permission)
              to help you discover chefs near you and to show booking locations.
            </li>
            <li>
              <strong>Communications</strong> — messages you send through the Service, support requests,
              and reviews or ratings you submit.
            </li>
            <li>
              <strong>Device and usage data</strong> — IP address, device type, operating system, app
              version, and usage analytics collected automatically to operate and improve the Service.
            </li>
          </ul>
        </Section>

        <Section title="2. How We Use Your Information">
          <p>We use personal data to:</p>
          <ul className="list-disc space-y-2 pl-6">
            <li>Create and manage your account and verify your identity.</li>
            <li>Facilitate bookings between diners and chefs and process payments and payouts.</li>
            <li>Send booking confirmations, reminders, and important service notices.</li>
            <li>Provide customer support and respond to your enquiries.</li>
            <li>Personalise recommendations and show relevant chefs and experiences.</li>
            <li>Maintain safety, prevent fraud, and enforce our terms.</li>
            <li>Analyse usage to improve and develop the Service.</li>
            <li>Comply with legal obligations.</li>
          </ul>
        </Section>

        <Section title="3. How We Share Your Information">
          <p>
            We do not sell your personal data. We share personal data only as needed to operate the
            Service:
          </p>
          <ul className="list-disc space-y-2 pl-6">
            <li>
              <strong>Between diners and chefs</strong> — when you make or accept a booking, we share
              the details necessary to host or attend the experience (such as name and relevant booking
              information).
            </li>
            <li>
              <strong>Service providers</strong> — payment processors (Stripe), hosting, analytics, and
              communication providers that process data on our behalf under appropriate safeguards.
            </li>
            <li>
              <strong>Legal and safety</strong> — when required by law, regulation, legal process, or to
              protect the rights, safety, and property of Potluck, our users, or the public.
            </li>
            <li>
              <strong>Business transfers</strong> — in connection with a merger, acquisition, or sale of
              assets, subject to this policy.
            </li>
          </ul>
        </Section>

        <Section title="4. Data Retention">
          <p>
            We retain personal data for as long as your account is active or as needed to provide the
            Service, comply with our legal obligations, resolve disputes, and enforce our agreements.
            When data is no longer required, we securely delete or anonymise it.
          </p>
        </Section>

        <Section title="5. Data Security">
          <p>
            We use reasonable technical and organisational measures — including encryption in transit,
            access controls, and secure payment processing — to protect personal data against
            unauthorised access, loss, or misuse. No method of transmission or storage is completely
            secure, so we cannot guarantee absolute security.
          </p>
        </Section>

        <Section title="6. Your Rights and Choices">
          <ul className="list-disc space-y-2 pl-6">
            <li>
              <strong>Access and correction</strong> — you may access and update your account
              information at any time, or request a copy of the personal data we hold about you.
            </li>
            <li>
              <strong>Deletion</strong> — you may request deletion of your account and associated
              personal data, subject to legal retention requirements.
            </li>
            <li>
              <strong>Withdraw consent</strong> — you may withdraw consent for optional processing such
              as location access or marketing communications.
            </li>
            <li>
              <strong>Marketing opt-out</strong> — you can unsubscribe from promotional emails using the
              link in each message.
            </li>
          </ul>
          <p>
            To exercise these rights, contact us at{' '}
            <a href={`mailto:${CONTACT_EMAIL}`} className="text-orange-500 hover:text-orange-600">
              {CONTACT_EMAIL}
            </a>
            .
          </p>
        </Section>

        <Section title="7. Children's Privacy">
          <p>
            The Service is not directed to children under 18. We do not knowingly collect personal data
            from children. If you believe a child has provided us with personal data, please contact us
            and we will take steps to delete it.
          </p>
        </Section>

        <Section title="8. International Transfers">
          <p>
            Your personal data may be processed and stored on servers located outside Singapore by our
            service providers. Where data is transferred internationally, we take steps to ensure it
            receives a standard of protection comparable to that under the PDPA.
          </p>
        </Section>

        <Section title="9. Changes to This Policy">
          <p>
            We may update this Privacy Policy from time to time. We will post the updated version on this
            page and revise the &quot;Last updated&quot; date above. Significant changes will be
            communicated through the Service where appropriate.
          </p>
        </Section>

        <Section title="10. Contact Us">
          <p>
            If you have questions or concerns about this Privacy Policy or your personal data, please
            contact our Data Protection team:
          </p>
          <ul className="list-none space-y-1">
            <li>
              Email:{' '}
              <a href={`mailto:${CONTACT_EMAIL}`} className="text-orange-500 hover:text-orange-600">
                {CONTACT_EMAIL}
              </a>
            </li>
            <li>Potluck, 71 Robinson Road, Singapore 068895</li>
          </ul>
        </Section>
      </div>

      <SiteFooter />
    </div>
  );
}
