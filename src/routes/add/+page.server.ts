import { db } from '$lib/server/db';
import { type Expense, expenseInsertSchema, expenses } from '$lib/server/db/schema';
import type { Actions } from './$types';
import { fail, redirect } from '@sveltejs/kit';
import { z } from 'zod';

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
