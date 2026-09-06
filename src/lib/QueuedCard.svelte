<script lang="ts">
	import { enhance } from '$app/forms';
	import { Categories } from '$lib';
	import type { QueuedPurchase } from '$lib/server/db/schema';
	import { toaster } from '$lib/toaster/toaster';
	import Check from '@lucide/svelte/icons/check';
	import CircleDollarSign from '@lucide/svelte/icons/circle-dollar-sign';
	import Clock from '@lucide/svelte/icons/clock';
	import Sparkles from '@lucide/svelte/icons/sparkles';
	import Trash2 from '@lucide/svelte/icons/trash-2';
	import { fly } from 'svelte/transition';

	import type { VendorAutofill } from '../routes/add/+page.server';

	interface Props {
		item: QueuedPurchase;
		vendors: string[];
		vendorAutofill: Record<string, VendorAutofill[]>;
		onProcessed?: (_id: number) => void;
	}

	let { item, vendors, vendorAutofill, onProcessed }: Props = $props();

	let date = $state('');
	let amount = $state(0);
	let currency = $state('CAD');
	let vendor = $state('');
	let categoryId = $state('2');
	let isMyCard = $state(true);
	let extraInfo = $state('');

	$effect(() => {
		date = item.transactionDate || new Date().toISOString().split('T')[0];
		amount = item.price;
		currency = item.currency || 'CAD';
		vendor = item.vendor || '';
		categoryId = String(item.categoryId || '2');
		isMyCard = item.isMyCard;
		extraInfo = item.extraInfo || '';
	});

	let isSubmitting = $state(false);
	let isDeleting = $state(false);

	let suggestions = $derived(vendor && vendorAutofill?.[vendor] ? vendorAutofill[vendor] : []);

	function autofill(suggestion: VendorAutofill) {
		categoryId = suggestion.categoryId;
		isMyCard = suggestion.isMyCard;
		if (suggestion.extraInfo) extraInfo = suggestion.extraInfo;
		if (suggestion.currency) currency = suggestion.currency;
		if (suggestion.amount) amount = suggestion.amount;
	}

	function formatTime(isoString: string) {
		try {
			const d = new Date(isoString);
			if (Number.isNaN(d.getTime())) return isoString;
			return d.toLocaleString(undefined, {
				month: 'short',
				day: 'numeric',
				hour: '2-digit',
				minute: '2-digit'
			});
		} catch {
			return isoString;
		}
	}
</script>

<div
	transition:fly={{ y: 20, duration: 250 }}
	class="border-surface-200-800 bg-surface-50-950 rounded-container flex flex-col gap-4 border p-4 shadow-sm md:p-5"
