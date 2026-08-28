import { relations, sql, type InferSelectModel, type InferInsertModel } from 'drizzle-orm';
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

export const queuedPurchases = sqliteTable('queued_purchases', {
	id: integer().primaryKey({ autoIncrement: true }).notNull(),
	transactionDate: text('transaction_date').notNull(),
	price: real().notNull(),
	currency: text().notNull().default('CAD'),
	vendor: text(),
	categoryId: integer('category_id').references(() => categories.id),
	isMyCard: integer('is_my_card', { mode: 'boolean' }).notNull().default(true),
	extraInfo: text('extra_info'),
	createdAt: text('created_at')
		.notNull()
		.default(sql`(CURRENT_TIMESTAMP)`)
});

export const categoryRelation = relations(expenses, ({ one }) => ({
	category: one(categories, {
		fields: [expenses.categoryId],
		references: [categories.id]
	})
}));

export const queuedPurchaseCategoryRelation = relations(queuedPurchases, ({ one }) => ({
	category: one(categories, {
		fields: [queuedPurchases.categoryId],
		references: [categories.id]
	})
}));

export const categoryToEntriesRelation = relations(categories, ({ many }) => ({
	expenses: many(expenses),
	queuedPurchases: many(queuedPurchases)
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

export type QueuedPurchase = InferSelectModel<typeof queuedPurchases>;
export type QueuedPurchaseInsert = InferInsertModel<typeof queuedPurchases>;
export type QueuedPurchaseWithCategory = QueuedPurchase & {
	category?: {
		id: number;
		category: string;
	} | null;
};
