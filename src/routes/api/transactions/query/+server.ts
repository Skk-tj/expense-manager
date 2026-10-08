import { eq, desc, asc, and, like, sql, inArray } from 'drizzle-orm';

import { db } from '#lib/server/db/index.js';
import { expenses, categories } from '#lib/server/db/schema.js';

import type { RequestHandler } from './$types';

type AgGridFilter = {
	filterType: 'text' | 'number' | 'boolean' | 'date' | 'set';
	type?: string;
	filter?: string | number | boolean;
	dateFrom?: string;
	values?: string[];
};

export const POST: RequestHandler = async ({ request }) => {
	const body = (await request.json()) as {
		startRow: number;
		endRow: number;
		sortModel: { colId: string; sort: 'asc' | 'desc' }[];
		filterModel: Record<string, AgGridFilter>;
	};
	const { startRow, endRow, sortModel, filterModel } = body;

	let filters = [];

	if (filterModel) {
		for (const [key, filterValue] of Object.entries(filterModel)) {
			const filter = filterValue;
			let column;
			if (key === 'transactionDate') column = expenses.transactionDate;
			else if (key === 'vendor') column = expenses.vendor;
			else if (key === 'currency') column = expenses.currency;
			else if (key === 'price') column = expenses.price;
			else if (key === 'isMyCard') column = expenses.isMyCard;
			else if (key === 'extraInfo') column = expenses.extraInfo;
			else if (key === 'category') column = categories.category;

			if (!column) continue;

			if (filter.filterType === 'text') {
				if (filter.type === 'contains') filters.push(like(column, `%${filter.filter}%`));
				else if (filter.type === 'equals') filters.push(eq(column, filter.filter!));
			} else if (filter.filterType === 'number') {
				if (filter.type === 'equals') filters.push(eq(column, filter.filter!));
				else if (filter.type === 'greaterThan') filters.push(sql`${column} > ${filter.filter}`);
				else if (filter.type === 'lessThan') filters.push(sql`${column} < ${filter.filter}`);
			} else if (filter.filterType === 'boolean') {
				filters.push(eq(column, filter.filter!));
			} else if (filter.filterType === 'date') {
				if (filter.type === 'equals') filters.push(eq(column, filter.dateFrom!));
				else if (filter.type === 'greaterThan') filters.push(sql`${column} > ${filter.dateFrom}`);
				else if (filter.type === 'lessThan') filters.push(sql`${column} < ${filter.dateFrom}`);
			} else if (filter.filterType === 'set') {
				if (filter.values && filter.values.length > 0) {
					filters.push(inArray(column, filter.values));
				}
			}
		}
	}

	let orderBys = [];
	if (sortModel && sortModel.length > 0) {
		for (const sort of sortModel) {
			let column;
			if (sort.colId === 'transactionDate') column = expenses.transactionDate;
			else if (sort.colId === 'vendor') column = expenses.vendor;
			else if (sort.colId === 'currency') column = expenses.currency;
			else if (sort.colId === 'price') column = expenses.price;
			else if (sort.colId === 'isMyCard') column = expenses.isMyCard;
			else if (sort.colId === 'category') column = categories.category;

			if (column) {
				orderBys.push(sort.sort === 'desc' ? desc(column) : asc(column));
			}
		}
	}

	// Default sort if none provided
	if (orderBys.length === 0) {
		orderBys.push(desc(expenses.transactionDate));
	}

	const query = db()
		.select({
			id: expenses.id,
			transactionDate: expenses.transactionDate,
			vendor: expenses.vendor,
			currency: expenses.currency,
			price: expenses.price,
			categoryId: expenses.categoryId,
			isMyCard: expenses.isMyCard,
			extraInfo: expenses.extraInfo,
			category: categories
		})
		.from(expenses)
		.innerJoin(categories, eq(categories.id, expenses.categoryId))
		.where(filters.length > 0 ? and(...filters) : undefined)
		.orderBy(...orderBys)
		.limit(endRow - startRow)
		.offset(startRow);

	const countQuery = db()
		.select({ count: sql`count(*)` })
		.from(expenses)
		.innerJoin(categories, eq(categories.id, expenses.categoryId))
		.where(filters.length > 0 ? and(...filters) : undefined);

	const [data, [{ count }]] = await Promise.all([query, countQuery]);

	// Parse numeric/boolean types for frontend
	const parsedData = data.map((row) => ({
		...row,
		price: Number.parseFloat(row.price as unknown as string),
		isMyCard: Boolean(row.isMyCard)
	}));

	return Response.json({
		rows: parsedData,
		lastRow: Number(count)
	});
};
