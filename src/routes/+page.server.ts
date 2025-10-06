import {
	getMonthlyTrend,
	getMonthlyTrendByCategory,
	getSpendingOnMonthAndYear,
	getTotalForCategories
} from '$lib/server/queryService';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ platform }) => {
	const thisMonth = new Date().getMonth() + 1;
	const thisYear = new Date().getFullYear();

	return {
		sum: await getSpendingOnMonthAndYear(platform?.env.DB, thisMonth, thisYear),
		sumLastMonth: await getSpendingOnMonthAndYear(platform?.env.DB, thisMonth - 1, thisYear),
		sumByCategories: await getTotalForCategories(platform?.env.DB, thisMonth, thisYear),
		sumTrend: await getMonthlyTrend(platform?.env.DB),
		sumTrendByCategory: await getMonthlyTrendByCategory(platform?.env.DB)
	};
};
