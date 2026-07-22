<script lang="ts">
	import { page } from '$app/state';
	import type { Tabs } from '$lib';
	import Navigation from '$lib/Navigation.svelte';
	import { toaster } from '$lib/toaster/toaster';

	import '../app.css';
	import TopBar from '$lib/TopBar.svelte';
	import { Toast } from '@skeletonlabs/skeleton-svelte';
	import { type Snippet } from 'svelte';

	let { children }: { children?: Snippet<[]> } = $props();

	let currentTab: Tabs = $derived(
		page.url.pathname.startsWith('/transactions')
			? 'transactions'
			: page.url.pathname.startsWith('/add')
				? 'add'
				: 'summary'
	);
</script>

<div
	class="grid h-full w-full grid-cols-1 grid-rows-[auto_1fr_auto] md:grid-cols-[auto_1fr] md:grid-rows-[auto_1fr]"
>
	<!-- Left Navigation (Desktop only) -->
	<aside class="z-10 col-span-1 col-start-1 row-span-2 row-start-1 hidden md:block">
		<Navigation tab={currentTab} layout="rail" />
	</aside>

	<!-- Header -->
	<header
		class="border-surface-200-800 z-10 col-span-1 col-start-1 row-span-1 row-start-1 border-b md:col-span-1 md:col-start-2 md:row-span-1 md:row-start-1"
	>
		<TopBar tab={currentTab} />
	</header>

	<!-- Main -->
	<main
		class="col-span-1 col-start-1 row-span-1 row-start-2 overflow-y-auto p-2 md:col-span-1 md:col-start-2 md:row-span-1 md:row-start-2 md:p-4"
	>
		{@render children?.()}
	</main>

	<!-- Bottom Navigation (Mobile only) -->
	<footer class="z-10 col-span-1 col-start-1 row-span-1 row-start-3 block md:hidden">
		<Navigation tab={currentTab} layout="bar" />
	</footer>
</div>

<Toast.Group {toaster}>
	{#snippet children(toast)}
		<Toast {toast}>
			<Toast.Message>
				<Toast.Title>{toast.title}</Toast.Title>
				<Toast.Description>{toast.description}</Toast.Description>
			</Toast.Message>
			<Toast.CloseTrigger />
		</Toast>
	{/snippet}
</Toast.Group>
