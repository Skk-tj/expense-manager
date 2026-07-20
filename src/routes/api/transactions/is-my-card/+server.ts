import { db } from '$lib/server/db';
import { expenses, expenseUpdateSchema } from '$lib/server/db/schema';
import { json } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';

import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request, platform }) => {
	const { id, isMyCard } = (await request.json()) as { id: number; isMyCard: boolean };

	const toUpdate = { isMyCard: isMyCard };
	const parsed = expenseUpdateSchema.parse(toUpdate);

	await db(platform?.env.DB).update(expenses).set(parsed).where(eq(expenses.id, id));

	return json({ success: true });
};
