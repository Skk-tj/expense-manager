<script lang="ts">
	import { Categories } from '$lib/index';
	import { type ExpenseWithCategory } from '$lib/server/db/schema';
	import { toaster } from '$lib/toaster/toaster';
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
	import { ServerSideRowModelModule, RichSelectModule, SetFilterModule } from 'ag-grid-enterprise';

	const gridOptions: GridOptions<ExpenseWithCategory> = $derived({
		theme: themeQuartz.withPart(colorSchemeDark),
		rowModelType: 'serverSide',
		pagination: true,
		paginationPageSize: 50,
		cacheBlockSize: 50,
		serverSideDatasource: {
			getRows: async (params) => {
				const response = await fetch('/api/transactions/query', {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json'
					},
					body: JSON.stringify(params.request)
				});
				if (!response.ok) {
					params.fail();
				}
				const data = await response.json();
				const mappedRows = data.rows.map((row: any) => ({
					...row,
					transactionDate: new Date(row.transactionDate + 'T12:00:00')
				}));
				params.success({ rowData: mappedRows, rowCount: data.lastRow });
			}
		},
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
				onCellValueChanged: onVendorCellEdited,
				filterParams: {
					values: (params: any) => {
						fetch('/api/transactions/vendors')
							.then((res) => res.json())
							.then((data) => params.success(data))
							.catch(() => params.fail());
					}
				}
			},
			{ field: 'currency', cellDataType: 'text', filter: 'agTextColumnFilter' },
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
			},
			{
				headerName: 'Actions',
				cellRenderer: (params: any) => {
					if (!params.data) return '';
					const button = document.createElement('button');
					button.innerText = 'Delete';
					button.className = 'btn preset-filled-error-500 py-1 px-3 text-xs rounded-md font-bold';
					button.onclick = async () => {
						if (!confirm('Are you sure you want to delete this expense?')) return;
						const response = await fetch('/api/transactions/delete', {
							method: 'DELETE',
							body: JSON.stringify({ id: params.data.id }),
							headers: { 'Content-Type': 'application/json' }
						});
						if (response.ok) {
							params.api.applyTransaction({ remove: [params.data] });
							toaster.success({ title: 'Expense deleted' });
						} else {
							toaster.error({ title: 'Failed to delete expense' });
						}
					};
					return button;
				},
				editable: false,
				filter: false,
				sortable: false,
				maxWidth: 120
			}
		]
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

		const y = newValue.getFullYear();
		const m = String(newValue.getMonth() + 1).padStart(2, '0');
		const d = String(newValue.getDate()).padStart(2, '0');

		const response = await fetch(`/api/transactions/transaction-date`, {
			method: 'POST',
			body: JSON.stringify({ id, transactionDate: `${y}-${m}-${d}` }),
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

<div
	class="h-full"
	{@attach (node) => {
		ModuleRegistry.registerModules([
			AllCommunityModule,
			RichSelectModule,
			SetFilterModule,
			ServerSideRowModelModule
		]);
		const api = createGrid(node, gridOptions);
		return () => api.destroy();
	}}
></div>
