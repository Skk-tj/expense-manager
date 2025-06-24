<script lang="ts">
	import {
		AllCommunityModule,
		colorSchemeDark,
		createGrid,
		type GridOptions,
		type IRichCellEditorParams,
		ModuleRegistry,
		type NewValueParams,
		themeQuartz
	} from 'ag-grid-community';
	import { RichSelectModule, SetFilterModule } from 'ag-grid-enterprise';
	import { onMount } from 'svelte';
	import { type ExpenseWithCategory } from '$lib/server/db/schema';
	import { Categories } from '$lib/index';
	import { toaster } from '$lib/toaster/toaster';

	interface Props {
		expense: ExpenseWithCategory[];
	}

	let { expense }: Props = $props();

	console.log(expense);

	const gridOptions: GridOptions<ExpenseWithCategory> = {
		theme: themeQuartz.withPart(colorSchemeDark),
		rowData: expense,
		columnDefs: [
			{
				field: 'transactionDate',
				filter: 'agDateColumnFilter',
				cellDataType: 'date',
				sort: 'desc',
				editable: true,
				onCellValueChanged: onTransactionDateEdited
			},
			{
				field: 'vendor',
				filter: 'agSetColumnFilter',
				editable: true,
				onCellValueChanged: onVendorCellEdited
			},
			{ field: 'currency', cellDataType: 'text', filter: 'agSetColumnFilter' },
			{
				field: 'price',
				filter: 'agNumberColumnFilter',
				valueFormatter: (p) =>
					new Intl.NumberFormat('en-CA', {
						style: 'currency',
						currency: p.data?.currency,
						currencyDisplay: 'code'
					}).format(p.value),
				cellDataType: 'number',
				editable: true,
				onCellValueChanged: onPriceCellEdited
			},
			{
				field: 'category',
				filter: 'agSetColumnFilter',
				headerName: 'Category',
				cellDataType: 'object',
				valueFormatter: (p) => p.value.category,
				valueParser: (p) => p.newValue,
				cellClassRules: {
					'bg-teal-500': (params) => params.data?.category.id === 1,
					'bg-green-500': (params) => params.data?.category.id === 2,
					'bg-blue-500': (params) => params.data?.category.id === 3,
					'bg-yellow-500': (params) => params.data?.category.id === 4,
					'bg-purple-500': (params) => params.data?.category.id === 5,
					'bg-pink-500': (params) => params.data?.category.id === 6,
					'bg-gray-500': (params) => params.data?.category.id === 7,
					'bg-orange-500': (params) => params.data?.category.id === 8,
					'bg-red-500': (params) => params.data?.category.id === 9
				},
				editable: true,
				cellEditor: 'agRichSelectCellEditor',
				onCellValueChanged: onCategoryCellEdited,
				cellEditorParams: {
					values: Object.entries(Categories).map((x) => {
						return {
							id: x[0],
							category: x[1]
						};
					}),
					formatValue: (value) => value.category
				} satisfies IRichCellEditorParams
			},
			{
				field: 'isMyCard',
				filter: 'agBooleanColumnFilter',
				cellDataType: 'boolean',
				editable: true,
				onCellValueChanged: onIsMyCardCellEdited
			},
			{
				field: 'extraInfo',
				filter: true,
				cellDataType: 'text',
				editable: true,
				onCellValueChanged: onExtraInfoCellEdited
			}
		]
	};

	let tableElement: HTMLDivElement | undefined = $state();

	onMount(() => {
		// Register all Community features
		ModuleRegistry.registerModules([AllCommunityModule, RichSelectModule, SetFilterModule]);
	});

	$effect(() => {
		if (tableElement !== undefined) {
			createGrid(tableElement, gridOptions);
		}
	});

	async function onVendorCellEdited(
		event: NewValueParams<ExpenseWithCategory, string>
	): Promise<void> {
		const id = event.data.id;
		const newValue = event.newValue;

		const response = await fetch(`/api/transactions/vendor`, {
			method: 'POST',
			body: JSON.stringify({ id, vendor: newValue }),
			headers: {
				'Content-Type': 'application/json'
			}
		});

		if (!response.ok) {
			toaster.error({
				title: 'Failed to update vendor'
			});
			return;
		}

		toaster.success({
			title: 'Success'
		});
	}

	async function onIsMyCardCellEdited(
		event: NewValueParams<ExpenseWithCategory, boolean>
	): Promise<void> {
		const id = event.data.id;
		const newValue = event.newValue;

		const response = await fetch(`/api/transactions/is-my-card`, {
			method: 'POST',
			body: JSON.stringify({ id, isMyCard: newValue }),
			headers: {
				'Content-Type': 'application/json'
			}
		});

		if (!response.ok) {
			toaster.error({
				title: 'Failed to update isMyCard'
			});
			return;
		}

		toaster.success({
			title: 'Success'
		});
	}

	async function onPriceCellEdited(event: NewValueParams<ExpenseWithCategory, number>) {
		const id = event.data.id;
		const newValue = event.newValue;

		const response = await fetch(`/api/transactions/price`, {
			method: 'POST',
			body: JSON.stringify({ id, price: newValue }),
			headers: {
				'Content-Type': 'application/json'
			}
		});

		if (!response.ok) {
			toaster.error({
				title: 'Failed to update price'
			});
			return;
		}

		toaster.success({
			title: 'Success'
		});
	}

	async function onExtraInfoCellEdited(event: NewValueParams<ExpenseWithCategory, string>) {
		const id = event.data.id;
		const newValue = event.newValue;

		const response = await fetch(`/api/transactions/extra-info`, {
			method: 'POST',
			body: JSON.stringify({ id, extraInfo: newValue }),
			headers: {
				'Content-Type': 'application/json'
			}
		});

		if (!response.ok) {
			toaster.error({
				title: 'Failed to update extraInfo'
			});
			return;
		}

		toaster.success({
			title: 'Success'
		});
	}

	async function onTransactionDateEdited(event: NewValueParams<ExpenseWithCategory, Date>) {
		const id = event.data.id;
		const newValue = event.newValue;

		if (newValue === null || newValue === undefined) {
			throw new Error('Failed to update transactionDate');
		}

		const response = await fetch(`/api/transactions/transaction-date`, {
			method: 'POST',
			body: JSON.stringify({ id, transactionDate: newValue.toISOString().slice(0, 10) }),
			headers: {
				'Content-Type': 'application/json'
			}
		});
		if (!response.ok) {
			toaster.error({
				title: 'Failed to update transactionDate'
			});
			return;
		}

		toaster.success({
			title: 'Success'
		});
	}

	async function onCategoryCellEdited(
		event: NewValueParams<ExpenseWithCategory, { id: string; category: string }>
	) {
		const id = event.data.id;
		const newValue = event.newValue;

		if (newValue === null || newValue === undefined) {
			throw new Error('Failed to update category');
		}

		const response = await fetch(`/api/transactions/category`, {
			method: 'POST',
			body: JSON.stringify({ id, category: newValue }),
			headers: {
				'Content-Type': 'application/json'
			}
		});

		if (!response.ok) {
			toaster.error({
				title: 'Failed to update category'
			});
			return;
		}

		toaster.success({
			title: 'Success'
		});
	}
</script>

<div class="h-full" bind:this={tableElement}></div>
