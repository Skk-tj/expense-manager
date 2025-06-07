import { drizzle } from 'drizzle-orm/libsql';
import * as schema from './schema';
import type { AnyD1Database } from 'drizzle-orm/d1';

export const db = (database: AnyD1Database) => drizzle(database, { schema, logger: true });
