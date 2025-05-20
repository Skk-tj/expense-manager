<script lang="ts">
	import '../app.css';
	import TopBar from '$lib/TopBar.svelte';
	import Navigation from '$lib/Navigation.svelte';
	import type { Tabs } from '$lib';

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
