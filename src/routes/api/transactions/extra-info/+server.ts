import { db } from '$lib/server/db';
import { expenses, expenseUpdateSchema } from '$lib/server/db/schema';
import type { RequestHandler } from './$types';
import { json } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';

export const POST: RequestHandler = async ({ request, platform }) => {
	const { id, extraInfo } = await request.json();

	const toUpdate = { extraInfo: extraInfo };
	const parsed = expenseUpdateSchema.parse(toUpdate);

	await db(platform?.env.DB).update(expenses).set(parsed).where(eq(expenses.id, id));

	return json({ success: true });
};
