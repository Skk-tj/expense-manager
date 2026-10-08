<script lang="ts">
	import { resolve } from '$app/paths';
	import { page } from '$app/state';
	import CircleDollarSign from '@lucide/svelte/icons/circle-dollar-sign';
	import CreditCard from '@lucide/svelte/icons/credit-card';
	import Inbox from '@lucide/svelte/icons/inbox';
	import Plus from '@lucide/svelte/icons/plus';
	import { Navigation } from '@skeletonlabs/skeleton-svelte';

	import type { Tabs } from '#lib';

	interface Props {
		tab: Tabs;
		layout?: 'rail' | 'bar';
	}

	let { tab, layout = 'rail' }: Props = $props();

	let queuedCount = $derived(Number(page.data?.queuedCount ?? 0));

	const getAnchorClass = (id: Tabs) => {
		const baseClass =
			layout === 'rail'
				? 'btn hover:preset-tonal aspect-square w-full max-w-[84px] flex flex-col items-center gap-0.5 relative'
				: 'btn hover:preset-tonal flex-1 flex flex-col items-center gap-0.5 py-1 px-0 md:py-2 relative';
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
					<a class={getAnchorClass('summary')} href={resolve('/')}>
						<CircleDollarSign />
						<span class="text-xs">Summary</span>
					</a>
				</Navigation.Menu>

				<Navigation.Menu class={layout === 'bar' ? 'flex flex-1' : ''}>
					<a class={getAnchorClass('transactions')} href={resolve('/transactions')}>
						<CreditCard />
						<span class="text-xs">Transactions</span>
					</a>
				</Navigation.Menu>

				<Navigation.Menu class={layout === 'bar' ? 'flex flex-1' : ''}>
					<a class={getAnchorClass('queued')} href={resolve('/queued')}>
						<div class="relative flex items-center justify-center">
							<Inbox />
							{#if queuedCount > 0}
								<span
									class="badge preset-filled-primary-500 absolute -top-1.5 -right-2.5 flex h-4 min-w-4 items-center justify-center rounded-full px-1 text-[10px] leading-none font-bold"
								>
									{queuedCount > 99 ? '99+' : queuedCount}
								</span>
							{/if}
						</div>
						<span class="text-xs">Queued</span>
					</a>
				</Navigation.Menu>

				<Navigation.Menu class={layout === 'bar' ? 'flex flex-1' : ''}>
					<a class={getAnchorClass('add')} href={resolve('/add')}>
						<Plus />
						<span class="text-xs">Add</span>
					</a>
				</Navigation.Menu>
			</Navigation.Group>
		</Navigation.Content>
	</Navigation>
</div>
