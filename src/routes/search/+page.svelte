<script lang="ts">
  import { base } from "$app/paths";
  import { page } from "$app/state";

  interface SearchResultData {
    url: string;
    meta: Record<string, string>;
    excerpt: string;
  }

  let query = $derived(page.url.searchParams.get("q") || "");
  let category = $derived(page.url.searchParams.get("category") || "");

  let results: SearchResultData[] = $state([]);
  let totalCount = $state(0);
  let loading = $state(false);
  let searched = $state(false);
  let pagefindError = $state(false);

  // For progressive loading
  let rawResults: { data: () => Promise<SearchResultData> }[] = $state([]);
  let loadedCount = $state(0);
  const PAGE_SIZE = 10;

  // Cache the Pagefind instance so we only load/init once
  let pagefindInstance: any = null;

  // Run search when query or category changes
  $effect(() => {
    const q = query;
    const cat = category;
    if (q) {
      performSearch(q, cat);
    } else {
      results = [];
      rawResults = [];
      totalCount = 0;
      loadedCount = 0;
      searched = false;
    }
  });

  async function performSearch(q: string, cat: string) {
    loading = true;
    searched = false;
    pagefindError = false;
    results = [];
    rawResults = [];
    loadedCount = 0;
    totalCount = 0;

    try {
      if (!pagefindInstance) {
        // Use a variable so Vite/Rollup won't try to resolve this at build time.
        // Pagefind generates this file into the build output as a post-build step.
        const pagefindPath = `${base}/pagefind/pagefind.js`;
        pagefindInstance = await import(/* @vite-ignore */ pagefindPath);
        await pagefindInstance.init();
      }

      const options: Record<string, any> = {
        sort: { date: "desc" },
      };
      if (cat) {
        options.filters = { category: cat };
      }

      const search = await pagefindInstance.search(q, options);
      rawResults = search.results;
      totalCount = search.results.length;

      // Load the first batch
      await loadMore();
    } catch {
      pagefindError = true;
      pagefindInstance = null;
      rawResults = [];
      totalCount = 0;
    }

    loading = false;
    searched = true;
  }

  async function loadMore() {
    const nextBatch = rawResults.slice(loadedCount, loadedCount + PAGE_SIZE);
    const loaded = await Promise.all(nextBatch.map((r) => r.data()));
    results = [...results, ...loaded];
    loadedCount = results.length;
  }

  let hasMore = $derived(loadedCount < totalCount);
</script>

<svelte:head>
  <title>{query ? `Search: ${query}` : "Search"} - UO Forum Archive</title>
</svelte:head>

<div class="breadcrumb">
  <a href="{base}/">Home</a>
  <span class="sep">/</span>
  <span class="current">Search</span>
</div>

<section class="search-page">
  {#if loading}
    <div class="status">
      <div class="spinner"></div>
      <p>Searching for "{query}"{category ? ` in ${category}` : ""}...</p>
    </div>
  {:else if pagefindError && searched}
    <div class="status">
      <p class="muted">
        Search is not available in development mode. Build the site and run
        preview to use search.
      </p>
    </div>
  {:else if searched && totalCount === 0}
    <div class="status">
      <p>No results found for "<strong>{query}</strong>"{category ? ` in ${category}` : ""}.</p>
    </div>
  {:else if searched && totalCount > 0}
    <p class="result-count">
      Found <strong>{totalCount}</strong> result{totalCount === 1 ? "" : "s"} for
      "<strong>{query}</strong>"{category ? ` in <strong>${category}</strong>` : ""}
    </p>

    <div class="results">
      {#each results as result (result.url)}
        <a href={result.url.replace(/\.html$/, "")} class="result-row">
          <div class="result-main">
            <div class="result-title">{result.meta?.title || "Untitled"}</div>
            <div class="result-meta">
              {#if result.meta?.author}
                <span>by {result.meta.author}</span>
              {/if}
              {#if result.meta?.category}
                <span class="meta-sep">&middot;</span>
                <span class="result-cat">{result.meta.category}</span>
              {/if}
              {#if result.meta?.date}
                <span class="meta-sep">&middot;</span>
                <span>{result.meta.date}</span>
              {/if}
            </div>
          </div>
          {#if result.meta?.postCount}
            <div class="result-posts">{result.meta.postCount} posts</div>
          {/if}
        </a>
      {/each}
    </div>

    {#if hasMore}
      <div class="load-more-wrap">
        <button class="load-more-btn" onclick={loadMore}>
          Show more ({totalCount - loadedCount} remaining)
        </button>
      </div>
    {/if}
  {:else if !query}
    <div class="status">
      <p class="muted">Enter a search term above to find threads.</p>
    </div>
  {/if}
</section>

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

  .search-page {
    margin-bottom: 2.5rem;
  }

  .status {
    text-align: center;
    padding: 3rem 1rem;
    color: var(--text-secondary);
    font-size: 0.9375rem;
  }

  .status .muted {
    color: var(--text-muted);
  }

  .spinner {
    width: 32px;
    height: 32px;
    border: 3px solid var(--border);
    border-top-color: var(--accent);
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
    margin: 0 auto 1rem;
  }

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }

  .result-count {
    color: var(--text-muted);
    font-size: 0.875rem;
    margin-bottom: 1rem;
  }

  .result-count :global(strong) {
    color: var(--text-primary);
  }

  .results {
    display: flex;
    flex-direction: column;
    border: 1px solid var(--border);
    border-radius: var(--radius);
    overflow: hidden;
  }

  .result-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
    padding: 0.75rem 1rem;
    background: var(--bg-secondary);
    border-bottom: 1px solid var(--border);
    text-decoration: none;
    color: inherit;
    transition:
      background 0.15s;
  }

  .result-row:last-child {
    border-bottom: none;
  }

  .result-row:hover {
    background: var(--bg-hover);
    text-decoration: none;
  }

  .result-main {
    flex: 1;
    min-width: 0;
  }

  .result-title {
    font-size: 0.9375rem;
    font-weight: 600;
    color: var(--text-primary);
    margin-bottom: 0.2rem;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .result-meta {
    font-size: 0.75rem;
    color: var(--text-muted);
    display: flex;
    gap: 0.375rem;
    flex-wrap: wrap;
    align-items: center;
  }

  .result-cat {
    color: var(--accent);
    font-weight: 500;
  }

  .meta-sep {
    color: var(--text-dimmed);
  }

  .result-posts {
    flex-shrink: 0;
    font-size: 0.75rem;
    color: var(--text-muted);
    white-space: nowrap;
  }

  .load-more-wrap {
    display: flex;
    justify-content: center;
    margin-top: 1.5rem;
  }

  .load-more-btn {
    background: var(--bg-secondary);
    border: 1px solid var(--border);
    color: var(--accent);
    padding: 0.625rem 1.5rem;
    border-radius: var(--radius-sm);
    font-size: 0.875rem;
    cursor: pointer;
    transition:
      background 0.2s,
      border-color 0.2s;
  }

  .load-more-btn:hover {
    background: var(--bg-hover);
    border-color: var(--accent);
  }
</style>
