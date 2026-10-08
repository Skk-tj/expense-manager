import { eq } from 'drizzle-orm';

import { db } from '#lib/server/db/index.js';
import { expenses } from '#lib/server/db/schema.js';

import type { RequestHandler } from './$types';

export const DELETE: RequestHandler = async ({ request }) => {
	const { id } = (await request.json()) as { id: number };

	if (!id) {
		return Response.json({ success: false, error: 'Missing ID' }, { status: 400 });
	}

	await db().delete(expenses).where(eq(expenses.id, id));

	return Response.json({ success: true });
};
