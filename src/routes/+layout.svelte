<script lang="ts">
	import type { Tabs } from '$lib';
	import Navigation from '$lib/Navigation.svelte';
	import TopBar from '$lib/TopBar.svelte';
	import { toaster } from '$lib/toaster/toaster';
	import '../app.css';
	import { Toast } from '@skeletonlabs/skeleton-svelte';

	let { children } = $props();

	let currentTab: Tabs = $state('summary');
</script>

<aside class="sticky top-0 h-screen">
	<Navigation bind:tab={currentTab} />
</aside>

<main class="flex flex-1 flex-col">
	<TopBar tab={currentTab} />
	{@render children()}
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
