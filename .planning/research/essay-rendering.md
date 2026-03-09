# Essay Rendering in Phaser 3 — Research

**Date:** 2026-03-09
**Context:** Starbucks Café interior in Andres World. Books on café tables open readable essays (~500–2000 words) when the player presses A/Space. Desktop-first, mobile degrades gracefully. Stack: Phaser 3 + Grid Engine + Vite + TypeScript.

---

## The Three Options

### Option A — Phaser Text / BitmapText (pure canvas, no HTML)

Render essay content entirely inside the Phaser canvas using `scene.add.text()` (canvas-rendered) or `scene.add.bitmapText()` (GPU-rendered from a pre-baked font atlas), combined with a rexRainbow UI plugin component (ScrollablePanel or TextArea) to handle scrolling.

**Relevant APIs:**
- `scene.add.text()` — built-in, supports word wrap via `style.wordWrap`, but re-rasterizes on every content change (slow for large text).
- `scene.add.bitmapText()` — GPU-accelerated; fast to render; word wrap supported since Phaser 3.21 via `setMaxWidth()`, but wrap logic has had edge-case bugs (tracked issue #6860).
- **rexRainbow ScrollablePanel / TextArea** — a plugin that wraps a Phaser text object in a container with a scroll bar and touch/mouse drag-to-scroll. This is the standard community solution for scrollable content within the canvas. Requires loading `rexuiplugin` as a scene plugin.

---

### Option B — HTML Overlay via `scene.add.dom()` (DOM element over canvas)

Phaser 3.17+ ships `Phaser.GameObjects.DOMElement`. When `dom: { createContainer: true }` is set in the game config, Phaser creates a `div` positioned exactly over the canvas with `pointer-events` managed to forward input. You create a standard HTML element (a `<div>` or `<article>`) at game-world coordinates, style it with CSS, and Phaser keeps it aligned with the camera/scene.

**Key properties:**
- The DOM container sits above the canvas in the stacking order. You cannot place canvas sprites above a DOM element — it is always topmost.
- The element behaves as native HTML: browser renders text at full crispness, CSS handles bold/links/paragraphs, and native `overflow-y: scroll` works on both desktop and mobile touch.
- Input events on the DOM element do not propagate into Phaser (and vice versa) without explicit `addListener()` calls.
- Camera movement in Phaser moves the DOM element's anchor point, but for a full-screen modal you would detach it from world coordinates and fix it to the viewport with CSS `position: fixed`.

---

### Option C — Exit the canvas → navigate to a separate HTML/MDX page

The game triggers a route change (e.g., `window.location.href = '/essays/my-essay'` or React Router `navigate()`). The essay renders as a fully normal webpage — MDX, rich HTML, full browser scrolling, SEO-friendly. The player presses "Back" or clicks a pixel-art button to return to the game. Phaser is either destroyed and re-initialized, or kept alive in a hidden container while the essay page mounts over it.

---

## Comparison Table

| Criterion | A: Phaser Text / BitmapText | B: HTML Overlay (add.dom) | C: Separate HTML/MDX page |
|---|---|---|---|
| **Implementation difficulty** | Medium-High — requires rexRainbow ScrollablePanel or custom scroll container; BitmapText font must be pre-baked; word-wrap has known edge cases | Low-Medium — enable `dom.createContainer`, inject a `<div>` with CSS; HTML/CSS knowledge sufficient; well-documented | Low — standard routing (React Router / Vite MPA); MDX out-of-box; no Phaser-specific work |
| **Mobile touch scroll** | Poor — rexRainbow scroller handles touch events but requires manual tuning; not native browser scroll; can feel sluggish or interfere with Grid Engine touch input | Good — native `overflow-y: scroll` + `-webkit-overflow-scrolling: touch`; works exactly like any mobile webpage | Excellent — full browser scroll context; zero friction |
| **Formatted text (bold, links, paragraphs)** | None natively — Phaser Text supports basic bold/italic via inline style tags (`[b]text[/b]`) but no clickable links, no real paragraph flow; BitmapText is even more limited (fixed font atlas only) | Full — any HTML/CSS/Markdown-rendered-to-HTML; `<a>` tags, `<strong>`, `<blockquote>`, code blocks all work natively | Full — MDX renders as standard HTML; full Markdown feature set |
| **Immersion (does it break "game IS the site"?)** | Preserved — content lives inside the canvas; feels like reading a sign in Pokemon | Partial break — visually the DOM div sits above the game, but with a pixel-art styled `<div>` (dark border, retro font via Google Fonts or CSS) it reads as a game UI panel rather than "leaving" the game | Clear break — URL changes, browser history changes, canvas disappears; feels like a normal website; requires deliberate transition design to soften |
| **Rendering quality** | Low — canvas text is blurry on non-1x DPI screens unless you scale the entire renderer; BitmapText is sharp but fixed to one font | High — browser renders text at native DPI; crisp on all screens including Retina/OLED | High — standard browser rendering |
| **SEO** | None — content is trapped inside canvas | None for canvas; HTML overlay text IS in the DOM but dynamically injected (Googlebot may or may not index) | Full — static MDX/HTML page is fully crawlable |
| **Maintenance / content updates** | Hard — text lives in game code or JSON; no Markdown support | Medium — HTML string or template literal in a JSON/TS file; can be injected from MDX compiled to HTML string at build time | Easy — edit `.mdx` file, rebuild; Vite + MDX pipeline standard |

---

## Recommended Approach: Option B (HTML Overlay) with pixel-art styling

**Option B is the best fit for this project.** Here is the reasoning:

1. **Essays need real formatting.** At 500–2000 words, essays will have paragraphs, emphasis, possibly links to sources. Option A cannot render clickable hyperlinks and has fragile word-wrap. Option B gets full HTML rendering for free.

2. **Mobile scroll is non-negotiable.** The project targets desktop-first but must degrade gracefully. Native browser scroll (Option B) works on mobile with zero extra work. The rexRainbow scroller (Option A) is a manual approximation that fights with Grid Engine's touch input.

3. **Immersion is preserved with the right styling.** The DOM overlay will look like a game UI panel, not a webpage, if it is styled as one: pixel-art border (CSS `image-rendering: pixelated`, a 9-slice border image or a thick retro-styled `border`), a monospace or pixel font (Press Start 2P or similar from Google Fonts), dark background, and a close button that looks like a Pokemon dialog dismiss. The URL does not change, the game canvas remains visible behind a semi-transparent backdrop — it reads as "you opened a book in the game," not "you left the game."

4. **MDX-to-HTML at build time bridges Option B and Option C cleanly.** Vite can compile `.mdx` files to HTML strings at build time (using `@mdx-js/rollup`). Those HTML strings are imported into the Phaser scene and injected into the DOM overlay's `innerHTML`. This means content is edited in Markdown, rendered natively in the browser, and displayed inside the game — no URL change, no Phaser restart.

5. **Option C is reserved for deep-content pages** (e.g., a full essay archive or an essay that needs SEO). If Andres decides a specific essay warrants its own URL for sharing, Option C can coexist: the game overlay links out to `/essays/slug` for the canonical version, while the in-game book still renders via Option B.

---

## Implementation Plan

When Phase 6 (Starbucks Café) is built, implement essay rendering as follows: configure the Phaser game with `dom: { createContainer: true }` and a wrapping `<div id="game-container">` parent; compile each essay from MDX to an HTML string at Vite build time using `@mdx-js/rollup`; store the compiled strings in a typed `essays` map keyed by slug; when the player presses A on a book, pause Grid Engine movement, call `scene.add.dom()` to mount a fixed-viewport `<div class="essay-modal">` containing the essay HTML, a scroll container (`overflow-y: auto`), and a pixel-art-styled close button; style the modal with CSS to match the game aesthetic (9-slice retro border, semi-transparent dark backdrop, Press Start 2P or a clean monospace font for body text); on close, destroy the DOM element and resume movement. The entire essay system requires no new page routes, no Phaser scene changes, and updates are made by editing `.mdx` files.

---

## Sources

- [Dom Element — Phaser Help (official docs)](https://docs.phaser.io/phaser/concepts/gameobjects/dom-element)
- [DOMElement API — Phaser Help](https://docs.phaser.io/api-documentation/class/gameobjects-domelement)
- [DOM element — Notes of Phaser 3 (rexRainbow)](https://rexrainbow.github.io/phaser3-rex-notes/docs/site/domelement/)
- [Scroll-able panel — Notes of Phaser 3 (rexRainbow)](https://rexrainbow.github.io/phaser3-rex-notes/docs/site/ui-scrollablepanel/)
- [Text Area — Notes of Phaser 3 (rexRainbow)](https://rexrainbow.github.io/phaser3-rex-notes/docs/site/ui-textarea/)
- [BitmapText word wrap bug #6860 — phaserjs/phaser GitHub](https://github.com/phaserjs/phaser/issues/6860)
- [BitmapText — Phaser Help (official docs)](https://docs.phaser.io/api-documentation/class/gameobjects-bitmaptext)
- [How to integrate Phaser 3 with any JavaScript Framework — Medium](https://franzeus.medium.com/how-to-integrate-your-phaser-3-game-with-any-javascript-framework-879c1354e766)
- [Phaser 3.17.0 Released (DOM Elements introduced) — phaser.io](https://phaser.io/news/2019/05/phaser-3170-released)
- [How to position UI elements over the canvas — Phaser Discourse](https://phaser.discourse.group/t/how-to-position-ui-elements-over-the-canvas/9661)
- [Show HN: Pokemon-style personal website in Phaser 3 — Hacker News](https://news.ycombinator.com/item?id=30656961)