>
	<!-- Header Bar -->
	<div
		class="border-surface-200-800 flex flex-wrap items-center justify-between gap-2 border-b pb-3"
	>
		<div class="flex items-center gap-2">
			<span class="badge preset-filled-primary-500 font-mono text-sm font-bold">
				{currency} ${amount.toFixed(2)}
			</span>
			<span class="text-surface-600-400 flex items-center gap-1 text-xs">
				<Clock class="size-3.5" />
				{formatTime(item.createdAt)}
			</span>
		</div>

		<!-- Discard Form -->
		<form
			action="?/delete"
			method="POST"
			use:enhance={() => {
				isDeleting = true;
				return async ({ result, update }) => {
					isDeleting = false;
					if (result.type === 'success') {
						toaster.info({ title: 'Queued purchase discarded' });
						onProcessed?.(item.id);
					} else {
						toaster.error({ title: 'Failed to discard purchase' });
					}
					await update({ reset: false });
				};
			}}
		>
			<input type="hidden" name="id" value={item.id} />
			<button
				type="submit"
				disabled={isDeleting || isSubmitting}
				class="btn preset-tonal-error flex items-center gap-1 px-2.5 py-1 text-xs"
				title="Discard purchase"
			>
				<Trash2 class="size-3.5" />
				<span>{isDeleting ? 'Discarding...' : 'Discard'}</span>
			</button>
		</form>
	</div>

	<!-- Main Edit Form -->
	<form
		action="?/confirm"
		method="POST"
		use:enhance={() => {
			isSubmitting = true;
			return async ({ result, update }) => {
				isSubmitting = false;
				if (result.type === 'success') {
					toaster.success({
						title: 'Expense Saved',
						description: `${vendor || 'Expense'} (${currency} ${amount}) recorded.`
					});
					onProcessed?.(item.id);
				} else if (result.type === 'failure') {
					toaster.error({
						title: 'Validation Error',
						description: 'Please ensure Vendor and Category are filled out.'
					});
				}
				await update({ reset: false });
			};
		}}
		class="flex flex-col gap-4"
	>
		<input type="hidden" name="id" value={item.id} />

		<div class="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
			<!-- Vendor Field -->
			<div class="sm:col-span-2 lg:col-span-1">
				<label class="label" for="vendor-{item.id}">
					<span class="label-text text-xs font-semibold">Vendor *</span>
				</label>
				<input
					type="text"
					class="input"
					id="vendor-{item.id}"
					name="vendor"
					required
					autocomplete="off"
					list="vendor-options-{item.id}"
					bind:value={vendor}
				/>
				<datalist id="vendor-options-{item.id}">
					{#each vendors as v (v)}
						<option value={v}></option>
					{/each}
				</datalist>
			</div>

			<!-- Category Select -->
			<div>
				<label for="category-{item.id}" class="label">
					<span class="label-text text-xs font-semibold">Category *</span>
				</label>
				<select
					id="category-{item.id}"
					name="categories"
					bind:value={categoryId}
					class="select rounded-container"
				>
					{#each Object.entries(Categories) as [catId, catName] (catId)}
						<option value={catId}>{catName}</option>
					{/each}
				</select>
			</div>

			<!-- Amount & Currency -->
			<div>
				<label class="label" for="amount-{item.id}">
					<span class="label-text text-xs font-semibold">Amount & Currency</span>
				</label>
				<div class="field-group grid-cols-[auto_1fr_auto]">
					<span class="label label-text preset-tonal">
						<CircleDollarSign class="size-4" />
					</span>
					<input
						class="input"
						type="number"
						placeholder="Amount"
						id="amount-{item.id}"
						bind:value={amount}
						name="amount"
						required
						step="0.01"
						inputmode="decimal"
					/>
					<select class="select" bind:value={currency} name="currency">
						<option>CAD</option>
						<option>USD</option>
						<option>JPY</option>
					</select>
				</div>
			</div>

			<!-- Date Field -->
			<div>
				<label class="label" for="date-{item.id}">
					<span class="label-text text-xs font-semibold">Date</span>
				</label>
				<input
					type="date"
					class="input"
					id="date-{item.id}"
					name="date"
					bind:value={date}
					required
				/>
			</div>

			<!-- Extra Info Field -->
			<div class="sm:col-span-1 lg:col-span-2">
				<label for="extra-{item.id}" class="label">
					<span class="label-text text-xs font-semibold">Notes / Card Details</span>
				</label>
				<input
					type="text"
					id="extra-{item.id}"
					class="input"
					name="extraInfo"
					placeholder="Optional notes or card description"
					bind:value={extraInfo}
				/>
			</div>

			<!-- My Card Checkbox -->
			<div class="flex items-center space-x-2 pt-2 sm:col-span-2 lg:col-span-3">
				<input
					type="checkbox"
					id="is-my-card-{item.id}"
					class="checkbox"
					name="isMyCard"
					bind:checked={isMyCard}
				/>
				<label for="is-my-card-{item.id}" class="label cursor-pointer">
					<span class="label-text text-sm">Paid with My Card</span>
				</label>
			</div>
		</div>

		<!-- Vendor Autofill Suggestions -->
		{#if suggestions.length > 0}
			<div
				class="border-surface-200-800 bg-surface-100-900 rounded-container flex flex-col gap-2 border p-3"
			>
				<div class="flex items-center gap-1 text-xs opacity-80">
					<Sparkles class="text-primary-500 size-3.5" />
					<span>Previous records for <strong>{vendor}</strong>:</span>
				</div>
				<div class="flex flex-wrap gap-2">
					{#each suggestions.slice(0, 3) as suggestion, i (i)}
						<button
							type="button"
							class="btn preset-tonal-secondary px-2.5 py-1 text-xs"
							onclick={() => autofill(suggestion)}
						>
							<span>
								{Categories[Number(suggestion.categoryId) as keyof typeof Categories]} &middot; {suggestion.currency}
								${suggestion.amount}
							</span>
							<span class="text-primary-500 ml-1 font-semibold">Apply</span>
						</button>
					{/each}
				</div>
			</div>
		{/if}

		<!-- Submit Button -->
		<div class="flex justify-end pt-1">
			<button
				type="submit"
				disabled={isSubmitting || isDeleting}
				class="btn preset-filled-primary-500 flex items-center gap-1.5 font-semibold"
			>
				<Check class="size-4" />
				<span>{isSubmitting ? 'Saving...' : 'Save Expense'}</span>
			</button>
		</div>
	</form>
</div>
