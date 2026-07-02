/**
 * Creates the checkout `orders` table + enums (idempotent — safe to re-run).
 * The app also self-migrates on first checkout via ensureOrdersSchema();
 * this script exists for provisioning a fresh environment ahead of traffic.
 * Run: pnpm --filter @homechef/web migrate:orders
 */
import { ensureOrdersSchema } from '../lib/orders';

ensureOrdersSchema()
  .then(() => {
    console.log('✓ orders table + enums are in place');
    process.exit(0);
  })
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
