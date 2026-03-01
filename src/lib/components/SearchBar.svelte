<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import categories from '$lib/data/categories.json';

	// Sync from URL params so the bar reflects the current search
	let query = $state('');
	let category = $state('');

	// Track whether the user is actively typing (vs URL-driven sync)
	let userInput = $state(false);

	$effect(() => {
		query = page.url.searchParams.get('q') || '';
		category = page.url.searchParams.get('category') || '';
	});

	function navigate() {
		const trimmed = query.trim();
		if (trimmed) {
			let url = `/search?q=${encodeURIComponent(trimmed)}`;
			if (category) {
				url += `&category=${encodeURIComponent(category)}`;
			}
			goto(url);
		}
	}

	// Debounced search-as-you-type
	let debounceTimer: ReturnType<typeof setTimeout> | undefined;

	function handleInput() {
		userInput = true;
		clearTimeout(debounceTimer);
		debounceTimer = setTimeout(() => {
			navigate();
			userInput = false;
		}, 300);
	}

	function handleCategoryChange() {
		// Navigate immediately when category changes (if there's a query)
		clearTimeout(debounceTimer);
		if (query.trim()) {
			navigate();
		}
	}

	function handleSubmit(e: SubmitEvent) {
		e.preventDefault();
		clearTimeout(debounceTimer);
		navigate();
	}
</script>

<form class="search-bar" onsubmit={handleSubmit}>
	<select class="category-select" bind:value={category} onchange={handleCategoryChange} aria-label="Filter by category">
		<option value="">All Categories</option>
		{#each categories as cat (cat.slug)}
			<option value={cat.name}>{cat.name}</option>
		{/each}
	</select>
	<div class="input-wrap">
		<svg
			class="search-icon"
			xmlns="http://www.w3.org/2000/svg"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			stroke-width="2"
			stroke-linecap="round"
			stroke-linejoin="round"
			aria-hidden="true"
		>
			<circle cx="11" cy="11" r="8" />
			<line x1="21" y1="21" x2="16.65" y2="16.65" />
		</svg>
		<input
			type="text"
			bind:value={query}
			oninput={handleInput}
			placeholder="Search threads..."
			aria-label="Search threads"
		/>
	</div>
</form>

<style>
	.search-bar {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		max-width: 700px;
		width: 100%;
		margin: 0 auto;
	}

	.category-select {
		flex-shrink: 0;
		padding: 0.625rem 0.75rem;
		background: var(--bg-secondary);
		border: 1px solid var(--border);
		border-radius: var(--radius-sm);
		color: var(--text-primary);
		font-size: 0.875rem;
		outline: none;
		cursor: pointer;
		transition: border-color 0.2s;
		max-width: 180px;
	}

	.category-select:focus {
		border-color: var(--accent);
	}

	.category-select:hover:not(:focus) {
		border-color: var(--border-hover);
	}

	.input-wrap {
		position: relative;
		flex: 1;
		display: flex;
		align-items: center;
		min-width: 0;
	}

	.search-icon {
		position: absolute;
		left: 0.75rem;
		width: 16px;
		height: 16px;
		color: var(--text-muted);
		pointer-events: none;
		flex-shrink: 0;
	}

	input {
		width: 100%;
		padding: 0.625rem 0.75rem 0.625rem 2.25rem;
		background: var(--bg-secondary);
		border: 1px solid var(--border);
		border-radius: var(--radius-sm);
		color: var(--text-primary);
		font-size: 0.9375rem;
		line-height: 1.4;
		outline: none;
		transition:
			border-color 0.2s,
			box-shadow 0.2s;
	}

	input::placeholder {
		color: var(--text-dimmed);
	}

	input:focus {
		border-color: var(--accent);
		box-shadow: 0 0 0 2px rgba(125, 170, 140, 0.2);
	}

	input:hover:not(:focus) {
		border-color: var(--border-hover);
	}

	@media (max-width: 640px) {
		.search-bar {
			flex-wrap: wrap;
		}

		.category-select {
			max-width: none;
			width: 100%;
		}

		.input-wrap {
			flex: 1;
			min-width: 0;
		}
	}
</style>
