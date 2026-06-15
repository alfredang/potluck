# Product Marketing Context — Potluck

> Read by the `seo-audit` (and related marketing) skills before auditing, so they
> tailor recommendations to this site instead of asking generic questions.

## What Potluck is
Potluck is a **two-sided home-chef marketplace** based in Singapore. Talented home
cooks ("home chefs") list dishes/menus and availability; diners discover chefs near
them, browse menus, and book a home-cooked meal or private home-dining experience.
It is *not* a restaurant, a recipe blog, or a grocery-delivery service.

- **Site type:** Marketplace (two-sided: chefs + diners) + content/blog.
- **Stack:** Next.js 15 (App Router) in `apps/web`, server-rendered, Postgres (Drizzle).
- **Hosting:** Hostinger via Coolify (self-hosted; **not** Vercel).
- **Primary market / locale:** Singapore, `en-SG`.
- **Canonical domain:** value of `NEXT_PUBLIC_SITE_URL` (e.g. https://potluckhub.io).
- **Native apps:** separate native iOS & Android apps exist (submitted to the App
  Store / Play Store). This repo is the **marketing + web** surface only.

## Primary SEO business goals (in priority order)
1. **Acquire diners** searching for home-cooked / private dining near them in Singapore.
2. **Recruit home chefs** (the "Become a Chef" funnel) — supply side growth.
3. **Build topical authority & long-tail traffic** through the blog (recipes, chef
   stories, food culture, hosting tips).

## Target audiences
- **Diners:** Singapore residents wanting authentic, affordable, home-cooked meals,
  private dining, halal/vegetarian options, or a unique food experience.
- **Aspiring home chefs:** home cooks who want to earn from their cooking.

## Priority keywords & topics
- Transactional / local: "home chef Singapore", "private dining Singapore",
  "home cooked food Singapore", "book a home chef", "personal chef Singapore",
  "halal home chef", "Peranakan / Nyonya home cook", cuisine + location combos
  (e.g. "Korean home chef Tanjong Pagar").
- Supply side: "become a home chef Singapore", "sell home cooked food Singapore",
  "earn cooking from home".
- Informational (blog): cuisine guides, recipes, "how to host a dinner", food culture,
  hawker-at-home, festive cooking, meal prep.

## Key page types & their SEO intent
- `/` — brand + primary diner conversion.
- `/explore` — chef discovery (category/cuisine/location facets). High commercial intent.
- `/chef/[id]` — individual chef profiles. **Most important long-tail / local pages.**
  Should carry `Restaurant`/`Person` structured data, ratings, menus, location.
- `/become-chef`, `/pricing` — supply-side conversion.
- `/blog`, `/blog/[slug]`, `/blog/category/[slug]` — topical authority; `BlogPosting` JSON-LD.
- `/admin/*` — **must be noindex + disallowed** in robots (private CMS).

## Structured data already in place (verify, don't duplicate)
- `Organization` JSON-LD in the root layout (`app/layout.tsx`).
- `Restaurant` + `Menu`/`MenuItem` JSON-LD on chef pages (`app/chef/[id]/page.tsx`).
- `BlogPosting` JSON-LD on blog posts (`app/blog/[slug]/page.tsx`).
- `robots.ts` (disallows `/admin`, `/api`) and `sitemap.ts` (static + chef + blog URLs).

## Audit emphasis for this site
- **Local SEO**: locations are Singapore neighbourhoods (Tiong Bahru, Geylang Serai,
  etc.). Recommend location/cuisine landing pages and `LocalBusiness`/`Restaurant` data.
- **Marketplace duplication / thin content**: watch for thin chef/menu pages, faceted
  `/explore` filter URLs that could create crawl bloat or duplicate content.
- **Two distinct funnels** (diner vs chef) — keep their intent and internal linking clean.
- **Trust signals**: reviews/ratings, verification badges — surface for E-E-A-T.
- **`en-SG` locale**, SGD currency, and Singapore-specific spelling/terms.
- Image SEO: chef/dish photos need descriptive `alt` text and reasonable sizes.

## Out of scope / do NOT recommend
- Vercel-specific tooling, analytics, or `vercel.json` (site is on Hostinger+Coolify).
- React Native / Expo / app-store ASO (handled in the separate native app repos).
