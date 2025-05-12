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
			{ field: 'id' },
			{ field: 'transactionDate', filter: 'agDateColumnFilter' },
			{ field: 'vendor', filter: true },
			{ field: 'currency' },
			{ field: 'price', filter: 'agNumberColumnFilter' },
			{ field: 'category' },
			{ field: 'isMyCard', filter: 'agBooleanColumnFilter' },
			{ field: 'extraInfo', filter: true }
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
