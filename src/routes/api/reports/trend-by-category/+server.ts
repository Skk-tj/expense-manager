import { getMonthlyTrendByCategory } from '$lib/server/queryService';
import { json } from '@sveltejs/kit';

import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ platform }) => {
	const sumTrendByCategory = await getMonthlyTrendByCategory(platform?.env.DB);
	return json({ sumTrendByCategory });
};
