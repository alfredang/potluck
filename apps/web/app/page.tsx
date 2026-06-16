import Link from 'next/link';
import { FOOD_CATEGORIES } from '@homechef/shared';
import { SiteNav } from './components/SiteNav';
import { SiteFooter } from './components/SiteFooter';
import { Testimonials } from './components/Testimonials';
import { EnquiryForm } from './components/EnquiryForm';
import { HomeBlogSection } from './components/HomeBlogSection';

// Re-fetch the blog teaser periodically; fails soft if the DB is offline.
export const revalidate = 300;

const STATS = [
  { value: '45', label: 'Singapore home chefs' },
  { value: '20', label: 'Cuisines' },
  { value: '4.9★', label: 'Average rating' },
  { value: '1,200+', label: 'Meals served' },
];

// Real home-cooked dishes for the drifting hero gallery — appetite first, no prices.
// Photos reuse the verified dish imagery from chefs-data.ts.
const HERO_DISHES = [
  { name: 'Laksa Lemak', desc: 'Coconut curry broth, simmered low and slow', by: 'Chef Sarah · Tiong Bahru', img: 'photo-1569718212165-3a8278d5f624' },
  { name: 'Omakase at home', desc: 'Seasonal sashimi, sliced to order at the counter', by: 'Chef Kenji · Robertson Quay', img: 'photo-1579871494447-9811cf80d66c' },
  { name: 'Beef Rendang', desc: 'Slow-cooked for hours till deeply caramelised', by: 'Chef Siti · Bedok', img: 'photo-1606491956689-2ea866880c84' },
  { name: 'Ayam Buah Keluak', desc: 'Heritage Nyonya chicken stew with black nuts', by: 'Chef Sarah · Tiong Bahru', img: 'photo-1567620905732-2d1ec7ab7445' },
  { name: 'Claypot Rice', desc: 'Smoky, crackling rice with lap cheong & chicken', by: 'Chef Mei Lin · Chinatown', img: 'photo-1516684732162-798a0062be99' },
  { name: 'Korean BBQ', desc: 'Marinated galbi, grilled right at the table', by: 'Chef Soo-young · Tanjong Pagar', img: 'photo-1553163147-622ab57be1c7' },
  { name: 'Vegetarian Thali', desc: 'A whole homemade feast on a single plate', by: 'Chef Priya · Little India', img: 'photo-1585937421612-70a008356fbe' },
  { name: 'Chettinad Chicken', desc: 'Bold, peppery South Indian curry with appam', by: 'Chef Raj · Serangoon', img: 'photo-1631452180519-c014fe946bc7' },
  { name: 'Nasi Ambeng', desc: 'Javanese rice feast, shared the kampung way', by: 'Chef Ahmad · Geylang Serai', img: 'photo-1563379091339-03b21ab4a4f8' },
];

function DishCard({ d }: { d: { name: string; desc: string; by: string; img: string } }) {
  return (
    <figure className="group relative overflow-hidden rounded-2xl border border-orange-100 bg-white shadow-warm-lg">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={`https://images.unsplash.com/${d.img}?w=500&q=80&auto=format&fit=crop`}
        alt={d.name}
        loading="lazy"
        className="aspect-[4/5] w-full object-cover transition duration-700 ease-out group-hover:scale-[1.06]"
      />
      <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent p-4 pt-12">
        <p className="font-display text-[15px] font-bold leading-tight text-white">{d.name}</p>
        <p className="mt-1 text-xs leading-snug text-white/85">{d.desc}</p>
        <p className="mt-1.5 text-[11px] font-semibold uppercase tracking-wide text-orange-200">{d.by}</p>
      </figcaption>
    </figure>
  );
}

