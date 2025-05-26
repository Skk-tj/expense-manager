import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { db } from '$lib/server/db';
import { expenses, expenseUpdateSchema } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';

export const POST: RequestHandler = async ({ request }) => {
	const { id, transactionDate } = await request.json();

	const toUpdate = { transactionDate: transactionDate };
	const parsed = expenseUpdateSchema.parse(toUpdate);

	await db.update(expenses).set(parsed).where(eq(expenses.id, id));

	return json({ success: true });
};
