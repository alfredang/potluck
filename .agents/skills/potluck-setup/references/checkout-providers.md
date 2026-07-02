# Multi-Provider Checkout (Stripe + PayPal + HitPay)

How Potluck's production checkout works and how to configure each provider.
All three platforms (web, iOS, Android) pay through the **same backend**: the
Next.js route handlers on the marketing site.

## Architecture

```
web BookingModal ─┐
iOS app ──────────┼─► POST https://<site>/api/checkout   (creates `orders` row,
Android app ──────┘        returns hosted-payment redirectUrl)
                              │
        user pays on the provider's hosted page (Stripe Checkout /
        PayPal approval / HitPay PayNow+card)
                              │
   provider webhook ─► /api/webhooks/{stripe|paypal|hitpay}  (signature-verified,
                        idempotent: pending_payment → paid/failed)
                              │
   customer lands on /checkout/result?order=…  (re-verifies with the provider —
   payments settle even if a webhook is delayed)
   mobile apps poll GET /api/checkout/{orderId} every 2 s (same reconciliation)
```

- **Pricing is always server-side**: `menu price × guests + 4% platform fee`
  (`PLATFORM_FEE_PERCENTAGE` from `@homechef/shared`), integer cents SGD.
- Orders live in the `orders` table (canonical schema:
  `apps/api/src/db/schema/orders.ts`). `menu_id` is text so it accepts both
  static marketing menu slugs (`sarah-tan-1`) and DB menu uuids (mobile).
- Key code: `apps/web/lib/orders.ts` (order service + reconciliation),
  `apps/web/lib/payments/{stripe,paypal,hitpay}.ts` (provider clients),
  `apps/web/app/api/checkout/**` + `apps/web/app/api/webhooks/**` (routes),
  `apps/web/app/checkout/result/page.tsx` (landing page).
- Admin visibility: `/admin/orders`.
- Mobile return deep link: the result page shows "Return to Potluck app"
  (`potluck://checkout/result?...`) when `platform=ios|android`; both apps
  register the `potluck` scheme.

## One-time setup per environment

1. **Create the table**: `pnpm --filter @homechef/web migrate:orders`
   (idempotent) or `pnpm db:push`.
2. Set env vars in Coolify (see `.env.example`), then per provider below.
3. A provider with missing env vars returns a clear 503 at checkout — the
   other providers keep working, so you can roll them out one at a time.

## Stripe (cards)

1. Keys: [dashboard.stripe.com/apikeys](https://dashboard.stripe.com/apikeys) →
   `STRIPE_SECRET_KEY` (test `sk_test_…`, live `sk_live_…`).
2. Webhook: Dashboard → Developers → Webhooks → Add endpoint
   `https://<site>/api/webhooks/stripe`, events:
   `checkout.session.completed`, `checkout.session.expired`,
   `checkout.session.async_payment_succeeded`, `checkout.session.async_payment_failed`.
   Copy the signing secret → `STRIPE_WEBHOOK_SECRET`.
3. Test card `4242 4242 4242 4242` (any future expiry / CVC).

## PayPal

1. [developer.paypal.com](https://developer.paypal.com) → My Apps & Credentials →
   create a REST app → `PAYPAL_CLIENT_ID` + `PAYPAL_CLIENT_SECRET`.
2. `PAYPAL_MODE=sandbox` (default) or `live`.
3. Webhook: in the app's settings add webhook URL
   `https://<site>/api/webhooks/paypal` with events
   `PAYMENT.CAPTURE.COMPLETED`, `PAYMENT.CAPTURE.DENIED`,
   `CHECKOUT.ORDER.APPROVED`. Copy the **Webhook ID** → `PAYPAL_WEBHOOK_ID`
   (used for signature verification; webhook returns 503 until set).
4. Note: PayPal orders are **captured** on return/webhook — handled by
   `verifyPayPalPayment` (idempotent, tolerates ORDER_ALREADY_CAPTURED).

## HitPay (PayNow + cards, SG)

1. [dashboard.hit-pay.com](https://dashboard.hit-pay.com) (or
   `dashboard.sandbox.hit-pay.com` for testing) → Payment Gateway → API Keys →
   `HITPAY_API_KEY` and `HITPAY_SALT` (salt verifies webhook HMACs).
2. `HITPAY_MODE=sandbox` (default) or `live`.
3. No dashboard webhook needed — each payment request registers
   `https://<site>/api/webhooks/hitpay` automatically.

## Ops notes

- Paid orders POST a summary to `ENQUIRY_WEBHOOK_URL` (Slack/CRM) if set,
  else log server-side.
- Refunds are currently issued in each provider's dashboard; mark the order
  `refunded` manually (or extend `/admin/orders`).
- `robots.ts` disallows `/checkout/`; the result page is `noindex`.
