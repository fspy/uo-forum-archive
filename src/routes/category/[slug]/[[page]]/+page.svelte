<script lang="ts">
	import ThreadListItem from '$lib/components/ThreadListItem.svelte';
	import ThreadCard from '$lib/components/ThreadCard.svelte';
	import Pagination from '$lib/components/Pagination.svelte';

	let { data } = $props();

	let viewMode = $state('list');
</script>

<svelte:head>
	<title>{data.category.name} - UO Forum Archive</title>
</svelte:head>

<div class="breadcrumb">
	<a href="/">Home</a>
	<span class="sep">/</span>
	<span class="current">{data.category.name}</span>
</div>

<div class="page-header">
	<div>
		<h2 class="page-title">{data.category.name}</h2>
		<p class="page-desc">
			{data.totalThreads.toLocaleString()} threads
			{#if data.totalPages > 1} &middot; Page {data.currentPage} of {data.totalPages}{/if}
		</p>
	</div>
	<div class="view-toggle">
		<button
			class={['toggle-btn', viewMode === 'list' ? 'active' : ''].join(' ')}
			onclick={() => (viewMode = 'list')}
			title="List view"
		>&#9776;</button>
		<button
			class={['toggle-btn', viewMode === 'grid' ? 'active' : ''].join(' ')}
			onclick={() => (viewMode = 'grid')}
			title="Gallery view"
		>&#9638;</button>
	</div>
</div>

{#if data.threads.length === 0}
	<p class="empty">No threads in this category.</p>
{:else if viewMode === 'grid'}
	<div class="grid">
		{#each data.threads as thread (thread.id)}
			<ThreadCard {thread} />
		{/each}
	</div>
{:else}
	<div class="list">
		{#each data.threads as thread (thread.id)}
			<ThreadListItem {thread} />
		{/each}
	</div>
{/if}

<Pagination
	currentPage={data.currentPage}
	totalPages={data.totalPages}
	baseUrl="/category/{data.category.slug}"
/>

<style>
	.breadcrumb {
		font-size: 0.8125rem;
		color: var(--text-muted);
		margin-bottom: 1.25rem;
		display: flex;
		gap: 0.375rem;
		flex-wrap: wrap;
	}

	.breadcrumb a {
		color: var(--link);
		text-decoration: none;
	}

	.breadcrumb a:hover {
		text-decoration: underline;
	}

	.sep {
		color: var(--text-dimmed);
	}

	.current {
		color: var(--text-secondary);
	}

	.page-header {
		display: flex;
		justify-content: space-between;
		align-items: flex-start;
		margin-bottom: 1.25rem;
		gap: 1rem;
	}

	.page-title {
		font-size: 1.5rem;
		color: var(--text-primary);
		font-weight: 700;
	}

	.page-desc {
		color: var(--text-muted);
		font-size: 0.8125rem;
		margin-top: 0.25rem;
	}

	.view-toggle {
		display: flex;
		gap: 0;
	}

	.toggle-btn {
		background: var(--bg-secondary);
		border: 1px solid var(--border);
		color: var(--text-muted);
		padding: 0.5rem 0.875rem;
		font-size: 1.125rem;
		cursor: pointer;
		transition:
			background 0.2s,
			color 0.2s;
	}

	.toggle-btn:first-child {
		border-radius: var(--radius-sm) 0 0 var(--radius-sm);
	}

	.toggle-btn:last-child {
		border-radius: 0 var(--radius-sm) var(--radius-sm) 0;
		border-left: none;
	}

	.toggle-btn.active {
		background: var(--accent);
		color: var(--bg-primary);
		border-color: var(--accent);
	}

	.grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
		gap: 1rem;
	}

	.empty {
		text-align: center;
		padding: 2.5rem;
		color: var(--text-muted);
	}

	@media (max-width: 640px) {
		.page-header {
			flex-direction: column;
		}
	}
</style>
