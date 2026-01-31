---
layout: default
title: Home
---

# Potluck Documentation

Welcome to the Potluck documentation. This guide covers everything you need to deploy and configure the Potluck home chef marketplace platform.

## Quick Links

### Mobile App Deployment
- [iOS Deployment Guide](ios-deployment) - Deploy to Apple App Store
- [Android Deployment Guide](android-deployment) - Deploy to Google Play Store

### Backend Configuration
- [Stripe Payment Setup](stripe-setup) - Configure payment processing
- [Email Notification Setup](email-setup) - Set up transactional emails

### Web Deployment
- [Vercel Deployment](vercel-deployment) - Deploy the web app to Vercel

---

## Overview

Potluck is a marketplace platform connecting home chefs with food lovers in Singapore. The platform consists of:

- **Web App** - Next.js 15 application deployed on Vercel
- **Mobile App** - React Native app for iOS and Android
- **API** - Fastify backend with PostgreSQL database

## Tech Stack

| Component | Technology |
|-----------|------------|
| Web Frontend | Next.js 15, React 19, Tailwind CSS 4 |
| Mobile App | React Native, Expo 52 |
| Backend | Fastify, Drizzle ORM |
| Database | Neon PostgreSQL |
| Payments | Stripe |
| Email | SendGrid / AWS SES |
| Hosting | Vercel (Web), EAS (Mobile) |

## Getting Started

1. Clone the repository
2. Install dependencies with `pnpm install`
3. Set up environment variables
4. Run `pnpm dev` to start development servers

See the [README](https://github.com/alfredang/potluck) for detailed setup instructions.
