import { NextResponse } from 'next/server';

// Lightweight enquiry capture for the homepage lead form. Validates input and forwards
// to ENQUIRY_WEBHOOK_URL (e.g. a Slack/CRM/Make webhook) when configured; otherwise it
// logs server-side so deploys never break on a missing integration. Wire Resend/CRM here.
export async function POST(req: Request) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: 'Invalid request' }, { status: 400 });
  }

  const name = String(body.name ?? '').trim();
  const email = String(body.email ?? '').trim();
  const interest = String(body.interest ?? '').trim();
  const message = String(body.message ?? '').trim();

  if (!name || !email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ ok: false, error: 'Please enter your name and a valid email.' }, { status: 422 });
  }

  const lead = { name, email, interest, message, source: 'homepage-enquiry', at: new Date().toISOString() };

  const webhook = process.env.ENQUIRY_WEBHOOK_URL;
  if (webhook) {
    try {
      await fetch(webhook, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(lead),
      });
    } catch (err) {
      console.error('[enquiry] webhook forward failed', err);
    }
  } else {
    console.log('[enquiry] new lead', lead);
  }

  return NextResponse.json({ ok: true });
}
