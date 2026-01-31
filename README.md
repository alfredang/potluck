# Potluck

[![Next.js](https://img.shields.io/badge/Next.js-15.5-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react)](https://react.dev/)
[![React Native](https://img.shields.io/badge/React%20Native-0.76-61DAFB?style=flat-square&logo=react)](https://reactnative.dev/)
[![Expo](https://img.shields.io/badge/Expo-52-000020?style=flat-square&logo=expo)](https://expo.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-3178C6?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.0-38B2AC?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Neon-336791?style=flat-square&logo=postgresql)](https://neon.tech/)
[![Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?style=flat-square&logo=vercel)](https://vercel.com/)
[![App Store](https://img.shields.io/badge/App%20Store-Ready-0D96F6?style=flat-square&logo=app-store)](https://developer.apple.com/)
[![Play Store](https://img.shields.io/badge/Play%20Store-Ready-414141?style=flat-square&logo=google-play)](https://play.google.com/)

A marketplace platform connecting home chefs with food lovers in Singapore. Discover authentic home-cooked meals from talented local chefs and book unique dining experiences in the comfort of their homes.

## Live Demo

**[https://potluck-ochre.vercel.app](https://potluck-ochre.vercel.app)**

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

### Mobile App
- **[React Native](https://reactnative.dev/)** - Cross-platform mobile framework
- **[Expo](https://expo.dev/)** - React Native development platform
- **[React Navigation](https://reactnavigation.org/)** - Native navigation

### Backend
- **[Fastify](https://fastify.io/)** - Fast Node.js web framework
- **[Drizzle ORM](https://orm.drizzle.team/)** - TypeScript ORM
- **[Neon PostgreSQL](https://neon.tech/)** - Serverless Postgres database

### Infrastructure
- **[Turborepo](https://turbo.build/)** - Monorepo build system
- **[pnpm](https://pnpm.io/)** - Fast, disk space efficient package manager
- **[Vercel](https://vercel.com/)** - Deployment platform

## Project Structure

```
potluck/
├── apps/
│   ├── web/              # Next.js frontend application
│   │   ├── app/          # App Router pages
│   │   └── ...
│   ├── mobile/           # React Native mobile app (iOS & Android)
│   │   ├── src/
│   │   │   ├── screens/  # App screens
│   │   │   ├── navigation/
│   │   │   └── components/
│   │   ├── app.json      # Expo configuration
│   │   └── eas.json      # EAS Build configuration
│   └── api/              # Fastify backend API
│       ├── src/
│       │   ├── db/       # Database schema & migrations
│       │   └── routes/   # API endpoints
│       └── ...
├── packages/
│   └── shared/           # Shared types, constants, utilities
├── .github/
│   └── workflows/        # CI/CD workflows for web & mobile
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

### Deploy to Vercel

1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel**
   ```bash
   vercel login
   ```

3. **Deploy**
   ```bash
   vercel --prod
   ```

### Environment Variables on Vercel

Set these environment variables in your Vercel project settings:

- `DATABASE_URL` - Your Neon PostgreSQL connection string
- `JWT_SECRET` - Secret key for JWT tokens

### Database Setup (Neon)

1. Create a free account at [neon.tech](https://neon.tech)
2. Create a new project
3. Copy the connection string to `DATABASE_URL`
4. Run `pnpm db:push` to create tables

## Mobile App

The Potluck mobile app is built with React Native and Expo, providing native iOS and Android experiences.

### Mobile App Setup

```bash
# Navigate to mobile app
cd apps/mobile

# Install dependencies
pnpm install

# Start development server
pnpm start

# Run on iOS simulator
pnpm ios

# Run on Android emulator
pnpm android
```

### Mobile App Deployment

See the detailed deployment guide: **[Mobile Deployment Guide](apps/mobile/DEPLOYMENT.md)**

Quick commands:
```bash
# Build for iOS
eas build --platform ios --profile production

# Build for Android
eas build --platform android --profile production

# Submit to App Store
eas submit --platform ios --latest

# Submit to Play Store
eas submit --platform android --latest
```

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
