---
name: potluck-marketing
description: >-
  Potluck's go-to-market brain — marketing strategy, launch/soft-launch planning, chef
  (supply-side) acquisition, positioning, channels, and the canonical product-marketing
  context for the Singapore home-chef marketplace (potluckhub.io). Use when planning or
  reviewing any marketing, growth, launch, GTM, campaign, social, content, or chef-recruitment
  work for Potluck — and as the shared context other marketing skills (seo-audit,
  lead-magnets, frontend-design, ui-ux-pro-max) read before tailoring their output. Triggers:
  "marketing plan", "launch plan", "go to market", "GTM", "acquire chefs", "chef recruitment",
  "growth", "campaign", "positioning", "product marketing", "soft launch", "channels".
---

# Potluck Marketing & Launch

The single source of truth for **how Potluck is positioned, marketed, and launched**. Read the
relevant reference before planning, then tailor to the specific task instead of asking generic
questions.

## What Potluck is (one line)
A two-sided **home-chef marketplace** in Singapore (scaling across SEA): home cooks list
dishes/menus + availability; diners discover chefs near them and book a home-cooked meal or
private home-dining experience. Canonical domain: value of `NEXT_PUBLIC_SITE_URL`
(e.g. https://potluckhub.io). Native iOS/Android apps live in separate repos.

## Current state (keep this honest when planning)
- Web marketing site live (Next.js, self-hosted on Hostinger via Coolify).
- 37 sample Singapore home chefs across 15 cuisines; blog with 40+ posts, ~half of which are
  **chef-spotlight lead magnets** linking to `/chef/{slug}`.
- Lead capture surfaces: homepage enquiry form + newsletter (`/api/enquiry`), site-wide
  WhatsApp widget, end-of-post email CTAs. WhatsApp Business: **+65 9048 0277**.
- Two funnels: **acquire diners** (primary) and **recruit home chefs** (supply growth).

## References (read the one that fits the task)
- [references/product-marketing.md](references/product-marketing.md) — **canonical context**:
  audiences, SEO goals, priority keywords, page-type intents, lead-magnet strategy, brand/design
  tokens. This is what `seo-audit`, `lead-magnets`, `frontend-design`, and `ui-ux-pro-max` read.
- [references/launch-plan.md](references/launch-plan.md) — soft-launch goals, timeline, channels,
  team, app status, revenue model, next steps.
- [references/chef-acquisition.md](references/chef-acquisition.md) — supply-side playbook:
  recruiting home chefs (offer, messaging, phased plan, channels).

## How to use
1. For **strategy/launch/growth** asks → start from `launch-plan.md` + `chef-acquisition.md`,
   then produce a concrete, dated plan (convert relative dates to absolute; today's market is SG).
2. For **SEO / lead-magnet / design** asks → `product-marketing.md` is the shared brief; defer
   tactical depth to the `seo-audit`, `lead-magnets`, and `frontend-design`/`ui-ux-pro-max` skills.
3. Keep recommendations Singapore-local (en-SG, SGD, neighbourhoods, hawker/kampung heritage) and
   on-brand (warm, communal, appetite-forward; primary orange `#f97316`; colorful POTLUCKHUB mark).

## Out of scope / do NOT recommend
- Vercel tooling/analytics (site is on Hostinger + Coolify).
- App-store ASO / React Native work → see the **app-store-release** skill (native apps are in
  separate repos).
