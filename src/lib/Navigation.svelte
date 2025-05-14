<script lang="ts">
	import { Navigation } from '@skeletonlabs/skeleton-svelte';
	import CreditCard from '@lucide/svelte/icons/credit-card';
	import CircleDollarSign from '@lucide/svelte/icons/circle-dollar-sign';
	import type { Tabs } from '$lib/tabs';

	interface Props {
		tab: Tabs;
	}

	let { tab = $bindable('transactions') }: Props = $props();
</script>

<div class="card border-surface-100-900 grid h-full grid-cols-[auto_1fr] border-[1px]">
	<!-- Component -->
	<Navigation.Rail
		value={tab}
		onValueChange={(newValue) => {
			if (newValue === 'summary' || newValue === 'transactions') {
				tab = newValue;
			}
		}}
	>
		{#snippet tiles()}
			<Navigation.Tile id="summary" label="Summary" href="/">
				<CircleDollarSign />
			</Navigation.Tile>

			<Navigation.Tile id="transactions" label="Transactions" href="/transactions">
				<CreditCard />
			</Navigation.Tile>
		{/snippet}
	</Navigation.Rail>
</div>
