<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		title: string;
		children?: Snippet;
	}

	let { title, children }: Props = $props();
</script>

<div class="card preset-filled-surface-100-900 border-surface-200-800 h-full border p-3 md:p-4">
	<h6 class="h6 mb-2">{title}</h6>
	{@render children?.()}
</div>
