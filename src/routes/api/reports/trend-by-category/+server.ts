import { env } from 'cloudflare:workers';

import { getMonthlyTrendByCategory } from '#lib/server/queryService.js';

import type { RequestHandler } from './$types';

export const GET: RequestHandler = async () => {
	const sumTrendByCategory = await getMonthlyTrendByCategory(env.DB);
	return Response.json({ sumTrendByCategory });
};
