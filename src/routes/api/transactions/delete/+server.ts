import { db } from '$lib/server/db';
import { expenses } from '$lib/server/db/schema';
import { json } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';

import type { RequestHandler } from './$types';

export const DELETE: RequestHandler = async ({ request, platform }) => {
	const { id } = (await request.json()) as { id: number };

	if (!id) {
		return json({ success: false, error: 'Missing ID' }, { status: 400 });
	}

	await db(platform?.env.DB).delete(expenses).where(eq(expenses.id, id));

	return json({ success: true });
};
