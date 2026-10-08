import { redirect } from '@sveltejs/kit';
import { sql } from 'drizzle-orm';

import { db } from '#lib/server/db/index.js';
import { queuedPurchases } from '#lib/server/db/schema.js';

import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async (event) => {
	const session = await event.locals.auth();
	const currentPath = event.url.pathname;
	if (currentPath === '/auth/signin') {
		return {
			session,
			queuedCount: 0
		};
	}

	if (session?.user === null || session?.user === undefined) {
		redirect(303, '/auth/signin');
	}

	let queuedCount = 0;
	try {
		const [{ count }] = await db()
			.select({ count: sql`count(*)` })
			.from(queuedPurchases);
		queuedCount = Number(count);
	} catch (e) {
		console.error('Failed to get queued count', e);
	}

	return {
		session,
		queuedCount
	};
};
