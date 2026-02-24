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

// Log pool errors without crashing the process — connections will be retried.
pool.on('error', (err) => {
  console.error('[DB] Pool error (non-fatal):', err.message);
});

pool.on('connect', () => {
  console.log('[DB] Connected to PostgreSQL');
});

export const db = drizzle({ client: pool, schema });

/**
 * Attempt a lightweight connection test.
 * Returns true on success, false on failure — never throws.
 */
export async function testConnection(): Promise<boolean> {
  try {
    const client = await pool.connect();
    await client.query('SELECT 1');
    client.release();
    console.log('[DB] Connection test passed');
    return true;
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error('[DB] Connection test failed (server will still start):', msg);
    return false;
  }
}

export type Database = typeof db;
export { schema };
