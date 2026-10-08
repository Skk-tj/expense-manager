<script lang="ts">
	import {
		type AgChartInstance,
		type AgChartOptions,
		AgCharts,
		AllCommunityModule,
		ModuleRegistry
	} from 'ag-charts-community';
	import { onMount } from 'svelte';

	import Card from '#lib/Card.svelte';
	import { Categories, type CurrencyBreakdownItem } from '#lib/index.js';

	interface Props {
		sum: number;
		lastMonthSum: number;
		currencyBreakdown?: CurrencyBreakdownItem[];
		sumByCategories: { category: string; sum: number }[];
	}

	let { sum, lastMonthSum, currencyBreakdown = [], sumByCategories }: Props = $props();

	let sumTrendByCategory: { time: [number, number]; [key: string]: number | [number, number] }[] =
		$state([]);

	let pieChartElement: HTMLDivElement | undefined = $state();
	let lineChartElement: HTMLDivElement | undefined = $state();

	onMount(() => {
		ModuleRegistry.registerModules([AllCommunityModule]);

		fetch('/api/reports/trend-by-category')
			.then(
				(res) =>
					res.json() as Promise<{
						sumTrendByCategory: {
							time: [number, number];
							[key: string]: number | [number, number];
						}[];
					}>
			)
			.then((categoryTrendData) => {
				sumTrendByCategory = categoryTrendData.sumTrendByCategory;
			});
	});

	$effect(() => {
		const options: AgChartOptions = {
			container: pieChartElement,
			data: sumByCategories,
			title: {
				text: 'By Category'
			},
			series: [
				{
					type: 'pie',
					angleKey: 'sum',
					legendItemKey: 'category',
					sectorLabelKey: 'sum',
					sectorLabel: {
						color: 'white',
						fontWeight: 'bold',
						formatter: (params: { value: number }) =>
							new Intl.NumberFormat('en-CA', { style: 'currency', currency: 'CAD' }).format(
								params.value
							)
					}
				}
			],
			theme: 'ag-default-dark'
		};

		const options2: AgChartOptions = {
			container: lineChartElement,
			data: sumTrendByCategory,
			title: {
				text: 'Trend'
			},
			series: Object.entries(Categories).map(([key, value]) => {
				return {
					type: 'bar',
					xKey: 'time',
					yKey: key,
					yName: value,
					stacked: true
				};
			}),
			axes: {
				x: {
					type: 'grouped-category',
					position: 'bottom',
					label: { rotation: 0 },
					depthOptions: [{}, { label: { fontWeight: 'bold' } }]
				},
				y: {
					type: 'number',
					position: 'left',
					label: {
						formatter: (params: { value: number }) =>
							new Intl.NumberFormat('en-CA', { style: 'currency', currency: 'CAD' }).format(
								params.value
							)
					}
				}
			},
			theme: 'ag-default-dark'
		};

		let pieChart: AgChartInstance | undefined;
		let lineChart: AgChartInstance | undefined;

		if (pieChartElement !== undefined) {
			pieChart = AgCharts.create(options);
		}

		if (lineChartElement !== undefined) {
			lineChart = AgCharts.create(options2);
		}

		return () => {
			if (pieChart) {
				pieChart.destroy();
			}
			if (lineChart) {
				lineChart.destroy();
			}
		};
	});
</script>

<div class="grid grid-cols-1 gap-2 md:grid-cols-2 md:gap-4 lg:grid-cols-3">
	<Card title="Total Spent This Month">
		<div class="h1">
			{new Intl.NumberFormat('en-CA', { style: 'currency', currency: 'CAD' }).format(sum)}
		</div>

		{#if currencyBreakdown.length > 0}
			<div class="border-surface-200-800 mt-4 border-t pt-3">
				<div class="text-surface-600-400 mb-2 text-xs font-semibold tracking-wider uppercase">
					By Currency
				</div>
				<div class="space-y-1.5">
					{#each currencyBreakdown as item (item.currency)}
						<div class="flex items-center justify-between text-sm">
							<span class="badge preset-filled-surface-200-800 font-mono text-xs font-bold">
								{item.currency}
							</span>
							<div class="text-right">
								<span class="font-medium">
									{new Intl.NumberFormat('en-CA', {
										style: 'currency',
										currency: item.currency
									}).format(item.originalAmount)}
								</span>
								{#if item.currency !== 'CAD'}
									<span class="text-surface-500-400 ml-1 text-xs">
										(≈ {new Intl.NumberFormat('en-CA', {
											style: 'currency',
											currency: 'CAD'
										}).format(item.cadAmount)})
									</span>
								{/if}
							</div>
						</div>
					{/each}
				</div>
			</div>
		{/if}
	</Card>

	<Card title="Total Spent Last Month">
		<div class="h1">
			{new Intl.NumberFormat('en-CA', { style: 'currency', currency: 'CAD' }).format(lastMonthSum)}
		</div>
	</Card>

	<Card title="Categories">
		<div class="table-wrap">
			<table class="table">
				<thead>
					<tr>
						<th>Category</th>
						<th class="text-right!">Amount</th>
					</tr>
				</thead>
				<tbody class="[&>tr]:hover:preset-tonal-primary">
					{#each sumByCategories as category (category)}
						<tr>
							<td>{category.category}</td>
							<td class="text-right"
								>{new Intl.NumberFormat('en-CA', { style: 'currency', currency: 'CAD' }).format(
									category.sum
								)}</td
							>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
	</Card>

	<Card title="Categories">
		<div bind:this={pieChartElement}></div>
	</Card>

	<div class="col-span-full lg:col-span-2">
		<Card title="Trend">
			<div bind:this={lineChartElement} class="h-128"></div>
		</Card>
	</div>
</div>
