import { redirect } from 'next/navigation';

// `/meals` was an early prototype that duplicated meal browsing with a separate
// (stale) dataset and a mobile-app shell. Discovery now lives on `/explore`
// (backed by the canonical chefs-data.ts), so we permanently send visitors there.
export default function MealsPage() {
  redirect('/explore');
}
