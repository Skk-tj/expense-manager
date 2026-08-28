import { db } from '$lib/server/db';
import { type ExpenseInsert, expenses, queuedPurchases } from '$lib/server/db/schema';
import { fail } from '@sveltejs/kit';
import { desc, eq } from 'drizzle-orm';

import type { VendorAutofill } from '../add/+page.server';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ platform }) => {
	const allExpenses = await db(platform?.env.DB)
		.select()
		.from(expenses)
		.orderBy(desc(expenses.transactionDate));

	const vendorAutofill: Record<string, VendorAutofill[]> = {};

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

	const queued = await db(platform?.env.DB)
		.select()
		.from(queuedPurchases)
		.orderBy(desc(queuedPurchases.id));

	return {
		queuedPurchases: queued,
		vendors: Object.keys(vendorAutofill).sort(),
		vendorAutofill
	};
};

export const actions = {
	confirm: async ({ request, platform }) => {
		const data = await request.formData();

		const id = data.get('id');
		const date = data.get('date');
		const amount = data.get('amount');
		const vendor = data.get('vendor');
		const category = data.get('categories') || data.get('categoryId');
		const isMyCard = data.get('isMyCard');
		const extraInfo = data.get('extraInfo');
		const currency = data.get('currency');

		if (!id) {
			return fail(400, { error: 'Missing queued purchase ID' });
		}

		const errors: Record<string, string[]> = {};
		if (!date) errors.transactionDate = ['Required'];
		if (!amount) errors.price = ['Required'];
		if (!vendor || String(vendor).trim() === '') errors.vendor = ['Vendor is required'];
		if (!category) errors.categoryId = ['Category is required'];
		if (!currency) errors.currency = ['Required'];

		if (Object.keys(errors).length > 0) {
			return fail(400, {
				errors,
				failedId: Number(id)
			});
		}

		const expenseToInsert: ExpenseInsert = {
			transactionDate: String(date),
			vendor: String(vendor).trim(),
			price: Number.parseFloat(String(amount)),
			categoryId: Number.parseInt(String(category), 10),
			isMyCard: isMyCard === 'on' || isMyCard === 'true',
			extraInfo: extraInfo ? String(extraInfo).trim() : null,
			currency: String(currency).trim()
		};

		// 1. Insert into expenses
		await db(platform?.env.DB).insert(expenses).values(expenseToInsert);

		// 2. Remove from queued purchases
		await db(platform?.env.DB)
			.delete(queuedPurchases)
			.where(eq(queuedPurchases.id, Number(id)));

		return {
			success: true,
			action: 'confirm',
			id: Number(id)
		};
	},

	delete: async ({ request, platform }) => {
		const data = await request.formData();
		const id = data.get('id');

		if (!id) {
			return fail(400, { error: 'Missing ID' });
		}

		await db(platform?.env.DB)
			.delete(queuedPurchases)
			.where(eq(queuedPurchases.id, Number(id)));

		return {
			success: true,
			action: 'delete',
			id: Number(id)
		};
	}
} satisfies Actions;
