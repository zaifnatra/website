# Back to the Loj

A desktop and mobile first-person interpretation of the Adirondak Loj trailhead. The site opens directly in a compact walkable clearing, with a reference-informed timber register, an experience noticeboard, a project notebook, and Huzaifa’s own outdoor photographs. Portfolio navigation provides direct access to the same stories without walking. A real Lake Colden photograph is available as an optional photo view.

## Run

```sh
npm ci
npm run dev
```

Open `http://localhost:5173/`. Node 20.19+ or 22.12+ is required by Vite. The compiled Rust WebAssembly binary is included, so running and deploying the site does not require a Rust installation.

```sh
npm run lint
npm run test:wasm
npm run build
npm run preview
```

`npm run deploy` builds and publishes the site to `zaifnatra/zaifnatra.github.io` (Pages serves `main` at `/`), then updates redirects in the original `zaifnatra/website` repository’s `gh-pages` branch. Source code remains in this repository. Deployment is not automatic.

Clean routes: `/`, `/about/`, `/experience/`, `/projects/`, `/projects/mtl-minted/`, `/outside/`, and `/resume/`. GitHub Pages redirects slashless directory URLs such as `/resume` to `/resume/`. These are real static HTML pages, so direct links and refreshes work without an SPA fallback. The résumé page embeds the PDF and offers a download.

`npm run dev` and `npm run build` generate the section pages from `public/about/index.html` with `scripts/build-pages.mjs`. Update that source to keep the readable portfolio and individual sections consistent. Old `.html` links and `/website/` links forward to the new routes; older public image and PDF links remain available.

## Explore

- **W/A/S/D:** walk. **Shift:** move faster. **Up/down:** forward/back. **Left/right:** turn.
- **Drag:** look around. Desktop double-click optionally locks the pointer; Escape releases it.
- **E**, a short click/tap on an object, or the on-screen prompt: open a nearby experience board, notebook, personal photo stand, or register.
- Experience, Projects, Outside, and Say hello also open directly from the navigation.
- On mobile, hold the direction buttons and drag the scene to look.
- The register saves a single note locally in this browser. It never submits an official hiking registration. “Clear this entry” removes it.
- Trail map, controls, reset, exit, sound, and reduced walking motion are available in the interface.

## Architecture

- `rust/trail-core/src/lib.rs`: Rust player movement, camera angles, collision, bounds, and distance tracking. Zero third-party crates.
- `public/wasm/trail_core.wasm`: the compiled Rust engine used by the app.
- `src/scene.js`: Three.js renderer, scene geometry/materials, input collection, and proximity interaction.
- `src/seasonal.js`: authored blue-grey 2012 Volkswagen Jetta TDI and patchy ground snow. The parked car is solid in the Rust movement engine.
- `src/main.js`: browser interface, automatic WebAssembly loading, local register, illustrated map, and synthesized ambience.
- `src/portfolio.js`: all portfolio dialogs, verified work history, projects, personal stories, and contact links.
- `src/styles/theme.css`: responsive photographic landing page and exploration HUD.
- `public/about/index.html`, `about.css`, and `about.js`: preserved personal website and résumé links.
- `REFERENCES.md` and `public/textures/SOURCES.md`: sources and reuse information.

This is a Rust-powered web application, not a full Rust renderer: HTML/CSS/JavaScript handle the browser UI, and Three.js handles WebGL. The heavy renderer is loaded only after entering the trail.

## Rebuild the Rust engine

Install Rust and its `wasm32-unknown-unknown` target:

```sh
rustup target add wasm32-unknown-unknown
npm run build:wasm
npm run test:wasm
cargo test --manifest-path rust/trail-core/Cargo.toml
```

Commit the rebuilt `public/wasm/trail_core.wasm` alongside Rust source changes. `scripts/build-wasm.mjs` uses a normal Cargo installation or the isolated `/tmp/adirondack-cargo` toolchain used during initial development. That temporary installation is not needed to run the checked-in build.

## Scope and realism

The playable area is the trailhead clearing, not the full route to either summit or lake. The register shelter uses a real photograph as a modeling reference, but all geometry is authored. This is not a photogrammetric scan, a measured geographic reconstruction, or a Google Street View panorama. The illustrated route map is not for navigation. Google Maps opens via a normal link without an API key; no Google imagery is downloaded or republished.

A genuinely photorealistic, positionally accurate version needs a licensed 3D scan or a set of overlapping photographs/video of the exact clearing and kiosk. The current scene and Rust movement system provide a base for replacing authored geometry with that captured asset.

The readable portfolio is available in `public/about/index.html`, updated with the latest résumé and user-confirmed Sushi Topia and Chalet Thai roles. Original asset files are unchanged. Optimized personal photo copies are in `public/images/personal-*.jpg`.

### Searchable project documentation

`public/projects/mtl-minted/index.html` is a static project page covering Huzaifa's Rust/Anchor contribution, the McHacks 13 Best Use of Solana award, and the team's US$1,000 microgrant. The microgrant amount comes directly from Huzaifa; no grant provider or award date is inferred. Keep this page, the entry in `public/about/index.html`, and `src/portfolio.js` consistent when updating project details.

The project page includes a canonical URL, social preview metadata, and SoftwareSourceCode JSON-LD matching its visible content. `public/sitemap.xml` lists the homepage, readable portfolio, and project page. URLs use the GitHub Pages address configured in `package.json`; update all canonical, social, structured-data, and sitemap URLs together if the site moves.

After deployment, submit `https://zaifnatra.github.io/sitemap.xml` in Google Search Console and request indexing for the project page. Local changes alone are not visible to Google, and indexing is not guaranteed. `public/robots.txt` is served at the domain root and points crawlers to the sitemap.

The playable bounds are x ±9m and z −19…9m, starting at (0,1.7,2). The irregular parking surface is roughly 16×14m, with the register and personal artifacts a few steps away. Both shader materials and generic environmental photography help the visual atmosphere; it is still authored geometry rather than a measured scan.

### Clearing minimap

The minimap tracks your position and facing direction. Click Work, Projects, Photos, or Register to open that part of the portfolio directly.
