import { db } from '$lib/server/db';
import { expenses } from '$lib/server/db/schema';
import { json } from '@sveltejs/kit';

import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ platform }) => {
	const data = await db(platform?.env.DB)
		.selectDistinct({ vendor: expenses.vendor })
		.from(expenses)
		.orderBy(expenses.vendor);
	return json(data.map((d) => d.vendor));
};
