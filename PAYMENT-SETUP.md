# Potluck Payment Setup Guide (Stripe + PayPal + HitPay)

Follow this guide top-to-bottom to take Potluck's checkout from "deployed but
unconfigured" to accepting real payments on **all three platforms** (web,
iOS app, Android app). Every platform pays through the same backend, so you
only configure things **once**.

> **Status when this guide was written:** the checkout code is live on
> https://potluckhub.io, the `orders` table exists in the production database,
> and the env vars are already created (empty) in Coolify. All that's missing
> are the real provider keys — that's what you'll add here.
>
> Each provider is independent: you can set up only Stripe today and add
> PayPal/HitPay later. An unconfigured provider shows a clear error at
> checkout while the others keep working.

---

## How the checkout works (30-second overview)

```
Web booking modal ─┐
iOS app ───────────┼──► POST https://potluckhub.io/api/checkout
Android app ───────┘        creates an order (server-side pricing:
                            menu price × guests + 4% platform fee, SGD cents)
                            and returns the provider's hosted payment URL
                                 │
                    customer pays on Stripe Checkout /
                    PayPal / HitPay (PayNow QR or card)
                                 │
        provider webhook ──► https://potluckhub.io/api/webhooks/{provider}
                             (signature-verified, marks order paid)
                                 │
        customer lands on https://potluckhub.io/checkout/result
        (web) or returns to the app (iOS/Android poll the order status)
```

Orders are visible at **https://potluckhub.io/admin/orders** (log in with
your `ADMIN_PASSWORD`).

---

## Part 0 — Where you'll paste the keys (Coolify)

All secrets live in Coolify, **never** in the code.

1. Open **https://coolify.tertiaryinfotech.com** and log in.
2. In the left sidebar go to **Projects** → open the project containing
   **potluck-web** (the app serving potluckhub.io).
3. Click **potluck-web** → **Configuration** → **Environment Variables**.
4. You will see these variables already created, waiting for values:

   | Variable | What goes in it | From |
   |---|---|---|
   | `STRIPE_SECRET_KEY` | `sk_live_…` (or `sk_test_…` while testing) | Part 1 |
   | `STRIPE_WEBHOOK_SECRET` | `whsec_…` | Part 1 |
   | `PAYPAL_CLIENT_ID` | REST app client ID | Part 2 |
   | `PAYPAL_CLIENT_SECRET` | REST app secret | Part 2 |
   | `PAYPAL_WEBHOOK_ID` | webhook ID (looks like `8PT597110X687430LKGECATA`) | Part 2 |
   | `PAYPAL_MODE` | `live` (already set; use `sandbox` while testing) | — |
   | `HITPAY_API_KEY` | business API key | Part 3 |
   | `HITPAY_SALT` | webhook salt | Part 3 |
   | `HITPAY_MODE` | `live` (already set; use `sandbox` while testing) | — |

5. After pasting values, click **Save**, then press **Restart** (top right)
   so the running container picks them up. (A full Redeploy also works but
   is slower.)

> **Tip — test first, then go live:** every provider has a test/sandbox mode.
> The safest path is: put **test** keys in first with
> `PAYPAL_MODE=sandbox` / `HITPAY_MODE=sandbox` and Stripe `sk_test_…`,
> run the Part 4 tests with fake cards, then swap in live keys and set both
> modes to `live`.

---

## Part 1 — Stripe (credit / debit cards)

### 1.1 Create / activate the account

1. Go to https://dashboard.stripe.com/register and sign up with
   your business email (or log in if Potluck already has an account).
2. Complete **Settings → Business** :
   - Business type: *Company / Platform or marketplace*
   - Industry: *Food & beverage*
   - Website: `https://potluckhub.io`
3. **Activate payments**: Dashboard home → "Activate payments" → fill in
   ACRA/UEN details, director identity, and your SGD bank account for payouts.
   (You can do everything below in test mode while waiting for approval.)

### 1.2 Get the secret key

1. Open https://dashboard.stripe.com/apikeys .
2. Top-right toggle chooses **Test mode** vs **Live mode** — each mode has
   its own keys. Start in test mode.
3. Under **Standard keys**, click **Reveal** next to *Secret key* and copy it:
   - Test: starts with `sk_test_`
   - Live: starts with `sk_live_`
4. Paste it into `STRIPE_SECRET_KEY` in Coolify (Part 0).

   *(The publishable key `pk_…` is not needed — Potluck uses Stripe's hosted
   Checkout page, which never touches your frontend keys.)*

