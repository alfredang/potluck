import 'dotenv/config';
import { drizzle } from 'drizzle-orm/node-postgres';
import pg from 'pg';
import { eq } from 'drizzle-orm';
import * as schema from './schema/index.js';

/**
 * Additive, idempotent seed for diner reviews.
 *
 * Reviews require a unique completed booking, so for each menu we create a few
 * completed bookings from sample diners, then attach a review (some with a chef
 * reply). Finally we recompute each chef's and menu's aggregate rating so the
 * "4.9 (N)" badges match the reviews actually shown. Re-running is safe: bookings
 * use deterministic booking numbers and reviews are keyed by their unique booking.
 */

// Use the same driver/config as the running API (node-postgres, ssl:false) so this
// works against the Coolify-hosted Postgres, not just Neon.
const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL!, ssl: false });
const db = drizzle({ client: pool, schema });

const DINERS = [
  { email: 'review.wei@potluckhub-diners.io', firstName: 'Wei Ling', lastName: 'Goh', avatarUrl: 'https://i.pravatar.cc/200?img=5' },
  { email: 'review.arjun@potluckhub-diners.io', firstName: 'Arjun', lastName: 'Menon', avatarUrl: 'https://i.pravatar.cc/200?img=12' },
  { email: 'review.siti@potluckhub-diners.io', firstName: 'Siti', lastName: 'Nurhaliza', avatarUrl: 'https://i.pravatar.cc/200?img=45' },
  { email: 'review.daniel@potluckhub-diners.io', firstName: 'Daniel', lastName: 'Lim', avatarUrl: 'https://i.pravatar.cc/200?img=33' },
  { email: 'review.mei@potluckhub-diners.io', firstName: 'Mei Chen', lastName: 'Tan', avatarUrl: 'https://i.pravatar.cc/200?img=20' },
  { email: 'review.rashid@potluckhub-diners.io', firstName: 'Rashid', lastName: 'Ismail', avatarUrl: 'https://i.pravatar.cc/200?img=15' },
  { email: 'review.priya@potluckhub-diners.io', firstName: 'Priya', lastName: 'Raj', avatarUrl: 'https://i.pravatar.cc/200?img=47' },
  { email: 'review.jason@potluckhub-diners.io', firstName: 'Jason', lastName: 'Ng', avatarUrl: 'https://i.pravatar.cc/200?img=51' },
];

// Pools of reviews. Each menu draws 3 from this pool (rotating), so wording varies.
const REVIEW_POOL: { rating: number; title: string; comment: string; reply?: string }[] = [
  { rating: 5, title: 'Tasted just like home', comment: 'Honestly better than most restaurants — you can taste the love in every bite. Will definitely book again lah.', reply: 'Thank you so much! So happy you enjoyed it. Come back anytime 🙏' },
  { rating: 5, title: 'A proper home-cooked spread', comment: 'Generous portions, warm host, and the flavours were spot on. Felt like makan at a friend\'s place.', reply: 'Appreciate the kind words! Always cook like I\'m feeding family.' },
  { rating: 4, title: 'Really enjoyed it', comment: 'Delicious and authentic. Only wish there was a bit more for the price, but I\'d come back.' },
  { rating: 5, title: 'Worth every cent', comment: 'Fresh ingredients, beautifully plated, and the chef even accommodated our dietary needs. Highly recommend.', reply: 'Glad the dietary swaps worked out for you. See you next time!' },
  { rating: 5, title: 'Best meal this month', comment: 'Brought my parents and they were so impressed. Cosy setting and the host was very welcoming.' },
  { rating: 4, title: 'Solid and comforting', comment: 'Tasty home cooking done right. Booking and payment on the app were smooth too.' },
  { rating: 5, title: 'Will be back for sure', comment: 'Everything was hot, fresh and full of flavour. The chef clearly takes pride in the food.', reply: 'Terima kasih! Means a lot coming from a fellow food lover 😊' },
  { rating: 3, title: 'Good but a little salty', comment: 'Flavours were there but slightly too salty for me. Service and portion were great though.' },
  { rating: 5, title: 'Authentic and heartfelt', comment: 'You don\'t get cooking like this outside someone\'s kitchen. Truly a hidden gem in the neighbourhood.' },
  { rating: 4, title: 'Lovely dinner', comment: 'Great value for a private home dining experience. Would recommend to friends.' },
];

const PAST_DAYS = [7, 14, 21, 30, 45, 60, 75, 90, 110, 130, 150, 180];

function daysAgo(n: number): Date {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d;
}

