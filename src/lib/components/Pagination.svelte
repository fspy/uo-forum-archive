<script lang="ts">
	let { currentPage, totalPages, baseUrl }: {
		currentPage: number;
		totalPages: number;
		baseUrl: string;
	} = $props();

	function pageUrl(page: number): string {
		return page === 1 ? baseUrl : `${baseUrl}/${page}`;
	}

	let pages = $derived.by(() => {
		const result: (number | '...')[] = [];
		const delta = 3;
		const left = Math.max(2, currentPage - delta);
		const right = Math.min(totalPages - 1, currentPage + delta);

		result.push(1);
		if (left > 2) result.push('...');
		for (let i = left; i <= right; i++) result.push(i);
		if (right < totalPages - 1) result.push('...');
		if (totalPages > 1) result.push(totalPages);

		return result;
	});
</script>

{#if totalPages > 1}
	<nav class="pager" aria-label="Pagination">
		{#if currentPage > 1}
			<a href={pageUrl(currentPage - 1)} class="page-link">&#9664; Prev</a>
		{/if}

		{#each pages as p, i (i)}
			{#if p === '...'}
				<span class="ellipsis">&hellip;</span>
			{:else}
				<a
					href={pageUrl(p)}
					class="page-link {p === currentPage ? 'active' : ''}"
					aria-current={p === currentPage ? 'page' : undefined}
				>{p}</a>
			{/if}
		{/each}

		{#if currentPage < totalPages}
			<a href={pageUrl(currentPage + 1)} class="page-link">Next &#9654;</a>
		{/if}
	</nav>
{/if}

<style>
	.pager {
		display: flex;
		justify-content: center;
		gap: 0.5rem;
		flex-wrap: wrap;
		padding: 1.5rem 0;
	}

	.page-link {
		background: var(--bg-secondary);
		border: 1px solid var(--border);
		color: var(--text-secondary);
		padding: 0.5rem 0.875rem;
		border-radius: var(--radius-sm);
		font-size: 0.8125rem;
		text-decoration: none;
		transition:
			background 0.2s,
			border-color 0.2s;
	}

	.page-link:hover {
		border-color: var(--accent);
		background: var(--bg-hover);
		text-decoration: none;
	}

	.page-link.active {
		background: var(--accent);
		color: var(--bg-primary);
		border-color: var(--accent);
		font-weight: 600;
	}

	.ellipsis {
		padding: 0.5rem 0.5rem;
		color: var(--text-muted);
		font-size: 0.8125rem;
	}
</style>
