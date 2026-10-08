import { eq } from 'drizzle-orm';

import { db } from '#lib/server/db/index.js';
import { expenses } from '#lib/server/db/schema.js';

import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request }) => {
	const { id, vendor } = (await request.json()) as { id: number; vendor: string };

	const toUpdate = { vendor: vendor };

	await db().update(expenses).set(toUpdate).where(eq(expenses.id, id));

	return Response.json({ success: true });
};
