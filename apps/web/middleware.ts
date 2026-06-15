import { NextResponse, type NextRequest } from 'next/server';

const ADMIN_COOKIE = 'pl_admin';

// Edge-safe HMAC-SHA256 (matches the Node crypto token in lib/admin-auth.ts).
async function expectedToken(): Promise<string> {
  const secret = process.env.ADMIN_PASSWORD || 'change-me-potluck-admin';
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey(
    'raw',
    enc.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign'],
  );
  const sig = await crypto.subtle.sign('HMAC', key, enc.encode('potluck-admin-v1'));
  return [...new Uint8Array(sig)].map((b) => b.toString(16).padStart(2, '0')).join('');
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Allow the login page and its assets through.
  if (pathname === '/admin/login') return NextResponse.next();

  const token = req.cookies.get(ADMIN_COOKIE)?.value;
  if (token && token === (await expectedToken())) {
    return NextResponse.next();
  }

  const url = req.nextUrl.clone();
  url.pathname = '/admin/login';
  url.searchParams.set('from', pathname);
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ['/admin/:path*'],
};
