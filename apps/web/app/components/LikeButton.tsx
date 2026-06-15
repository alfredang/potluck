'use client';

import { useEffect, useState } from 'react';

/**
 * Generic optimistic like button backed by a counter endpoint.
 * Mirrors the ai-cms pattern: optimistic update + per-browser localStorage flag.
 *
 * The endpoint must support:
 *   GET  {endpoint}?id={id}            -> { likeCount }
 *   POST {endpoint} {id, action}       -> { likeCount }   action: 'like' | 'unlike'
 */
export function LikeButton({
  id,
  endpoint,
  initialCount = 0,
  size = 'sm',
}: {
  id: string;
  endpoint: string;
  initialCount?: number;
  size?: 'sm' | 'md';
}) {
  const [count, setCount] = useState(initialCount);
  const [liked, setLiked] = useState(false);
  const [pending, setPending] = useState(false);

  const storageKey = `liked:${endpoint}:${id}`;

  // Load the current count and per-browser liked flag on mount.
  useEffect(() => {
    let cancelled = false;
    if (typeof window !== 'undefined') {
      setLiked(localStorage.getItem(storageKey) === '1');
    }
    fetch(`${endpoint}?id=${encodeURIComponent(id)}`)
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (!cancelled && d && typeof d.likeCount === 'number') setCount(d.likeCount);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, endpoint]);

  async function onClick() {
    if (pending) return;
    setPending(true);
    const nextLiked = !liked;
    const action = nextLiked ? 'like' : 'unlike';
    // optimistic
    setLiked(nextLiked);
    setCount((c) => (nextLiked ? c + 1 : Math.max(0, c - 1)));
    if (typeof window !== 'undefined') {
      if (nextLiked) localStorage.setItem(storageKey, '1');
      else localStorage.removeItem(storageKey);
    }
    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, action }),
      });
      if (res.ok) {
        const data = (await res.json()) as { likeCount?: number };
        if (typeof data.likeCount === 'number') setCount(data.likeCount);
      } else {
        throw new Error('request failed');
      }
    } catch {
      // rollback
      setLiked(!nextLiked);
      setCount((c) => (nextLiked ? Math.max(0, c - 1) : c + 1));
      if (typeof window !== 'undefined') {
        if (nextLiked) localStorage.removeItem(storageKey);
        else localStorage.setItem(storageKey, '1');
      }
    } finally {
      setPending(false);
    }
  }

  const pad = size === 'md' ? 'px-4 py-2 text-sm' : 'px-3 py-1.5 text-xs';

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={pending}
      aria-pressed={liked}
      aria-label={liked ? 'Unlike' : 'Like'}
      className={`inline-flex items-center gap-1.5 rounded-full border font-medium transition disabled:opacity-60 ${pad} ${
        liked
          ? 'border-orange-300 bg-orange-50 text-orange-600'
          : 'border-gray-300 bg-white text-gray-600 hover:border-orange-300 hover:text-orange-600'
      }`}
    >
      <svg
        className="h-4 w-4"
        viewBox="0 0 24 24"
        fill={liked ? 'currentColor' : 'none'}
        stroke="currentColor"
        strokeWidth={2}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
        />
      </svg>
      <span className="tabular-nums">{count}</span>
      <span className="hidden sm:inline">{liked ? 'Liked' : 'Like'}</span>
    </button>
  );
}
