import { drizzle } from 'drizzle-orm/node-postgres';
import pg from 'pg';
import * as schema from './schema/index.js';

console.log('[DB] Initializing database connection...');
console.log('[DB] DATABASE_URL:', process.env.DATABASE_URL?.replace(/:[^:@]+@/, ':***@'));

const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL!,
  ssl: false,
  max: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 10000,
});

pool.on('error', (err) => {
  console.error('[DB] Pool error:', err.message);
});

pool.on('connect', () => {
  console.log('[DB] Connected to PostgreSQL');
});

export const db = drizzle({ client: pool, schema });

export type Database = typeof db;
export { schema };
