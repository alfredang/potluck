import { drizzle } from 'drizzle-orm/node-postgres';
import pg from 'pg';
import * as schema from './schema/index.js';

const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL!,
  ssl: false,
});

export const db = drizzle({ client: pool, schema });

export type Database = typeof db;
export { schema };
