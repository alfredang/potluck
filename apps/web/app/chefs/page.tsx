import { redirect } from 'next/navigation';

// `/chefs` was an early prototype that duplicated chef discovery with a separate
// (stale) dataset and a mobile-app shell. Chef discovery now lives on `/explore`
// (backed by the canonical chefs-data.ts), so we permanently send visitors there.
export default function ChefsPage() {
  redirect('/explore');
}
