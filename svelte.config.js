import adapter from '@sveltejs/adapter-static';

const dev = process.argv.includes('dev');

/** @type {import('@sveltejs/kit').Config} */
const config = {
  kit: {
    adapter: adapter({
      pages: 'build',
      assets: 'build',
      fallback: undefined,
      precompress: false,
      strict: true
    }),
    paths: {
      base: dev ? '' : process.env.BASE_PATH || ''
    },
    prerender: {
      handleMissingId: 'ignore',
      handleHttpError: 'ignore',
      entries: ['*'],
      concurrency: 8,
      crawl: false
    }
  }
};

export default config;
