import { db } from '$lib/server/db';
import { expenses } from '$lib/server/db/schema';
import { json } from '@sveltejs/kit';

export const GET = async ({ platform }) => {
	const data = await db(platform?.env.DB)
		.selectDistinct({ vendor: expenses.vendor })
		.from(expenses)
		.orderBy(expenses.vendor);
	return json(data.map((d) => d.vendor));
};
