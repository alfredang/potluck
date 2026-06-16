'use client';

import { useEffect, useState } from 'react';

// Potluck's WhatsApp business line. Suggested queries pre-fill the chat so a diner or
// aspiring chef can reach us in one tap — a low-friction, site-wide lead-capture point.
const WHATSAPP_NUMBER = '6590480277';

const SUGGESTED_QUERIES = [
  { emoji: '🍲', text: "Hi! I'd like to book a home chef for a dinner." },
  { emoji: '🕌', text: 'Which halal home chefs are available this weekend?' },
  { emoji: '🎉', text: 'I want to host a private dinner for 6 — can you help?' },
  { emoji: '👩‍🍳', text: 'How do I become a home chef on Potluck?' },
];

function waLink(text: string) {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
}

export function WhatsAppWidget() {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Gentle one-time auto-peek so people notice the chat, then it stays in their control.
  useEffect(() => {
    setMounted(true);
    const t = setTimeout(() => setOpen(true), 2600);
    const t2 = setTimeout(() => setOpen(false), 7000);
    return () => {
      clearTimeout(t);
      clearTimeout(t2);
    };
  }, []);

  if (!mounted) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col items-end gap-3 print:hidden">
      {/* Chat panel */}
      <div
        className={`w-[min(20rem,calc(100vw-2.5rem))] origin-bottom-right overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-2xl transition-all duration-300 ${
          open ? 'pointer-events-auto translate-y-0 scale-100 opacity-100' : 'pointer-events-none translate-y-3 scale-95 opacity-0'
        }`}
        role="dialog"
        aria-label="Chat with Potluck on WhatsApp"
        aria-hidden={!open}
      >
        <div className="flex items-center gap-3 bg-gradient-to-r from-orange-500 to-amber-500 px-4 py-3 text-white">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/15 text-lg">🍲</span>
          <div className="leading-tight">
            <p className="text-sm font-semibold">Potluck Concierge</p>
            <p className="text-xs text-white/80">Typically replies in minutes</p>
          </div>
          <button
            onClick={() => setOpen(false)}
            className="ml-auto rounded-full p-1 text-white/80 hover:bg-white/10 hover:text-white"
            aria-label="Close chat"
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="space-y-2 bg-[#FFF8F1] px-3 py-4">
          <p className="mx-1 mb-1 text-xs font-medium text-gray-600">
            👋 Hungry or curious? Tap a question to start:
          </p>
          {SUGGESTED_QUERIES.map((q) => (
            <a
              key={q.text}
              href={waLink(q.text)}
              target="_blank"
              rel="noopener noreferrer"
              className="block rounded-xl rounded-tl-sm bg-white px-3 py-2.5 text-sm text-gray-800 shadow-sm ring-1 ring-orange-100/60 transition hover:bg-orange-50"
            >
              <span className="mr-1.5">{q.emoji}</span>
              {q.text}
            </a>
          ))}
          <a
            href={waLink('Hi Potluck! I have a question.')}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-1 flex items-center justify-center gap-2 rounded-xl bg-[#25D366] px-3 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#1ebe5b]"
          >
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51l-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
            </svg>
            Open WhatsApp chat
          </a>
        </div>
      </div>

      {/* Floating launcher */}
      <button
        onClick={() => setOpen((v) => !v)}
        className="group relative flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-orange-500 to-amber-500 text-white shadow-lg shadow-orange-500/30 transition hover:scale-105 hover:from-orange-600 hover:to-amber-600 focus:outline-none focus:ring-4 focus:ring-orange-500/30"
        aria-label={open ? 'Close WhatsApp chat' : 'Chat with us on WhatsApp'}
        aria-expanded={open}
      >
        {!open && (
          <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex h-4 w-4 items-center justify-center rounded-full bg-emerald-500 text-[10px] font-bold">1</span>
          </span>
        )}
        {open ? (
          <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg className="h-7 w-7" viewBox="0 0 24 24" fill="currentColor">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51l-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347zM12.05 21.785h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884z" />
          </svg>
        )}
      </button>
    </div>
  );
}
