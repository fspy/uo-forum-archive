<script lang="ts">
	import type { ThreadIndex } from '$lib/types';

	let { thread }: { thread: ThreadIndex } = $props();

	function handleImgError(e: Event) {
		const img = e.target as HTMLImageElement;
		img.style.display = 'none';
		const placeholder = img.parentElement?.querySelector('.placeholder');
		if (placeholder) (placeholder as HTMLElement).style.display = 'flex';
	}
</script>

<a href="/thread/{thread.id}/{thread.slug}" class="card">
	<div class="thumb">
		{#if thread.thumb}
			<img
				src="/{thread.thumb}"
				alt=""
				loading="lazy"
				onerror={handleImgError}
			/>
			<div class="placeholder" style="display:none">&#9876;</div>
		{:else}
			<div class="placeholder">&#9876;</div>
		{/if}
	</div>
	<div class="body">
		<div class="title">{thread.title}</div>
		<div class="meta">
			<span>{thread.author}</span>
			<span class="cat">{thread.category}</span>
			<span>{thread.date}</span>
			<span class="posts">{thread.postCount} posts</span>
		</div>
	</div>
</a>

<style>
	.card {
		background: var(--bg-secondary);
		border: 1px solid var(--border);
		border-radius: 10px;
		overflow: hidden;
		transition:
			border-color 0.2s,
			transform 0.15s,
			box-shadow 0.2s;
		text-decoration: none;
		color: inherit;
		display: block;
	}

	.card:hover {
		border-color: var(--accent);
		transform: translateY(-2px);
		box-shadow: 0 6px 24px rgba(0, 0, 0, 0.4);
		text-decoration: none;
	}

	.thumb {
		width: 100%;
		height: 180px;
		background: var(--bg-primary);
		display: flex;
		align-items: center;
		justify-content: center;
		overflow: hidden;
	}

	.thumb img {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}

	.placeholder {
		color: var(--border);
		font-size: 48px;
		display: flex;
		align-items: center;
		justify-content: center;
		width: 100%;
		height: 100%;
	}

	.body {
		padding: 0.875rem 1rem;
	}

	.title {
		font-size: 0.9375rem;
		font-weight: 600;
		color: var(--text-primary);
		margin-bottom: 0.375rem;
		display: -webkit-box;
		-webkit-line-clamp: 2;
		-webkit-box-orient: vertical;
		overflow: hidden;
	}

	.meta {
		font-size: 0.75rem;
		color: var(--text-muted);
		display: flex;
		gap: 0.75rem;
		flex-wrap: wrap;
		align-items: center;
	}

	.cat {
		color: var(--accent);
	}

	.posts {
		background: var(--bg-primary);
		color: var(--accent);
		padding: 0.125rem 0.5rem;
		border-radius: 10px;
		font-size: 0.6875rem;
	}
</style>
