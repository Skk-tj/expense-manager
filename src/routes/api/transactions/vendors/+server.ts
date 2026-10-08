import { db } from '#lib/server/db/index.js';
import { expenses } from '#lib/server/db/schema.js';

import type { RequestHandler } from './$types';

export const GET: RequestHandler = async () => {
	const data = await db()
		.selectDistinct({ vendor: expenses.vendor })
		.from(expenses)
		.orderBy(expenses.vendor);
	return Response.json(data.map((d) => d.vendor));
};
