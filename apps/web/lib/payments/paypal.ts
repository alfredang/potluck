// PayPal provider — Orders v2 REST API via fetch (no SDK dependency).
// Docs: https://developer.paypal.com/docs/api/orders/v2/

import {
  PaymentConfigError,
  checkoutResultUrl,
  type OrderForPayment,
  type PaymentVerdict,
  type ProviderSession,
} from './types';

function apiBase(): string {
  return process.env.PAYPAL_MODE === 'live'
    ? 'https://api-m.paypal.com'
    : 'https://api-m.sandbox.paypal.com';
}

async function getAccessToken(): Promise<string> {
  const clientId = process.env.PAYPAL_CLIENT_ID;
  const secret = process.env.PAYPAL_CLIENT_SECRET;
  if (!clientId || !secret) {
    throw new PaymentConfigError('PayPal is not configured (PAYPAL_CLIENT_ID / PAYPAL_CLIENT_SECRET missing)');
  }
  const res = await fetch(`${apiBase()}/v1/oauth2/token`, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${Buffer.from(`${clientId}:${secret}`).toString('base64')}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: 'grant_type=client_credentials',
    cache: 'no-store',
  });
  if (!res.ok) throw new Error(`PayPal authentication failed (${res.status})`);
  const data = (await res.json()) as { access_token: string };
  return data.access_token;
}

async function paypalFetch(path: string, init?: RequestInit): Promise<Response> {
  const token = await getAccessToken();
  return fetch(`${apiBase()}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
      ...(init?.headers ?? {}),
    },
    cache: 'no-store',
  });
}

export async function createPayPalOrder(order: OrderForPayment): Promise<ProviderSession> {
  const res = await paypalFetch('/v2/checkout/orders', {
    method: 'POST',
    body: JSON.stringify({
      intent: 'CAPTURE',
      purchase_units: [
        {
          reference_id: order.id,
          custom_id: order.id,
          invoice_id: order.orderNumber,
          description: `${order.menuName} — Potluck booking ${order.orderNumber}`.slice(0, 127),
          amount: { currency_code: order.currency, value: (order.total / 100).toFixed(2) },
        },
      ],
      application_context: {
        brand_name: 'Potluck',
        user_action: 'PAY_NOW',
        shipping_preference: 'NO_SHIPPING',
        return_url: checkoutResultUrl(order.id, 'paypal', order.platform),
        cancel_url: checkoutResultUrl(order.id, 'paypal', order.platform, { cancelled: '1' }),
      },
    }),
  });
  const data = (await res.json()) as {
    id?: string;
    links?: Array<{ rel: string; href: string }>;
    message?: string;
  };
  if (!res.ok || !data.id) {
    throw new Error(`PayPal order creation failed: ${data.message ?? res.status}`);
  }
  const approve = data.links?.find((l) => l.rel === 'approve' || l.rel === 'payer-action')?.href;
  if (!approve) throw new Error('PayPal did not return an approval link');
  return { redirectUrl: approve, providerRef: data.id };
}

/**
 * Verify (and finalize) a PayPal payment. PayPal orders must be *captured*
 * after buyer approval, so this captures when the order is APPROVED.
 * Idempotent: an already-captured order reports paid.
 */
export async function verifyPayPalPayment(providerRef: string): Promise<PaymentVerdict> {
  const res = await paypalFetch(`/v2/checkout/orders/${providerRef}`);
  if (!res.ok) return res.status === 404 ? 'failed' : 'pending';
  const data = (await res.json()) as { status?: string };

  if (data.status === 'COMPLETED') return 'paid';
  if (data.status === 'VOIDED') return 'failed';
  if (data.status !== 'APPROVED') return 'pending'; // CREATED / PAYER_ACTION_REQUIRED

  const cap = await paypalFetch(`/v2/checkout/orders/${providerRef}/capture`, { method: 'POST' });
  const capData = (await cap.json()) as { status?: string; details?: Array<{ issue?: string }> };
  if (cap.ok && capData.status === 'COMPLETED') return 'paid';
  if (capData.details?.some((d) => d.issue === 'ORDER_ALREADY_CAPTURED')) return 'paid';
  if (capData.details?.some((d) => d.issue === 'ORDER_NOT_APPROVED')) return 'pending';
  return 'failed';
}

/** Verify a webhook came from PayPal (verify-webhook-signature API). */
export async function verifyPayPalWebhook(
  headers: Headers,
  rawBody: string
): Promise<boolean> {
  const webhookId = process.env.PAYPAL_WEBHOOK_ID;
  if (!webhookId) throw new PaymentConfigError('PAYPAL_WEBHOOK_ID missing');
  const res = await paypalFetch('/v1/notifications/verify-webhook-signature', {
    method: 'POST',
    body: JSON.stringify({
      auth_algo: headers.get('paypal-auth-algo'),
      cert_url: headers.get('paypal-cert-url'),
      transmission_id: headers.get('paypal-transmission-id'),
      transmission_sig: headers.get('paypal-transmission-sig'),
      transmission_time: headers.get('paypal-transmission-time'),
      webhook_id: webhookId,
      webhook_event: JSON.parse(rawBody),
    }),
  });
  if (!res.ok) return false;
  const data = (await res.json()) as { verification_status?: string };
  return data.verification_status === 'SUCCESS';
}
