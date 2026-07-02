import Link from 'next/link';
import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { ADMIN_COOKIE } from '../../lib/admin-auth';

export const metadata = { title: 'Admin | Potluck', robots: { index: false } };

async function logout() {
  'use server';
  const jar = await cookies();
  jar.delete(ADMIN_COOKIE);
  redirect('/admin/login');
}

const NAV = [
  { href: '/admin', label: 'Dashboard' },
  { href: '/admin/orders', label: 'Orders' },
  { href: '/admin/reviews', label: 'Reviews' },
  { href: '/admin/posts', label: 'Blog Posts' },
  { href: '/admin/categories', label: 'Categories' },
];

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // The login route renders its own standalone screen.
  const jar = await cookies();
  const isLoginScreen = !jar.get(ADMIN_COOKIE);
  if (isLoginScreen) {
    // Middleware already gates everything except /admin/login, so an
    // unauthenticated request here means we're on the login page.
    return <>{children}</>;
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <aside className="flex w-60 flex-col border-r border-gray-200 bg-white">
        <div className="flex items-center gap-2 border-b border-gray-200 px-5 py-4">
          <img src="/logo.png" alt="Potluck" className="h-8 w-8" />
          <span className="font-bold text-gray-900">Admin</span>
        </div>
        <nav className="flex-1 space-y-1 p-3">
          {NAV.map((n) => (
            <Link
              key={n.href}
              href={n.href}
              className="block rounded-lg px-3 py-2 text-sm font-medium text-gray-700 hover:bg-orange-50 hover:text-orange-600"
            >
              {n.label}
            </Link>
          ))}
        </nav>
        <div className="border-t border-gray-200 p-3">
          <Link href="/" className="block rounded-lg px-3 py-2 text-sm text-gray-500 hover:bg-gray-50">
            ← View site
          </Link>
          <form action={logout}>
            <button
              type="submit"
              className="mt-1 w-full rounded-lg px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50"
            >
              Log out
            </button>
          </form>
        </div>
      </aside>
      <main className="flex-1 overflow-x-hidden">
        <div className="mx-auto max-w-5xl px-6 py-8">{children}</div>
      </main>
    </div>
  );
}
