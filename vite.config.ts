import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig, type PreviewServer } from 'vite';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { lookup } from 'mrmime';
import type { IncomingMessage, ServerResponse } from 'node:http';

// Serves /pagefind/* from build/pagefind/ during preview.
// Pagefind generates its index as a post-build step, so the files
// only exist in the build output dir, not in static/.
function pagefindPlugin() {
  return {
    name: 'pagefind-serve',
    configurePreviewServer(server: PreviewServer) {
      server.middlewares.use((req: IncomingMessage, res: ServerResponse, next: () => void) => {
        if (req.url?.startsWith('/pagefind/')) {
          const filePath = join('build', req.url.split('?')[0]);
          readFile(filePath)
            .then((data) => {
              const mimeType = lookup(filePath) || 'application/octet-stream';
              res.setHeader('Content-Type', mimeType);
              res.end(data);
            })
            .catch(() => next());
        } else {
          next();
        }
      });
    }
  };
}

export default defineConfig({
  plugins: [pagefindPlugin(), sveltekit()]
});
