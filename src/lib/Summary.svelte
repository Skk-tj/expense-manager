<script lang="ts">
	import Card from '$lib/Card.svelte';
	import { Categories } from '$lib/index';
	import {
		type AgChartInstance,
		type AgChartOptions,
		AgCharts,
		AllCommunityModule,
		ModuleRegistry
	} from 'ag-charts-community';
	import { onMount } from 'svelte';

	interface Props {
		sum: number;
		lastMonthSum: number;
		sumByCategories: { category: string; sum: number }[];
		sumTrend: { date: [number, number]; sum: number }[];
		sumTrendByCategory: { time: [number, number]; [key: string]: number | [number, number] }[];
	}

	let { sum, lastMonthSum, sumByCategories, sumTrend, sumTrendByCategory }: Props = $props();

	let pieChartElement: HTMLDivElement | undefined = $state();
	let lineChartElement: HTMLDivElement | undefined = $state();

	onMount(() => {
		ModuleRegistry.registerModules([AllCommunityModule]);
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

<div class="grid grid-cols-3 gap-2 xl:grid-cols-4">
	<Card title="Total Spent This Month">
		{new Intl.NumberFormat('en-CA', { style: 'currency', currency: 'CAD' }).format(sum)}
	</Card>

	<Card title="Total Spent Last Month">
		{new Intl.NumberFormat('en-CA', { style: 'currency', currency: 'CAD' }).format(lastMonthSum)}
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

	<div class="col-span-2">
		<Card title="Trend">
			<div bind:this={lineChartElement} class="h-128"></div>
		</Card>
	</div>
</div>
