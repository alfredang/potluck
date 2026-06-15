import Link from 'next/link';

/**
 * Potluck brand logo — the spoon-and-arches mark from the native iOS/Android
 * app icon, paired with the "Potluck" wordmark. Keep in sync with the native
 * app icon (also used as the web favicon: app/icon.png).
 */
export function LogoMark({ className = 'h-9 w-9' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 1024 1024"
      className={className}
      role="img"
      aria-label="Potluck"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="potluck-bg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#FFF4E2" />
          <stop offset="1" stopColor="#FFE3BE" />
        </linearGradient>
        <linearGradient id="potluck-spoon" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#E0764F" />
          <stop offset="1" stopColor="#C9512F" />
        </linearGradient>
      </defs>

      {/* rounded app-icon tile background */}
      <rect width="1024" height="1024" rx="224" fill="url(#potluck-bg)" />

      {/* rainbow arch: golden outer, teal inner */}
      <path
        d="M 212 560 A 300 300 0 0 1 812 560"
        fill="none"
        stroke="#E5A23B"
        strokeWidth="74"
        strokeLinecap="round"
      />
      <path
        d="M 307 560 A 205 205 0 0 1 717 560"
        fill="none"
        stroke="#1F6E6A"
        strokeWidth="74"
        strokeLinecap="round"
      />

      {/* spoon */}
      <rect x="486" y="250" width="52" height="380" rx="26" fill="url(#potluck-spoon)" />
      <ellipse cx="512" cy="690" rx="96" ry="124" fill="url(#potluck-spoon)" />
      <ellipse cx="512" cy="678" rx="60" ry="84" fill="#D8623F" opacity="0.55" />
    </svg>
  );
}

export function Logo({
  className = '',
  markClassName = 'h-9 w-9',
  wordmarkClassName = 'text-2xl font-bold text-orange-500',
}: {
  className?: string;
  markClassName?: string;
  wordmarkClassName?: string;
}) {
  return (
    <Link href="/" className={`flex items-center gap-2 ${className}`} aria-label="Potluck home">
      <LogoMark className={markClassName} />
      <span className={wordmarkClassName}>Potluck</span>
    </Link>
  );
}
