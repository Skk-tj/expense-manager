import { eq } from 'drizzle-orm';

import { db } from '#lib/server/db/index.js';
import { expenses } from '#lib/server/db/schema.js';

import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request }) => {
	const { id, extraInfo } = (await request.json()) as { id: number; extraInfo: string };

	const toUpdate = { extraInfo: extraInfo };

	await db().update(expenses).set(toUpdate).where(eq(expenses.id, id));

	return Response.json({ success: true });
};
