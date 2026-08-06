# Portfolio Site — Complete Front-End Design Specification

> **Purpose of this document.** This is a self-contained, framework-agnostic specification of the *visual and interaction design* of this single-page portfolio site. It is written so that a different agent can reproduce the exact look and feel inside a **completely different application** without importing this project's build tooling, routing, or component architecture.
>
> **Read this first — how to port without breaking the host app:**
> - This design is **presentational only**. It has **no global side effects**: no CSS resets applied to `html`/`body` that you must keep, no state management, no data fetching, no routing dependency. Everything can live inside one scoped container.
> - The original uses React + Vite, but **nothing here requires React**. Every element is a plain semantic tag (`nav`, `section`, `a`, `img`, `h1`…`h4`, `p`, `span`). Reimplement in any framework or plain HTML.
> - The original writes most styling as **inline styles** on elements, with a small companion stylesheet (`theme.css`) for pseudo-classes, keyframes, and one media query. When porting, you may keep inline styles or convert them to classes — the *values* below are the source of truth.
> - **To avoid affecting the host application**, scope everything: wrap the whole design in a single root container and namespace the handful of global rules (see [§13 Porting checklist](#13-porting-checklist--isolation-guidance)). Do **not** copy the bare `* { margin:0; padding:0 }` reset into a host app that already has its own reset — it will clobber the host's spacing. Guidance for scoping it is in §13.

---

## 1. Design philosophy & overall impression

A **quiet, editorial, high-end personal portfolio.** The aesthetic reads like a design-studio landing page: lots of whitespace, a serif display typeface paired with a neutral sans body, near-pure black-on-white, thin hairline dividers, and generous vertical rhythm. Motion is minimal and tasteful — a soft fade-and-rise on load, a continuously scrolling credential marquee, subtle scale-on-hover for buttons.

Keywords: **minimal, monochrome, editorial, serif-display, airy, hairline-bordered, restrained motion.**

The page is a **single vertical scroll** with in-page anchor navigation (no separate routes/pages). Sections are stitched together by full-width hairline rules and consistent max-width centering.

---

## 2. Layout skeleton (top to bottom)

The entire page is one scrolling column on a white background. Order of regions:

1. **Hero block** — full-viewport-height region with a background photo, a top navigation bar overlaid, and a large centered headline + subhead + two CTA buttons.
2. **Credential marquee** — a thin full-width horizontal auto-scrolling strip of career highlights, bounded top and bottom by hairline rules.
3. **About section** (`#about`) — two-column: text + experience list on the left, a tall sticky image on the right.
4. **Work section** (`#work`) — heading row, then three large alternating "feature" project rows, then a 4-up grid of smaller project cards.
5. **Outside section** (`#outside`) — heading, then a responsive 3-up photo gallery.
6. **Contact section** (`#contact`) — two-column: heading + blurb + two buttons on the left, a list of contact links (Email / LinkedIn / GitHub) on the right.
7. **Footer** — logo mark + location/year, separated by a top hairline.

All content regions (except the marquee, which is full-bleed) are centered with `max-width: 80rem` and horizontal padding.

---

## 3. Design tokens

These are the atomic values. Everything in the design is built from this set. When porting, define these once (as CSS custom properties, a theme object, whatever your host uses) and reference them.

### 3.1 Color palette

| Token | Value | Usage |
|---|---|---|
| `--color-bg` | `#FFFFFF` | Page background, button text on dark buttons, marquee text-on-white |
| `--color-fg` | `#000000` | Primary text, headings, active nav link, dark button background, logo, focus outline |
| `--color-muted` | `#6F6F6F` (also written `rgb(111,111,111)`) | Secondary/body text, inactive nav links, captions, italic emphasis words, meta labels |
| `--color-hairline` | `#EEEEEE` | Section divider rules, list-row separators |
| `--color-border` | `#E4E4E4` | Outlined-button and chip borders |
| `--color-surface` | `#F7F7F7` | Image placeholder / card image background (shows before/behind images) |

There are **no** accent/brand colors, gradients of hue, or saturated colors anywhere. The only gradient is a **white-to-transparent-to-white vertical scrim** over the hero photo (see §7.1). The palette is strictly grayscale.

### 3.2 Typography

Two font families, loaded from Google Fonts:

| Family | Role | Weights used | Style notes |
|---|---|---|---|
| **Instrument Serif** | Display / headings / logo | `400` only (regular + italic) | Used at large sizes for all `h1`–`h4`, the logo, and the footer mark. Italic variant is used for emphasized words rendered in muted gray. |
| **Inter** | Body / UI | `300, 400, 500, 600` | Everything that isn't a display heading: paragraphs, nav links, buttons, chips, captions, meta text. |

Font stacks:
- Display: `'Instrument Serif', serif`
- Body: `'Inter', system-ui, sans-serif`

**Google Fonts loading** (put in document `<head>`; the design assumes these are available):

```html
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link
  href="https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Inter:wght@300;400;500;600&display=swap"
  rel="stylesheet" />
```

> If the host app already manages fonts, just ensure these two families with these weights are available; otherwise self-host or use the links above. `display=swap` avoids blocking render.

#### Type scale (exact values from the design)

Sizes use `rem` and fluid `clamp()`. Assume root font-size = 16px (`1rem = 16px`).

| Element | Font family | Size | Weight | Line-height | Letter-spacing | Color |
|---|---|---|---|---|---|---|
| Hero H1 | Instrument Serif | `clamp(3rem, 7.5vw, 6rem)` | 400 | `.95` | `-2.46px` | `#000` (emphasis word `#6F6F6F` italic) |
| Section H2 (About/Outside/Work) | Instrument Serif | `clamp(2.25rem, 4vw, 3.5rem)` | 400 | `1.05` | `-1.4px` | `#000` |
| Contact H2 | Instrument Serif | `clamp(2.25rem, 4.5vw, 3.75rem)` | 400 | `1.02` | `-1.6px` | `#000` |
| Feature project H3 | Instrument Serif | `2.25rem` | 400 | `1.05` | `-1px` | `#000` |
| Small project H4 | Instrument Serif | `1.5rem` | 400 | (default) | `-.5px` | `#000` |
| Logo (nav) | Instrument Serif | `1.875rem` | 400 | `1` | `-0.02em` | `#000` |
| Logo (footer) | Instrument Serif | `1.25rem` | 400 | — | — | `#000` |
| Hero subhead | Inter | `1.125rem` | 400 | `1.7` | — | `#6F6F6F` |
| Body paragraph (About) | Inter | `1.0625rem` | 400 | `1.75` | — | `#6F6F6F` |
| Feature project body | Inter | `1rem` | 400 | `1.7` | — | `#6F6F6F` |
| Small project body | Inter | `.9375rem` | 400 | `1.65` | — | `#6F6F6F` |
| Contact blurb | Inter | `1.0625rem` | 400 | `1.75` | — | `#6F6F6F` |
| Nav links | Inter | `.875rem` | 400 | — | — | active `#000`, others `#6F6F6F` |
| Primary CTA buttons (hero/contact) | Inter | `1rem` | 400 | — | — | `#FFF` on `#000`, or `#000` outlined |
| Nav "Get in touch" button | Inter | `.875rem` | 400 | — | — | `#FFF` on `#000` |
| Chips (project links) | Inter | `.8125rem` (feature) / `.78rem` (small cards) | 400 | — | — | `#000` |
| Section eyebrow label ("About", "Reach me", etc.) | Inter | `.75rem` | 400 | `1` | `.18em` | `#6F6F6F`, `text-transform: uppercase` |
| Project category eyebrow ("Winner · McHacks") | Inter | `.75rem` | 400 | — | `.16em` | `#6F6F6F`, uppercase |
| Tech stack line | Inter | `.8125rem` | 400 | — | — | `#6F6F6F` |
| Marquee items | Inter | `.8125rem` | 400 | — | `.14em` | `#6F6F6F`, uppercase |
| Meta captions (dates, "Seven projects…") | Inter | `.8125rem`–`.875rem` | 400 | — | — | `#6F6F6F` |
| Contact link labels (EMAIL/LINKEDIN/GITHUB) | Inter | `.75rem` | 400 | — | `.16em` | `#6F6F6F`, uppercase |
| Contact link values | Inter | `1.125rem` (email uses `clamp(.9375rem,2.5vw,1.125rem)`) | 400 | — | — | `#000` |
| Footer location/year | Inter | `.8125rem` | 400 | — | — | `#6F6F6F` |

**Italic-emphasis pattern (signature detail):** Headings frequently place one word in *italic gray* while the rest is upright black. Example markup:

```html
<h2>My passions, <em style="font-style:italic;color:rgb(111,111,111)">hobbies</em> and life story.</h2>
```
Used in: hero ("*Portfolio*"), About ("*hobbies*"), Outside ("*screen.*"), Contact ("*together.*"). Always `font-style: italic` + `color:#6F6F6F` on a single word.

**Logo mark:** the word `huzaifa` in Instrument Serif with a superscript ® :
```html
<a href="#top">huzaifa<sup style="font-size:.5em;vertical-align:super;letter-spacing:0">®</sup></a>
```

### 3.3 Spacing, radii, sizing

- **Content max-width:** `80rem` (1280px), centered with `margin: 0 auto`.
- **Standard horizontal padding** inside sections: `1.25rem` (some use `1.5rem`/`2rem` in the hero/nav). Use `1.25rem` as the default gutter.
- **Vertical section padding:** fluid `clamp(4rem, 10vw, 8rem)` top/bottom for major sections.
- **Border radii:**
  - Pills (buttons, chips, badges): `999px` (fully rounded).
  - Image containers / cards: `2px` (nearly square — a deliberate, crisp editorial detail).
- **Hairline borders:** `1px solid #EEEEEE` for dividers; `1px solid #E4E4E4` for interactive outlines (buttons/chips).
- **Button padding:**
  - Hero primary "See the work": `1.25rem 3.5rem`.
  - Hero secondary "Resume": `1.25rem 2.5rem`.
  - Contact buttons: `1.125rem 2.5rem`.
  - Nav "Get in touch": `.625rem 1.5rem`.
  - Chips (feature): `.45rem 1rem`; chips (small cards): `.4rem .9rem`.
  - Eyebrow badge padding for the (removed) counter was `.35rem .75rem` — reuse for any pill badge.
- **Image sizes:**
  - Feature-project paired images: height `16rem` each, side-by-side `1fr 1fr` with `.75rem` gap.
  - Small project card image: height `13rem`.
  - Outside gallery tiles: `clamp(16rem, 26vw, 22rem)` tall.
  - About sticky image: `clamp(24rem, 42vw, 32rem)` tall, `position: sticky; top: 2rem`.
  - Company logos in experience list: `36×36px`, `border-radius: 8px`, `object-fit: contain`.

### 3.4 Breakpoint

- **Single mobile breakpoint: `640px`.** At `max-width: 640px` the text navigation links are hidden (see §7.1 and §11). All other responsiveness is handled fluidly via `clamp()` and CSS Grid `auto-fit` with `minmax()`, so there is effectively one hard breakpoint.

---

## 4. Global styles / CSS reset

The original `theme.css` global rules. **When porting into a host app, see §13 before copying the reset** — scope it to your root container instead of applying globally.

```css
/* box model + zero default margins/padding */
* { box-sizing: border-box; margin: 0; padding: 0; }

body {
  font-family: 'Inter', system-ui, sans-serif;
  background: #FFFFFF;
  color: #000000;
  -webkit-font-smoothing: antialiased;
}

html { scroll-behavior: smooth; }          /* smooth in-page anchor scrolling */

img { max-width: 100%; }                    /* images never overflow their box */

a { color: inherit; text-decoration: none; }
a:hover { opacity: .7; }                    /* default link hover: subtle fade */

:focus-visible { outline: 2px solid #000000; outline-offset: 3px; }  /* a11y focus ring */

/* anchored sections land 2rem below the top edge, not flush */
section[id] { scroll-margin-top: 2rem; }
```

Key behaviors to preserve:
- **Smooth scroll** for the anchor nav.
- **Universal link reset** (`color: inherit; text-decoration: none`) with a **0.7 opacity hover** as the baseline; specific components override this (see §5).
- **Visible focus ring** — a 2px solid black outline offset 3px, for keyboard accessibility. Keep this.
- **`scroll-margin-top: 2rem`** on `[id]` sections so anchored jumps aren't flush to the viewport top.

---

## 5. Interaction / hover states

Defined as classes in `theme.css` (because inline styles can't express `:hover`). Three interactive archetypes:

```css
/* text nav links: gray → black, full opacity on hover */
.nav-link:hover { color: #000000; opacity: 1; }

/* pill buttons: gentle scale up */
.btn:hover { transform: scale(1.03); opacity: 1; }

/* chips (project link pills): invert to solid black */
.chip:hover { background: #000000; color: #FFFFFF; opacity: 1; }
```

Corresponding transitions live on the elements themselves (inline):
- Nav links: `transition: color .2s ease`.
- Buttons: `transition: transform .25s ease`.
- Chips: `transition: background .2s ease, color .2s ease`.
- Experience list rows / gallery: `transition: opacity .2s ease` (they rely on the global `a:hover { opacity:.7 }`).

**Summary of hover language:** links darken, buttons lift (scale 1.03), chips invert to black-on-white→white-on-black, everything else softly fades to 0.7 opacity.

---

## 6. Animations & keyframes

Three animations, all defined in `theme.css`. All motion is disabled under `prefers-reduced-motion` (see below — keep this).

```css
/* soft fade + upward rise; used for entrance of hero text and any badge */
@keyframes fadeRise {
  from { opacity: 0; transform: translateY(20px); }
  to   { opacity: 1; transform: translateY(0); }
}

/* infinite horizontal scroll for the credential marquee */
@keyframes marquee {
  from { transform: translateX(0); }
  to   { transform: translateX(-50%); }   /* -50% because the list is duplicated */
}

/* respect reduced-motion: kill all animation + smooth scroll */
@media (prefers-reduced-motion: reduce) {
  html { scroll-behavior: auto; }
  * { animation: none !important; transition: none !important; }
}
```

**Where `fadeRise` is applied (staggered hero entrance):**
- H1: `animation: fadeRise .8s ease-out both`
- Subhead: `animation: fadeRise .8s ease-out .2s both` (0.2s delay)
- CTA button row: `animation: fadeRise .8s ease-out .4s both` (0.4s delay)

This produces a top-down cascade of the hero content on load. Duration `.8s`, easing `ease-out`, `both` fill mode so elements start hidden.

**Marquee mechanics:** The strip contains the list of credentials **twice** (the second copy `aria-hidden="true"`). The track is `width: max-content` and animated `marquee 32s linear infinite`, translating from `0` to `-50%`. Because the content is duplicated, `-50%` equals exactly one full set width, giving a seamless infinite loop.

---

## 7. Component specifications (exhaustive)

Each component below lists structure, exact styling, and behavior. Values are the source of truth.

### 7.1 Hero block

A full-height region containing a background photo, the overlaid top nav, and centered hero content.

**Outer wrapper:**
```
position: relative; min-height: 100vh; width: 100%; overflow: hidden;
```
The page's outermost container also sets `overflow-x: hidden` to prevent horizontal scroll from the marquee/animations, and establishes the white bg + black text base.

**Background image layer** (absolutely positioned, behind everything, `z-index: 0`):
```
position: absolute; left:0; right:0; bottom:0; top: 300px; z-index:0; overflow:hidden;
```
> Note the `top: 300px` — the photo starts 300px down, so the top of the hero (nav + start of headline) sits on pure white, and the photo fills the lower portion. The `<img>` inside is `position:absolute; inset:0; width:100%; height:100%; object-fit:cover; object-position:center 40%` with `fetchPriority="high"`, `decoding="async"`.

**Scrim over the photo** (a white gradient that fades the photo so text stays legible):
```css
position: absolute; inset: 0;
background: linear-gradient(
  to bottom,
  #FFFFFF 0%,
  rgba(255,255,255,.88) 18%,
  rgba(255,255,255,.45) 52%,
  rgba(255,255,255,.8) 100%
);
```
This is the **only gradient in the design** — a white veil, densest at top and bottom, most transparent (showing the photo) around the middle.

**Top navigation bar** (`<nav>`, overlaid, `z-index: 10`):
```
position: relative; z-index: 10;
display: flex; justify-content: space-between; align-items: center;
flex-wrap: wrap; gap: 1rem;
max-width: 80rem; margin: 0 auto; padding: 1.5rem 2rem;
```
- **Left:** the logo `<a href="#top">huzaifa®</a>` (Instrument Serif, `1.875rem`).
- **Right:** a flex group (`display:flex; align-items:center; gap:1rem 1.5rem; justify-content:flex-end`) containing:
  - An inner `.nav-links` container (`display:flex; align-items:center; flex-wrap:wrap; gap:1rem 1.5rem; justify-content:flex-end`) with the five text links: **Home** (`#top`, active/black), **About** (`#about`), **Work** (`#work`), **Outside** (`#outside`), **Reach Me** (`#contact`) — all `.875rem`; Home is black, the rest are `#6F6F6F` with class `nav-link` (gray→black on hover).
  - The **"Get in touch"** pill button (`<a href="#contact" class="btn">`): `border-radius:999px; padding:.625rem 1.5rem; font-size:.875rem; background:#000; color:#FFF; transition:transform .25s ease; white-space:nowrap`.

**Mobile behavior (≤640px):** `.nav-links { display: none !important; }` — the five text links disappear, leaving only the **logo (left) + "Get in touch" button (right)** on a single clean row. The button has `white-space: nowrap` so its label never breaks. Section links remain reachable by scrolling. *(This is the intended, corrected mobile layout.)*

> **Why the button is broken out of `.nav-links`:** it must stay visible on mobile while the text links hide. Keep the button as a **sibling** of the `.nav-links` container, not inside it.

**Hero content** (`<section id="top">`):
```
position: relative; z-index: 10;
display: flex; flex-direction: column; align-items: center; justify-content: center;
text-align: center;
padding: calc(8rem - 75px) 1.5rem clamp(6rem,14vw,10rem) 1.5rem;
```
Contains, in order:
1. **H1** — `Huzaifa Fareed <em>Portfolio</em> Site.` (the italic word gray). `max-width: 80rem`, `text-wrap: pretty`, plus the `fadeRise` entrance.
2. **Subhead `<p>`** — `Software engineering student, outdoor & tech enthusiast.` `max-width: 42rem; margin-top: 2rem`; `fadeRise` +0.2s.
3. **CTA row `<div>`** — `display:flex; flex-wrap:wrap; justify-content:center; width:100%; gap:1rem; margin-top:3rem`; `fadeRise` +0.4s. Two buttons:
   - **Primary "See the work"** (`href="#work"`, `.btn`): `border-radius:999px; padding:1.25rem 3.5rem; font-size:1rem; background:#000; color:#FFF; transition:transform .25s ease`.
   - **Secondary "Resume"** (`href={CV}` `target="_blank" rel="noopener noreferrer"`, `.btn`): `border-radius:999px; padding:1.25rem 2.5rem; font-size:1rem; color:#000; border:1px solid #E4E4E4; transition:transform .25s ease`.

**Button system (reusable):**
- *Primary/dark:* solid `#000` bg, `#FFF` text, pill, no border.
- *Secondary/outline:* transparent bg, `#000` text, `1px solid #E4E4E4` border, pill.
- Both use `.btn` (scale 1.03 on hover).

### 7.2 Credential marquee

Full-bleed strip directly under the hero.

**Wrapper `<section>`:** `border-top: 1px solid #EEEEEE; border-bottom: 1px solid #EEEEEE; overflow: hidden; padding: 1.25rem 0;`

**Track `<div>`:** `display:flex; gap:4rem; width:max-content; animation: marquee 32s linear infinite; color:#6F6F6F; font-size:.8125rem; letter-spacing:.14em; text-transform:uppercase;`

**Content:** a list of `<span>` items, then the **same list duplicated** with `aria-hidden="true"` on the copies (required for the seamless `-50%` loop). Example items:
`Shopify · SWE Intern` · `Meta × MLH · Production Engineering` · `Bombardier Aerospace · SWE Intern` · `3rd overall · Meta Hackathon` · `Winner · McHacks` · `Winner · ConUHacks`.

### 7.3 About section (`#about`)

Two-column responsive grid.

**Section:** `max-width:80rem; margin:0 auto; padding: clamp(4rem,10vw,8rem) 1.25rem; display:grid; grid-template-columns: repeat(auto-fit, minmax(min(100%,26rem),1fr)); gap: clamp(2.5rem,5vw,5rem); align-items:start;`
> The `auto-fit / minmax(min(100%,26rem),1fr)` pattern = **two columns on wide screens, one column when a column would be narrower than 26rem.** This is the responsive workhorse used across the site; reuse it.

**Left column** (`display:flex; flex-direction:column; gap:2rem`):
- Eyebrow `<span>`: "About" — `.75rem`, `letter-spacing:.18em`, uppercase, `#6F6F6F`.
- H2 with italic-emphasis word.
- Body `<p>`: `1.0625rem`, line-height `1.75`, `#6F6F6F`, `max-width:34rem`.
- **Experience list** (`display:flex; flex-direction:column; gap:.25rem; margin-top:1rem`): each entry is an `<a>` row:
  ```
  display:flex; align-items:center; gap:1rem; padding:1rem 0;
  border-top:1px solid #EEEEEE;  /* last row also gets border-bottom */
  transition: opacity .2s ease;
  ```
  Row content: `36×36` company logo (`border-radius:8px; object-fit:contain; flex-shrink:0`) → a name/role stack (`display:flex; flex-direction:column; gap:2px`; name `.9375rem` weight 500 black, role `.8125rem` `#6F6F6F`) → a right-aligned date `<span>` (`margin-left:auto; font-size:.8125rem; color:#6F6F6F; white-space:nowrap`).

**Right column:** a **sticky** image container: `position:sticky; top:2rem; height:clamp(24rem,42vw,32rem); overflow:hidden; border-radius:2px;` with an `<img>` (`width:100%; height:100%; object-fit:cover; display:block`). The image scrolls with the text then pins.

### 7.4 Work section (`#work`)

**Section:** `max-width:80rem; margin:0 auto; padding: 0 1.25rem 6rem 1.25rem;`

**Header row:** `display:flex; justify-content:space-between; align-items:flex-end; gap:2rem; padding-bottom:3rem; border-bottom:1px solid #EEEEEE;` — left: H2 "Projects" (Instrument Serif, `clamp(2.25rem,4vw,3.5rem)`, line-height 1); right: a meta `<span>` "Seven projects · 2024 — 2026" (`.875rem`, `#6F6F6F`, `padding-bottom:.5rem`).

**Feature project rows (×3, alternating image side):** each is a grid:
```
display:grid; grid-template-columns: repeat(auto-fit, minmax(min(100%,22rem),1fr));
gap: clamp(1.5rem,4vw,3rem); align-items:center;
padding: 3.5rem 0; border-bottom: 1px solid #EEEEEE;
```
Each row has two children: an **image pair** and a **text block**. Rows **alternate** which comes first (image-left/text-right, then text-left/image-right, then image-left/text-right) for visual rhythm.
- **Image pair:** `display:grid; grid-template-columns:1fr 1fr; gap:.75rem;` — two tiles, each `height:16rem; overflow:hidden; border-radius:2px; background:#F7F7F7`, image `object-fit:cover`.
- **Text block** (`display:flex; flex-direction:column; gap:1rem`): category eyebrow (`.75rem`, `letter-spacing:.16em`, uppercase, `#6F6F6F`, e.g. "Winner · McHacks") → H3 (Instrument Serif `2.25rem`) → description `<p>` (`1rem`/`1.7`/`#6F6F6F`) → tech-stack `<span>` (`.8125rem`, `#6F6F6F`) → **chip row** (`display:flex; flex-wrap:wrap; gap:.5rem; margin-top:.25rem`).
- **Chips** (`.chip` links, `target="_blank" rel="noopener noreferrer"`): `padding:.45rem 1rem; border:1px solid #E4E4E4; border-radius:999px; font-size:.8125rem; white-space:nowrap; color:#000; transition:background .2s ease,color .2s ease`. Labels use a trailing `↗`, e.g. "Code on GitHub ↗", "Devpost ↗". Invert to black on hover.

**Small project grid (×4 cards):**
```
display:grid; grid-template-columns: repeat(auto-fit, minmax(min(100%,16rem),1fr));
gap: 2rem; padding-top: 3.5rem;
```
Each card (`display:flex; flex-direction:column; gap:1rem`): image (`height:13rem; overflow:hidden; border-radius:2px; background:#F7F7F7`) → H4 (Instrument Serif `1.5rem`) → description `<p>` (`.9375rem`/`1.65`/`#6F6F6F`) → tech `<span>` (`.8125rem`) → chip row pinned to bottom (`margin-top:auto; padding-top:.25rem`, chips slightly smaller: `padding:.4rem .9rem; font-size:.78rem`). Chip labels here are shorter ("GitHub ↗", "Live ↗", "Download ↗").

### 7.5 Outside section (`#outside`)

**Section:** `max-width:80rem; margin:0 auto; padding: 0 1.25rem clamp(4rem,10vw,8rem) 1.25rem;`

**Header** (`display:flex; flex-direction:column; gap:1rem; padding-bottom:3rem`): eyebrow "Outside" + H2 with italic word ("Away from the *screen.*").

**Gallery grid:** `display:grid; grid-template-columns: repeat(auto-fit, minmax(min(100%,18rem),1fr)); gap:1rem;` — three photo tiles, each `height:clamp(16rem,26vw,22rem); overflow:hidden; border-radius:2px; background:#F7F7F7`, image `object-fit:cover; display:block`.

### 7.6 Contact section (`#contact`)

Two-column responsive grid.

**Section:** `max-width:80rem; margin:0 auto; padding: 0 1.25rem clamp(4rem,10vw,8rem) 1.25rem; display:grid; grid-template-columns: repeat(auto-fit, minmax(min(100%,24rem),1fr)); gap: clamp(2.5rem,5vw,5rem); align-items:start;`

**Left column** (`display:flex; flex-direction:column; gap:2rem`): eyebrow "Reach me" → H2 ("Let's connect or build something *together.*", `clamp(2.25rem,4.5vw,3.75rem)`, letter-spacing `-1.6px`) → blurb `<p>` (`1.0625rem`/`1.75`/`#6F6F6F`, `max-width:30rem`) → **button row** (`display:flex; flex-wrap:wrap; gap:1rem; margin-top:.5rem`) with a primary "Email me" (`mailto:`, dark pill, `padding:1.125rem 2.5rem`) and an outline "View CV" (`padding:1.125rem 2.5rem; border:1px solid #E4E4E4`).

**Right column** (`display:flex; flex-direction:column`): a list of three contact rows, each:
```
display:flex; justify-content:space-between; align-items:baseline; gap:1rem;
padding:1.5rem 0; border-top:1px solid #EEEEEE;   /* last row adds border-bottom */
```
Row = uppercase label `<span>` (`.75rem`, `letter-spacing:.16em`, `#6F6F6F`) on the left + value `<a>` on the right (`1.125rem`, `#000`). Rows: **Email** (`mailto:`, value uses `clamp(.9375rem,2.5vw,1.125rem)` + `overflow-wrap:anywhere; text-align:right` so long addresses wrap), **LinkedIn**, **GitHub** (external links `target="_blank" rel="noopener noreferrer"`).

### 7.7 Footer

```
max-width:80rem; margin:0 auto; padding:2rem 1.25rem;
display:flex; flex-wrap:wrap; gap:1rem;
justify-content:space-between; align-items:center;
border-top: 1px solid #EEEEEE;
```
Left: the logo mark "huzaifa®" (Instrument Serif `1.25rem`). Right: a `<span>` "Montréal · 2026" (`.8125rem`, `#6F6F6F`).

---

## 8. Recurring layout patterns (reuse these)

1. **Centered content column:** `max-width: 80rem; margin: 0 auto;` + `1.25rem` horizontal padding.
2. **Responsive two-column that collapses to one:**
   `display:grid; grid-template-columns: repeat(auto-fit, minmax(min(100%, <BASIS>), 1fr)); gap: clamp(...);`
   Basis is `26rem` (About), `22rem` (feature projects), `24rem` (Contact), `18rem` (Outside), `16rem` (small cards). Larger basis = collapses to one column sooner.
3. **Hairline-separated list rows:** `padding: 1.25–1.5rem 0; border-top: 1px solid #EEEEEE;` with the final row also taking `border-bottom`.
4. **Image tile:** fixed/clamped height + `overflow:hidden; border-radius:2px; background:#F7F7F7`, inner `<img>` `width:100%; height:100%; object-fit:cover; display:block`.
5. **Eyebrow label:** tiny uppercase gray tracker text above a heading (`.75rem`, `letter-spacing:.16–.18em`, `text-transform:uppercase`, `#6F6F6F`).
6. **Pill + chip:** `border-radius:999px`; solid-dark, outline, or invert-on-hover variants.
7. **Fluid vertical rhythm:** section padding `clamp(4rem,10vw,8rem)`; heading sizes via `clamp()`.

---

## 9. Accessibility notes (preserve these)

- **Visible focus ring:** `:focus-visible { outline: 2px solid #000; outline-offset: 3px }`.
- **Reduced motion:** all animations/transitions and smooth scroll are disabled under `prefers-reduced-motion: reduce`.
- **Decorative duplicates hidden:** the marquee's duplicated set is `aria-hidden="true"`.
- **External links** use `target="_blank" rel="noopener noreferrer"`.
- **Images** have descriptive `alt` text; below-the-fold images use `loading="lazy"`, the hero uses `fetchPriority="high"` + `decoding="async"`.
- **Semantic landmarks:** `nav`, `section[id]`, `footer`, real heading hierarchy (`h1` → `h2` → `h3`/`h4`).
- **Color contrast:** primary text is `#000` on `#FFF`; the `#6F6F6F` gray is reserved for secondary text at readable sizes.

---

## 10. Content/asset inventory (for reference)

The design references these asset *slots* — swap in your own when porting:
- **Photos:** one hero landscape (`salkantay2`), one tall About portrait (`salkantay`), three "Outside" gallery shots (`ultra`, `cat`, `golf`), and project screenshots (paired per feature project; single per small card).
- **Logos:** three 36px company logos (Shopify, Meta, Bombardier) in the experience list, plus a `favicon.svg`.
- **Downloads:** a résumé PDF (opened in a new tab) and a `.jar` game file (a `download` link).
- **Font families:** Instrument Serif + Inter (see §3.2).

> None of the imagery is load-bearing for the design language — the *layout, type, color, spacing, and motion* are what define it. Substitute assets freely.

---

## 11. Responsive behavior summary

- **≥ ~1000px:** full two-column sections, multi-column project grids, full text nav.
- **Fluidly down to 640px:** grids collapse column-by-column via `auto-fit`/`minmax`; type and spacing shrink via `clamp()`. No hard breakpoint needed here.
- **≤ 640px:** the **only** hard rule fires — `.nav-links { display:none !important }` — leaving logo + "Get in touch" on one top row. Everything else remains fluid single-column.

---

## 12. Known design decisions / gotchas

- **`2px` radius, not 0 and not large.** The near-square corners on images/cards are intentional and part of the editorial feel. Don't round them heavily.
- **Hero photo starts at `top: 300px`.** The nav and top of the headline sit on white, not on the photo. Preserve this offset (or the equivalent) so text contrast stays high.
- **The scrim gradient is essential** for legibility over the photo — keep the white veil.
- **Marquee requires duplicated content** for the `-50%` seamless loop; halving or removing the copy breaks the loop.
- **`.nav-links` hide uses `!important`** specifically to override the element's **inline** `display:flex` — a stylesheet rule without `!important` would lose to inline styles. If you convert inline styles to classes, you can drop the `!important`.
- **A visitor-counter component was intentionally removed** from this design (it depended on an unreliable third-party counter and is not part of the visual language). Do not reintroduce it.
- **No dark mode.** The design is committed to light (white bg / black text). If the host app is dark-themed, either wrap this design in a forced-light container or fully re-map the tokens (bg↔fg) — but note the hairline grays and the white scrim gradient were all chosen for a light background and would need rework.

---

## 13. Porting checklist & isolation guidance

Follow this to drop the design into another app **without disturbing the host's infrastructure or global styles.**

1. **Wrap everything in one scoped root**, e.g. `<div class="hf-portfolio"> … </div>`, and set the base there instead of on `body`:
   ```css
   .hf-portfolio { background:#FFFFFF; color:#000000; font-family:'Inter',system-ui,sans-serif; -webkit-font-smoothing:antialiased; overflow-x:hidden; }
   ```
2. **Do NOT copy `* { margin:0; padding:0; box-sizing:border-box }` globally** into an app that has its own reset. Instead scope it:
   ```css
   .hf-portfolio *, .hf-portfolio *::before, .hf-portfolio *::after { box-sizing:border-box; margin:0; padding:0; }
   ```
   (Or, if the host already normalizes box-sizing, only zero margins/padding on the elements you add.)
3. **Namespace the utility classes** (`nav-link`, `btn`, `chip`, `nav-links`, `visitor-*` is gone) under `.hf-portfolio` so they can't collide with host classes:
   ```css
   .hf-portfolio .btn:hover { transform:scale(1.03); opacity:1; }
   .hf-portfolio .nav-link:hover { color:#000; opacity:1; }
   .hf-portfolio .chip:hover { background:#000; color:#fff; opacity:1; }
   @media (max-width:640px){ .hf-portfolio .nav-links{ display:none !important; } }
   ```
4. **Scope the link reset** — the global `a { color:inherit; text-decoration:none }` and `a:hover{opacity:.7}` will affect the host's links if applied globally. Scope to `.hf-portfolio a`.
5. **Keep the keyframes** (`fadeRise`, `marquee`) — keyframe names are global; rename them (e.g. `hf-fadeRise`) if the host might have a name clash.
6. **Preserve the reduced-motion and focus-visible rules** (scope `:focus-visible` to `.hf-portfolio :focus-visible` if you don't want to touch host focus styles).
7. **Provide the two fonts** (Instrument Serif 400/400-italic, Inter 300/400/500/600) via the `<head>` links in §3.2, or self-host.
8. **Set `scroll-margin-top: 2rem`** on the anchored sections you include (scoped) so in-page nav lands correctly; ensure your anchor IDs (`#top`, `#about`, `#work`, `#outside`, `#contact`) don't collide with host IDs — rename if needed.
9. **Supply your own assets** for the slots in §10; the design is asset-agnostic.
10. **No JS is required** for the design itself (the marquee and entrance are pure CSS). If your host is not React, ignore the original `App`/`main` wiring entirely — just render the markup.

If you complete steps 1–8, the design is fully self-contained inside `.hf-portfolio` and **cannot leak into or be broken by** the surrounding application.
