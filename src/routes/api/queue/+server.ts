import { env } from 'cloudflare:workers';
import { desc, eq } from 'drizzle-orm';

import { db } from '#lib/server/db/index.js';
import { queuedPurchases, categories } from '#lib/server/db/schema.js';

import type { RequestHandler } from './$types';

function extractToken(request: Request, url: URL, body?: Record<string, unknown>): string | null {
	const authHeader = request.headers.get('authorization');
	if (authHeader) {
		const match = authHeader.match(/^Bearer\s+(.+)$/i);
		if (match) return match[1].trim();
		return authHeader.trim();
	}

	const apiKeyHeader = request.headers.get('x-api-key');
	if (apiKeyHeader) return apiKeyHeader.trim();

	const urlKey =
		url.searchParams.get('key') || url.searchParams.get('token') || url.searchParams.get('apiKey');
	if (urlKey) return urlKey.trim();

	if (body && typeof body === 'object') {
		const bodyKey = body.key || body.token || body.apiKey;
		if (typeof bodyKey === 'string') return bodyKey.trim();
	}

	return null;
}

function isAuthorized(token: string | null): boolean {
	const validSecrets = [env.SHORTCUTS_API_KEY, env.API_KEY, env.AUTH_SECRET, env.PASSWORD].filter(
		(s): s is string => typeof s === 'string' && s.length > 0
	);

	// If no secrets are configured in the environment, allow (e.g. local dev)
	if (validSecrets.length === 0) {
		return true;
	}

	if (!token) return false;
	return validSecrets.includes(token);
}

function parseAmount(val: unknown): number | null {
	if (typeof val === 'number' && !Number.isNaN(val)) return Math.abs(val);
	if (typeof val === 'string') {
		const cleaned = val.replace(/[^0-9.-]+/g, '');
		const parsed = Number.parseFloat(cleaned);
		if (!Number.isNaN(parsed)) return Math.abs(parsed);
	}
	return null;
}

function parseDate(val: unknown): string {
	if (typeof val === 'string' && val.trim().length > 0) {
		const parsedDate = new Date(val);
		if (!Number.isNaN(parsedDate.getTime())) {
			return parsedDate.toISOString().split('T')[0];
		}
		const match = val.match(/^\d{4}-\d{2}-\d{2}/);
		if (match) return match[0];
	}
	if (typeof val === 'number') {
		const parsedDate = new Date(val);
		if (!Number.isNaN(parsedDate.getTime())) {
			return parsedDate.toISOString().split('T')[0];
		}
	}
	return new Date().toISOString().split('T')[0];
}

export const POST: RequestHandler = async ({ request, url, locals }) => {
	const body = ((await request.json().catch(() => ({}))) || {}) as Record<string, unknown>;

	const session = await locals.auth().catch(() => null);
	const token = extractToken(request, url, body);

	// If not logged in via session, check token
	if (!session?.user && !isAuthorized(token)) {
		return Response.json(
			{ error: 'Unauthorized: Invalid or missing API key/token' },
			{ status: 401 }
		);
	}

	const rawAmount = body.amount ?? body.price ?? body.value ?? body.cost;
	const amount = parseAmount(rawAmount);

	if (amount === null) {
		return Response.json(
			{
				error: 'Invalid or missing amount/price field',
				received: rawAmount
			},
			{ status: 400 }
		);
	}

	const currency =
		typeof body.currency === 'string' && body.currency.trim().length > 0
			? body.currency.trim().toUpperCase()
			: 'CAD';

	const transactionDate = parseDate(
		body.date ?? body.transactionDate ?? body.time ?? body.timestamp
	);
	const vendor =
		typeof body.vendor === 'string'
			? body.vendor.trim()
			: typeof body.merchant === 'string'
				? body.merchant.trim()
				: null;
	const extraInfo =
		typeof body.extraInfo === 'string'
			? body.extraInfo.trim()
			: typeof body.note === 'string'
				? body.note.trim()
				: typeof body.card === 'string'
					? `Card: ${body.card.trim()}`
					: null;

	let isMyCard = true;
	if (typeof body.isMyCard === 'boolean') {
		isMyCard = body.isMyCard;
	} else if (typeof body.isMyCard === 'string') {
		isMyCard = body.isMyCard.toLowerCase() !== 'false';
	} else if (typeof body.myCard === 'boolean') {
		isMyCard = body.myCard;
	}

	let categoryId: number | null = null;
	if (typeof body.categoryId === 'number') {
		categoryId = body.categoryId;
	} else if (typeof body.categoryId === 'string') {
		const parsed = Number.parseInt(body.categoryId, 10);
		if (!Number.isNaN(parsed)) categoryId = parsed;
	}

	const [created] = await db(env.DB)
		.insert(queuedPurchases)
		.values({
			price: amount,
			currency,
			transactionDate,
			vendor: vendor || null,
			categoryId,
			isMyCard,
			extraInfo: extraInfo || null
		})
		.returning();

	return Response.json({
		success: true,
		message: 'Queued purchase created successfully',
		purchase: created
	});
};

export const GET: RequestHandler = async ({ locals, request, url }) => {
	const session = await locals.auth().catch(() => null);
	const token = extractToken(request, url);

	if (!session?.user && !isAuthorized(token)) {
		return Response.json({ error: 'Unauthorized' }, { status: 401 });
	}

	const items = await db(env.DB)
		.select({
			id: queuedPurchases.id,
			transactionDate: queuedPurchases.transactionDate,
			price: queuedPurchases.price,
			currency: queuedPurchases.currency,
			vendor: queuedPurchases.vendor,
			categoryId: queuedPurchases.categoryId,
			isMyCard: queuedPurchases.isMyCard,
			extraInfo: queuedPurchases.extraInfo,
			createdAt: queuedPurchases.createdAt,
			category: categories
		})
		.from(queuedPurchases)
		.leftJoin(categories, eq(categories.id, queuedPurchases.categoryId))
		.orderBy(desc(queuedPurchases.id));

	return Response.json({
		count: items.length,
		items
	});
};

export const DELETE: RequestHandler = async ({ request, locals, url }) => {
	const session = await locals.auth().catch(() => null);
	const token = extractToken(request, url);

	if (!session?.user && !isAuthorized(token)) {
		return Response.json({ error: 'Unauthorized' }, { status: 401 });
	}

	let id: number | null = null;
	try {
		const body = (await request.json()) as { id?: number };
		if (typeof body.id === 'number') id = body.id;
	} catch {
		const urlId = url.searchParams.get('id');
		if (urlId) id = Number.parseInt(urlId, 10);
	}

	if (!id) {
		return Response.json({ error: 'Missing or invalid ID' }, { status: 400 });
	}

	await db(env.DB).delete(queuedPurchases).where(eq(queuedPurchases.id, id));

	return Response.json({ success: true, id });
};
