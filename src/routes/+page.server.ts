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

	const lastMonth = thisMonth === 1 ? 12 : thisMonth - 1;
	const lastYear = thisMonth === 1 ? thisYear - 1 : thisYear;

	return {
		sum: await getSpendingOnMonthAndYear(platform?.env.DB, thisMonth, thisYear),
		sumLastMonth: await getSpendingOnMonthAndYear(platform?.env.DB, lastMonth, lastYear),
		sumByCategories: await getTotalForCategories(platform?.env.DB, thisMonth, thisYear),
		sumTrend: await getMonthlyTrend(platform?.env.DB),
		sumTrendByCategory: await getMonthlyTrendByCategory(platform?.env.DB)
	};
};
