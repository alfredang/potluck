'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

// While an order is still pending, re-poll the status endpoint (which also
// reconciles with the provider) and refresh the page when it settles.
export function PollRefresh({ orderId }: { orderId: string }) {
  const router = useRouter();

  useEffect(() => {
    let cancelled = false;
    let tries = 0;

    const tick = async () => {
      if (cancelled || tries++ > 40) return; // ~2 minutes
      try {
        const res = await fetch(`/api/checkout/${orderId}`, { cache: 'no-store' });
        if (res.ok) {
          const data = (await res.json()) as { status?: string };
          if (data.status && data.status !== 'pending_payment') {
            router.refresh();
            return;
          }
        }
      } catch {
        // network hiccup — keep polling
      }
      if (!cancelled) setTimeout(tick, 3000);
    };

    const timer = setTimeout(tick, 3000);
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [orderId, router]);

  return null;
}
