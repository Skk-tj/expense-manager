import type { PageServerLoad } from './$types';
import {
	getMonthlyTrend,
	getMonthlyTrendByCategory,
	getSpendingOnMonthAndYear,
	getTotalForCategories
} from '$lib/server/queryService';

export const load: PageServerLoad = async () => {
	const thisMonth = new Date().getMonth() + 1;
	const thisYear = new Date().getFullYear();

	return {
		sum: await getSpendingOnMonthAndYear(thisMonth, thisYear),
		sumLastMonth: await getSpendingOnMonthAndYear(thisMonth - 1, thisYear),
		sumByCategories: await getTotalForCategories(thisMonth, thisYear),
		sumTrend: await getMonthlyTrend(),
		sumTrendByCategory: await getMonthlyTrendByCategory()
	};
};
