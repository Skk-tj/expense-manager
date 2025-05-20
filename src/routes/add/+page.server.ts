import type { Actions } from './$types';
import { z } from 'zod';
import { type Expense, expenseInsertSchema, expenses } from '$lib/server/db/schema';
import { db } from '$lib/server/db';
import { redirect } from '@sveltejs/kit';

export const actions = {
	default: async ({ request }) => {
		const data = await request.formData();

		const date = data.get('date');
		const dateParse = z.string().date('Date is invalid').parse(date);

		const amount = data.get('amount');
		const amountParse = z.string().parse(amount);
		const amountParseNumber = Number.parseFloat(amountParse);

		const vendor = data.get('vendor');
		const vendorParse = z.string({ message: 'vendor is null' }).parse(vendor);

		const category = data.get('categories');
		const categoryParse = z.string().parse(category);
		const categoryParseNumber = Number.parseInt(categoryParse);

		const isMyCard = data.get('isMyCard');
		const isMyCardParse = z.enum(['on']).nullable().parse(isMyCard);
		const isMyCardParseBool = isMyCardParse === 'on';

		const extraInfo = data.get('extraInfo');
		const extraInfoParse = z.string().nullable().parse(extraInfo);

		const currency = data.get('currency');
		const currencyParse = z.enum(['CAD', 'USD', 'JPY']).parse(currency);

		const expenseToInsert: Omit<Expense, 'id'> = {
			transactionDate: dateParse,
			vendor: vendorParse,
			price: amountParseNumber,
			categoryId: categoryParseNumber,
			isMyCard: isMyCardParseBool,
			extraInfo: extraInfoParse,
			currency: currencyParse
		};

		const parsed = expenseInsertSchema.parse(expenseToInsert);
		await db.insert(expenses).values(parsed);

		redirect(303, '/transactions');
	}
} satisfies Actions;