### 1.3 Create the webhook

1. Go to https://dashboard.stripe.com/webhooks (make sure you're in the same
   mode — test or live — as your key!).
2. Click **+ Add endpoint** (or "Add destination" → *Webhook endpoint*).
3. Endpoint URL:

   ```
   https://potluckhub.io/api/webhooks/stripe
   ```

4. Under **Select events**, add exactly these four:
   - `checkout.session.completed`
   - `checkout.session.expired`
   - `checkout.session.async_payment_succeeded`
   - `checkout.session.async_payment_failed`
5. Click **Add endpoint**, then on the endpoint page click
   **Reveal** under *Signing secret* and copy the `whsec_…` value.
6. Paste it into `STRIPE_WEBHOOK_SECRET` in Coolify.

### 1.4 Restart & smoke-test

1. In Coolify: **Restart** potluck-web.
2. On https://potluckhub.io open any chef → **Book Now** → pick a date/time →
   *Continue to Payment* → fill your name/email → choose **Credit / Debit
   Card** → *Proceed to Payment*.
3. You should land on a Stripe-hosted page. In test mode pay with:

   | Card number | Result |
   |---|---|
   | `4242 4242 4242 4242` | ✅ success |
   | `4000 0000 0000 3220` | 3-D Secure challenge |
   | `4000 0000 0000 0002` | ❌ declined |

   Any future expiry, any CVC, any postal code.
4. You should be redirected to `potluckhub.io/checkout/result` showing
   **"Payment received!"** with an order number like `PL-XXXXXXXX`.
5. Confirm the order shows as **paid** at https://potluckhub.io/admin/orders .

---

## Part 2 — PayPal

### 2.1 Get developer credentials

