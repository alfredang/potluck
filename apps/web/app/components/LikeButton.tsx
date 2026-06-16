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
      aria-label={liked ? 'Remove like' : 'Like this'}
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
          d="M6.633 10.5c.806 0 1.533-.446 2.031-1.08a9.041 9.041 0 012.861-2.4c.723-.384 1.35-.956 1.653-1.715a4.498 4.498 0 00.322-1.672V2.75a.75.75 0 01.75-.75 2.25 2.25 0 012.25 2.25c0 1.152-.26 2.243-.723 3.218-.266.558.107 1.282.725 1.282h3.126c1.026 0 1.945.694 2.054 1.715.045.422.068.85.068 1.285a11.95 11.95 0 01-2.649 7.521c-.388.482-.987.729-1.605.729H13.48c-.483 0-.964-.078-1.423-.23l-3.114-1.04a4.501 4.501 0 00-1.423-.23H5.904M14.25 9h2.25M5.904 18.75c.083.205.173.405.27.602.197.4-.078.898-.523.898h-.908c-.889 0-1.713-.518-1.972-1.368a12 12 0 01-.521-3.507c0-1.553.295-3.036.831-4.398C3.387 9.953 4.167 9.5 5 9.5h1.053c.472 0 .745.556.5.96a8.958 8.958 0 00-1.302 4.665c0 1.194.232 2.333.654 3.375z"
        />
      </svg>
      <span className="tabular-nums">{count}</span>
      <span className="hidden sm:inline">{liked ? 'Liked' : 'Like'}</span>
    </button>
  );
}
