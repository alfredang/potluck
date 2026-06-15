import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { ADMIN_COOKIE, makeToken, verifyPassword } from '../../../lib/admin-auth';

export const metadata = { title: 'Admin Login | Potluck', robots: { index: false } };

async function login(formData: FormData) {
  'use server';
  const password = String(formData.get('password') ?? '');
  if (!verifyPassword(password)) {
    redirect('/admin/login?error=1');
  }
  const jar = await cookies();
  jar.set(ADMIN_COOKIE, makeToken(), {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 60 * 60 * 24 * 7,
  });
  redirect('/admin');
}

export default async function AdminLogin({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;
  const configured = Boolean(process.env.ADMIN_PASSWORD);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-sm rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
        <div className="flex flex-col items-center">
          <img src="/logo.png" alt="Potluck" className="h-12 w-12 rounded-xl" />
          <h1 className="mt-4 text-xl font-bold text-gray-900">Potluck Admin</h1>
          <p className="mt-1 text-sm text-gray-500">Sign in to manage the blog</p>
        </div>

        {!configured && (
          <p className="mt-6 rounded-lg bg-amber-50 px-3 py-2 text-sm text-amber-700">
            Set <code>ADMIN_PASSWORD</code> in your environment to enable login.
          </p>
        )}
        {error && (
          <p className="mt-6 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
            Incorrect password. Try again.
          </p>
        )}

        <form action={login} className="mt-6 space-y-4">
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
            />
          </div>
          <button
            type="submit"
            className="w-full rounded-lg bg-orange-500 py-2.5 font-semibold text-white hover:bg-orange-600"
          >
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
}
