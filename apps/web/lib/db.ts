import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';

// For Vercel serverless functions
const sql = neon(process.env.DATABASE_URL!);
export const db = drizzle({ client: sql });

// Re-export schema from shared package
export * from './schema';
