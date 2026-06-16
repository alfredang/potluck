import Link from 'next/link';

/**
 * Server-rendered pagination control for blog listings.
 * `basePath` is the route (e.g. "/blog" or "/blog/category/recipes").
 * Page 1 links omit the ?page param so the canonical stays clean.
 */
export function Pager({
  basePath,
  page,
  totalPages,
}: {
  basePath: string;
  page: number;
  totalPages: number;
}) {
  if (totalPages <= 1) return null;

  const href = (p: number) => (p <= 1 ? basePath : `${basePath}?page=${p}`);

  // Window of page numbers around the current page.
  const pages: number[] = [];
  const start = Math.max(1, page - 2);
  const end = Math.min(totalPages, start + 4);
  for (let p = Math.max(1, end - 4); p <= end; p++) pages.push(p);

  const linkBase =
    'inline-flex h-11 min-w-11 items-center justify-center rounded-xl px-3 text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2';

  return (
    <nav aria-label="Pagination" className="mt-12 flex flex-wrap items-center justify-center gap-2">
      {page > 1 ? (
        <Link href={href(page - 1)} rel="prev" className={`${linkBase} border border-orange-200 bg-white text-gray-700 hover:border-orange-300 hover:text-orange-600`}>
          ← Prev
        </Link>
      ) : (
        <span aria-disabled className={`${linkBase} cursor-not-allowed border border-orange-100 bg-orange-50/40 text-gray-300`}>
          ← Prev
        </span>
      )}

      {pages[0] > 1 && (
        <>
          <Link href={href(1)} className={`${linkBase} border border-orange-200 bg-white text-gray-700 hover:border-orange-300 hover:text-orange-600`}>1</Link>
          {pages[0] > 2 && <span className="px-1 text-gray-400">…</span>}
        </>
      )}

      {pages.map((p) =>
        p === page ? (
          <span key={p} aria-current="page" className={`${linkBase} bg-orange-500 text-white shadow-warm`}>
            {p}
          </span>
        ) : (
          <Link key={p} href={href(p)} className={`${linkBase} border border-orange-200 bg-white text-gray-700 hover:border-orange-300 hover:text-orange-600`}>
            {p}
          </Link>
        ),
      )}

      {pages[pages.length - 1] < totalPages && (
        <>
          {pages[pages.length - 1] < totalPages - 1 && <span className="px-1 text-gray-400">…</span>}
          <Link href={href(totalPages)} className={`${linkBase} border border-orange-200 bg-white text-gray-700 hover:border-orange-300 hover:text-orange-600`}>{totalPages}</Link>
        </>
      )}

      {page < totalPages ? (
        <Link href={href(page + 1)} rel="next" className={`${linkBase} border border-orange-200 bg-white text-gray-700 hover:border-orange-300 hover:text-orange-600`}>
          Next →
        </Link>
      ) : (
        <span aria-disabled className={`${linkBase} cursor-not-allowed border border-orange-100 bg-orange-50/40 text-gray-300`}>
          Next →
        </span>
      )}
    </nav>
  );
}
