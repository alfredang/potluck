import crypto from 'crypto';

export const ADMIN_COOKIE = 'pl_admin';

function secret(): string {
  return process.env.ADMIN_PASSWORD || 'change-me-potluck-admin';
}

/** Stable token derived from the admin password — invalidated if the password changes. */
export function makeToken(): string {
  return crypto.createHmac('sha256', secret()).update('potluck-admin-v1').digest('hex');
}

export function isValidToken(token: string | undefined | null): boolean {
  if (!token) return false;
  const expected = makeToken();
  // constant-time compare
  if (token.length !== expected.length) return false;
  return crypto.timingSafeEqual(Buffer.from(token), Buffer.from(expected));
}

export function verifyPassword(input: string): boolean {
  const pw = process.env.ADMIN_PASSWORD;
  if (!pw) return false;
  if (input.length !== pw.length) return false;
  return crypto.timingSafeEqual(Buffer.from(input), Buffer.from(pw));
}
