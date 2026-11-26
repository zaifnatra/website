import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const origin = 'https://zaifnatra.github.io';
const portfolio = readFileSync(resolve(root, 'public/about/index.html'), 'utf8');
function write(path, html) {
  const file = resolve(root, 'public', path);
  mkdirSync(dirname(file), { recursive: true });
  writeFileSync(file, html);
}
const sections = [
  ['experience', 'Experience', 'Huzaifa Fareed’s work at Shopify, Meta × MLH, Bombardier, and beyond.'],
  ['projects', 'Projects', 'Projects by Huzaifa Fareed, including mtl minted, a McHacks 13 winner and US$1,000 microgrant recipient.'],
  ['outside', 'Outside', 'Huzaifa Fareed’s hiking, running, camping, and outdoor stories.'],
];
for (const [slug, title, description] of sections) {
  const section = portfolio.match(new RegExp(`<section class="content-section" id="${slug}"[\\s\\S]*?</section>`))?.[0];
  if (!section) throw new Error(`Missing portfolio section: ${slug}`);
  const content = section.replace(/<h2([^>]*)>(.*?)<\/h2>/, '<h1$1>$2</h1>');
  write(`${slug}/index.html`, `<!doctype html>
<html lang="en"><head><meta charset="UTF-8" /><meta name="viewport" content="width=device-width, initial-scale=1" />
<title>${title} | Huzaifa Fareed</title><meta name="description" content="${description}" />
<link rel="canonical" href="${origin}/${slug}/" /><link rel="stylesheet" href="/about.css" /><link rel="icon" type="image/png" sizes="32x32" href="/favicon-32.png" />
  <link rel="icon" href="/favicon.ico" sizes="any" />
  <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
<style>main{max-width:720px;margin:40px auto 80px}h1{font:400 42px/1.2 var(--font-heading)}.section-heading{align-items:center}.masthead{gap:20px;flex-wrap:wrap}</style>
</head><body><a class="skip-link" href="#content">Skip to content</a><div class="shell">
<header class="masthead"><a href="/">← Back to the clearing</a><nav aria-label="Portfolio"><ul class="link-list"><li><a href="/about/">About</a></li>${sections.map(([path, name]) => `<li><a href="/${path}/"${path === slug ? ' aria-current="page"' : ''}>${name}</a></li>`).join('')}<li><a href="/resume/">Résumé</a></li></ul></nav></header>
<main id="content">${content}</main></div></body></html>\n`);
}

// Real directory indexes support direct entry and refresh on GitHub Pages.
// Preserve older shared links with explicit redirects, rather than an SPA 404 trick.
export function redirectPage(target) {
  return `<!doctype html><html lang="en"><head><meta charset="UTF-8" /><meta name="viewport" content="width=device-width, initial-scale=1" /><title>Page moved | Huzaifa Fareed</title><link rel="canonical" href="${origin}${target}" /><meta http-equiv="refresh" content="0; url=${target}" /></head><body><p>This page has moved. <a href="${target}">Continue to Huzaifa’s website</a>.</p><script>location.replace(${JSON.stringify(target)} + location.search + location.hash);</script></body></html>\n`;
}
for (const [oldPath, target] of Object.entries({
  'about.html': '/about/',
  'mtl-minted.html': '/projects/mtl-minted/',
  'resume.html': '/resume/',
})) write(oldPath, redirectPage(target));
console.log('Built clean portfolio routes and legacy redirects.');
