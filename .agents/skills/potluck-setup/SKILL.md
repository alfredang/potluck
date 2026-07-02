---
name: potluck-setup
description: >-
  Configure Potluck's third-party integrations and infrastructure — the multi-provider
  booking checkout (Stripe + PayPal + HitPay, shared by web/iOS/Android), Stripe
  Connect/subscriptions, and transactional email setup for the home-chef marketplace. Use
  when wiring up, configuring, or debugging Potluck payments, checkout, or email, or setting
  required environment variables. Triggers: "stripe", "paypal", "hitpay", "paynow",
  "checkout", "payments", "Connect", "subscription", "webhook", "payout", "orders table",
  "email setup", "transactional email", "SMTP", "Resend", "env vars for payments/email".
---

# Potluck Setup & Integrations

Runbook for Potluck's external service configuration. Read the matching reference, and follow
the repo's secrets rules: **never hardcode keys** — all credentials come from environment
variables (`.env` / Coolify), see CLAUDE.md guardrails and the `secrets` skill.

## References
- [references/checkout-providers.md](references/checkout-providers.md) — **the live checkout**:
  multi-provider (Stripe + PayPal + HitPay) booking checkout shared by web/iOS/Android —
  architecture, `orders` table migration (`pnpm --filter @homechef/web migrate:orders`),
  webhook endpoints, and the `STRIPE_*` / `PAYPAL_*` / `HITPAY_*` env vars.
- [references/stripe-setup.md](references/stripe-setup.md) — Stripe payments: account/Connect
  setup, subscription tiers, webhooks, payouts, and the required `STRIPE_*` env vars.
- [references/email-setup.md](references/email-setup.md) — transactional email configuration
  (provider, sending domain/DNS, templates, env vars).

## Context
- Hosting: Hostinger via **Coolify** (Docker) — set production secrets in Coolify, not in code.
- Money is integer **cents (SGD)**; subscription tiers: Free / Basic $10 / Pro $20 / Unlimited $30.
- The web app also reads `ENQUIRY_WEBHOOK_URL` (optional) to forward homepage enquiry/newsletter
  leads from `/api/enquiry` to Slack/CRM; if unset, leads are logged server-side.

## Do / Don't
- ✅ Keep `DATABASE_URL`, `STRIPE_*`, email creds, `ADMIN_PASSWORD` in env (`.env.example` lists them).
- ❌ No Vercel-specific config (site is on Hostinger + Coolify).
