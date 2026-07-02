import Link from 'next/link';

// Trust badges for chefs. Verified = passed Potluck's site-visit verification
// (see /chef-verification); Featured = hand-picked by the Potluck team.

export function VerifiedBadge({ withLink = false, className = '' }: { withLink?: boolean; className?: string }) {
  const badge = (
    <span
      className={`inline-flex items-center gap-1 rounded-full bg-teal-50 px-2 py-0.5 text-xs font-semibold text-teal-700 ${className}`}
      title="Identity & kitchen verified by Potluck (site visit)"
    >
      <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="currentColor">
        <path
          fillRule="evenodd"
          d="M8.6 3.8a2.25 2.25 0 0 1 1.6-.66h3.6c.6 0 1.18.24 1.6.66l1.2 1.2c.16.16.38.26.6.26h1.7c1.24 0 2.25 1 2.25 2.25v1.7c0 .22.1.44.26.6l1.2 1.2c.88.88.88 2.32 0 3.2l-1.2 1.2a.85.85 0 0 0-.26.6v1.7c0 1.24-1 2.25-2.25 2.25h-1.7a.85.85 0 0 0-.6.26l-1.2 1.2a2.25 2.25 0 0 1-3.2 0l-1.2-1.2a.85.85 0 0 0-.6-.26h-1.7c-1.24 0-2.25-1-2.25-2.25v-1.7a.85.85 0 0 0-.26-.6l-1.2-1.2a2.25 2.25 0 0 1 0-3.2l1.2-1.2c.16-.16.26-.38.26-.6v-1.7c0-1.24 1-2.25 2.25-2.25h1.7c.22 0 .44-.1.6-.26l1.2-1.2Zm7.02 6.9a.75.75 0 1 0-1.24-.84l-2.98 4.4-1.6-1.6a.75.75 0 1 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.15-.11l3.48-5.16Z"
          clipRule="evenodd"
        />
      </svg>
      Verified
    </span>
  );
  if (!withLink) return badge;
  return (
    <Link href="/chef-verification" className="hover:opacity-80" aria-label="How Potluck verifies chefs">
      {badge}
    </Link>
  );
}

export function FeaturedBadge({ className = '' }: { className?: string }) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full bg-amber-50 px-2 py-0.5 text-xs font-semibold text-amber-700 ${className}`}
      title="Hand-picked by the Potluck team"
    >
      <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2.5l2.6 5.9 6.4.6-4.8 4.3 1.4 6.3L12 16.3l-5.6 3.3 1.4-6.3-4.8-4.3 6.4-.6L12 2.5z" />
      </svg>
      Featured
    </span>
  );
}
