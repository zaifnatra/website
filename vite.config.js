import { defineConfig } from 'vite'

export default defineConfig({
  appType: 'mpa',
  base: '/',
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
