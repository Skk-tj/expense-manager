import type { PageServerLoad } from './$types';
import { db } from '$lib/server/db';
import { expenseWithCategorySchema } from '$lib/server/db/schema';

export const load: PageServerLoad = async ({ platform }) => {
	const expense = await db(platform?.env.DB).query.expenses.findMany({
		with: {
			category: {}
		}
	});

	const parsed = expense.map((x) => expenseWithCategorySchema.parse(x));

	return {
		expense: parsed
	};
};
