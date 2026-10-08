import { and, eq, sql } from 'drizzle-orm';
import { sum } from 'drizzle-orm/sql/functions/aggregate';

import {
	convertCurrencyToCad,
	getExchangeRates,
	type CurrencyBreakdownItem
} from '#lib/server/currency.js';
import { db } from '#lib/server/db/index.js';
import { categories, expenses } from '#lib/server/db/schema.js';

export async function getSpendingByCurrencyOnMonthAndYear(
	d1: D1Database | undefined,
	month: number,
	year: number
) {
	const rows = await db(d1)
		.select({
			currency: expenses.currency,
			sum: sum(expenses.price)
		})
		.from(expenses)
		.where(
			and(
				sql`CAST(strftime('%m',${expenses.transactionDate}) as INT) = ${month}`,
				sql`CAST(strftime('%Y',${expenses.transactionDate}) as INT) = ${year}`
			)
		)
		.groupBy(expenses.currency);

	return rows.map((r) => ({
		currency: r.currency || 'CAD',
		sum: Number.parseFloat(r.sum ?? '0')
	}));
}

export async function getSpendingOnMonthAndYear(
	d1: D1Database | undefined,
	month: number,
	year: number,
	rates?: Record<string, number>
) {
	const exchangeRates = rates ?? (await getExchangeRates());
	const byCurrency = await getSpendingByCurrencyOnMonthAndYear(d1, month, year);
	return byCurrency.reduce(
		(total, item) => total + convertCurrencyToCad(item.sum, item.currency, exchangeRates),
		0
	);
}

export async function getMonthlySpendingSummary(
	d1: D1Database | undefined,
	month: number,
	year: number,
	rates?: Record<string, number>
): Promise<{ totalCad: number; breakdown: CurrencyBreakdownItem[] }> {
	const exchangeRates = rates ?? (await getExchangeRates());
	const byCurrency = await getSpendingByCurrencyOnMonthAndYear(d1, month, year);

	const breakdown: CurrencyBreakdownItem[] = byCurrency.map((item) => {
		const currency = item.currency.toUpperCase();
		const originalAmount = item.sum;
		const cadAmount = convertCurrencyToCad(originalAmount, currency, exchangeRates);
		const rate = exchangeRates[currency] ?? 1.0;
		return {
			currency,
			originalAmount,
			cadAmount,
			rate
		};
	});

	// Sort CAD first, then by cadAmount descending
	breakdown.sort((a, b) => {
		if (a.currency === 'CAD') return -1;
		if (b.currency === 'CAD') return 1;
		return b.cadAmount - a.cadAmount;
	});

	const totalCad = breakdown.reduce((acc, item) => acc + item.cadAmount, 0);

	return {
		totalCad,
		breakdown
	};
}

export async function getTotalForCategories(
	d1: D1Database | undefined,
	month: number,
	year: number,
	rates?: Record<string, number>
) {
	const exchangeRates = rates ?? (await getExchangeRates());
	const byCategory = await db(d1)
		.select({
			category: categories.category,
			currency: expenses.currency,
			sum: sum(expenses.price)
		})
		.from(expenses)
		.innerJoin(categories, eq(categories.id, expenses.categoryId))
		.where(
			and(
				sql`CAST(strftime('%m',${expenses.transactionDate}) as INT) = ${month}`,
				sql`CAST(strftime('%Y',${expenses.transactionDate}) as INT) = ${year}`
			)
		)
		.groupBy(expenses.categoryId, expenses.currency);

	const categoryMap = new Map<string, number>();
	for (const x of byCategory) {
		const amount = Number.parseFloat(x.sum ?? '0');
		const cad = convertCurrencyToCad(amount, x.currency || 'CAD', exchangeRates);
		categoryMap.set(x.category, (categoryMap.get(x.category) ?? 0) + cad);
	}

	return Array.from(categoryMap.entries()).map(([category, catSum]) => ({
		category,
		sum: catSum
	}));
}

export async function getMonthlyTrend(d1: D1Database | undefined, rates?: Record<string, number>) {
	const exchangeRates = rates ?? (await getExchangeRates());
	const trend = await db(d1)
		.select({
			month: sql`strftime('%m', transaction_date)`,
			year: sql`strftime('%Y', transaction_date)`,
			currency: expenses.currency,
			sum: sum(expenses.price)
		})
		.from(expenses)
		.groupBy(
			sql`CAST(strftime('%m', transaction_date) as INT), CAST(strftime('%Y', transaction_date) as INT), expenses.currency`
		);

	const byMonth = new Map<string, { date: [number, number]; sum: number }>();
	for (const { month, year, currency, sum } of trend) {
		const key = `${year}-${month}`;
		const cad = convertCurrencyToCad(
			Number.parseFloat(sum ?? '0'),
			(currency as string) || 'CAD',
			exchangeRates
		);
		const existing = byMonth.get(key);
		if (existing) {
			existing.sum += cad;
		} else {
			byMonth.set(key, {
				date: [Number(year), Number(month)],
				sum: cad
			});
		}
	}

	return Array.from(byMonth.values()).sort((a, b) => {
		if (a.date[0] !== b.date[0]) {
			return a.date[0] - b.date[0];
		}
		return a.date[1] - b.date[1];
	});
}

export async function getMonthlyTrendByCategory(
	d1: D1Database | undefined,
	rates?: Record<string, number>
) {
	const exchangeRates = rates ?? (await getExchangeRates());
	const trend = await db(d1)
		.select({
			month: sql`strftime('%m', transaction_date)`,
			year: sql`strftime('%Y', transaction_date)`,
			category: categories.category,
			category_id: expenses.categoryId,
			currency: expenses.currency,
			sum: sum(expenses.price)
		})
		.from(expenses)
		.innerJoin(categories, eq(categories.id, expenses.categoryId))
		.groupBy(
			sql`CAST(strftime('%m', transaction_date) as INT), CAST(strftime('%Y', transaction_date) as INT), category_id, expenses.currency`
		);

	const byCategory = trend.reduce(
		(acc, { month, year, category_id, currency, sum }) => {
			const timeKey = `${year}-${month}`;
			if (!acc[timeKey]) {
				acc[timeKey] = {
					time: [Number(year), Number(month)]
				};
			}
			const cad = convertCurrencyToCad(
				Number.parseFloat(sum ?? '0'),
				(currency as string) || 'CAD',
				exchangeRates
			);
			acc[timeKey][category_id] = Number(acc[timeKey][category_id] ?? 0) + cad;
			return acc;
		},
		{} as Record<string, { time: [number, number]; [key: string]: number | [number, number] }>
	);

	return Object.values(byCategory).sort((a, b) => {
		if (a.time[0] !== b.time[0]) {
			return a.time[0] - b.time[0];
		}
		return a.time[1] - b.time[1];
	});
}
