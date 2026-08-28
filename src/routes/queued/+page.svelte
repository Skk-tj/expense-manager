<script lang="ts">
	import QueuedCard from "$lib/QueuedCard.svelte";
	import { toaster } from "$lib/toaster/toaster";
	import ChevronDown from "@lucide/svelte/icons/chevron-down";
	import ChevronUp from "@lucide/svelte/icons/chevron-up";
	import Copy from "@lucide/svelte/icons/copy";
	import Inbox from "@lucide/svelte/icons/inbox";
	import Smartphone from "@lucide/svelte/icons/smartphone";
	import Sparkles from "@lucide/svelte/icons/sparkles";
	import Terminal from "@lucide/svelte/icons/terminal";

	import type { PageData } from "./$types";

	let { data }: { data: PageData } = $props();

	let removedIds = $state<number[]>([]);
	let items = $derived(
		data.queuedPurchases.filter((item) => !removedIds.includes(item.id)),
	);

	let showGuide = $state(false);
	let copiedCurl = $state(false);
	let copiedJson = $state(false);

	function onItemProcessed(id: number) {
		removedIds.push(id);
	}

	const curlExample = `curl -X POST "https://<YOUR_DOMAIN>/api/queue" \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer YOUR_AUTH_SECRET" \\
  -d '{
    "amount": 14.50,
    "currency": "CAD",
    "vendor": "Starbucks",
    "date": "${new Date().toISOString().split("T")[0]}",
    "extraInfo": "Apple Pay"
  }'`;

	const jsonExample = `{
  "amount": 14.50,
  "currency": "CAD",
  "vendor": "Starbucks",
  "date": "${new Date().toISOString().split("T")[0]}",
  "extraInfo": "Apple Pay"
}`;

	async function copyToClipboard(text: string, type: "curl" | "json") {
		try {
			await navigator.clipboard.writeText(text);
			if (type === "curl") {
				copiedCurl = true;
				setTimeout(() => (copiedCurl = false), 2000);
			} else {
				copiedJson = true;
				setTimeout(() => (copiedJson = false), 2000);
			}
			toaster.success({ title: "Copied to clipboard!" });
		} catch {
			toaster.error({ title: "Failed to copy" });
		}
	}
</script>

<div class="mx-auto flex w-full max-w-4xl flex-col gap-6 p-2 md:p-4">
	<!-- Page Header -->
	<div class="flex flex-wrap items-center justify-between gap-3">
		<div class="flex items-center gap-2">
			{#if items.length > 0}
				<span
					class="badge preset-filled-primary-500 text-sm font-semibold"
				>
					{items.length}
					{items.length === 1 ? "purchase" : "purchases"} pending
				</span>
			{/if}
		</div>
	</div>

	<!-- Apple Shortcuts Setup Guide Accordion -->
	{#if showGuide}
		<div
			class="border-surface-200-800 bg-surface-50-950 rounded-container flex flex-col gap-4 border p-4 shadow-md md:p-6"
		>
			<div
				class="border-surface-200-800 flex items-center gap-2 border-b pb-3"
			>
				<Smartphone class="text-primary-500 size-5" />
				<h2 class="text-base font-semibold">
					How to Set Up Apple Shortcuts Automation
				</h2>
			</div>

			<div class="grid grid-cols-1 gap-4 text-sm md:grid-cols-2">
				<div class="flex flex-col gap-3">
					<h3 class="text-primary-500 font-semibold">
						1. Create iOS Automation
					</h3>
					<ol class="list-inside list-decimal space-y-1.5 opacity-90">
						<li>Open <strong>Shortcuts</strong> on your iPhone.</li>
						<li>
							Go to the <strong>Automation</strong> tab and tap
							<strong>+</strong>.
						</li>
						<li>
							Select <strong>Transaction</strong> (Apple Pay / Wallet).
						</li>
						<li>
							Choose <strong>Any Card</strong> and select
							<strong>Run Immediately</strong>.
						</li>
						<li>
							Tap <strong>Next</strong> and choose
							<strong>New Blank Automation</strong>.
						</li>
					</ol>
				</div>

				<div class="flex flex-col gap-3">
					<h3 class="text-primary-500 font-semibold">
						2. Configure API Action
					</h3>
					<ol class="list-inside list-decimal space-y-1.5 opacity-90">
						<li>
							Add action: <strong>Get Contents of URL</strong>.
						</li>
						<li>
							URL: <code
								>https://&lt;your-domain&gt;/api/queue</code
							>
						</li>
						<li>Method: <strong>POST</strong></li>
						<li>
							Headers: <code>Authorization</code> =
							<code>Bearer &lt;YOUR_SECRET&gt;</code>
							(or URL param <code>?key=...</code>)
						</li>
						<li>
							Request Body: <strong>JSON</strong> with
							<code>amount</code>, <code>vendor</code>,
							<code>date</code>.
						</li>
					</ol>
				</div>
			</div>

			<!-- Test cURL & JSON -->
			<div
				class="border-surface-200-800 mt-2 flex flex-col gap-3 border-t pt-4"
			>
				<div class="flex flex-wrap items-center justify-between gap-2">
					<span
						class="flex items-center gap-1.5 text-xs font-semibold"
					>
						<Terminal class="size-4" />
						Test Payload (cURL)
					</span>
					<div class="flex gap-2">
						<button
							type="button"
							class="btn preset-tonal px-2.5 py-1 text-xs"
							onclick={() => copyToClipboard(jsonExample, "json")}
						>
							<Copy class="size-3.5" />
							<span
								>{copiedJson
									? "JSON Copied!"
									: "Copy JSON"}</span
							>
						</button>
						<button
							type="button"
							class="btn preset-filled-primary-500 px-2.5 py-1 text-xs"
							onclick={() => copyToClipboard(curlExample, "curl")}
						>
							<Copy class="size-3.5" />
							<span
								>{copiedCurl
									? "cURL Copied!"
									: "Copy cURL"}</span
							>
						</button>
					</div>
				</div>
				<pre
					class="bg-surface-100-900 rounded-container overflow-x-auto p-3 font-mono text-xs">{curlExample}</pre>
			</div>
		</div>
	{/if}

	<!-- Queued Purchases List -->
	{#if items.length > 0}
		<div class="flex flex-col gap-4">
			{#each items as item (item.id)}
				<QueuedCard
					{item}
					vendors={data.vendors}
					vendorAutofill={data.vendorAutofill}
					onProcessed={onItemProcessed}
				/>
			{/each}
		</div>
	{:else}
		<!-- Empty State -->
		<div
			class="border-surface-200-800 bg-surface-50-950 rounded-container flex flex-col items-center justify-center gap-4 border p-8 text-center shadow-sm md:p-12"
		>
			<div
				class="bg-surface-100-900 text-primary-500 flex size-16 items-center justify-center rounded-full"
			>
				<Inbox class="size-8" />
			</div>
			<div class="flex max-w-md flex-col gap-1.5">
				<h2 class="text-lg font-bold">Queue is Clear</h2>
			</div>

			<button
				type="button"
				class="btn preset-tonal-primary mt-2 flex items-center gap-1.5 text-xs font-medium"
				onclick={() => (showGuide = true)}
			>
				<Sparkles class="size-4" />
				<span>View Shortcuts Setup Guide</span>
			</button>
		</div>
	{/if}
</div>
