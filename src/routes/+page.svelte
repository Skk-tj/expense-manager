<script lang="ts">
	import {
		AllCommunityModule,
		ModuleRegistry,
		createGrid,
		type GridOptions,
		themeQuartz,
		colorSchemeDark
	} from 'ag-grid-community';
	import { onMount } from 'svelte';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();

	const gridOptions: GridOptions = {
		theme: themeQuartz.withPart(colorSchemeDark),
		rowData: data.expense,
		columnDefs: [
			{ field: 'transactionDate', filter: 'agDateColumnFilter', cellDataType: 'date' },
			{ field: 'vendor', filter: true, cellDataType: 'text' },
			{ field: 'currency', cellDataType: 'text' },
			{
				field: 'price',
				filter: 'agNumberColumnFilter',
				valueFormatter: (p) => '$' + p.value,
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
