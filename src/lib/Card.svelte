<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		title: string;
		children?: Snippet;
	}

	let { title, children }: Props = $props();
</script>

<div class="card preset-filled-surface-100-900 border-surface-200-800 card-hover h-full border p-4">
	<h6 class="h6">{title}</h6>
	<h1 class="h1">
		{@render children?.()}
	</h1>
</div>
