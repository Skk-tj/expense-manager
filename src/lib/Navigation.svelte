<script lang="ts">
	import type { Tabs } from '$lib';
	import CircleDollarSign from '@lucide/svelte/icons/circle-dollar-sign';
	import CreditCard from '@lucide/svelte/icons/credit-card';
	import Plus from '@lucide/svelte/icons/plus';
	import { Navigation } from '@skeletonlabs/skeleton-svelte';

	interface Props {
		tab: Tabs;
	}

	let { tab = $bindable() }: Props = $props();
</script>

<div class="card border-surface-100-900 grid h-full grid-cols-[auto_1fr] border-[1px]">
	<!-- Component -->
	<Navigation.Rail
		value={tab}
		onValueChange={(newValue) => {
			if (newValue === 'summary' || newValue === 'transactions' || newValue === 'add') {
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

			<Navigation.Tile id="add" label="Add" href="/add">
				<Plus />
			</Navigation.Tile>
		{/snippet}
	</Navigation.Rail>
</div>
