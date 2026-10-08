import { eq } from 'drizzle-orm';

import { db } from '#lib/server/db/index.js';
import { expenses } from '#lib/server/db/schema.js';

import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request }) => {
	const { id, category } = (await request.json()) as { id: number; category: { id: string } };

	const toUpdate = { categoryId: Number(category.id) };

	await db().update(expenses).set(toUpdate).where(eq(expenses.id, id));

	return Response.json({ success: true });
};
