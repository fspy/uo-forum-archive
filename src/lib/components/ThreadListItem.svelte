<script lang="ts">
	import { base } from '$app/paths';
	import type { ThreadIndex } from '$lib/types';

	let { thread }: { thread: ThreadIndex } = $props();
</script>

<a href="{base}/thread/{thread.id}/{thread.slug}" class="item">
	<div class="left">
		<div class="title">{thread.title}</div>
		<div class="meta">
			<span>by {thread.author}</span>
			<span class="cat">{thread.category}</span>
			<span>{thread.date}</span>
		</div>
	</div>
	<div class="badge">{thread.postCount} posts</div>
</a>

<style>
	.item {
		background: var(--bg-secondary);
		border: 1px solid var(--border);
		border-radius: var(--radius);
		padding: 1rem 1.25rem;
		margin-bottom: 0.5rem;
		display: flex;
		justify-content: space-between;
		align-items: center;
		gap: 1rem;
		transition:
			border-color 0.2s,
			background 0.2s;
		text-decoration: none;
		color: inherit;
	}

	.item:hover {
		border-color: var(--accent);
		background: var(--bg-hover);
		text-decoration: none;
	}

	.title {
		font-size: 1rem;
		color: var(--text-primary);
		font-weight: 500;
	}

	.meta {
		font-size: 0.75rem;
		color: var(--text-muted);
		margin-top: 0.25rem;
		display: flex;
		gap: 1rem;
		flex-wrap: wrap;
	}

	.cat {
		color: var(--accent);
		text-decoration: none;
	}

	.cat:hover {
		text-decoration: underline;
	}

	.badge {
		background: var(--bg-primary);
		color: var(--accent);
		padding: 0.25rem 0.75rem;
		border-radius: 12px;
		font-size: 0.8rem;
		white-space: nowrap;
	}

	@media (max-width: 640px) {
		.item {
			flex-direction: column;
			align-items: flex-start;
		}
	}
</style>
