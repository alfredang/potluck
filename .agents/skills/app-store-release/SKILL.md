---
name: app-store-release
description: >-
  Release the Potluck native mobile apps — Apple App Store + Google Play submission,
  store-listing metadata, screenshots, review/compliance, and iOS/Android deployment
  (Expo/EAS) steps. Use when submitting, updating, or troubleshooting a Potluck app-store /
  Play-store release or its listing. Triggers: "app store", "app store connect", "play store",
  "google play", "submit the app", "app review", "store listing", "screenshots", "ASO",
  "TestFlight", "EAS submit", "ios deployment", "android deployment".
---

# Potluck App Store Release

How to ship and update the **native iOS/Android apps** for Potluck (PotLuckHub). The native
apps live in **separate repositories** (not this web repo) — this skill is the release/runbook
reference. Use the canonical web domain from `NEXT_PUBLIC_SITE_URL` (https://potluckhub.io) for
Support/Privacy URLs in listings.

## References
- [references/submission-guide.md](references/submission-guide.md) — step-by-step App Store
  Connect submission: screenshots, metadata, pricing, review info, submit.
- [references/ios-deployment.md](references/ios-deployment.md) — full iOS build/deploy guide
  (Expo/EAS, certificates, TestFlight).
- [references/android-deployment.md](references/android-deployment.md) — full Android
  build/deploy guide (Google Play, signing, release tracks).

## Quick facts
- App name: **PotLuckHub** · Subtitle: "Home Cooked Meals" · Price: Free
- Support URL: https://potluckhub.io · Privacy: https://potluckhub.io/privacy
- App-review contact: hello@potluckhub.io
- Store listings should match brand: Singapore home-chef marketplace, warm/appetite-forward.

## Cautions
- Native code is in the separate app repos — **do not** re-add Expo/EAS/React Native to this
  web repo (see AGENTS.md guardrails).
- Don't commit signing secrets / API keys — keep them in the app repos' secrets / EAS.
- Keep listing copy and screenshots in sync with the current app + web brand (POTLUCKHUB mark).
