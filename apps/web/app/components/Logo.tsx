import Link from 'next/link';

// Colorful POTLUCKHUB wordmark. Warm food palette cycled across the letters
// (orange → chili red → turmeric amber → herb emerald) for a lively, appetite-forward
// brand mark. Keep the spoon/arches logo in sync with the native app icon.
const WORDMARK = 'POTLUCKHUB';
const LETTER_COLORS = [
  '#f97316', // P — orange
  '#ef4444', // O — chili red
  '#f59e0b', // T — turmeric amber
  '#10b981', // L — herb emerald
  '#f97316', // U — orange
  '#ef4444', // C — chili red
  '#f59e0b', // K — turmeric amber
  '#10b981', // H — herb emerald
  '#f97316', // U — orange
  '#ef4444', // B — chili red
];

export function Wordmark({ className = '' }: { className?: string }) {
  return (
    <span
      className={`font-display select-none font-black tracking-tight ${className}`}
      aria-label={WORDMARK}
    >
      {WORDMARK.split('').map((ch, i) => (
        <span key={i} style={{ color: LETTER_COLORS[i % LETTER_COLORS.length] }}>
          {ch}
        </span>
      ))}
    </span>
  );
}

/**
 * Brand lockup: spoon/arches logo + colorful POTLUCKHUB wordmark. Links home by default.
 * `size` controls the logo height; the wordmark scales alongside it.
 */
export function Logo({
  href = '/',
  size = 'md',
  className = '',
}: {
  href?: string | null;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}) {
  const dims =
    size === 'lg'
      ? { img: 'h-11 w-11', text: 'text-2xl' }
      : size === 'sm'
        ? { img: 'h-7 w-7', text: 'text-lg' }
        : { img: 'h-9 w-9', text: 'text-xl' };

  const inner = (
    <span className={`flex items-center gap-2 ${className}`}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/logo.png" alt="Potluck home chef marketplace" className={`${dims.img} object-contain`} />
      <Wordmark className={dims.text} />
    </span>
  );

  if (href === null) return inner;
  return (
    <Link href={href} className="inline-flex items-center" aria-label="Potluck — home">
      {inner}
    </Link>
  );
}
