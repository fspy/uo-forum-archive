<script lang="ts">
	let { data } = $props();
</script>

<svelte:head>
	<title>UO Forum Archive - Ultima Online Forum Archive</title>
</svelte:head>

<section class="forums">
	{#each data.groups as group (group.name)}
		<div class="forum-row">
			<div class="forum-main">
				{#if group.children.length === 1}
					<a href="/category/{group.children[0].slug}" class="forum-name linked">{group.name}</a>
				{:else}
					<span class="forum-name">{group.name}</span>
				{/if}
				<p class="forum-desc">{group.description}</p>
				{#if group.children.length > 1}
					<div class="forum-children">
						{#each group.children as child, i}
							{#if i > 0}<span class="child-sep">&middot;</span>{/if}
							<a href="/category/{child.slug}" class="child-link">{child.name}</a>
						{/each}
					</div>
				{/if}
			</div>
			<div class="forum-count">
				<span class="count-num">{group.totalCount.toLocaleString()}</span>
				<span class="count-label">threads</span>
			</div>
		</div>
	{/each}
</section>

<style>
	.forums {
		margin-bottom: 2.5rem;
		border: 1px solid var(--border);
		border-radius: var(--radius);
		overflow: hidden;
	}

	.forum-row {
		display: flex;
		justify-content: space-between;
		align-items: center;
		gap: 1rem;
		padding: 1rem 1.25rem;
		background: var(--bg-secondary);
		border-bottom: 1px solid var(--border);
		transition: background 0.15s;
	}

	.forum-row:last-child {
		border-bottom: none;
	}

	.forum-row:hover {
		background: var(--bg-hover);
	}

	.forum-main {
		flex: 1;
		min-width: 0;
	}

	.forum-name {
		font-size: 1.0625rem;
		font-weight: 600;
		color: var(--text-primary);
		display: block;
	}

	.forum-name.linked {
		color: var(--accent);
		text-decoration: none;
	}

	.forum-name.linked:hover {
		text-decoration: underline;
	}

	.forum-desc {
		font-size: 0.8125rem;
		color: var(--text-muted);
		margin-top: 0.2rem;
	}

	.forum-children {
		margin-top: 0.5rem;
		display: flex;
		flex-wrap: wrap;
		gap: 0.25rem;
		align-items: center;
	}

	.child-link {
		font-size: 0.75rem;
		color: var(--link);
		text-decoration: none;
	}

	.child-link:hover {
		text-decoration: underline;
	}

	.child-sep {
		font-size: 0.625rem;
		color: var(--text-dimmed);
	}

	.forum-count {
		display: flex;
		flex-direction: column;
		align-items: center;
		flex-shrink: 0;
		min-width: 4rem;
	}

	.count-num {
		font-size: 1rem;
		font-weight: 700;
		color: var(--accent);
	}

	.count-label {
		font-size: 0.6875rem;
		color: var(--text-dimmed);
		text-transform: uppercase;
		letter-spacing: 0.5px;
	}

	@media (max-width: 640px) {
		.forum-row {
			flex-direction: column;
			align-items: flex-start;
			gap: 0.5rem;
		}

		.forum-count {
			flex-direction: row;
			gap: 0.375rem;
		}
	}
</style>
