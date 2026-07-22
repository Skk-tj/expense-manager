<script lang="ts">
	import type { Tabs } from '$lib';
	import { AppBar } from '@skeletonlabs/skeleton-svelte';

	interface Props {
		tab: Tabs;
	}

	let { tab }: Props = $props();
</script>

<AppBar class="p-2 md:p-4">
	<AppBar.Headline>
		{#if tab === 'transactions'}
			<h2 class="h3 md:h2">Transactions</h2>
		{:else if tab === 'summary'}
			<h2 class="h3 md:h2">Summary</h2>
		{:else if tab === 'add'}
			<h2 class="h3 md:h2">Add</h2>
		{/if}
	</AppBar.Headline>
</AppBar>
