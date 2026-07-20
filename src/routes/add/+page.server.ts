import { db } from '$lib/server/db';
import { type ExpenseInsert, expenses } from '$lib/server/db/schema';
import { fail, redirect } from '@sveltejs/kit';
import { desc } from 'drizzle-orm';

import type { Actions, PageServerLoad } from './$types';

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
		const errors: Record<string, string[]> = {};
		if (!date) errors.transactionDate = ['Required'];
		if (!amount) errors.price = ['Required'];
		if (!vendor) errors.vendor = ['Required'];
		if (!category) errors.categoryId = ['Required'];
		if (!currency) errors.currency = ['Required'];

		if (Object.keys(errors).length > 0) {
			return fail(400, {
				errors,
				data: {
					transactionDate: String(date),
					vendor: String(vendor),
					price: Number(amount),
					categoryId: String(category),
					isMyCard: isMyCard === 'on',
					currency: String(currency),
					extraInfo: extraInfo ? String(extraInfo) : ''
				}
			});
		}

		const expenseToInsert: ExpenseInsert = {
			transactionDate: String(date),
			vendor: String(vendor),
			price: Number.parseFloat(String(amount)),
			categoryId: Number.parseInt(String(category)),
			isMyCard: isMyCard === 'on',
			extraInfo: extraInfo ? String(extraInfo) : null,
			currency: String(currency)
		};

		await db(platform?.env.DB).insert(expenses).values(expenseToInsert);

		redirect(303, '/transactions');
	}
} satisfies Actions;
