# AGENTS.md

Guidance for Codex (and other agents) working in this repository.

## What this is

**Potluck** is a **two-sided home-chef marketplace**: home cooks ("home chefs") list
dishes/menus and availability; diners discover chefs near them, browse menus, and book a
home-cooked meal or private home-dining experience. It is **not** a restaurant, recipe blog,
or grocery-delivery app.

- **Primary market:** Singapore today, designed to scale **across the region (SEA)** — the
  data model, cuisines, and locale handling assume multi-city / multi-cuisine growth.
- **Canonical domain:** value of `NEXT_PUBLIC_SITE_URL` (e.g. `https://potluckhub.io`).
- **Native apps:** the iOS & Android apps live in **separate repositories** (already
  submitted to the App Store / Play Store). **This repo has no mobile/React Native code** —
  do not re-add Expo, EAS, or `react-native`.
- **Hosting:** self-hosted on **Hostinger via Coolify** (Docker). **Not Vercel** — do not add
  `vercel.json`, Vercel analytics, or Vercel-specific APIs.

## Monorepo layout

pnpm workspaces + Turborepo. Packages live under `apps/*` and `packages/*`.

- `apps/web` — **Next.js 15 (App Router)** marketing site + public app + blog + admin CMS.
  Tailwind CSS v4. This is the main surface you will work in.
- `apps/api` — **Fastify** API (Drizzle ORM, Postgres). Owns the **canonical DB schema**.
- `packages/shared` — shared TS types, Zod schemas, constants (incl. `FOOD_CATEGORIES`,
  subscription tiers). Consumed by web as `@homechef/shared`. Exports TS source directly
  (no build step — `tsx`/Next transpiles it).

## Commands

Run from the repo root unless noted. Package manager is **pnpm** (`packageManager` pinned).

```bash
pnpm install                              # install all workspaces
pnpm dev                                  # turbo dev (all apps)
pnpm --filter @homechef/web dev           # web only (http://localhost:3000)
pnpm --filter @homechef/web build         # production build (output: standalone)
pnpm --filter @homechef/web typecheck     # tsc --noEmit for web
pnpm --filter @homechef/web seed:blog     # seed 25 blog categories + 20 posts (needs DATABASE_URL)
pnpm db:push                              # drizzle-kit push (api) — create/sync DB tables
pnpm db:studio                            # drizzle studio
```

Build/lint note: `apps/web/next.config.ts` sets `typescript.ignoreBuildErrors` and
`eslint.ignoreDuringBuilds` to **true** so deploys don't break on lint/type noise. Still run
`typecheck` yourself before declaring something done — the build won't catch type errors for you.

## Data architecture (important)

There are **two data sources** by design:

1. **Chefs & menus = static data** in `apps/web/lib/chefs-data.ts` (`CHEFS`, `getChef`,
   `getAllMenuIds`). 20 chefs, ~34 menu items. Rendered by `/explore` and `/chef/[id]`.
   Chosen so the marketing site is reliable even if the DB is briefly unavailable.
   - When adding chefs/menus, **keep menu `id`s stable** — they are the like-counter key.
2. **Blog + likes = Postgres** via Drizzle. The web app talks to the DB directly through
   `apps/web/lib/db.ts` (re-exports schema from `apps/web/lib/schema.ts`, which re-exports
   the canonical schema in `apps/api/src/db/schema/*`).

DB tables added for the web surface (defined in `apps/api/src/db/schema/blog.ts`):
- `blog_categories`, `blog_posts` (status `draft|published`, `featured`, `like_count`,
  `view_count`, SEO fields), `menu_likes` (`menu_id` → counter for static menu likes).
- `orders` (`apps/api/src/db/schema/orders.ts`) — the multi-provider checkout. `menu_id` is
  text so it accepts both static slugs and DB menu uuids. Create it per environment with
  `pnpm --filter @homechef/web migrate:orders` (idempotent) or `pnpm db:push`.

Query helpers live in `apps/web/lib/blog.ts`. Always go through these rather than re-writing
Drizzle queries in pages.

## Key features & where they live

- **Blog (public):** `app/blog/page.tsx` (featured + latest + category chips),
  `app/blog/[slug]/page.tsx` (detail + JSON-LD + like + share), `app/blog/category/[slug]`.
- **Blog CMS (admin):** `app/admin/*` — dashboard, posts (list + `[id]` editor incl. `new`),
  categories. Server actions in `actions.ts` files. Auth: single `ADMIN_PASSWORD` env →
  signed cookie (`lib/admin-auth.ts`) → guarded by `middleware.ts` (`/admin/:path*`).
- **Checkout (Stripe + PayPal + HitPay):** the booking modal in
  `app/chef/[id]/ChefPageClient.tsx` → `POST app/api/checkout` (server-side pricing:
  menu × guests + 4% fee, creates `orders` row + hosted-payment session) → provider page →
  webhooks `app/api/webhooks/{stripe,paypal,hitpay}` + reconciliation on
  `GET app/api/checkout/[orderId]` and `app/checkout/result/page.tsx`. Provider clients in
  `lib/payments/*`, order service in `lib/orders.ts`, admin view at `/admin/orders`.
  **The iOS/Android apps use these same endpoints** (they poll the status route and open the
  hosted page in an in-app browser) — don't change the request/response shapes without
  updating both apps. Setup runbook: `potluck-setup` skill → `references/checkout-providers.md`.
