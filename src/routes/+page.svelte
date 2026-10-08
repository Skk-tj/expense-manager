<script lang="ts">
	import Summary from '#lib/Summary.svelte';

	import type { PageProps } from './$types';

	let props: PageProps = $props();
</script>

<div class="p-2">
	<Summary
		sum={props.data.sum}
		lastMonthSum={props.data.sumLastMonth}
		currencyBreakdown={props.data.currencyBreakdown}
		sumByCategories={props.data.sumByCategories}
	/>
</div>
