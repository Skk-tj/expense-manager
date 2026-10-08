import { env } from 'cloudflare:workers';

import { getMonthlyTrend } from '#lib/server/queryService.js';

import type { RequestHandler } from './$types';

export const GET: RequestHandler = async () => {
	const sumTrend = await getMonthlyTrend(env.DB);
	return Response.json({ sumTrend });
};
