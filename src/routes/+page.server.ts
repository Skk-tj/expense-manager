import type { PageServerLoad } from './$types';
import { db } from '$lib/server/db';
import { expenseSelectSchema } from '$lib/server/db/schema';

export const load: PageServerLoad = async () => {
	const expense = await db.query.expenses.findMany({
		columns: {
			categoryId: false
		},
		with: {
			category: {
				columns: {
					category: true
				}
			}
		}
	});

	const mapped = expense.map((x) => {
		return {
			...x,
			category: x.category?.category ?? ''
		};
	});

	return {
		expense: mapped
	};
};
