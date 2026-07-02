// HitPay provider — hosted payment requests (card + PayNow), SGD-native.
// Docs: https://docs.hitpayapp.com/apis/payment-requests

import { createHmac, timingSafeEqual } from 'crypto';
import {
  PaymentConfigError,
  checkoutResultUrl,
  siteUrl,
  type OrderForPayment,
  type PaymentVerdict,
  type ProviderSession,
} from './types';

function apiBase(): string {
  return process.env.HITPAY_MODE === 'live'
    ? 'https://api.hit-pay.com/v1'
    : 'https://api.sandbox.hit-pay.com/v1';
}

function apiKey(): string {
  const key = process.env.HITPAY_API_KEY;
  if (!key) throw new PaymentConfigError('PayNow/HitPay is not configured (HITPAY_API_KEY missing)');
  return key;
}

async function hitpayFetch(path: string, init?: RequestInit): Promise<Response> {
  return fetch(`${apiBase()}${path}`, {
    ...init,
    headers: {
      'X-BUSINESS-API-KEY': apiKey(),
      'Content-Type': 'application/json',
      'X-Requested-With': 'XMLHttpRequest',
      ...(init?.headers ?? {}),
    },
    cache: 'no-store',
  });
}

export async function createHitPayRequest(order: OrderForPayment): Promise<ProviderSession> {
  const res = await hitpayFetch('/payment-requests', {
    method: 'POST',
    body: JSON.stringify({
      amount: (order.total / 100).toFixed(2),
      currency: order.currency,
      email: order.customerEmail,
      name: order.customerName,
      purpose: `Potluck booking ${order.orderNumber} — ${order.menuName}`.slice(0, 255),
      reference_number: order.orderNumber,
      redirect_url: checkoutResultUrl(order.id, 'hitpay', order.platform),
      webhook: `${siteUrl()}/api/webhooks/hitpay`,
      send_email: true,
    }),
  });
  const data = (await res.json().catch(() => ({}))) as { id?: string; url?: string; message?: string };
  if (!res.ok || !data.id || !data.url) {
    throw new Error(`HitPay payment request failed: ${data.message ?? res.status}`);
  }
  return { redirectUrl: data.url, providerRef: data.id };
}

export async function verifyHitPayPayment(providerRef: string): Promise<PaymentVerdict> {
  const res = await hitpayFetch(`/payment-requests/${providerRef}`);
  if (!res.ok) return res.status === 404 ? 'failed' : 'pending';
  const data = (await res.json()) as { status?: string };
  if (data.status === 'completed') return 'paid';
  if (data.status === 'expired' || data.status === 'failed') return 'failed';
  return 'pending';
}

/**
 * Verify a HitPay webhook (form-encoded). Signature = HMAC-SHA256 over the
 * alphabetically-sorted `key+value` pairs (excluding `hmac`), keyed by the salt.
 */
export function verifyHitPayWebhook(fields: Record<string, string>): boolean {
  const salt = process.env.HITPAY_SALT;
  if (!salt) throw new PaymentConfigError('HITPAY_SALT missing');
  const provided = fields.hmac;
  if (!provided) return false;
  const payload = Object.keys(fields)
    .filter((k) => k !== 'hmac')
    .sort()
    .map((k) => `${k}${fields[k]}`)
    .join('');
  const expected = createHmac('sha256', salt).update(payload).digest('hex');
  const a = Buffer.from(expected);
  const b = Buffer.from(provided);
  return a.length === b.length && timingSafeEqual(a, b);
}
