import { categories, expenses } from '$lib/server/db/schema';
import { relations } from 'drizzle-orm/relations';

export const expensesRelations = relations(expenses, ({ one }) => ({
	category: one(categories, {
		fields: [expenses.categoryId],
		references: [categories.id]
	})
}));

export const categoriesRelations = relations(categories, ({ many }) => ({
	expenses: many(expenses)
}));
