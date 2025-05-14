<script lang="ts">
	interface Props {
		sum: string | null;
	}

	let { sum }: Props = $props();
</script>

<div class="card preset-filled-surface-100-900 border-surface-200-800 card-hover border p-4">
	<h6 class="h6">Total Spent This Month</h6>
	<h1 class="h1">
		{new Intl.NumberFormat('en-CA', { style: 'currency', currency: 'CAD' }).format(sum)}
	</h1>
</div>
