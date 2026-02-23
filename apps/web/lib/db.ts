import { drizzle } from 'drizzle-orm/node-postgres';
import pg from 'pg';

const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL!,
  ssl: false,
});

export const db = drizzle({ client: pool });

// Re-export schema from shared package
export * from './schema';
