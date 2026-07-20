import { getSpendingOnMonthAndYear, getTotalForCategories } from '$lib/server/queryService';

import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ platform }) => {
	const thisMonth = new Date().getMonth() + 1;
	const thisYear = new Date().getFullYear();

	const lastMonth = thisMonth === 1 ? 12 : thisMonth - 1;
	const lastYear = thisMonth === 1 ? thisYear - 1 : thisYear;

	const [sum, sumLastMonth, sumByCategories] = await Promise.all([
		getSpendingOnMonthAndYear(platform?.env.DB, thisMonth, thisYear),
		getSpendingOnMonthAndYear(platform?.env.DB, lastMonth, lastYear),
		getTotalForCategories(platform?.env.DB, thisMonth, thisYear)
	]);

	return {
		sum,
		sumLastMonth,
		sumByCategories
	};
};
