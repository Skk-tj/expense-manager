<script lang="ts">
	import Inbox from '@lucide/svelte/icons/inbox';

	import QueuedCard from '#lib/QueuedCard.svelte';

	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	let removedIds = $state<number[]>([]);
	let items = $derived(data.queuedPurchases.filter((item) => !removedIds.includes(item.id)));

	function onItemProcessed(id: number) {
		removedIds.push(id);
	}
</script>

<div class="mx-auto flex w-full max-w-4xl flex-col gap-6 p-2 md:p-4">
	<!-- Page Header -->
	<div class="flex flex-wrap items-center justify-between gap-3">
		<div class="flex items-center gap-2">
			{#if items.length > 0}
				<span class="badge preset-filled-primary-500 text-sm font-semibold">
					{items.length}
					{items.length === 1 ? 'purchase' : 'purchases'} pending
				</span>
			{/if}
		</div>
	</div>

	<!-- Queued Purchases List -->
	{#if items.length > 0}
		<div class="flex flex-col gap-4">
			{#each items as item (item.id)}
				<QueuedCard
					{item}
					vendors={data.vendors}
					vendorAutofill={data.vendorAutofill}
					onProcessed={onItemProcessed}
				/>
			{/each}
		</div>
	{:else}
		<!-- Empty State -->
		<div
			class="border-surface-200-800 bg-surface-50-950 rounded-container flex flex-col items-center justify-center gap-4 border p-8 text-center shadow-sm md:p-12"
		>
			<div
				class="bg-surface-100-900 text-primary-500 flex size-16 items-center justify-center rounded-full"
			>
				<Inbox class="size-8" />
			</div>
			<div class="flex max-w-md flex-col gap-1.5">
				<h2 class="text-lg font-bold">Queue is Clear</h2>
			</div>
		</div>
	{/if}
</div>
