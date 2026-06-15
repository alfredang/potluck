# Potluck

[![Next.js](https://img.shields.io/badge/Next.js-15.5-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-3178C6?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.0-38B2AC?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Neon-336791?style=flat-square&logo=postgresql)](https://neon.tech/)
[![Coolify](https://img.shields.io/badge/Deployed%20on-Coolify-8B5CF6?style=flat-square&logo=docker)](https://coolify.io/)
[![App Store](https://img.shields.io/badge/App%20Store-Ready-0D96F6?style=flat-square&logo=app-store)](https://developer.apple.com/)
[![Play Store](https://img.shields.io/badge/Play%20Store-Ready-414141?style=flat-square&logo=google-play)](https://play.google.com/)

A marketplace platform connecting home chefs with food lovers in Singapore. Discover authentic home-cooked meals from talented local chefs and book unique dining experiences in the comfort of their homes.

## Live Demo

**[https://potluckhub.io](https://potluckhub.io)**

## About

Potluck solves the problem of finding authentic, home-cooked meals by connecting passionate home chefs with people who want to experience genuine local cuisine. Whether you're craving Peranakan, Malay, Japanese, Korean, or Indian food, Potluck lets you book a dining experience directly with a home chef in Singapore.

### Key Features

- **Explore Chefs** - Browse home chefs by cuisine type, location, ratings, and price range
- **Search & Filter** - Find exactly what you're looking for with real-time search and category filters
- **Book Dining Experiences** - Select from chef's available dates and time slots
- **Chef Profiles** - View detailed menus, reviews, ratings, and social media links
- **Booking System** - Request bookings with guest count and special dietary requirements
- **Multi-tier Pricing** - Free, Pro ($19/mo), and Unlimited ($49/mo) subscription plans for chefs

## Tech Stack

### Frontend
- **[Next.js 15](https://nextjs.org/)** - React framework with App Router
- **[React 19](https://react.dev/)** - UI library with latest features
- **[Tailwind CSS 4](https://tailwindcss.com/)** - Utility-first CSS framework
- **[TypeScript](https://www.typescriptlang.org/)** - Type-safe JavaScript

> **Note:** The native iOS and Android apps are maintained in **separate repositories**
> (already submitted to the App Store and Play Store). This repository contains the
> **web platform + marketing site + API** only.

### Backend
- **[Fastify](https://fastify.io/)** - Fast Node.js web framework
- **[Drizzle ORM](https://orm.drizzle.team/)** - TypeScript ORM
- **[Neon PostgreSQL](https://neon.tech/)** - Serverless Postgres database

### Infrastructure
- **[Turborepo](https://turbo.build/)** - Monorepo build system
- **[pnpm](https://pnpm.io/)** - Fast, disk space efficient package manager
- **[Hostinger](https://www.hostinger.com/) + [Coolify](https://coolify.io/)** - Self-hosted Docker deployment platform

## Project Structure

```
potluck/
├── apps/
│   ├── web/              # Next.js frontend application
│   │   ├── app/          # App Router pages (incl. /blog and /admin CMS)
│   │   ├── lib/          # DB, blog queries, chef data, admin auth
│   │   └── scripts/      # seed-blog.ts
│   └── api/              # Fastify backend API
│       ├── src/
│       │   ├── db/       # Database schema & migrations
│       │   └── routes/   # API endpoints
│       └── ...
├── packages/
│   └── shared/           # Shared types, constants, utilities
├── .github/
│   └── workflows/        # CI/CD workflows
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
   # Copy example env files
   cp apps/web/.env.example apps/web/.env
   cp apps/api/.env.example apps/api/.env
   ```

4. **Configure environment variables**

   **Web App** (`apps/web/.env`):
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:3001
   ```

   **API** (`apps/api/.env`):
   ```env
   DATABASE_URL=postgresql://user:password@host/database
   JWT_SECRET=your-secret-key
   ```

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

## Deployment

### Deploy with Coolify (Hostinger)

The web app is self-hosted on [Hostinger](https://www.hostinger.com/) using [Coolify](https://coolify.io/) and deploys automatically from this Git repository.

1. **In Coolify, create a new Application** from the `alfredang/potluck` Git repository (branch `main`).

2. **Build settings**
   - Build Pack: `Dockerfile`
   - Dockerfile location: `apps/web/Dockerfile`
   - Domain: `potluckhub.io`

3. **Deploy** — Coolify builds the Docker image and deploys on each push to `main`. You can also trigger a manual redeploy from the Coolify dashboard.

### Environment Variables on Coolify

Set these environment variables in your Coolify application settings:

- `DATABASE_URL` - Your PostgreSQL connection string
- `JWT_SECRET` - Secret key for JWT tokens

### Database Setup (Neon)

1. Create a free account at [neon.tech](https://neon.tech)
2. Create a new project
3. Copy the connection string to `DATABASE_URL`
4. Run `pnpm db:push` to create tables, then `pnpm --filter @homechef/web seed:blog` to seed the blog

### Blog CMS

The blog and categories are managed from the built-in CMS at **`/admin`**, protected by the
`ADMIN_PASSWORD` environment variable. Set a strong value in Coolify before going live.

> **Native apps:** the iOS and Android apps are maintained in separate repositories and have
> already been submitted to the App Store and Play Store. This repo does not contain mobile code.

## Documentation

For detailed guides, visit our **[Documentation Site](https://alfredang.github.io/potluck/)**:

- [iOS Deployment Guide](https://alfredang.github.io/potluck/ios-deployment)
- [Android Deployment Guide](https://alfredang.github.io/potluck/android-deployment)
- [Stripe Payment Setup](https://alfredang.github.io/potluck/stripe-setup)
- [Email Notification Setup](https://alfredang.github.io/potluck/email-setup)

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT
