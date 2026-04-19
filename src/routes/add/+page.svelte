<script lang="ts">
	import { Categories } from '$lib';
	import CircleDollarSign from '@lucide/svelte/icons/circle-dollar-sign';
	import { enhance } from '$app/forms';
	import type { ActionData } from './$types';

	let { form }: { form: ActionData } = $props();

	type FormData = {
		date: string;
		amount: number;
		currency: string;
		isMyCard: boolean;
		extraInfo: string;
		vendor: string;
		categoryId: string;
	};

	let formData: FormData = $state({
		date: form?.data?.transactionDate ?? new Date().toISOString().split('T')[0],
		amount: form?.data?.price ?? 0,
		currency: form?.data?.currency ?? 'CAD',
		isMyCard: form?.data?.isMyCard ?? true,
		extraInfo: form?.data?.extraInfo ?? '',
		vendor: form?.data?.vendor ?? '',
		categoryId: String(form?.data?.categoryId ?? '1')
	});
</script>

<form class="mx-auto flex flex-col items-end p-2" method="POST" use:enhance>
	<div class="grid grid-cols-1 gap-4 lg:grid-cols-2">
		<div>
			<label class="label" for="date">
				<span class="label-text">Date</span>
			</label>
			<input
				type="date"
				class="input {form?.errors?.transactionDate ? 'input-error' : ''}"
				id="date"
				name="date"
				bind:value={formData.date}
				required
				enterkeyhint="next"
			/>
			{#if form?.errors?.transactionDate}
				<span class="text-error-500 text-sm">{form.errors.transactionDate[0]}</span>
			{/if}
		</div>

		<div>
			<label class="label" for="vendor">
				<span class="label-text">Vendor</span>
			</label>
			<input
				type="text"
				class="input {form?.errors?.vendor ? 'input-error' : ''}"
				id="vendor"
				name="vendor"
				required
				placeholder="Vendor"
				enterkeyhint="next"
				autocomplete="off"
				bind:value={formData.vendor}
			/>
			{#if form?.errors?.vendor}
				<span class="text-error-500 text-sm">{form.errors.vendor[0]}</span>
			{/if}
		</div>

		<div>
			<label class="label" for="amount">
				<span class="label-text">Amount</span>
			</label>
			<div class="input-group grid-cols-[auto_1fr_auto]">
				<div class="ig-cell preset-tonal">
					<CircleDollarSign size={16} />
				</div>

				<input
					class="ig-input {form?.errors?.price ? 'input-error' : ''}"
					type="number"
					placeholder="Amount"
					id="amount"
					bind:value={formData.amount}
					name="amount"
					required
					step="0.01"
					inputmode="decimal"
					enterkeyhint="next"
				/>

				<select class="ig-select" bind:value={formData.currency} name="currency">
					<option>CAD</option>
					<option>USD</option>
					<option>JPY</option>
				</select>
			</div>
			{#if form?.errors?.price}
				<span class="text-error-500 text-sm">{form.errors.price[0]}</span>
			{/if}
		</div>

		<div>
			<label for="categories-select" class="label">
				<span class="label-text">Category</span>
			</label>
			<select
				id="categories-select"
				name="categories"
				bind:value={formData.categoryId}
				enterkeyhint="next"
				class="select rounded-container {form?.errors?.categoryId ? 'select-error' : ''}"
			>
				{#each Object.entries(Categories) as [categoryId, category] (categoryId)}
					<option value={categoryId}>{category}</option>
				{/each}
			</select>
			{#if form?.errors?.categoryId}
				<span class="text-error-500 text-sm">{form.errors.categoryId[0]}</span>
			{/if}
		</div>

		<div class="lg:col-span-2">
			<label for="extra" class="label">
				<span class="label-text">Extra Info</span>
			</label>

			<textarea
				id="extra"
				rows="3"
				class="textarea {form?.errors?.extraInfo ? 'textarea-error' : ''}"
				name="extraInfo"
				bind:value={formData.extraInfo}
				enterkeyhint="next"
			></textarea>
			{#if form?.errors?.extraInfo}
				<span class="text-error-500 text-sm">{form.errors.extraInfo[0]}</span>
			{/if}
		</div>

		<div class="flex items-center space-x-2 lg:col-span-2">
			<input
				type="checkbox"
				id="is-my-card"
				class="checkbox"
				name="isMyCard"
				enterkeyhint="next"
				bind:checked={formData.isMyCard}
			/>
			<label for="is-my-card" class="label">
				<span class="label-text">My Card</span>
			</label>
		</div>
	</div>

	<button type="submit" class="btn preset-outlined-primary-500"> Submit </button>
</form>
