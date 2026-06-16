// Social-proof section for the homepage. Static, representative testimonials from both
// sides of the marketplace (diners + home chefs) — Singapore voices and neighbourhoods.
const TESTIMONIALS = [
  {
    quote:
      "We booked a Peranakan home dinner for our anniversary and it blew our minds. Chef Mei cooked ayam buah keluak right in front of us — better than any restaurant.",
    name: 'Rachel T.',
    role: 'Diner · Tiong Bahru',
    emoji: '🍛',
    stars: 5,
  },
  {
    quote:
      "I cook for my neighbourhood every weekend now. Potluck handles the bookings and payments so I just focus on the food. I'm earning around $2,000 a month from my own kitchen.",
    name: 'Faizal R.',
    role: 'Home Chef · Geylang Serai',
    emoji: '👨‍🍳',
    stars: 5,
  },
  {
    quote:
      "Finding halal home-cooked food I could trust was hard until this. The chefs are verified, the reviews are real, and the rendang was unforgettable.",
    name: 'Nurul A.',
    role: 'Diner · Tampines',
    emoji: '🕌',
    stars: 5,
  },
  {
    quote:
      "Hosted a private Korean dinner for 8 friends. Chef came to our place, cooked, and cleaned up. Felt like a restaurant takeover at home — half the price.",
    name: 'Daniel L.',
    role: 'Diner · Tanjong Pagar',
    emoji: '🥘',
    stars: 5,
  },
];

function Stars({ count }: { count: number }) {
  return (
    <div className="flex gap-0.5 text-amber-400" aria-label={`${count} out of 5 stars`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <svg key={i} className={`h-4 w-4 ${i < count ? 'text-amber-400' : 'text-gray-200'}`} viewBox="0 0 20 20" fill="currentColor">
          <path d="M9.05 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.957a1 1 0 00.95.69h4.162c.969 0 1.371 1.24.588 1.81l-3.368 2.447a1 1 0 00-.364 1.118l1.287 3.957c.3.922-.755 1.688-1.54 1.118l-3.367-2.447a1 1 0 00-1.176 0l-3.367 2.447c-.784.57-1.838-.196-1.539-1.118l1.286-3.957a1 1 0 00-.363-1.118L2.07 9.374c-.783-.57-.38-1.81.588-1.81h4.162a1 1 0 00.95-.69l1.286-3.957z" />
        </svg>
      ))}
    </div>
  );
}

export function Testimonials() {
  return (
    <section className="bg-cream py-12 sm:py-14">
      <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-wide text-orange-500">Loved across the island</p>
          <h2 className="font-display mt-2 text-3xl font-bold text-gray-900 sm:text-4xl">Real homes. Real food. Real reviews.</h2>
          <div className="mt-4 flex items-center justify-center gap-2 text-gray-600">
            <Stars count={5} />
            <span className="text-sm font-medium">4.9 average from 1,200+ diners</span>
          </div>
        </div>
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {TESTIMONIALS.map((t) => (
            <figure key={t.name} className="flex h-full flex-col rounded-2xl border border-orange-100 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-warm">
              <Stars count={t.stars} />
              <blockquote className="mt-3 flex-1 text-sm leading-relaxed text-gray-700">“{t.quote}”</blockquote>
              <figcaption className="mt-4 flex items-center gap-3 border-t border-orange-100 pt-4">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-100 text-xl">{t.emoji}</span>
                <span>
                  <span className="block text-sm font-semibold text-gray-900">{t.name}</span>
                  <span className="block text-xs text-gray-500">{t.role}</span>
                </span>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
