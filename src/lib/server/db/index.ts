import { drizzle } from 'drizzle-orm/d1';
import * as schema from './schema';
import type { D1Database } from '@cloudflare/workers-types';

export const db = (database: D1Database) => drizzle(database, { schema, logger: true });
