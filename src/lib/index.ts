// place files you want to import through the `$lib` alias in this folder.
export type Tabs = 'transactions' | 'summary' | 'add';

export const Categories = {
	1: 'Subscription',
	2: 'Food/Household',
	3: 'Discretionary',
	4: 'Government',
	5: 'Eat out',
	6: 'Utility',
	7: 'Health',
	8: 'Travel',
	9: 'Pet'
} as const;

export const CategoryKeys = Object.keys(Categories);
