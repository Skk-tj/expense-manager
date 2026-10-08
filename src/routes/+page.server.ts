import { env } from 'cloudflare:workers';

import { getExchangeRates } from '#lib/server/currency.js';
import {
	getMonthlySpendingSummary,
	getSpendingOnMonthAndYear,
	getTotalForCategories
} from '#lib/server/queryService.js';

import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	const thisMonth = new Date().getMonth() + 1;
	const thisYear = new Date().getFullYear();

	const lastMonth = thisMonth === 1 ? 12 : thisMonth - 1;
	const lastYear = thisMonth === 1 ? thisYear - 1 : thisYear;

	const rates = await getExchangeRates();

	const [{ totalCad: sum, breakdown: currencyBreakdown }, sumLastMonth, sumByCategories] =
		await Promise.all([
			getMonthlySpendingSummary(env.DB, thisMonth, thisYear, rates),
			getSpendingOnMonthAndYear(env.DB, lastMonth, lastYear, rates),
			getTotalForCategories(env.DB, thisMonth, thisYear, rates)
		]);

	return {
		sum,
		sumLastMonth,
		currencyBreakdown,
		sumByCategories
	};
};
