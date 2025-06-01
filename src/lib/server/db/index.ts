import { drizzle } from 'drizzle-orm/libsql';
import * as schema from './schema';
import { env } from '$env/dynamic/private';

export const db = drizzle(env.DB!, { schema, logger: true });