// Inline SVG step icons (no emoji as structural icons).
function IconSearch() {
  return (
    <svg className="h-7 w-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="7" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  );
}
function IconCalendar() {
  return (
    <svg className="h-7 w-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="17" rx="2.5" />
      <path d="M3 9h18M8 2v4M16 2v4" />
    </svg>
  );
}
function IconBowl() {
  return (
    <svg className="h-7 w-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 11h18a9 9 0 0 1-18 0Z" />
      <path d="M12 7c0-2 2-2 2-3.5M8.5 7C8.5 5 10 5 10 3.5M5 20h14" />
    </svg>
  );
}

const STEPS = [
  { icon: <IconSearch />, title: 'Discover', body: 'Browse home chefs by cuisine, neighbourhood and date — from Tiong Bahru to Tampines. Read real reviews and peek at their menus.' },
  { icon: <IconCalendar />, title: 'Book', body: 'Pick your date, menu and party size. Pay securely in SGD and get instant confirmation — no deposit drama.' },
  { icon: <IconBowl />, title: 'Makan', body: 'Pull up a chair at the chef’s table — or have them cook at yours — for a proper home-cooked spread.' },
];

const TRUST = [
  'Identity-verified home chefs',
  'Halal, vegetarian & dietary-friendly',
  'Secure SGD payments, held till you dine',
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      <SiteNav />

      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-b from-orange-100/70 via-amber-50/70 to-[var(--cream)]">
        {/* warm ambient blobs */}
        <div className="pointer-events-none absolute -left-24 -top-24 h-72 w-72 rounded-full bg-orange-200/50 blur-3xl" />
        <div className="pointer-events-none absolute -right-24 top-10 h-72 w-72 rounded-full bg-amber-200/50 blur-3xl" />
        <div className="pointer-events-none absolute bottom-0 left-1/3 h-64 w-64 rounded-full bg-emerald-200/30 blur-3xl" />
        <div className="relative mx-auto max-w-[1440px] px-4 pb-12 pt-6 sm:px-6 sm:pt-10 lg:px-8 lg:pb-14">
          <div className="grid items-center gap-10 lg:grid-cols-2">
            <div className="animate-rise">
              <span className="inline-flex items-center gap-2 rounded-full bg-white/85 px-3.5 py-1.5 text-sm font-semibold text-orange-700 shadow-sm ring-1 ring-orange-200/70 backdrop-blur">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-70 motion-reduce:hidden" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
                </span>
                Singapore’s home-chef marketplace
              </span>
              <h1 className="font-display mt-5 text-[2.6rem] font-black leading-[1.04] tracking-tight text-gray-900 sm:text-5xl lg:text-[3.5rem]">
                Home-cooked meals,
                <span className="block bg-gradient-to-r from-orange-500 via-red-500 to-amber-500 bg-clip-text italic text-transparent">
                  from real Singapore kitchens.
                </span>
              </h1>
              <p className="mt-5 max-w-xl text-lg leading-relaxed text-gray-600">
                From Peranakan feasts in Joo Chiat to nasi lemak in Geylang Serai — discover talented
                home chefs in your neighbourhood. Book a seat at their table, or have them cook a
                private dinner at yours.
              </p>
              <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/explore"
                  className="rounded-xl bg-orange-500 px-7 py-3.5 text-center text-base font-semibold text-white shadow-warm transition hover:-translate-y-0.5 hover:bg-orange-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2"
                >
                  Find a home chef
                </Link>
                <Link
                  href="/become-chef"
                  className="rounded-xl border border-orange-200 bg-white px-7 py-3.5 text-center text-base font-semibold text-gray-800 shadow-sm transition hover:-translate-y-0.5 hover:border-orange-300 hover:text-orange-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2"
                >
                  Become a chef
                </Link>
              </div>
              <dl className="mt-8 grid max-w-lg grid-cols-4 gap-4">
                {STATS.map((s) => (
                  <div key={s.label}>
                    <dt className="font-display text-2xl font-extrabold text-gray-900">{s.value}</dt>
                    <dd className="mt-0.5 text-xs text-gray-500">{s.label}</dd>
                  </div>
                ))}
              </dl>
            </div>

            {/* Visual: drifting gallery of real home-cooked dishes */}
            <div className="relative hidden lg:block">
              <div
                aria-hidden
                className="marquee-pause relative mx-auto h-[620px] max-w-md overflow-hidden [mask-image:linear-gradient(to_bottom,transparent,#000_7%,#000_93%,transparent)]"
              >
                <div className="grid grid-cols-2 gap-4">
                  <div className="animate-marquee-up flex flex-col gap-4">
                    {[...HERO_DISHES.slice(0, 5), ...HERO_DISHES.slice(0, 5)].map((d, i) => (
                      <DishCard key={`a-${d.name}-${i}`} d={d} />
                    ))}
                  </div>
                  <div className="animate-marquee-down flex flex-col gap-4 pt-10">
                    {[...HERO_DISHES.slice(5), ...HERO_DISHES.slice(5)].map((d, i) => (
                      <DishCard key={`b-${d.name}-${i}`} d={d} />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Trust strip */}
          <ul className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-2 border-t border-orange-200/50 pt-6 text-sm font-medium text-gray-600">
            {TRUST.map((t) => (
              <li key={t} className="flex items-center gap-2">
                <svg className="h-5 w-5 shrink-0 text-emerald-500" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M16.704 5.29a1 1 0 010 1.42l-7.5 7.5a1 1 0 01-1.42 0l-3.5-3.5a1 1 0 111.42-1.42l2.79 2.79 6.79-6.79a1 1 0 011.42 0z" clipRule="evenodd" />
                </svg>
                {t}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Cuisines */}
      <section className="bg-cream py-12 sm:py-14">
        <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wide text-orange-500">Cravings, sorted</p>
              <h2 className="font-display mt-1.5 text-2xl font-bold text-gray-900 sm:text-3xl">Browse by cuisine</h2>
              <p className="mt-1.5 text-gray-600">From hawker-style favourites to private fine-dining at home.</p>
            </div>
            <Link href="/explore" className="hidden text-sm font-semibold text-orange-600 hover:text-orange-700 sm:block">
              See all chefs →
            </Link>
          </div>
          <div className="mt-7 grid grid-cols-3 gap-3 sm:grid-cols-5 lg:grid-cols-9">
            {FOOD_CATEGORIES.map((category) => (
              <Link
                key={category.slug}
                href={`/explore?category=${category.slug}`}
                className="group flex flex-col items-center rounded-2xl border border-orange-100/80 bg-white p-4 shadow-sm transition hover:-translate-y-1 hover:border-orange-200 hover:shadow-warm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500"
              >
                <span className="text-3xl transition group-hover:scale-110">{category.emoji}</span>
                <span className="mt-2 text-center text-xs font-medium text-gray-700 sm:text-sm">{category.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="bg-white py-12 sm:py-14">
        <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-semibold uppercase tracking-wide text-orange-500">Craving to table</p>
            <h2 className="font-display mt-1.5 text-2xl font-bold text-gray-900 sm:text-3xl">How Potluck works</h2>
            <p className="mt-2 text-gray-600">Three steps, lah — from craving to a proper home-cooked spread.</p>
          </div>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {STEPS.map((s, i) => (
              <div key={s.title} className="group relative rounded-2xl border border-orange-100 bg-cream p-7 shadow-sm transition hover:-translate-y-1 hover:shadow-warm">
                <span className="font-display absolute right-5 top-5 text-3xl font-black text-orange-200/80">0{i + 1}</span>
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-orange-100 text-orange-600 transition group-hover:bg-orange-500 group-hover:text-white">{s.icon}</div>
                <h3 className="font-display mt-4 text-xl font-bold text-gray-900">{s.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-gray-600">{s.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <Testimonials />

      {/* Enquiry form */}
      <EnquiryForm />

      {/* From the blog (lead magnets) */}
      <HomeBlogSection />

      <SiteFooter />
    </div>
  );
}
