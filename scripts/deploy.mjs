import ghpages from 'gh-pages';
import { mkdirSync, writeFileSync, readFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const origin = 'https://zaifnatra.github.io';
const publish = options => new Promise((resolve, reject) => {
  ghpages.publish(options.dir, options, error => error ? reject(error) : resolve());
});
// The source repository stays in website; this repository hosts the root domain.
await publish({ dir: resolve(root, 'dist'), branch: 'main', nojekyll: true,
  repo: 'https://github.com/zaifnatra/zaifnatra.github.io.git',
  message: 'Publish portfolio at root with clean routes' });
console.log(`Published ${origin}/`);

const legacy = resolve(root, 'dist-legacy');
const routes = {
  'index.html': '/', 'about.html': '/about/', 'mtl-minted.html': '/projects/mtl-minted/',
  'resume.html': '/resume/', 'about/index.html': '/about/', 'resume/index.html': '/resume/',
  'projects/index.html': '/projects/', 'projects/mtl-minted/index.html': '/projects/mtl-minted/',
  'experience/index.html': '/experience/', 'outside/index.html': '/outside/',
};
for (const [file, route] of Object.entries(routes)) {
  const path = resolve(legacy, file), url = origin + route;
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, `<!doctype html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>Page moved | Huzaifa Fareed</title><link rel="canonical" href="${url}"><meta http-equiv="refresh" content="0; url=${url}"></head><body><p>This page has moved to <a href="${url}">${url}</a>.</p><script>location.replace(${JSON.stringify(url)} + location.search + location.hash);</script></body></html>`);
}
writeFileSync(resolve(legacy, 'sitemap.xml'), readFileSync(resolve(root, 'dist/sitemap.xml')));
// Keep older shared image/PDF URLs available while forwarding the old pages.
await publish({ dir: legacy, branch: 'gh-pages', add: true, nojekyll: true,
  repo: 'https://github.com/zaifnatra/website.git', message: 'Forward old website URLs to root portfolio' });
console.log('Published redirects for /website/ and its old pages.');
