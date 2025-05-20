import { relations } from 'drizzle-orm';
import { sqliteTable, text, integer, real } from 'drizzle-orm/sqlite-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';

export const categories = sqliteTable('categories', {
	id: integer().primaryKey({ autoIncrement: true }).notNull(),
	category: text().notNull()
});

export const expenses = sqliteTable('expenses', {
	id: integer().primaryKey({ autoIncrement: true }).notNull(),
	transactionDate: text('transaction_date').notNull(),
	vendor: text().notNull(),
	price: real().notNull(),
	categoryId: integer('category_id')
		.notNull()
		.references(() => categories.id),
	isMyCard: integer('is_my_card', { mode: 'boolean' }).notNull(),
	extraInfo: text('extra_info'),
	currency: text().notNull().default('CAD')
});

export const categoryRelation = relations(expenses, ({ one }) => ({
	category: one(categories, {
		fields: [expenses.categoryId],
		references: [categories.id]
	})
}));

export const categoryToEntriesRelation = relations(categories, ({ one }) => ({
	expenses: one(expenses)
}));

export const expenseSelectSchema = createSelectSchema(expenses, {
	id: z.number().int(),
	transactionDate: z.string().date(),
	vendor: z.string(),
	price: z.number().nonnegative(),
	categoryId: z.number().int().gte(1).lte(9),
	isMyCard: z.boolean(),
	extraInfo: z.string().nullable(),
	currency: z.string().length(3)
});

export const expenseWithCategorySchema = expenseSelectSchema.extend({
	transactionDate: z
		.string()
		.date()
		.transform((x) => new Date(`${x}T00:00:00.000`)),
	category: z.object({
		id: z.number().int(),
		category: z.string()
	})
});

export type Expense = z.infer<typeof expenseSelectSchema>;
export type ExpenseWithCategory = z.infer<typeof expenseWithCategorySchema>;
export const expenseInsertSchema = createInsertSchema(expenses);
