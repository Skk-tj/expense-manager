<script lang="ts">
	import Transactions from '$lib/Transactions.svelte';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();
</script>

<Transactions expense={data.expense} />
