import { relations, type InferSelectModel, type InferInsertModel } from 'drizzle-orm';
import { integer, real, sqliteTable, text } from 'drizzle-orm/sqlite-core';

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

export type Expense = InferSelectModel<typeof expenses>;
export type ExpenseInsert = InferInsertModel<typeof expenses>;
export type ExpenseWithCategory = Omit<Expense, 'transactionDate'> & {
	transactionDate: Date;
	category: {
		id: number;
		category: string;
	};
};
