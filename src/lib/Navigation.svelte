<script lang="ts">
	import type { Tabs } from '$lib';
	import CircleDollarSign from '@lucide/svelte/icons/circle-dollar-sign';
	import CreditCard from '@lucide/svelte/icons/credit-card';
	import Plus from '@lucide/svelte/icons/plus';
	import { Navigation } from '@skeletonlabs/skeleton-svelte';

	interface Props {
		tab: Tabs;
		layout?: 'rail' | 'bar';
	}

	let { tab, layout = 'rail' }: Props = $props();

	const getAnchorClass = (id: Tabs) => {
		const baseClass =
			layout === 'rail'
				? 'btn hover:preset-tonal aspect-square w-full max-w-[84px] flex flex-col items-center gap-0.5'
				: 'btn hover:preset-tonal flex-1 flex flex-col items-center gap-0.5 py-1 px-0 md:py-2';
		const activeClass = 'preset-tonal-primary';
		return tab === id ? `${baseClass} ${activeClass}` : baseClass;
	};
</script>

<div
	class="border-surface-200-800 bg-surface-50-950 h-full w-full {layout === 'rail'
		? 'border-r'
		: 'border-t'}"
>
	<!-- Component -->
	<Navigation {layout} class={layout === 'bar' ? 'w-full' : ''}>
		<Navigation.Content class={layout === 'bar' ? 'w-full' : ''}>
			<Navigation.Group class={layout === 'bar' ? 'flex w-full flex-row justify-around' : ''}>
				<Navigation.Menu class={layout === 'bar' ? 'flex flex-1' : ''}>
					<a class={getAnchorClass('summary')} href="/">
						<CircleDollarSign />
						<span class="text-xs">Summary</span>
					</a>
				</Navigation.Menu>

				<Navigation.Menu class={layout === 'bar' ? 'flex flex-1' : ''}>
					<a class={getAnchorClass('transactions')} href="/transactions">
						<CreditCard />
						<span class="text-xs">Transactions</span>
					</a>
				</Navigation.Menu>

				<Navigation.Menu class={layout === 'bar' ? 'flex flex-1' : ''}>
					<a class={getAnchorClass('add')} href="/add">
						<Plus />
						<span class="text-xs">Add</span>
					</a>
				</Navigation.Menu>
			</Navigation.Group>
		</Navigation.Content>
	</Navigation>
</div>
