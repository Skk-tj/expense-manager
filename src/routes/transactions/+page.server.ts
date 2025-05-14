import type { PageServerLoad } from './$types';
import { db } from '$lib/server/db';
import { expenseWithCategorySchema } from '$lib/server/db/schema';

export const load: PageServerLoad = async () => {
	const expense = await db.query.expenses.findMany({
		with: {
			category: {}
		}
	});

	const parsed = expense.map((x) => expenseWithCategorySchema.parse(x));

	return {
		expense: parsed
	};
};
