# Potluck

[![Next.js](https://img.shields.io/badge/Next.js-15.5-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-3178C6?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.0-38B2AC?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-17-336791?style=flat-square&logo=postgresql)](https://www.postgresql.org/)
[![Payments](https://img.shields.io/badge/Payments-Stripe%20·%20PayPal%20·%20HitPay-635BFF?style=flat-square&logo=stripe&logoColor=white)](PAYMENT-SETUP.md)
[![Coolify](https://img.shields.io/badge/Self--hosted-Coolify-8B5CF6?style=flat-square&logo=docker&logoColor=white)](https://coolify.io/)
[![App Store](https://img.shields.io/badge/App%20Store-Ready-0D96F6?style=flat-square&logo=app-store)](https://developer.apple.com/)
[![Play Store](https://img.shields.io/badge/Play%20Store-Ready-414141?style=flat-square&logo=google-play)](https://play.google.com/)

A marketplace platform connecting home chefs with food lovers in Singapore. Discover authentic home-cooked meals from talented local chefs and book unique dining experiences in the comfort of their homes.

## Live Demo

**[https://potluckhub.io](https://potluckhub.io)**

![Potluck — home screen](screenshot.png)

## Get the App

Potluck is also available as native mobile apps — book a home chef on the go:

[![Download on the App Store](https://img.shields.io/badge/Download-App%20Store-0D96F6?style=for-the-badge&logo=apple&logoColor=white)](https://apps.apple.com/app/id6759842391)
[![Get it on Google Play](https://img.shields.io/badge/Get%20it%20on-Google%20Play-414141?style=for-the-badge&logo=google-play&logoColor=white)](https://play.google.com/store/apps/details?id=io.potluckhub.app)

- **iOS (App Store):** https://apps.apple.com/app/id6759842391
- **Android (Google Play):** https://play.google.com/store/apps/details?id=io.potluckhub.app

## About

Potluck solves the problem of finding authentic, home-cooked meals by connecting passionate home chefs with people who want to experience genuine local cuisine. Whether you're craving Peranakan, Malay, Japanese, Korean, or Indian food, Potluck lets you book a dining experience directly with a home chef in Singapore.

### Key Features

- **Explore Chefs** - Browse home chefs by cuisine type, location, ratings, and price range
- **Search & Filter** - Find exactly what you're looking for with real-time search and category filters
- **Book Dining Experiences** - Select from chef's available dates and time slots
- **Chef Profiles** - View detailed menus, reviews, ratings, and social media links
- **Booking System** - Request bookings with guest count and special dietary requirements
- **Multi-Provider Checkout** - Pay by credit/debit card (Stripe), PayPal, or PayNow/card
  (HitPay) — one shared checkout backend used by the website and both mobile apps, with
  server-side pricing (menu × guests + 4% platform fee, SGD) and signature-verified webhooks
- **Chef Verification (site visit)** - Every Verified badge is earned through an in-person
  kitchen visit; the process is public at [/chef-verification](https://potluckhub.io/chef-verification)
- **Featured & Verified Badges** - Trust badges on explore cards and chef pages; featured
  chefs surface first, on the website and in both mobile apps
- **Guest Reviews** - Write and read chef reviews (shared `/api/reviews` endpoint across web,
  iOS and Android, with verified-booking tagging and admin moderation)
- **Admin CMS** - Password-protected `/admin` for blog posts, categories, checkout orders, and
  review moderation
- **Multi-tier Pricing** - Free, Basic (S$10/mo), Pro (S$20/mo), and Unlimited (S$30/mo)
  subscription plans for chefs

## Tech Stack

### Frontend
- **[Next.js 15](https://nextjs.org/)** - React framework with App Router
- **[React 19](https://react.dev/)** - UI library with latest features
- **[Tailwind CSS 4](https://tailwindcss.com/)** - Utility-first CSS framework
- **[TypeScript](https://www.typescriptlang.org/)** - Type-safe JavaScript

### Backend
- **[Fastify](https://fastify.io/)** - Fast Node.js web framework
- **[Drizzle ORM](https://orm.drizzle.team/)** - TypeScript ORM
- **[PostgreSQL](https://www.postgresql.org/)** - Relational database

> The native iOS & Android apps live in **separate repositories** and are already on the
> App Store / Play Store. This repo contains the web, API, and shared packages only.

### Infrastructure
- **[Turborepo](https://turbo.build/)** - Monorepo build system
- **[pnpm](https://pnpm.io/)** - Fast, disk space efficient package manager
- **[Coolify](https://coolify.io/)** - Self-hosted deployment (on Hostinger, via Docker)

## Project Structure

```
potluck/
├── apps/
│   ├── web/              # Next.js frontend application
│   │   ├── app/          # App Router pages
│   │   └── ...
│   └── api/              # Fastify backend API
│       ├── src/
│       │   ├── db/       # Database schema & migrations
│       │   └── routes/   # API endpoints
│       └── ...
├── packages/
│   └── shared/           # Shared types, constants, utilities
├── turbo.json            # Turborepo configuration
└── package.json          # Root workspace config
```

## Getting Started

### Prerequisites

- **Node.js** >= 20.0.0
- **pnpm** >= 9.0.0

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/alfredang/potluck.git
   cd potluck
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Set up environment variables**
   ```bash
   # Single example env file at the repo root covers web + API
   cp .env.example .env
   ```

4. **Configure environment variables** — open `.env` and set at minimum:
   ```env
   DATABASE_URL=postgresql://user:password@host/database
   NEXT_PUBLIC_SITE_URL=http://localhost:3000
   ADMIN_PASSWORD=choose-a-strong-password
   ```
   Payment provider keys (`STRIPE_*`, `PAYPAL_*`, `HITPAY_*`) are optional in
   development — see **[PAYMENT-SETUP.md](PAYMENT-SETUP.md)** for the full
   step-by-step payment configuration guide.

5. **Set up the database**
   ```bash
   # Push schema to database
   pnpm db:push

   # Seed sample data (optional)
   pnpm db:seed
   ```

6. **Start development servers**
   ```bash
   pnpm dev
   ```

   This starts:
   - Web app at `http://localhost:3000`
   - API at `http://localhost:3001`

## Available Scripts

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start all apps in development mode |
| `pnpm build` | Build all apps for production |
| `pnpm lint` | Run ESLint on all packages |
| `pnpm typecheck` | Run TypeScript type checking |
| `pnpm db:push` | Push database schema changes |
| `pnpm db:seed` | Seed database with sample data |
| `pnpm db:studio` | Open Drizzle Studio |
| `pnpm --filter @homechef/web seed:blog` | Seed blog categories + posts |
| `pnpm --filter @homechef/web migrate:orders` | Create the checkout `orders` table (idempotent; the app also self-migrates on first checkout) |

## Deployment

### Deploy with Coolify

The web app and API are self-hosted on **Coolify** (Docker, on Hostinger). Each app
ships with a `Dockerfile`; Coolify builds and deploys automatically on push to `main`.

1. In Coolify, create an application from this Git repository for each service
   (`apps/web` and `apps/api`), using the included `Dockerfile`.
2. Configure the environment variables below in each service.
3. Push to `main` — Coolify rebuilds and redeploys.

### Environment Variables

Set these in each Coolify service (full list with comments in [`.env.example`](.env.example)):

- `DATABASE_URL` - PostgreSQL connection string (production uses a Coolify-hosted Postgres 17)
- `NEXT_PUBLIC_SITE_URL` - Canonical site URL (drives SEO tags and payment redirect URLs)
- `ADMIN_PASSWORD` - Access to the `/admin` CMS and orders dashboard
- `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET` - Card payments
- `PAYPAL_CLIENT_ID`, `PAYPAL_CLIENT_SECRET`, `PAYPAL_WEBHOOK_ID`, `PAYPAL_MODE` - PayPal
- `HITPAY_API_KEY`, `HITPAY_SALT`, `HITPAY_MODE` - PayNow / HitPay
- `JWT_ACCESS_SECRET`, `JWT_REFRESH_SECRET` - Auth tokens (API)

### Payments

The production payment setup (Stripe + PayPal + HitPay accounts, webhooks, test
cards, go-live checklist) is documented step-by-step in
**[PAYMENT-SETUP.md](PAYMENT-SETUP.md)**. All three platforms — web, iOS, and
Android — share the same checkout endpoints (`/api/checkout`), so payments are
configured once for everything.

### Database Setup

1. Provision a PostgreSQL database (any provider, or self-hosted).
2. Copy the connection string to `DATABASE_URL`.
3. Run `pnpm db:push` to create tables (the checkout `orders` table also
   self-creates on first use).

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT
