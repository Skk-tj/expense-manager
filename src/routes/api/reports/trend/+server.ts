import { getMonthlyTrend } from '$lib/server/queryService';
import { json } from '@sveltejs/kit';

import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ platform }) => {
	const sumTrend = await getMonthlyTrend(platform?.env.DB);
	return json({ sumTrend });
};