1. Go to https://developer.paypal.com and log in with Potluck's PayPal
   **Business** account (create one at https://www.paypal.com/sg/business if
   needed — you'll need UEN + bank details to receive money).
2. Open **Apps & Credentials** (top nav).
3. Note the **Sandbox / Live** toggle at the top — like Stripe, each side has
   its own credentials. Start on **Sandbox**.
4. Click **Create App**:
   - App name: `Potluck Checkout`
   - Type: **Merchant**
5. On the app page copy:
   - **Client ID** → paste into `PAYPAL_CLIENT_ID` in Coolify
   - **Secret key** (click "Show") → paste into `PAYPAL_CLIENT_SECRET`
6. Set `PAYPAL_MODE` in Coolify to match: `sandbox` for sandbox keys,
   `live` for live keys.

### 2.2 Create the webhook

1. Still on your app's page, scroll to **Webhooks** → **Add Webhook**.
2. Webhook URL:

   ```
   https://potluckhub.io/api/webhooks/paypal
   ```

3. Tick these event types (use the search box):
   - **Payment capture completed** (`PAYMENT.CAPTURE.COMPLETED`)
   - **Payment capture denied** (`PAYMENT.CAPTURE.DENIED`)
   - **Checkout order approved** (`CHECKOUT.ORDER.APPROVED`)
4. Save. The webhook list now shows a **Webhook ID** — copy it and paste
   into `PAYPAL_WEBHOOK_ID` in Coolify.

   > Without `PAYPAL_WEBHOOK_ID` the endpoint rejects all events (it's used
   > to cryptographically verify they really came from PayPal). Checkout
   > still works though — the result page and the apps verify/capture the
   > payment directly with PayPal's API as a fallback.

### 2.3 Restart & smoke-test

1. **Restart** potluck-web in Coolify.
2. Book a dish and choose **PayPal** at checkout.
3. Sandbox: log in with a sandbox *personal* account
   (Developer Dashboard → **Testing Tools → Sandbox Accounts** — one is
   auto-created; reset its password there if needed) and approve the payment.
4. You should return to the result page as **"Payment received!"** and the
   order shows **paid** in `/admin/orders`.

---

## Part 3 — HitPay (PayNow QR + cards, Singapore)

### 3.1 Create the account

1. Sign up at https://dashboard.hit-pay.com/register with the business
   email, then complete KYC (UEN, director ID, bank account). PayNow
   collection requires the KYC to be approved.
2. For testing first, you can instead register a free sandbox account at
   https://dashboard.sandbox.hit-pay.com — no KYC needed, fake PayNow works.

### 3.2 Get the API key and salt

1. In the HitPay Dashboard go to **Settings → Payment Gateway → API Keys**
   (on sandbox: same path).
2. Click **Generate** if no keys exist yet.
3. Copy:
   - **API Key** → paste into `HITPAY_API_KEY` in Coolify
   - **Salt** → paste into `HITPAY_SALT` (this verifies webhook signatures)
4. Set `HITPAY_MODE` to `sandbox` or `live` to match where the keys came from.

   > No webhook needs to be configured in the HitPay dashboard — Potluck
   > registers `https://potluckhub.io/api/webhooks/hitpay` automatically on
   > every payment request.

### 3.3 Restart & smoke-test

1. **Restart** potluck-web in Coolify.
2. Book a dish and choose **PayNow / Card**.
3. Sandbox: the HitPay page shows a fake PayNow QR — click
   "simulate payment" (sandbox lets you complete without a real bank app).
   Live: scan the QR with any SG bank app and pay S$1–2 to yourself as a test.
4. Confirm **"Payment received!"** and the paid order in `/admin/orders`.

---

## Part 4 — End-to-end verification checklist

Run through this once with test/sandbox keys and once after going live.

- [ ] **Stripe card** payment succeeds → result page says *Payment received!*
- [ ] **PayPal** payment succeeds → result page says *Payment received!*
- [ ] **HitPay PayNow** payment succeeds → result page says *Payment received!*
- [ ] All three orders show **paid** (green) at `/admin/orders`
- [ ] Cancel mid-payment (browser Back / Cancel link) → order shows
      **cancelled**, no charge
- [ ] Quick API check from any terminal (should return `{"error":"Invalid
      payment provider"}` — proves the endpoint is up):

  ```bash
  curl -s -X POST https://potluckhub.io/api/checkout \
    -H 'Content-Type: application/json' -d '{"provider":"x"}'
  ```

- [ ] **iOS / Android**: book any dish in the app → pick a payment method →
      pay in the in-app browser → the app flips to *Payment received!* by
      itself (it polls the order every 2 s). Requires the v1.2 builds.

## Part 5 — Going live (after sandbox testing passes)

1. Stripe: switch the dashboard to **Live mode**, repeat 1.2–1.3 (live key +
   a *new* live-mode webhook endpoint + its `whsec_…`), replace both values
   in Coolify.
2. PayPal: toggle **Live** in the developer dashboard, create the app +
   webhook again on the live side, replace `PAYPAL_CLIENT_ID`,
   `PAYPAL_CLIENT_SECRET`, `PAYPAL_WEBHOOK_ID`, set `PAYPAL_MODE=live`.
3. HitPay: replace with the real dashboard's API key + salt, set
   `HITPAY_MODE=live`.
4. **Restart** potluck-web.
5. Make one small real payment per provider (e.g. the S$15 gelato menu with
   1 guest ≈ S$15.60) and refund yourself from each provider's dashboard.
6. Re-run the Part 4 checklist.

---

## Troubleshooting

| Symptom | Meaning | Fix |
|---|---|---|
| Checkout shows *"…not configured (XXX missing)"* (HTTP 503) | That env var is empty | Paste the key in Coolify and **Restart** |
| *"Could not start the payment…"* (HTTP 502) | Provider rejected the request | Key is wrong/revoked, or mode mismatch (e.g. `sk_test_` key while testing a live flow). Check potluck-web **Logs** in Coolify for the exact provider error |
| Paid, but result page stuck on *"Confirming your payment…"* | Webhook not arriving **and** verification failing | Usually a mode mismatch or wrong `STRIPE_WEBHOOK_SECRET` / `PAYPAL_WEBHOOK_ID`. The page keeps re-checking with the provider for ~2 min, so a correct key normally settles it even without webhooks |
| Stripe webhook shows failures in its dashboard | Wrong signing secret | Re-copy `whsec_…` from that exact endpoint (test and live secrets differ) |
| Order `failed` with reason *"Cancelled by customer"* | User pressed cancel | Nothing to fix — no charge was made |
| Need to refund | — | Refund in the provider's dashboard (Stripe Payments / PayPal Activity / HitPay Transactions). Optionally mark the order refunded in the DB |

**Where things are in the code** (for future changes):
provider clients `apps/web/lib/payments/*`, order logic `apps/web/lib/orders.ts`,
API routes `apps/web/app/api/checkout/**` and `apps/web/app/api/webhooks/**`,
result page `apps/web/app/checkout/result/`, admin list `apps/web/app/admin/orders/`.
The iOS/Android apps call the same two endpoints — don't change their
request/response shapes without updating both apps
(`/Users/…/projects/mobile/{iOS,Android}/potluckapp`).
