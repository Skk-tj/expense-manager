import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { db } from '$lib/server/db';
import { expenses, expenseUpdateSchema } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';

export const POST: RequestHandler = async ({ request, platform }) => {
	const { id, category } = await request.json();

	const toUpdate = { categoryId: Number(category.id) };
	const parsed = expenseUpdateSchema.parse(toUpdate);

	await db(platform?.env.DB).update(expenses).set(parsed).where(eq(expenses.id, id));

	return json({ success: true });
};
