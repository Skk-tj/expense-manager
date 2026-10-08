import { eq } from 'drizzle-orm';

import { db } from '#lib/server/db/index.js';
import { expenses } from '#lib/server/db/schema.js';

import type { RequestHandler } from './$types';

const ALLOWED_CURRENCIES = ['CAD', 'USD', 'JPY'] as const;
type AllowedCurrency = (typeof ALLOWED_CURRENCIES)[number];

export const POST: RequestHandler = async ({ request }) => {
	const { id, currency } = (await request.json()) as { id: number; currency: string };

	if (!id || typeof id !== 'number') {
		return Response.json({ error: 'Invalid expense id' }, { status: 400 });
	}

	const normalizedCurrency = currency?.toUpperCase().trim();
	if (!ALLOWED_CURRENCIES.includes(normalizedCurrency as AllowedCurrency)) {
		return Response.json(
			{ error: `Currency must be one of: ${ALLOWED_CURRENCIES.join(', ')}` },
			{ status: 400 }
		);
	}

	await db().update(expenses).set({ currency: normalizedCurrency }).where(eq(expenses.id, id));

	return Response.json({ success: true });
};
