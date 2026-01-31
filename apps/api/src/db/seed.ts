import 'dotenv/config';
import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';
import * as schema from './schema/index.js';
import { FOOD_CATEGORIES } from '@homechef/shared';

const sql = neon(process.env.DATABASE_URL!);
const db = drizzle({ client: sql, schema });

async function seed() {
  console.log('🌱 Seeding database...');

  // Seed menu categories
  console.log('Creating menu categories...');
  for (const category of FOOD_CATEGORIES) {
    await db
      .insert(schema.menuCategories)
      .values({
        name: category.name,
        slug: category.slug,
        description: `Delicious ${category.name} cuisine`,
        displayOrder: FOOD_CATEGORIES.indexOf(category),
      })
      .onConflictDoNothing();
  }

  console.log('✅ Seeding complete!');
  process.exit(0);
}

seed().catch((err) => {
  console.error('❌ Seeding failed:', err);
  process.exit(1);
});
