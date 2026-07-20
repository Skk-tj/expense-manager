import { db } from '$lib/server/db';
import { expenses } from '$lib/server/db/schema';
import { json } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';

import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request, platform }) => {
	const { id, isMyCard } = (await request.json()) as { id: number; isMyCard: boolean };

	const toUpdate = { isMyCard: isMyCard };

	await db(platform?.env.DB).update(expenses).set(toUpdate).where(eq(expenses.id, id));

	return json({ success: true });
};
