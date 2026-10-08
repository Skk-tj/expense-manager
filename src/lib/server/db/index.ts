import { env } from 'cloudflare:workers';
import { drizzle } from 'drizzle-orm/d1';

import * as schema from './schema';

export const db = (database: D1Database = env.DB) => {
	if (!database) {
		throw new Error('Database is not defined');
	}
	return drizzle(database, { schema, logger: true });
};
