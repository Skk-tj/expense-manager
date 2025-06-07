import { drizzle } from 'drizzle-orm/d1';
import * as schema from './schema';
import type { D1Database } from '@cloudflare/workers-types';

export const db = (database: D1Database | undefined) => {
	if (!database) {
		throw new Error('Database is not defined');
	}
	return drizzle(database, { schema, logger: true });
};
