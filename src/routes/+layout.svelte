<script lang="ts">
	import '../app.css';
	import TopBar from '$lib/TopBar.svelte';
	import Navigation from '$lib/Navigation.svelte';

	let { children } = $props();
</script>

<aside class="sticky top-0 h-screen">
	<Navigation />
</aside>

<main class="flex flex-1 flex-col">
	<TopBar />
	{@render children()}
</main>
