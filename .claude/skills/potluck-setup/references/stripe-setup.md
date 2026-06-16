---
layout: default
title: Stripe Payment Setup
---

# Stripe Payment Setup Guide

This guide covers integrating Stripe payment processing into the Potluck platform.

## Prerequisites

- Stripe account - [stripe.com](https://stripe.com)
- Node.js 20+
- Potluck project set up

---

## Step 1: Create Stripe Account

### 1.1 Sign Up

1. Go to [dashboard.stripe.com/register](https://dashboard.stripe.com/register)
2. Enter your email and create a password
3. Verify your email address

### 1.2 Complete Business Profile

1. Go to **Settings** → **Business settings**
2. Complete:
   - Business name: Potluck
   - Business type: Platform/Marketplace
   - Industry: Food & Drink
   - Business address
   - Tax information

### 1.3 Activate Your Account

1. Go to **Settings** → **Activate account**
2. Complete identity verification
3. Add bank account for payouts

---

## Step 2: Get API Keys

### 2.1 Access API Keys

1. Go to [dashboard.stripe.com/apikeys](https://dashboard.stripe.com/apikeys)
2. You'll see:
   - **Publishable key**: `pk_test_...` (client-side)
   - **Secret key**: `sk_test_...` (server-side)

### 2.2 Toggle Test/Live Mode

- Use **Test mode** during development
- Switch to **Live mode** for production

---

## Step 3: Configure Environment Variables

### API (.env)

```env
# apps/api/.env

# Stripe Secret Key
STRIPE_SECRET_KEY=sk_test_your_secret_key_here

# Stripe Webhook Secret (created in Step 5)
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here

# For Connect (marketplace)
STRIPE_CONNECT_CLIENT_ID=ca_your_connect_client_id
```

### Web App (.env)

```env
# apps/web/.env

# Stripe Publishable Key
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_publishable_key_here
```

---

## Step 4: Install Stripe SDK

### Backend (API)

```bash
cd apps/api
pnpm add stripe
```

### Frontend (Web)

```bash
cd apps/web
pnpm add @stripe/stripe-js @stripe/react-stripe-js
```

### Mobile (React Native)

```bash
cd apps/mobile
pnpm add @stripe/stripe-react-native
```

---

## Step 5: Backend Implementation

### 5.1 Initialize Stripe

Create `apps/api/src/lib/stripe.ts`:

```typescript
import Stripe from 'stripe';

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-12-18.acacia',
  typescript: true,
});
```

### 5.2 Create Payment Intent Route

Create `apps/api/src/routes/payments.ts`:

```typescript
import { FastifyPluginAsync } from 'fastify';
import { stripe } from '../lib/stripe';

const paymentsRoutes: FastifyPluginAsync = async (fastify) => {
  // Create Payment Intent
  fastify.post('/create-payment-intent', async (request, reply) => {
    const { amount, currency = 'sgd', bookingId, chefId } = request.body as {
      amount: number;
      currency?: string;
      bookingId: string;
      chefId: string;
    };

    try {
      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(amount * 100), // Convert to cents
        currency,
        metadata: {
          bookingId,
          chefId,
        },
        automatic_payment_methods: {
          enabled: true,
        },
      });

      return {
        clientSecret: paymentIntent.client_secret,
        paymentIntentId: paymentIntent.id,
      };
    } catch (error) {
      reply.status(400).send({ error: (error as Error).message });
    }
  });

  // Get Payment Status
  fastify.get('/payment-status/:paymentIntentId', async (request, reply) => {
    const { paymentIntentId } = request.params as { paymentIntentId: string };

    try {
      const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
      return {
        status: paymentIntent.status,
        amount: paymentIntent.amount / 100,
      };
    } catch (error) {
      reply.status(400).send({ error: (error as Error).message });
    }
  });
};

export default paymentsRoutes;
```

### 5.3 Create Webhook Handler

Create `apps/api/src/routes/webhooks.ts`:

```typescript
import { FastifyPluginAsync } from 'fastify';
import { stripe } from '../lib/stripe';
import Stripe from 'stripe';

const webhookRoutes: FastifyPluginAsync = async (fastify) => {
  fastify.post('/stripe', {
    config: {
      rawBody: true,
    },
    handler: async (request, reply) => {
      const sig = request.headers['stripe-signature'] as string;
      const rawBody = request.rawBody as Buffer;

      let event: Stripe.Event;

      try {
        event = stripe.webhooks.constructEvent(
          rawBody,
          sig,
          process.env.STRIPE_WEBHOOK_SECRET!
        );
      } catch (err) {
        reply.status(400).send({ error: 'Webhook signature verification failed' });
        return;
      }

      // Handle events
      switch (event.type) {
        case 'payment_intent.succeeded':
          const paymentIntent = event.data.object as Stripe.PaymentIntent;
          console.log('Payment succeeded:', paymentIntent.id);
          // Update booking status to confirmed
          // Send confirmation email
          break;

        case 'payment_intent.payment_failed':
          const failedPayment = event.data.object as Stripe.PaymentIntent;
          console.log('Payment failed:', failedPayment.id);
          // Notify user of failure
          break;

        case 'charge.refunded':
          const refund = event.data.object as Stripe.Charge;
          console.log('Refund processed:', refund.id);
          // Update booking status
          break;
      }

      reply.send({ received: true });
    },
  });
};

export default webhookRoutes;
```

---

## Step 6: Frontend Implementation

### 6.1 Initialize Stripe Provider

Update `apps/web/app/layout.tsx`:

```typescript
'use client';

import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <Elements stripe={stripePromise}>
          {children}
        </Elements>
      </body>
    </html>
  );
}
```

### 6.2 Create Payment Form Component

Create `apps/web/components/PaymentForm.tsx`:

```typescript
'use client';

import { useState } from 'react';
import {
  PaymentElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';

interface PaymentFormProps {
  clientSecret: string;
  onSuccess: () => void;
  onError: (error: string) => void;
}

export default function PaymentForm({ clientSecret, onSuccess, onError }: PaymentFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) return;

    setIsProcessing(true);

    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: window.location.origin + '/booking/success',
      },
      redirect: 'if_required',
    });

    if (error) {
      onError(error.message || 'Payment failed');
    } else if (paymentIntent?.status === 'succeeded') {
      onSuccess();
    }

    setIsProcessing(false);
  };

  return (
    <form onSubmit={handleSubmit}>
      <PaymentElement />
      <button
        type="submit"
        disabled={!stripe || isProcessing}
        className="mt-4 w-full rounded-lg bg-orange-500 py-3 text-white font-semibold"
      >
        {isProcessing ? 'Processing...' : 'Pay Now'}
      </button>
    </form>
  );
}
```

---

## Step 7: Set Up Webhooks

### 7.1 Local Development (Stripe CLI)

```bash
# Install Stripe CLI
brew install stripe/stripe-cli/stripe

# Login
stripe login

# Forward webhooks to local server
stripe listen --forward-to localhost:3001/webhooks/stripe
```

Copy the webhook signing secret and add to `.env`:
```
STRIPE_WEBHOOK_SECRET=whsec_...
```

### 7.2 Production Webhooks

1. Go to [Stripe Dashboard → Webhooks](https://dashboard.stripe.com/webhooks)
2. Click **"Add endpoint"**
3. Enter URL: `https://api.potluck.sg/webhooks/stripe`
4. Select events:
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`
   - `charge.refunded`
5. Click **"Add endpoint"**
6. Copy the signing secret to your production env vars

---

## Step 8: Stripe Connect (For Chef Payouts)

### 8.1 Enable Connect

1. Go to [Stripe Connect Settings](https://dashboard.stripe.com/settings/connect)
2. Choose platform type: **Express**
3. Configure branding

### 8.2 Onboard Chefs

Create onboarding link:

```typescript
// Create Connect Account for chef
const account = await stripe.accounts.create({
  type: 'express',
  country: 'SG',
  email: chef.email,
  capabilities: {
    card_payments: { requested: true },
    transfers: { requested: true },
  },
});

// Create onboarding link
const accountLink = await stripe.accountLinks.create({
  account: account.id,
  refresh_url: 'https://potluck.sg/chef/connect/refresh',
  return_url: 'https://potluck.sg/chef/connect/complete',
  type: 'account_onboarding',
});

// Redirect chef to accountLink.url
```

### 8.3 Process Payouts

```typescript
// When booking is confirmed, create transfer to chef
const transfer = await stripe.transfers.create({
  amount: Math.round(chefAmount * 100),
  currency: 'sgd',
  destination: chef.stripeAccountId,
  transfer_group: bookingId,
});
```

---

## Step 9: Testing

### Test Card Numbers

| Card Number | Scenario |
|-------------|----------|
| 4242 4242 4242 4242 | Successful payment |
| 4000 0000 0000 3220 | 3D Secure required |
| 4000 0000 0000 0002 | Declined |
| 4000 0000 0000 9995 | Insufficient funds |

**For all test cards:**
- Expiry: Any future date
- CVC: Any 3 digits
- ZIP: Any 5 digits

### Test Webhooks

```bash
# Trigger test events
stripe trigger payment_intent.succeeded
stripe trigger payment_intent.payment_failed
```

---

## Step 10: Go Live

### Checklist

- [ ] Complete Stripe account activation
- [ ] Replace test keys with live keys
- [ ] Update webhook endpoint to production URL
- [ ] Test live payments with small amount
- [ ] Configure email receipts in Stripe Dashboard

### Update Environment Variables

```env
# Production keys (in Vercel/hosting platform)
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_live_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
```

---

## Useful Links

- [Stripe Documentation](https://stripe.com/docs)
- [Stripe API Reference](https://stripe.com/docs/api)
- [Stripe Testing](https://stripe.com/docs/testing)
- [Stripe Connect](https://stripe.com/docs/connect)

---

[← Back to Documentation](index)