async function main() {
  if (!process.env.DATABASE_URL) {
    console.error('❌ DATABASE_URL is not set.');
    process.exit(1);
  }
  console.log('🌱 Seeding diner reviews…');

  // 1. Ensure sample diners exist.
  const dinerIds: string[] = [];
  for (const d of DINERS) {
    await db.insert(schema.users).values({
      email: d.email,
      firstName: d.firstName,
      lastName: d.lastName,
      role: 'customer',
      avatarUrl: d.avatarUrl,
      emailVerified: true,
    }).onConflictDoNothing();
    const [u] = await db.select().from(schema.users).where(eq(schema.users.email, d.email));
    if (u) dinerIds.push(u.id);
  }
  console.log(`  diners ready: ${dinerIds.length}`);

  // 2. Fetch chefs + menus.
  const menus = await db.select().from(schema.menus);
  console.log(`  menus found: ${menus.length}`);

  let reviewSeq = 0;
  let created = 0;

  // 3. For each menu, create up to 3 completed bookings + reviews.
  for (let mi = 0; mi < menus.length; mi++) {
    const menu = menus[mi];
    for (let j = 0; j < 3; j++) {
      const tpl = REVIEW_POOL[(mi * 3 + j) % REVIEW_POOL.length];
      const diner = dinerIds[(mi * 3 + j) % dinerIds.length];
      if (!diner) continue;

      const when = daysAgo(PAST_DAYS[(mi + j) % PAST_DAYS.length]);
      const guests = 2 + ((mi + j) % 3);
      const subtotal = menu.price * guests;
      const platformFee = Math.round(subtotal * 0.04);
      const total = subtotal + platformFee;
      const bookingNumber = `SR-${menu.id.slice(0, 6)}-${j}`; // deterministic → idempotent

      // Booking (completed). onConflictDoNothing on the unique booking_number.
      const insertedBooking = await db.insert(schema.bookings).values({
        bookingNumber,
        customerId: diner,
        chefId: menu.chefId,
        menuId: menu.id,
        scheduledDate: when.toISOString().slice(0, 10),
        scheduledTime: '19:00:00',
        guestCount: guests,
        menuPrice: menu.price,
        subtotal,
        platformFee,
        total,
        status: 'completed',
        confirmedAt: when,
        completedAt: when,
        termsAcceptedAt: when,
        createdAt: when,
        updatedAt: when,
      }).onConflictDoNothing().returning();

      let bookingId = insertedBooking[0]?.id;
      if (!bookingId) {
        const [existing] = await db.select().from(schema.bookings)
          .where(eq(schema.bookings.bookingNumber, bookingNumber));
        bookingId = existing?.id;
      }
      if (!bookingId) continue;

      // Review (one per booking — booking_id is unique).
      const before = await db.select().from(schema.reviews)
        .where(eq(schema.reviews.bookingId, bookingId));
      if (before.length === 0) {
        await db.insert(schema.reviews).values({
          bookingId,
          customerId: diner,
          chefId: menu.chefId,
          menuId: menu.id,
          rating: tpl.rating,
          title: tpl.title,
          comment: tpl.comment,
          chefResponse: tpl.reply ?? null,
          chefRespondedAt: tpl.reply ? when : null,
          isVerifiedPurchase: true,
          isVisible: true,
          createdAt: when,
          updatedAt: when,
        }).onConflictDoNothing();
        created++;
      }
      reviewSeq++;
    }
  }
  console.log(`  reviews created this run: ${created}`);

  // 4. Recompute aggregate ratings so badges match the visible reviews.
  const allReviews = await db.select().from(schema.reviews);

  const byChef = new Map<string, number[]>();
  const byMenu = new Map<string, number[]>();
  for (const r of allReviews) {
    if (!byChef.has(r.chefId)) byChef.set(r.chefId, []);
    if (!byMenu.has(r.menuId)) byMenu.set(r.menuId, []);
    byChef.get(r.chefId)!.push(r.rating);
    byMenu.get(r.menuId)!.push(r.rating);
  }

  for (const [chefId, ratings] of byChef) {
    const avg = ratings.reduce((a, b) => a + b, 0) / ratings.length;
    await db.update(schema.chefProfiles)
      .set({ averageRating: avg.toFixed(2), totalReviews: ratings.length })
      .where(eq(schema.chefProfiles.id, chefId));
  }
  for (const [menuId, ratings] of byMenu) {
    const avg = ratings.reduce((a, b) => a + b, 0) / ratings.length;
    await db.update(schema.menus)
      .set({ averageRating: avg.toFixed(2), totalOrders: ratings.length })
      .where(eq(schema.menus.id, menuId));
  }
  console.log(`  aggregates updated: ${byChef.size} chefs, ${byMenu.size} menus`);
  console.log(`✅ Done. Total reviews in DB: ${allReviews.length}`);
  process.exit(0);
}

main().catch((err) => {
  console.error('❌ Review seeding failed:', err);
  process.exit(1);
});
