import { defineConfig } from 'vite'
import { createHash } from 'node:crypto'
import { readFileSync } from 'node:fs'

// Match the JS scene to its Rust ABI even when Pages caches public assets.
const movementHash = createHash('sha256').update(readFileSync(new URL('./public/wasm/trail_core.wasm', import.meta.url))).digest('hex').slice(0, 16)

export default defineConfig({
  appType: 'mpa',
  base: '/',
  define: { 'import.meta.env.TRAIL_CORE_HASH': JSON.stringify(movementHash) },
  plugins: [{
    name: 'static-directory-routes',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        const url = new URL(req.url, 'http://localhost');
        if (/^\/(about|experience|projects|projects\/mtl-minted|outside|resume)\/?$/.test(url.pathname)) {
          if (!url.pathname.endsWith('/')) {
            res.writeHead(302, { Location: `${url.pathname}/${url.search}` });
            res.end();
            return;
          }
          req.url = `${url.pathname}index.html${url.search}`;
        }
        next();
      });
    },
  }],
})
