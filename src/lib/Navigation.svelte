<script lang="ts">
	import type { Tabs } from '$lib';
	import CircleDollarSign from '@lucide/svelte/icons/circle-dollar-sign';
	import CreditCard from '@lucide/svelte/icons/credit-card';
	import Plus from '@lucide/svelte/icons/plus';
	import { Navigation } from '@skeletonlabs/skeleton-svelte';

	interface Props {
		tab: Tabs;
	}

	let { tab = $bindable() }: Props = $props();

	const anchorRail =
		'btn hover:preset-tonal aspect-square w-full max-w-[84px] flex flex-col items-center gap-0.5';
</script>

<div class="border-surface-200-800 grid h-full grid-cols-[auto_1fr]">
	<!-- Component -->
	<Navigation layout="rail">
		<Navigation.Content>
			<Navigation.Group>
				<Navigation.Menu>
					<a class={anchorRail} href="/" onclick={() => (tab = 'summary')}>
						<CircleDollarSign />
						<span class="text-xs">Summary</span>
					</a>
				</Navigation.Menu>

				<Navigation.Menu>
					<a class={anchorRail} href="/transactions" onclick={() => (tab = 'transactions')}>
						<CreditCard />
						<span class="text-xs">Transactions</span>
					</a>
				</Navigation.Menu>

				<Navigation.Menu>
					<a class={anchorRail} href="/add" onclick={() => (tab = 'add')}>
						<Plus />
						<span class="text-xs">Add</span>
					</a>
				</Navigation.Menu>
			</Navigation.Group>
		</Navigation.Content>
	</Navigation>
</div>
