import { db } from '$lib/server/db';
import { sum } from 'drizzle-orm/sql/functions/aggregate';
import { categories, expenses } from '$lib/server/db/schema';
import { and, eq, sql } from 'drizzle-orm';

export async function getSpendingOnMonthAndYear(month: number, year: number) {
	const theSumThisMonth = await db
		.select({ value: sum(expenses.price) })
		.from(expenses)
		.where(
			and(
				sql`CAST(strftime('%m',${expenses.transactionDate}) as INT) = ${month}`,
				sql`CAST(strftime('%Y',${expenses.transactionDate}) as INT) = ${year}`
			)
		);

	return Number.parseFloat(theSumThisMonth[0]?.value ?? '0');
}

export async function getTotalForCategories(month: number, year: number) {
	const byCategory = await db
		.select({ category: categories.category, sum: sum(expenses.price) })
		.from(expenses)
		.innerJoin(categories, eq(categories.id, expenses.categoryId))
		.where(
			and(
				sql`CAST(strftime('%m',${expenses.transactionDate}) as INT) = ${month}`,
				sql`CAST(strftime('%Y',${expenses.transactionDate}) as INT) = ${year}`
			)
		)
		.groupBy(expenses.categoryId);

	return byCategory.map((x) => {
		return {
			category: x.category,
			sum: Number.parseFloat(x.sum ?? '0')
		};
	});
}

export async function getMonthlyTrend() {
	const trend = await db
		.select({
			month: sql`strftime('%m', transaction_date)`,
			year: sql`strftime('%Y', transaction_date)`,
			sum: sum(expenses.price)
		})
		.from(expenses)
		.groupBy(
			sql`CAST(strftime('%m', transaction_date) as INT), CAST(strftime('%Y', transaction_date) as INT)`
		);

	return trend
		.map(({ month, year, sum }) => {
			return {
				date: [Number(year), Number(month)] as [number, number],
				sum: Number.parseFloat(sum ?? '0')
			};
		})
		.sort((a, b) => {
			if (a.date[0] !== b.date[0]) {
				return a.date[0] - b.date[0];
			}
			// If years are equal, compare months
			return a.date[1] - a.date[1];
		});
}

export async function getMonthlyTrendByCategory() {
	const trend = await db
		.select({
			month: sql`strftime('%m', transaction_date)`,
			year: sql`strftime('%Y', transaction_date)`,
			category: categories.category,
			category_id: expenses.categoryId,
			sum: sum(expenses.price)
		})
		.from(expenses)
		.innerJoin(categories, eq(categories.id, expenses.categoryId))
		.groupBy(
			sql`CAST(strftime('%m', transaction_date) as INT), CAST(strftime('%Y', transaction_date) as INT), category_id`
		);

	const byCategory = trend.reduce(
		(acc, { month, year, category_id, sum }) => {
			const timeKey = `${year}-${month}`;
			if (!acc[timeKey]) {
				acc[timeKey] = {
					time: [Number(year), Number(month)]
				};
			}
			acc[timeKey][category_id] = Number.parseFloat(sum ?? '0');
			return acc;
		},
		{} as Record<string, { time: [number, number]; [key: string]: number | [number, number] }>
	);

	return Object.values(byCategory).sort((a, b) => {
		if (a.time[0] !== b.time[0]) {
			return a.time[0] - b.time[0];
		}
		// If years are equal, compare months
		return a.time[1] - a.time[1];
	});
}
