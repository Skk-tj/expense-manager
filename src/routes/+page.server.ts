import type { PageServerLoad } from './$types';
import {
	getMonthlyTrend,
	getMonthlyTrendByCategory,
	getSpendingOnMonthAndYear,
	getTotalForCategories
} from '$lib/server/queryService';

export const load: PageServerLoad = async ({ platform }) => {
	const thisMonth = new Date().getMonth() + 1;
	const thisYear = new Date().getFullYear();

	return {
		sum: await getSpendingOnMonthAndYear(platform?.env.db, thisMonth, thisYear),
		sumLastMonth: await getSpendingOnMonthAndYear(platform?.env.db, thisMonth - 1, thisYear),
		sumByCategories: await getTotalForCategories(platform?.env.db, thisMonth, thisYear),
		sumTrend: await getMonthlyTrend(platform?.env.db),
		sumTrendByCategory: await getMonthlyTrendByCategory(platform?.env.db)
	};
};
