import type { FastifyPluginAsync } from 'fastify';
import Stripe from 'stripe';
import { config } from '../config/index.js';

const stripe = new Stripe(config.stripeSecretKey);

export const webhooksRoutes: FastifyPluginAsync = async (fastify) => {
  // Stripe webhook
  fastify.post('/stripe', {
    config: {
      rawBody: true,
    },
  }, async (request, reply) => {
    const sig = request.headers['stripe-signature'];

    if (!sig || !config.stripeWebhookSecret) {
      return reply.status(400).send({
        success: false,
        error: { code: 'MISSING_SIGNATURE', message: 'Missing Stripe signature' },
      });
    }

    let event: Stripe.Event;

    try {
      // For Fastify, we need to access the raw body
      const rawBody = (request as any).rawBody;
      event = stripe.webhooks.constructEvent(rawBody, sig, config.stripeWebhookSecret);
    } catch {
      fastify.log.error('Webhook signature verification failed');
      return reply.status(400).send({
        success: false,
        error: { code: 'INVALID_SIGNATURE', message: 'Invalid Stripe signature' },
      });
    }

    fastify.log.info(`Received Stripe event: ${event.type}`);

    try {
      switch (event.type) {
        case 'payment_intent.succeeded':
          await handlePaymentIntentSucceeded(event.data.object as Stripe.PaymentIntent);
          break;

        case 'payment_intent.payment_failed':
          await handlePaymentIntentFailed(event.data.object as Stripe.PaymentIntent);
          break;

        case 'customer.subscription.created':
        case 'customer.subscription.updated':
          await handleSubscriptionUpdated(event.data.object as Stripe.Subscription);
          break;

        case 'customer.subscription.deleted':
          await handleSubscriptionDeleted(event.data.object as Stripe.Subscription);
          break;

        case 'invoice.paid':
          await handleInvoicePaid(event.data.object as Stripe.Invoice);
          break;

        case 'invoice.payment_failed':
          await handleInvoicePaymentFailed(event.data.object as Stripe.Invoice);
          break;

        case 'account.updated':
          await handleAccountUpdated(event.data.object as Stripe.Account);
          break;

        default:
          fastify.log.info(`Unhandled event type: ${event.type}`);
      }
    } catch {
      fastify.log.error('Error processing webhook');
      return reply.status(500).send({
        success: false,
        error: { code: 'PROCESSING_ERROR', message: 'Error processing webhook' },
      });
    }

    return reply.send({ received: true });
  });
};

async function handlePaymentIntentSucceeded(paymentIntent: Stripe.PaymentIntent) {
  // TODO: Update payment record to 'held' status
  // TODO: Update booking status to 'confirmed'
  console.log('Payment succeeded:', paymentIntent.id);
}

async function handlePaymentIntentFailed(paymentIntent: Stripe.PaymentIntent) {
  // TODO: Update payment record to 'failed' status
  console.log('Payment failed:', paymentIntent.id);
}

async function handleSubscriptionUpdated(subscription: Stripe.Subscription) {
  // TODO: Update subscription record
  console.log('Subscription updated:', subscription.id);
}

async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  // TODO: Update subscription to 'canceled' and reset to free tier
  console.log('Subscription deleted:', subscription.id);
}

async function handleInvoicePaid(invoice: Stripe.Invoice) {
  // TODO: Record subscription payment
  console.log('Invoice paid:', invoice.id);
}

async function handleInvoicePaymentFailed(invoice: Stripe.Invoice) {
  // TODO: Update subscription status to 'past_due'
  console.log('Invoice payment failed:', invoice.id);
}

async function handleAccountUpdated(account: Stripe.Account) {
  // TODO: Update chef's stripeOnboardingComplete status
  console.log('Account updated:', account.id);
}
