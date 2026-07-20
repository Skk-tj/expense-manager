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

<aside class="sticky top-0 h-screen">
	<Navigation tab={currentTab} />
</aside>

<main class="flex flex-1 flex-col">
	<TopBar tab={currentTab} />
	{@render children?.()}
</main>

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
