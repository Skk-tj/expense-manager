import { db } from '$lib/server/db';
import { type Expense, expenseInsertSchema, expenses } from '$lib/server/db/schema';
import { fail, redirect } from '@sveltejs/kit';
import { z } from 'zod';

import type { Actions, PageServerLoad } from './$types';

import { desc } from 'drizzle-orm';

export const load: PageServerLoad = async ({ platform }) => {
	const allExpenses = await db(platform?.env.DB)
		.select()
		.from(expenses)
		.orderBy(desc(expenses.transactionDate));

	const vendorAutofill: Record<string, any[]> = {};
	
	for (const exp of allExpenses) {
		if (!vendorAutofill[exp.vendor]) {
			vendorAutofill[exp.vendor] = [];
		}
		if (vendorAutofill[exp.vendor].length < 5) {
			vendorAutofill[exp.vendor].push({
				date: exp.transactionDate,
				amount: exp.price,
				categoryId: String(exp.categoryId),
				currency: exp.currency,
				isMyCard: exp.isMyCard,
				extraInfo: exp.extraInfo ?? ''
			});
		}
	}

	return {
		vendors: Object.keys(vendorAutofill).sort(),
		vendorAutofill
	};
};

export const actions = {
	default: async ({ request, platform }) => {
		const data = await request.formData();

		const date = data.get('date');
		const amount = data.get('amount');
		const vendor = data.get('vendor');
		const category = data.get('categories');
		const isMyCard = data.get('isMyCard');
		const extraInfo = data.get('extraInfo');
		const currency = data.get('currency');

		const expenseToInsert: Omit<Expense, 'id'> = {
			transactionDate: String(date),
			vendor: String(vendor),
			price: Number.parseFloat(String(amount)),
			categoryId: Number.parseInt(String(category)),
			isMyCard: isMyCard === 'on',
			extraInfo: extraInfo ? String(extraInfo) : null,
			currency: String(currency)
		};

		const parsed = expenseInsertSchema.safeParse(expenseToInsert);

		if (!parsed.success) {
			return fail(400, {
				errors: z.flattenError(parsed.error).fieldErrors,
				data: expenseToInsert
			});
		}

		await db(platform?.env.DB).insert(expenses).values(parsed.data);

		redirect(303, '/transactions');
	}
} satisfies Actions;
