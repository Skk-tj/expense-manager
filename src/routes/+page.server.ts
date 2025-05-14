import type { PageServerLoad } from './$types';
import { db } from '$lib/server/db';
import { expenses } from '$lib/server/db/schema';
import { sum } from 'drizzle-orm/sql/functions/aggregate';
import { and, sql } from 'drizzle-orm';

export const load: PageServerLoad = async () => {
	const thisMonth = new Date().getMonth() + 1;
	const thisYear = new Date().getFullYear();

	const theSum = await db
		.select({ value: sum(expenses.price) })
		.from(expenses)
		.where(
			and(
				sql`CAST(strftime('%m', ${expenses.transactionDate}) as INT) = ${thisMonth}`,
				sql`CAST(strftime('%Y', ${expenses.transactionDate}) as INT) = ${thisYear}`
			)
		);

	return {
		sum: Number.parseFloat(theSum[0]?.value ?? '0')
	};
};
