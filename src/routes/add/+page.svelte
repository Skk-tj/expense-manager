<script lang="ts">
	import { Categories } from '$lib';
	import CircleDollarSign from '@lucide/svelte/icons/circle-dollar-sign';

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
		date: new Date().toISOString().split('T')[0],
		amount: 0,
		currency: 'CAD',
		isMyCard: true,
		extraInfo: '',
		vendor: '',
		categoryId: '1'
	});
</script>

<form class="mx-auto flex flex-col items-end p-2" method="POST">
	<div class="grid grid-cols-1 gap-4 lg:grid-cols-2">
		<div>
			<label class="label" for="date">
				<span class="label-text">Date</span>
			</label>
			<input type="date" class="input" id="date" name="date" bind:value={formData.date} required />
		</div>

		<div>
			<label class="label" for="vendor">
				<span class="label-text">Vendor</span>
			</label>
			<input
				type="text"
				class="input"
				id="vendor"
				name="vendor"
				required
				bind:value={formData.vendor}
			/>
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
					class="ig-input"
					type="number"
					placeholder="Amount"
					id="amount"
					value={formData.amount}
					name="amount"
					required
					step="0.01"
				/>

				<select class="ig-select" bind:value={formData.currency} name="currency">
					<option>CAD</option>
					<option>USD</option>
					<option>JPY</option>
				</select>
			</div>
		</div>

		<div>
			<label for="categories-select" class="label">
				<span class="label-text">Category</span>
			</label>
			<select
				id="categories-select"
				name="categories"
				bind:value={formData.categoryId}
				class="select rounded-container"
			>
				{#each Object.entries(Categories) as [categoryId, category] (categoryId)}
					<option value={categoryId}>{category}</option>
				{/each}
			</select>
		</div>

		<div class="lg:col-span-2">
			<label for="extra" class="label">
				<span class="label-text">Extra Info</span>
			</label>

			<textarea
				id="extra"
				rows="3"
				class="textarea"
				name="extraInfo"
				bind:value={formData.extraInfo}
			></textarea>
		</div>

		<div class="flex items-center space-x-2 lg:col-span-2">
			<input
				type="checkbox"
				id="is-my-card"
				class="checkbox"
				name="isMyCard"
				bind:checked={formData.isMyCard}
			/>
			<label for="is-my-card" class="label">
				<span class="label-text">My Card</span>
			</label>
		</div>
	</div>

	<button type="submit" class="btn preset-outlined-primary-500"> Submit </button>
</form>
