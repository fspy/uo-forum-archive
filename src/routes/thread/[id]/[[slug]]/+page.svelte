<script lang="ts">
  import { base } from "$app/paths";
  import Post from "$lib/components/Post.svelte";

  let { data } = $props();

  let categorySlug = $derived(data.categorySlug);
</script>

<svelte:head>
  <title>{data.thread.title} - UO Forum Archive</title>
  <meta
    name="description"
    content="{data.thread.category} - {data.thread.postCount} posts by {data
      .thread.opAuthor}"
  />
</svelte:head>

<div class="breadcrumb">
  <a href="{base}/">Home</a>
  <span class="sep">/</span>
  <a href="{base}/category/{categorySlug}">{data.thread.category}</a>
  <span class="sep">/</span>
  <span class="current">Thread #{data.thread.discussionId}</span>
</div>

<div
  class="thread-header"
  data-pagefind-body
  data-pagefind-meta="author:{data.thread.opAuthor}"
  data-pagefind-filter="category:{data.thread.category}"
  data-pagefind-sort="date:{data.thread.opDatetime}"
>
  <h2 class="thread-title" data-pagefind-meta="title" data-pagefind-weight="10">
    {data.thread.title}
  </h2>
  <span hidden data-pagefind-meta="postCount:{data.thread.postCount}"></span>
  <span hidden data-pagefind-meta="date:{data.thread.opDate || ''}"></span>
  <span hidden data-pagefind-meta="category:{data.thread.category}"></span>
  <div class="thread-meta" data-pagefind-ignore>
    <a href="{base}/category/{categorySlug}" class="meta-cat"
      >{data.thread.category}</a
    >
    <span class="meta-sep">&middot;</span>
    <span>{data.thread.opAuthor}</span>
    <span class="meta-sep">&middot;</span>
    <span>{data.thread.postCount} posts</span>
    {#if data.thread.opDate}
      <span class="meta-sep">&middot;</span>
      <span>{data.thread.opDate}</span>
    {/if}
  </div>
</div>

<div class="posts">
  {#each data.thread.posts as post (post.postId)}
    <Post {post} />
  {/each}
</div>

<div class="back-nav">
  <a href="{base}/category/{categorySlug}" class="back-link"
    >&larr; Back to {data.thread.category}</a
  >
</div>

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

  .thread-header {
    margin-bottom: 1.5rem;
  }

  .thread-title {
    font-size: 1.5rem;
    color: var(--accent);
    font-weight: 700;
    line-height: 1.3;
    margin-bottom: 0.5rem;
  }

  .thread-meta {
    color: var(--text-muted);
    font-size: 0.875rem;
    display: flex;
    gap: 0.5rem;
    flex-wrap: wrap;
    align-items: center;
  }

  .meta-cat {
    color: var(--accent);
    text-decoration: none;
    font-weight: 500;
  }

  .meta-cat:hover {
    text-decoration: underline;
  }

  .meta-sep {
    color: var(--text-dimmed);
  }

  .posts {
    margin-bottom: 2rem;
  }

  .back-nav {
    padding: 1.5rem 0;
    border-top: 1px solid var(--border);
  }

  .back-link {
    display: inline-flex;
    align-items: center;
    gap: 0.375rem;
    background: var(--bg-secondary);
    border: 1px solid var(--border);
    color: var(--accent);
    padding: 0.5rem 1rem;
    border-radius: var(--radius-sm);
    text-decoration: none;
    font-size: 0.875rem;
    transition:
      background 0.2s,
      border-color 0.2s;
  }

  .back-link:hover {
    background: var(--bg-hover);
    border-color: var(--accent);
    text-decoration: none;
  }
</style>