- **Reviews (same shared-endpoint pattern as checkout):** shared `GET/POST app/api/reviews`
  (used by web + both mobile apps; accepts slug or uuid chef ids), backed by `chef_reviews`
  (`apps/api/src/db/schema/chef-reviews.ts`, self-migrating via `lib/reviews.ts`). For uuid
  chefs the GET merges the canonical `reviews` table. UI: `app/components/ChefReviews.tsx`
  (list + write form) on chef pages; moderation at `/admin/reviews` (hide/delete).
- **Chef verification & featured:** static chefs carry `isVerified` (site-visit verified) and
  `isFeatured` flags in `chefs-data.ts`; badges in `app/components/ChefBadges.tsx` render on
  `/explore` cards and chef pages; the process is explained at `/chef-verification` (in the
  sitemap). Featured chefs sort first under the default "recommended" sort.
- **Likes:** generic `app/components/LikeButton.tsx` (optimistic + `localStorage`) backed by
  `app/api/menus/like/route.ts` (static menus) and `app/api/blog/like/route.ts` (posts).
- **Social share:** `app/components/ShareButtons.tsx` (LinkedIn/X/Facebook/WhatsApp/Email/copy).
- **Shared chrome:** `app/components/SiteNav.tsx`, `SiteFooter.tsx`, `Logo.tsx`/`LogoMark`,
  `PostCard.tsx`. The brand logo (spoon + arches) must stay in sync with the native app icon.

## Food categories & regional scope

Canonical cuisines are `FOOD_CATEGORIES` in `packages/shared/src/constants/index.ts`
(chinese, western, thai, japanese, korean, malay, indian, halal, vegetarian). When expanding
regionally, **add new cuisines/locations here and to `chefs-data.ts`**, and make sure they
flow into `/explore` filters, chef JSON-LD `servesCuisine`, and the sitemap. Cuisine + city
combinations are the highest-value long-tail SEO surface (e.g. "Korean home chef Tanjong Pagar").

## SEO conventions (this site is SEO-critical)

- `NEXT_PUBLIC_SITE_URL` drives canonical URLs, OG tags, `robots.ts`, and `sitemap.ts`. Never
  hardcode the domain; read from this env (fallback constant only).
- **Metadata:** root defaults + title template in `app/layout.tsx` (locale `en-SG`). Every
  significant route exports `generateMetadata` (or `metadata`) with `title`, `description`,
  `alternates.canonical`, and OpenGraph/Twitter. Follow the existing chef/blog examples.
- **Structured data (JSON-LD):** `Organization` (layout), `Restaurant` + `Menu`/`MenuItem`
  (chef pages), `BlogPosting` (posts). Add matching JSON-LD when you add new entity pages.
- **Crawl control:** `app/robots.ts` disallows `/admin` and `/api`; `app/sitemap.ts` lists
  static routes + every chef + published posts + categories. Keep both updated when adding routes.
- `/admin/*` and other private pages must set `robots: { index: false }`.
- The `seo-audit` skill is installed (`.agents/skills/seo-audit`) and tailored via the shared
  context at `.agents/skills/potluck-marketing/references/product-marketing.md`. Update that
  context file — not generic assumptions — when the marketplace scope changes.

## Project skills (this repo is skill-centric)

Project knowledge lives as **skills** under `.agents/skills/` (not loose docs). Each has a
`SKILL.md` + a `references/` folder. Invoke the matching skill (and read its references)
instead of hunting for scattered markdown:

- **`potluck-marketing`** — marketing, soft-launch/GTM, chef acquisition, and the canonical
  `product-marketing.md` (audiences, SEO goals, keywords, lead-magnet strategy, brand tokens)
  that `seo-audit`, `lead-magnets`, `frontend-design`, and `ui-ux-pro-max` read.
- **`app-store-release`** — App Store / Play Store submission, store listing, and iOS/Android
  (Expo/EAS) deployment runbooks. (Native apps live in separate repos — see Guardrails.)
- **`potluck-setup`** — Stripe payments and transactional email configuration + env vars.
- **`seo-audit`**, **`lead-magnets`**, **`frontend-design`**, **`ui-ux-pro-max`** — installed,
  Potluck-tailored design/marketing skills.

When project facts change (scope, launch, integrations), update the relevant skill's
`references/*`, not ad-hoc files at the repo root.

## Conventions

- **Imports:** relative paths (the repo does **not** use a `@/` alias).
- **Icons:** inline SVG (no `react-icons` / icon deps).
- **Blog content:** stored and rendered as **HTML** (`contentHtml`, via `dangerouslySetInnerHTML`
  into `.blog-content`, styled in `globals.css`). The admin editor is a plain HTML textarea.
- **Money:** menu prices are integer **cents (SGD)**; divide by 100 for display.
- **Server vs client:** keep DB access and `generateMetadata` in server components; interactive
  bits (booking modal, like button, share) are client components. The chef page is split into a
  server `page.tsx` (SEO/JSON-LD) + `ChefPageClient.tsx` (interactivity) for this reason.
- Match the surrounding Tailwind/utility style; primary brand colour is orange (`orange-500`).

## Guardrails

- Don't reintroduce mobile (Expo/EAS/React Native) or Vercel config — both were intentionally removed.
- Don't hardcode secrets. `ADMIN_PASSWORD`, `DATABASE_URL`, Stripe keys, etc. come from env
  (see `.env.example`). Set them in Coolify for production.
- When changing the blog schema, update `apps/api/src/db/schema/blog.ts`, the re-export in
  `apps/web/lib/schema.ts`, and the `CREATE TABLE` safety block in `scripts/seed-blog.ts`.
