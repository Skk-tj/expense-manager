<script lang="ts">
	import { Navigation } from '@skeletonlabs/skeleton-svelte';
	import CreditCard from '@lucide/svelte/icons/credit-card';

	// State
	let value = $state('transactions');
</script>

<div class="card border-surface-100-900 grid h-full grid-cols-[auto_1fr] border-[1px]">
	<!-- Component -->
	<Navigation.Rail {value} onValueChange={(newValue) => (value = newValue)}>
		{#snippet tiles()}
			<Navigation.Tile id="transactions" label="Transactions">
				<CreditCard />
			</Navigation.Tile>
		{/snippet}
	</Navigation.Rail>
</div>
