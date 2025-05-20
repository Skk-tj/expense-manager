<script lang="ts">
	import type { PageProps } from './$types';
	import Summary from '$lib/Summary.svelte';

	let props: PageProps = $props();

	console.log(props);
</script>

<div class="p-2">
	<Summary
		sum={props.data.sum}
		lastMonthSum={props.data.sumLastMonth}
		sumByCategories={props.data.sumByCategories}
		sumTrend={props.data.sumTrend}
		sumTrendByCategory={props.data.sumTrendByCategory}
	/>
</div>
