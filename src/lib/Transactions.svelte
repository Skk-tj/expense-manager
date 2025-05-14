<script lang="ts">
	import {
		AllCommunityModule,
		colorSchemeDark,
		createGrid,
		type GridOptions,
		ModuleRegistry,
		themeQuartz
	} from 'ag-grid-community';
	import { onMount } from 'svelte';
	import { type Expense } from '$lib/server/db/schema';

	interface Props {
		expense: Expense[];
	}

	let { expense }: Props = $props();

	const gridOptions: GridOptions = {
		theme: themeQuartz.withPart(colorSchemeDark),
		rowData: expense,
		columnDefs: [
			{ field: 'transactionDate', filter: 'agDateColumnFilter', cellDataType: 'date' },
			{ field: 'vendor', filter: true },
			{ field: 'currency', cellDataType: 'text' },
			{
				field: 'price',
				filter: 'agNumberColumnFilter',
				valueFormatter: (p) =>
					new Intl.NumberFormat('en-CA', { style: 'currency', currency: 'CAD' }).format(p.value),
				cellDataType: 'number'
			},
			{
				field: 'category.category',
				filter: true,
				headerName: 'Category',
				cellDataType: 'text',
				cellClassRules: {
					'bg-teal-500': (params) => params.data.category.id === 1,
					'bg-green-500': (params) => params.data.category.id === 2,
					'bg-blue-500': (params) => params.data.category.id === 3,
					'bg-yellow-500': (params) => params.data.category.id === 4,
					'bg-purple-500': (params) => params.data.category.id === 5,
					'bg-pink-500': (params) => params.data.category.id === 6,
					'bg-gray-500': (params) => params.data.category.id === 7,
					'bg-orange-500': (params) => params.data.category.id === 8
				}
			},
			{ field: 'isMyCard', filter: 'agBooleanColumnFilter', cellDataType: 'boolean' },
			{ field: 'extraInfo', filter: true, cellDataType: 'text' }
		]
	};

	let tableElement: HTMLDivElement | undefined = $state();

	onMount(() => {
		// Register all Community features
		ModuleRegistry.registerModules([AllCommunityModule]);
	});

	$effect(() => {
		if (tableElement !== undefined) {
			createGrid(tableElement, gridOptions);
		}
	});
</script>

<div class="h-full" bind:this={tableElement}></div>
