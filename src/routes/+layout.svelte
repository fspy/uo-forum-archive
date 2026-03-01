<script lang="ts">
	import '../app.css';
	import { base } from '$app/paths';

	import SearchBar from '$lib/components/SearchBar.svelte';

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href="{base}/favicon.ico" type="image/x-icon" />
</svelte:head>

<div class="app">
	<header class="header">
		<div class="header-inner">
			<a href="{base}/" class="brand">
				<h1 class="title">⚔ Ultima Online Forum Archive ⚔</h1>
				<p class="subtitle">A complete archive of forum.uo.com discussions</p>
			</a>
		</div>
	</header>

	<main class="main">
		<div class="search-area">
			<SearchBar />
		</div>
		{@render children()}
	</main>

	<footer class="footer">
		<div class="footer-inner">
			<p>© {new Date().getFullYear()} Ultima Online Forum Archive. This is a fan-maintained archive of forum.uo.com.</p>
			<p class="footer-note">Ultima Online is a trademark of Electronic Arts Inc.</p>
		</div>
	</footer>
</div>

<style>
	.app {
		display: flex;
		flex-direction: column;
		min-height: 100vh;
	}

	.header {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		z-index: 100;
		background: linear-gradient(135deg, var(--bg-secondary), var(--bg-primary));
		border-bottom: 2px solid var(--accent);
	}

	.header-inner {
		max-width: var(--max-width);
		margin: 0 auto;
		padding: 1rem 1.5rem;
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 1.5rem;
	}

	.brand {
		text-decoration: none;
		color: inherit;
	}

	.brand:hover {
		text-decoration: none;
	}

	.title {
		color: var(--accent);
		font-size: 1.4rem;
		font-weight: 700;
		letter-spacing: 2px;
		line-height: 1.3;
	}

	.subtitle {
		color: var(--text-muted);
		font-size: 0.8rem;
		margin-top: 0.15rem;
		letter-spacing: 0.5px;
	}

	.main {
		flex: 1;
		max-width: var(--max-width);
		width: 100%;
		margin: 0 auto;
		padding: 7rem 1.5rem 3rem;
	}

	.search-area {
		margin-bottom: 1.5rem;
	}

	.footer {
		border-top: 1px solid var(--border);
		background: var(--bg-tertiary);
	}

	.footer-inner {
		max-width: var(--max-width);
		margin: 0 auto;
		padding: 1.5rem;
		text-align: center;
		color: var(--text-muted);
		font-size: 0.8rem;
		line-height: 1.8;
	}

	.footer-note {
		color: var(--text-dimmed);
		font-size: 0.75rem;
	}

	@media (max-width: 640px) {
		.header-inner {
			flex-direction: column;
			text-align: center;
			padding: 0.75rem 1rem;
		}

		.title {
			font-size: 1.1rem;
		}

		.main {
			padding-top: 9rem;
		}
	}
</style>
