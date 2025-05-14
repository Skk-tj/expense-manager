<script lang="ts">
	import { AppBar } from '@skeletonlabs/skeleton-svelte';

	import type { Tabs } from '$lib/tabs';

	interface Props {
		tab: Tabs;
	}

	let { tab = $bindable('transactions') }: Props = $props();
</script>

<AppBar>
	{#snippet headline()}
		{#if tab === 'transactions'}
			<h2 class="h2">Transactions</h2>
		{:else if tab === 'summary'}
			<h2 class="h2">Summary</h2>
		{/if}
	{/snippet}
</AppBar>
