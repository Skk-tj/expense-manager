import type { PageServerLoad } from './$types';
import { db } from '$lib/server/db';
import { expenseSelectSchema } from '$lib/server/db/schema';
import { z } from 'zod';

export const load: PageServerLoad = async () => {
	const expense = await db.query.expenses.findMany({
		with: {
			category: {}
		}
	});

	const parsed = expense.map((x) =>
		expenseSelectSchema
			.extend({
				category: z.object({
					id: z.number().int(),
					category: z.string()
				})
			})
			.parse(x)
	);

	return {
		expense: parsed
	};
};
