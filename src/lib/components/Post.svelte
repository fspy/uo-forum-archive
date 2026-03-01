<script lang="ts">
	import { base } from '$app/paths';
	import type { Post } from '$lib/types';

	let { post }: { post: Post } = $props();

	let showLightbox = $state(false);
	let lightboxSrc = $state('');

	// Rewrite /images/ paths in the raw HTML to include the base path.
	// This is necessary because messageHtml is baked at extraction time
	// with absolute /images/ paths that don't account for subpath deployment.
	let messageHtml = $derived(
		base
			? post.messageHtml.replace(/src="\/images\//g, `src="${base}/images/`)
			: post.messageHtml
	);

	// Same treatment for avatar URLs
	let avatarUrl = $derived(
		base && post.avatarUrl
			? post.avatarUrl.replace(/^\/images\//, `${base}/images/`)
			: post.avatarUrl
	);

	function openLightbox(src: string) {
		lightboxSrc = src;
		showLightbox = true;
	}

	function closeLightbox() {
		showLightbox = false;
	}

	function handleImgClick(e: Event) {
		const target = e.target as HTMLElement;
		if (target.tagName === 'IMG') {
			openLightbox((target as HTMLImageElement).src);
		}
	}

	function handleAvatarError(e: Event) {
		(e.target as HTMLImageElement).style.display = 'none';
	}
</script>

<article class="post {post.isOriginalPost ? 'op' : ''}">
	<div class="post-header">
		{#if avatarUrl}
			<img
				class="avatar"
				src={avatarUrl}
				alt="{post.author}'s avatar"
				onerror={handleAvatarError}
			/>
		{:else}
			<div class="avatar-placeholder"></div>
		{/if}
		<div>
			<div class="author">{post.author}</div>
			<div class="date">{post.displayDate || post.datetime}</div>
		</div>
	</div>
	<!-- eslint-disable-next-line svelte/no-at-html-tags -->
	<div class="post-body" role="presentation" onclick={handleImgClick}>
		{@html messageHtml}
	</div>
	{#if post.signature}
		<div class="signature" data-pagefind-ignore>{post.signature}</div>
	{/if}
</article>

{#if showLightbox}
	<div class="lightbox" role="button" tabindex="-1" onclick={closeLightbox} onkeydown={(e) => e.key === 'Escape' && closeLightbox()}>
		<img src={lightboxSrc} alt="Enlarged view" />
	</div>
{/if}

<style>
	.post {
		background: var(--bg-secondary);
		border: 1px solid var(--border);
		border-radius: var(--radius);
		margin-bottom: 0.75rem;
		overflow: hidden;
	}

	.post.op {
		border-left: 3px solid var(--accent);
	}

	.post-header {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		padding: 0.75rem 1rem;
		background: var(--bg-tertiary);
		border-bottom: 1px solid var(--border);
	}

	.avatar {
		width: 40px;
		height: 40px;
		border-radius: 50%;
		object-fit: cover;
		background: var(--bg-primary);
	}

	.avatar-placeholder {
		width: 40px;
		height: 40px;
		border-radius: 50%;
		background: var(--bg-primary);
	}

	.author {
		font-weight: 600;
		color: var(--text-primary);
	}

	.date {
		font-size: 0.75rem;
		color: var(--text-dimmed);
	}

	.post-body {
		padding: 1rem;
		font-size: 0.9375rem;
		line-height: 1.7;
		word-wrap: break-word;
		overflow-wrap: break-word;
	}

	.post-body :global(img) {
		max-width: 100%;
		height: auto;
		border-radius: 4px;
		margin: 0.5rem 0;
		cursor: pointer;
	}

	.post-body :global(blockquote),
	.post-body :global(.Quote) {
		background: var(--bg-primary);
		border-left: 3px solid var(--accent);
		padding: 0.75rem 1rem;
		margin: 0.5rem 0;
		border-radius: 0 var(--radius-sm) var(--radius-sm) 0;
	}

	.post-body :global(.QuoteAuthor) {
		color: var(--accent);
		font-size: 0.8125rem;
		margin-bottom: 0.25rem;
	}

	.post-body :global(a) {
		color: var(--link);
	}

	.signature {
		padding: 0.5rem 1rem;
		border-top: 1px solid var(--border);
		font-size: 0.75rem;
		color: var(--text-dimmed);
		font-style: italic;
	}

	.lightbox {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background: rgba(0, 0, 0, 0.92);
		z-index: 1000;
		display: flex;
		justify-content: center;
		align-items: center;
		cursor: pointer;
	}

	.lightbox img {
		max-width: 95%;
		max-height: 95%;
		object-fit: contain;
	}
</style>
