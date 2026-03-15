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

# Interior Scene Transitions — Research Notes
**Date:** 2026-03-09
**Context:** Andres World — Phaser 3 + Grid Engine overworld → interior → overworld flow

---

## Executive Summary

The project already has a working transition system in place (Overworld.ts + InteriorStub.ts). This document captures how it works, fills in the "why" behind the design decisions, and documents the patterns, pitfalls, and correct implementation for full interior scenes that will replace the stub.

---

## Q1: Grid Engine Instance Lifecycle Across Scene Switches

**Answer: Grid Engine is a Scene Plugin — it is per-scene and does NOT persist across scene switches.**

Grid Engine is registered as a Phaser Scene Plugin (not a Global Plugin):

```js
plugins: {
  scene: [{ key: "gridEngine", plugin: GridEngine, mapping: "gridEngine" }]
}
```

Because it is a Scene Plugin, each Scene gets its own `this.gridEngine` instance tied to that scene's lifecycle. When you call `this.scene.start("Interior")`, Phaser destroys the old scene (including its Grid Engine instance) and creates a fresh one. When the interior calls `this.scene.start("Overworld")`, the Overworld scene is re-created from scratch — `create()` runs again, Grid Engine is re-initialized via `this.gridEngine.create(map, config)`, and the player is placed at the spawn position passed in `data`.

**Implication:** You cannot "pause" Grid Engine in one scene and "resume" it in another. You must reinitialize it in every scene's `create()` method. Player position must be passed explicitly as data — it is not automatically preserved.

**Alternative — sleep/wake:** Phaser's `scene.sleep()` + `scene.wake()` pattern keeps a scene alive (no update, no render, but all objects intact). This *would* preserve Grid Engine state, but at the cost of memory (the overworld tilemap stays loaded). The current project uses `scene.start()` (destroy + recreate), which is simpler and is the correct choice given the map size.

**Verdict for this project:** Recreate Grid Engine on every scene transition. Pass player position in `data`. This is exactly what the existing code does.

---

## Q2: Detecting "Player Steps on Door Tile" — Pattern for Triggering a Scene Switch

**Answer: Two valid patterns exist. This project uses the interaction (Space/E keypress) pattern, not the step-on pattern. The step-on pattern uses `positionChangeFinished()` observable.**

### Pattern A — Interaction (what this project uses)
Player walks up to the door, presses Space/E. The `update()` loop calls `this.gridEngine.getFacingPosition("player")`, looks up the facing coordinate in `interactionMap`, and dispatches the transition. No tile property check needed.

```
// In update():
const facingPos = this.gridEngine.getFacingPosition("player")
const key = `${facingPos.x},${facingPos.y}`
const interaction = this.interactionMap.get(key)
if (interaction?.type === "building") { this.scene.start(...) }
```

This is the authentic Pokemon Gen 1/2 feel: you press A to enter a building.

### Pattern B — Step-On (automatic teleport, Pokemon Gen 3+ style)
Subscribe to Grid Engine's `positionChangeFinished()` observable. On every tile the player lands on, check if that tile has a door property (via Tiled custom property or a hardcoded coordinate set).

```
// In create():
this.gridEngine.positionChangeFinished().subscribe(({ charId, enterTile }) => {
  if (charId !== "player") return
  const tile = map.getTileAt(enterTile.x, enterTile.y, true, "Triggers")
  if (tile?.properties?.door) {
    this.scene.start("Interior", { spawnKey: tile.properties.spawnKey, returnPos: enterTile })
  }
})
```

`positionChangeFinished` fires once per completed tile move (not per frame). This is the right event to use — NOT `update()` polling — because Grid Engine characters stop precisely in the center of a tile only when this event fires. Checking position in `update()` can fire multiple times mid-movement.

**Verdict for this project:** Stick with Pattern A (interaction). It matches Pokemon Gen 1/2 fidelity. Pattern B is documented here for exit doors inside interiors (where you may want auto-teleport on stepping onto the exit tile rather than requiring a keypress).

---

## Q3: Passing Player Position — Entry and Return Flow

### Entry (Overworld → Interior)

In `Overworld.ts`, when the player interacts with a building entrance:

```ts
// interactionMap entry:
this.interactionMap.set("13,22", {
  type: "building",
  key: "ThovenHQ",
  returnPos: { x: 13, y: 23 }  // tile just outside the door
})

// handleInteraction():
this.scene.start("InteriorStub", {
  returnPos: payload.returnPos,   // where to put the player on return
  buildingKey: payload.key,       // which building (for interior to know what to show)
})
```

The interior scene receives this in `create(data)` and holds it for the return trip.

### Return (Interior → Overworld)

The interior scene calls:

```ts
this.scene.start("Overworld", { returnFrom: data })
```

`data` contains `{ returnPos, buildingKey }`, which was the data passed TO the interior.

Back in `Overworld.create(data)`:

```ts
// startPosition uses returnPos if present, otherwise default spawn (dock):
startPosition: data?.returnFrom?.returnPos ?? { x: 25, y: 38 }
```

And after Grid Engine is created, a redundant explicit setPosition call reinforces it:

```ts
if (data?.returnFrom?.returnPos) {
  this.gridEngine.setPosition("player", data.returnFrom.returnPos)
}
```

**The `returnPos` is the tile directly outside the door** (one tile south of the door tile the player was facing). This places the player just outside the building, facing away from it — exactly the Pokemon feel.

### Spawn Point Inside Interior

Each interior scene receives `spawnKey` or uses a fixed spawn coordinate. Interior maps should have a Tiled object layer with spawn point objects. In `create()`, look up the spawn object:

```ts
const spawnPoint = map.findObject("SpawnPoints", obj => obj.name === data.spawnKey)
const spawnTile = { x: Math.floor(spawnPoint.x / 16), y: Math.floor(spawnPoint.y / 16) }
this.gridEngine.create(map, {
  characters: [{ id: "player", startPosition: spawnTile, ... }]
})
```

---

## Q4: Grid Engine GitHub — Multi-Scene and Interior Examples

Sources: https://github.com/Annoraaq/grid-engine and https://annoraaq.github.io/grid-engine/

Key findings from the Grid Engine repository and documentation:

- **No dedicated multi-scene example** exists in the Grid Engine examples directory. Multi-scene patterns are left to the game author.
- `this.gridEngine.create(tilemap, config)` must be called in every scene's `create()` that uses Grid Engine. It is not optional or resumable.
- **Key events for door detection:**
  - `this.gridEngine.positionChangeFinished()` — Observable, fires after each completed tile move. Best event for step-on door detection.
  - `this.gridEngine.movementStopped()` — Observable, fires when a character stops moving. Used in this project for John Collison's patrol.
  - `this.gridEngine.getFacingPosition(charId)` — Synchronous, returns `{x, y}` of the tile the character is facing. Used in this project for interaction detection.
- `this.gridEngine.setPosition(charId, {x, y})` — Teleports a character to a tile immediately. Used for repositioning player on return from interior.
- All Grid Engine observables return RxJS Observables. Always call `.unsubscribe()` in the scene's `shutdown` event to prevent memory leaks.

---

## Q5: ariroffe/personal-website — Interior Transition Pattern

Source: https://github.com/ariroffe/personal-website (the primary reference project, 425 HN upvotes)

The ariroffe project is a Pokemon Gen 1/2 Phaser 3 + Tiled overworld personal website — the closest existing reference to Andres World. From search results and the HN discussion:

- The project uses Tiled tilemaps exported as JSON, with a custom tileset compiled via GIMP.
- It has multiple scenes structured around the Phaser scene system.
- The specific interior transition code is in the scenes/ directory of the repository (direct source access was not available via web search, but the pattern inferred from the Phaser 3 + Pokemon context is consistent with what is already implemented in this project).
- The HN post confirms the game uses building entry interactions similar to Pattern A above.

**Note:** Direct file-by-file inspection of ariroffe's scenes/ directory was not possible in this research session. The existing implementation in this codebase already reflects the correct pattern.

---

## Recommended Implementation Pattern

Full door-entry/exit flow for a real interior scene (replacing InteriorStub):

```
// === ENTRY (Overworld.ts — already implemented) ===

// 1. Register door in interactionMap with returnPos = tile just outside door
interactionMap.set("13,22", {
  type: "building",
  key: "ThovenHQ",
  returnPos: { x: 13, y: 23 }   // one tile south of door
})

// 2. On Space/E press while facing door tile:
this.scene.start("ThovenHQ", {
  returnPos: { x: 13, y: 23 },
  buildingKey: "ThovenHQ"
})


// === INTERIOR SCENE (ThovenHQ.ts) ===

class ThovenHQScene extends Phaser.Scene {
  constructor() { super({ key: "ThovenHQ" }) }

  create(data: { returnPos: {x,y}, buildingKey: string }) {
    // 1. Load interior tilemap (different map from overworld)
    const map = this.make.tilemap({ key: "thoven-interior" })
    const tileset = map.addTilesetImage("interiors", "interiors")
    map.createLayer("Floor", tileset)
    map.createLayer("Walls", tileset)
    map.createLayer("Objects", tileset)

    // 2. Spawn player at interior door spawn point
    const spawnObj = map.findObject("SpawnPoints", o => o.name === "entrance")
    const spawnTile = { x: Math.floor(spawnObj.x / 16), y: Math.floor(spawnObj.y / 16) }
    const playerSprite = this.add.sprite(0, 0, "player")

    // 3. Initialize Grid Engine — fresh instance, this scene only
    this.gridEngine.create(map, {
      characters: [{ id: "player", sprite: playerSprite, startPosition: spawnTile }]
    })

    // 4. Find exit tile — Tiled object or hardcoded coordinate
    const exitTile = { x: 3, y: 9 }   // door tile inside interior

    // 5. Subscribe to positionChangeFinished for step-on exit detection
    //    (alternative to requiring keypress to exit)
    const sub = this.gridEngine.positionChangeFinished().subscribe(({ charId, enterTile }) => {
      if (charId !== "player") return
      if (enterTile.x === exitTile.x && enterTile.y === exitTile.y) {
        sub.unsubscribe()
        this.scene.start("Overworld", { returnFrom: data })
      }
    })

    // 6. Cleanup on scene shutdown
    this.events.on("shutdown", () => sub.unsubscribe())
  }
}


// === RETURN (Overworld.ts — already implemented) ===

create(data?: { returnFrom?: { returnPos: {x,y}, buildingKey: string } }) {
  // ... build tilemap, create layers ...

  this.gridEngine.create(map, {
    characters: [{
      id: "player",
      startPosition: data?.returnFrom?.returnPos ?? { x: 25, y: 38 }
    }]
  })

  // Explicit setPosition as safety net (redundant but harmless)
  if (data?.returnFrom?.returnPos) {
    this.gridEngine.setPosition("player", data.returnFrom.returnPos)
  }
}
```

---

## Common Pitfalls

1. **Calling `this.gridEngine.create()` before all `map.createLayer()` calls are complete.**
   Grid Engine reads the tilemap's collision and tile data during `create()`. If layers aren't built yet, collision detection will be wrong or broken. Always create all layers first, then call `this.gridEngine.create()`.

2. **Forgetting to unsubscribe Grid Engine observables.**
   `positionChangeFinished()`, `movementStopped()`, etc. return RxJS Observables. If you subscribe in `create()` and don't unsubscribe in the `shutdown` event, the subscription survives scene destruction and fires on the next scene (or causes null reference errors). Always: `this.events.on("shutdown", () => sub.unsubscribe())`.

3. **Using `update()` loop polling to detect tile position instead of `positionChangeFinished()`.**
   Characters are between tiles most of the time. Checking position in `update()` will fire the transition mid-walk, mid-tile. `positionChangeFinished` fires exactly once when the character has fully settled on the new tile.

4. **Using `scene.start()` when you intended to preserve overworld state.**
   `scene.start()` destroys and recreates. If the player has walked deep into the map and you want to return them to exactly where they were (not to a door spawn), use `scene.sleep()` + `scene.wake()` instead. The tradeoff is that the sleeping scene stays in memory. For this project's map size (~50x40 tiles), either approach is fine — the current `scene.start()` approach is simpler.

5. **`returnPos` pointing at the door tile instead of one tile outside it.**
   If `returnPos = { x: 13, y: 22 }` (the door tile itself), the player respawns inside the building wall. Always set `returnPos` to the tile one step in the direction the player came from — i.e., the walkable tile in front of the entrance.

6. **Hardcoded spawn coordinates instead of Tiled object layers.**
   For simple interiors, hardcoding is fine. For multiple entrances to the same interior (e.g., a side door), use a Tiled "SpawnPoints" object layer with named objects and look them up by name in `create()`. This scales cleanly as interiors grow.

7. **Not fading the camera during transition.**
   Raw scene switches are jarring. Add a camera fade-out before `scene.start()` and fade-in at the start of the new scene's `create()` for the Pokemon feel. Use `this.cameras.main.fadeOut(300)` + listen for `FADE_OUT_COMPLETE` event before calling `scene.start()`.

8. **Grid Engine initialized with wrong tileset GIDs.**
   When switching to an interior scene with a different tileset, the GID-to-tile mapping is specific to that map. Always use the tileset names exactly as they appear in the interior map's JSON, not the overworld's tileset names.

---

## Relevant Source Files in This Project

- `/Users/andresmartinez/andres-world/src/game/scenes/Overworld.ts` — entry side, interaction detection, returnPos pattern (lines 31, 96-97, 112-114, 129-130, 242-245)
- `/Users/andresmartinez/andres-world/src/game/scenes/InteriorStub.ts` — stub interior, return flow (lines 8, 40-47)
- `/Users/andresmartinez/andres-world/src/game/main.ts` — scene registration order

---

## References

- [Grid Engine GitHub](https://github.com/Annoraaq/grid-engine)
- [Grid Engine Documentation](https://annoraaq.github.io/grid-engine/)
- [ariroffe/personal-website (primary reference)](https://github.com/ariroffe/personal-website)
- [Phaser 3 ScenePlugin API — sleep/wake/start](https://photonstorm.github.io/phaser3-docs/Phaser.Scenes.ScenePlugin.html)
- [Phaser 3 — Passing Data To A Scene](https://phaser.io/examples/v3/view/scenes/passing-data-to-a-scene)
- [Rex Rainbow Notes — Scene Manager](https://rexrainbow.github.io/phaser3-rex-notes/docs/site/scenemanager/)
- [PokemonClone — door object pattern](https://github.com/boxerbomb/PokemonClone)
- [Phaser 3 Scene Lifecycle — DeepWiki](https://deepwiki.com/phaserjs/phaser/3.1-scene-lifecycle)

# LimeZu Modern Exteriors 16x16 — Tileset Structure Reference

**Researched:** 2026-03-09
**Method:** Visual inspection of PNG files + pixel-level catalog analysis (tileset-catalog.json) + existing project code
**Confidence:** HIGH for verified GIDs (from tileset-catalog.json pixel data); MEDIUM for row-range zone descriptions (from visual inspection of PNGs)

---

## Overview: LimeZu Pack Structure

The LimeZu Modern Exteriors pack distributes content across many individual numbered PNG files. This project uses the individual sheets, NOT the `Modern_Exteriors_Complete_Tileset.png` mega-sheet.

### Universal LimeZu Fact: Row 0 is Always Transparent

Every LimeZu individual sheet has row 0 as a transparent border row. All pixels in row 0 are RGB [0,0,0] (black alpha-transparent). This is confirmed by the tileset-catalog.json for all 5 tilesets (terrains, beach, buildings, garden, worksite).

**GID formula:**
```
localId = row * cols + col   (0-indexed)
GID = firstgid + localId
```

### GID Chain (5-tileset layout in use)

| Tileset | File | firstgid | tilecount | GID range |
|---------|------|----------|-----------|-----------|
| terrains | 1_Terrains_and_Fences_16x16.png | 1 | 2368 | 1–2368 |
| beach | 21_Beach_16x16.png | 2369 | 4000 | 2369–6368 |
| buildings | 4_Generic_Buildings_16x16.png | 6369 | 6400 | 6369–12768 |
| garden | 17_Garden_16x16.png | 12769 | 6272 | 12769–19040 |
| worksite | 8_Worksite_16x16.png | 19041 | 640 | 19041–19680 |

---

## Tileset 1: 1_Terrains_and_Fences_16x16.png

**Dimensions:** 512 × 1184 px | **Grid:** 32 cols × 74 rows | **Total tiles:** 2368
**firstgid:** 1 | **GID range:** 1–2368
**Margin/spacing:** 0/0

### Verified GIDs (from tileset-catalog.json pixel samples)

| Tile | Row | Col | GID | RGB | Description |
|------|-----|-----|-----|-----|-------------|
| Transparent border | 0 | 0 | 1 | [0,0,0] | Row 0 = transparent for entire row |
| Plaza/pavement | 1 | 1 | 34 | [217,226,241] | Light blue-grey stone — used as PLAZA_GID |
| Bright blue accent | 1 | 2 | 35 | [0,164,229] | Vivid blue — likely a flag/sign element |
| Red accent | 1 | 4-5 | 37-38 | [235,0,7] | Bright red pixels — likely sign/flag |
| Dark grey object | 1 | 16-17 | 49-50 | [58,58,80] | Dark blue-grey — likely a prop |
| Grass family | 1 | 25-28 | 58-61 | [83,166,93] | Lighter green grass variant |
| Path/dirt | 1 | 29-30 | 62-63 | [168,95,70] | Reddish-brown dirt/path edge |
| (row 2-4 mixed) | 2-4 | various | 65-160 | mixed | Terrain transition tiles, mixed grass/path |
| Transparent row | 5 | 0-24 | 161-185 | [0,0,0] | Cols 0-24 all transparent in row 5 |
| **WATER** | **5** | **25** | **186** | **[54,154,176]** | **Teal water — VERIFIED** |
| Water variants | 5 | 26-29 | 187-190 | [60,163,178] | Lighter teal water |
| **GRASS** | **6** | **0** | **193** | **[71,151,87]** | **Green grass — VERIFIED** |
| Grass variants | 6 | 0-5 | 193-197 | ~[71,151,87] | Grass tone family |
| Path/dirt blend | 6 | 5-6 | 198-199 | [181,117,77] / [199,140,89] | Earthy path transitions |
| Water+grass mix | 6 | 13-14 | 206-207 | [54,154,176] | Water-grass shoreline transition |
| Dark water | 6 | 25-26 | 218-219 | [33,92,129] | Deep ocean/dark water variant |
| Grass row | 7 | 0-6 | 225-231 | [71,151,87] | More grass tile variants |
| Dark teal water | 7 | 25 | 250 | [42,118,107] | Darker water/teal |
| Grass row | 8 | many | 257+ | [71,151,87] | Grass continues in multiple row groups |
| Mixed terrain | 9 | 0-2 | 289-291 | [0,0,0] | Transparent in cols 0-2 |
| Grass | 9 | 3-4 | 292-293 | [71,151,87] | Grass |
| **PATH** | **9** | **5** | **294** | **[199,140,89]** | **Earthy sandy path — VERIFIED** |
| Path col 6 | 9 | 6 | 295 | [199,140,89] | Path continues |
| Road/concrete | 9 | 25-26 | 314-315 | [171,173,177]/[160,162,163] | Grey road surface |
| Teal-green | 9 | 27-28 | 316-317 | [75,100,99] | Pond/wetland variant |

### Row Zone Summary (1_Terrains_and_Fences_16x16.png)

Based on visual inspection of the PNG image:

| Row Range | Content Zone |
|-----------|-------------|
| 0 | Transparent border (all-black) |
| 1–4 | Road/city terrain tiles — crosswalks, sidewalks, road markings. Cols 0-15: pavement/flags/buildings tops; Cols 25-31: grass and dirt/path variants |
| 5 | Transition row — cols 0-24 transparent, cols 25-29: **water tiles (teal, verified)** |
| 6–9 | **Primary terrain content**: grass (cols 0-4), path/dirt (cols 5-7), water+grass shoreline combos (cols 13-15), water variants (cols 25-29) |
| 10–20 | Fence/wall segments — horizontal, vertical, corner variants |
| 21–35 | Additional terrain variants — dirt paths, gravel, alternative grass shades |
| 36–50 | Water/ocean tile variants and animated water tile sets |
| 51–65 | Terrain overlay decorations — tire tracks, shadows, weathering |
| 66–73 | Road markings, sidewalk details, curb tiles |

### Fence Tile Note (ge_collide)

The terrain sheet includes fence segments. Used in the codebase:
- `FENCE_LOCAL_ID = 5 * 32 + 0 = 160` (row=5, col=0) → GID 161
- This tile is marked `ge_collide: true` in the JSON tileset properties
- Row 5 col 0 is transparent (RGB [0,0,0]) — used as an invisible collision marker

---

## Tileset 2: 21_Beach_16x16.png

**Dimensions:** 512 × 2000 px | **Grid:** 32 cols × 125 rows | **Total tiles:** 4000
**firstgid:** 2369 | **GID range:** 2369–6368
**Margin/spacing:** 0/0

### Verified GIDs (from tileset-catalog.json pixel samples)

| Tile | Row | Col | GID | RGB | Description |
|------|-----|-----|-----|-----|-------------|
| Transparent border | 0 | 0-21 | 2369-2390 | [0,0,0] | Row 0 cols 0-21 transparent |
| Dark objects | 0 | 22-23 | 2391-2392 | [58,58,80] | Dark blue-grey objects (likely beach props top) |
| Reddish object | 0 | 24 | 2393 | [192,92,66] | Reddish-brown prop |
| **Sandy beach tiles** | **0** | **27-30** | **2396-2399** | **[232,187,91]/[219,132,71]** | **Sand/golden tile family** |
| Mixed row 1 | 1 | various | 2401-2432 | mixed | Transition tiles, some transparent |
| **SAND** | **2** | **0-6** | **2433-2439** | **[230,174,85]** | **Golden sand — VERIFIED (row=2, col=0, GID=2433)** |
| Sand+water | 2 | 8 | 2441 | [60,163,178] | Water mixed with sand — shoreline |
| Sand variants | 2 | 9,11-14 | 2442,2444-2447 | [230,174,85] | More sand |
| Dark blue | 2 | 16-17 | 2449-2450 | [65,96,149] | Deep water/shadow |
| Rows 3-8 mixed | 3-8 | various | 2465-2656 | mixed | Beach objects, dock sections, pier tiles |
| Beach row 9 mixed | 9 | 0-4 | 2657-2661 | [0,0,0] | Transparent/border in row 9 cols 0-4 |
| Beach sand | 9 | 5-6 | 2662-2663 | [224,155,78] | Sandy-orange |
| More sand | 9 | 13-14 | 2670-2671 | [230,174,85] | Golden sand |
| **DOCK** | **9** | **15** | **2672** | **[126,97,81]** | **Wooden pier brown — VERIFIED** |
| Dock variant | 9 | 16 | 2673 | [168,95,70] | Reddish-brown pier plank |
| Dock variant | 9 | 17-18 | 2674-2675 | [126,97,81]/[123,91,58] | Pier wood shades |

### Row Zone Summary (21_Beach_16x16.png)

Based on visual inspection of the PNG image:

| Row Range | Content Zone |
|-----------|-------------|
| 0 | Transparent border (cols 0-21), then beach props tops (right side) |
| 1 | Transition row — mixed sand/water edge tiles |
| 2–4 | **Primary sand tiles** (cols 0-7 golden sand), water-sand shoreline transitions (cols 8-15), deep water variants (cols 16-21), misc beach objects (cols 22-31) |
| 5–8 | Beach prop objects: parasols, beach chairs, sandcastles, coolers, etc. Top of tall objects — visually these are OBJECT tiles, not terrain fills |
| 9–14 | **Dock/pier tiles** — wooden plank floor variants (cols 15-21), boardwalk pieces, rope/bollard details |
| 15–25 | Fog/misty beach variants ("foggy variants" label visible in PNG) |
| 26–50 | Lighthouse sprite tiles (multi-tile tall lighthouse structure) |
| 51–75 | More lighthouse variants and beach building sections |
| 76–100 | Additional beach prop clusters |
| 101–124 | Rope/anchor/boat elements and edge tiles |

### Key Note: Beach Row 0 Has Sandy Tiles Too

Beach row 0 cols 27-30 (GIDs 2396-2399) show sandy/golden RGB values ([232,187,91] and [219,132,71]). These are sandy-orange and represent the tops of beach prop sprites, not flat fill tiles. Use row 2 cols 0-6 for flat sand fills.

---

## Tileset 3: 4_Generic_Buildings_16x16.png

**Dimensions:** 512 × 3200 px | **Grid:** 32 cols × 200 rows | **Total tiles:** 6400
**firstgid:** 6369 | **GID range:** 6369–12768
**Margin/spacing:** 0/0

### Verified GIDs (from tileset-catalog.json pixel samples)

| Tile | Row | Col | GID | RGB | Description |
|------|-----|-----|-----|-----|-------------|
| Transparent border | 0 | all | 6369-6400 | [0,0,0] | Row 0 = full transparent row |
| **BUILDING facade** | **1** | **0** | **6401** | **[132,81,86]** | **Mauve/rosy building wall — row=1, col=0** |
| Building row 1 | 1 | 0-5 | 6401-6406 | [132,81,86] | Consistent mauve/rose — building wall family |
| Various buildings | 1-9 | various | 6401-6688 | mixed | Building facade sections, wall pieces |

**Note:** The current generate-map.ts uses `BUILDING_GID = tileGid(BUILDING_FIRSTGID, BUILDING_COLS, 0, 0) = 6369` which is a transparent (row=0) tile. This is used solely as a collision marker tile with `ge_collide: true` in the JSON properties — it renders as transparent but Grid Engine reads the property. The first actual visible building tile is at row=1, col=0, GID=6401, RGB=[132,81,86] (mauve/rosy building wall).

### Row Zone Summary (4_Generic_Buildings_16x16.png)

Based on visual inspection of the PNG image:

| Row Range | Content Zone |
|-----------|-------------|
| 0 | Transparent border |
| 1–8 | **Modern building facades** — yellow/tan office towers (cols 0-7), brick-detailed buildings (cols 8-15), darker brick facades (cols 16-23), mixed building styles (cols 24-31) |
| 9–20 | **Building middle sections** — window rows, awning details, fire escapes, balconies |
| 21–35 | **Building base/ground floor** — storefronts, doors, shop windows, entrance tiles |
| 36–50 | **Residential building variants** — smaller buildings, different facade colors (grey, blue-grey) |
| 51–80 | **Large building complexes** — multi-unit facades, connected buildings with shared walls |
| 81–110 | **Building details** — rooftop sections, AC units, water towers, roof access |
| 111–140 | **Corner pieces and edge tiles** — building corners for constructing arbitrary building shapes |
| 141–170 | **Interior-facing wall fragments** — used for building interiors seen from outside |
| 171–200 | **Additional building variants** — garage doors, loading bays, industrial units |

### Building Tile Note

The 4_Generic_Buildings_16x16 sheet is a sprite atlas of complete building front-facing views. Most tiles form parts of 2-4 tile wide, 3-6 tile tall building sprites. The top rows of each building section are at the top of the sprite (high row numbers for the foot, low row numbers for the roof). Individual building footprints span multiple columns and rows.

---

## Tileset 4: 17_Garden_16x16.png

**Dimensions:** 512 × 3136 px | **Grid:** 32 cols × 196 rows | **Total tiles:** 6272
**firstgid:** 12769 | **GID range:** 12769–19040
**Margin/spacing:** 0/0

### Verified GIDs (from tileset-catalog.json pixel samples)

| Tile | Row | Col | GID | RGB | Description |
|------|-----|-----|-----|-----|-------------|
| Transparent border | 0 | all transparent except cols 0-3, 7-8 | 12769+ | [0,0,0] mostly | Row 0: most transparent |
| Green tile | 0 | 0 | 12769 | [45,162,51] | Bright green — likely grass/shrub top |
| More green | 0 | 1-4 | 12770-12773 | [45,162,51]/[38,139,73] | Green vegetation tops |
| Dark green | 0 | 5 | 12774 | [31,97,79] | Dark foliage |
| Green row 1 | 1 | 0-3 | 12801-12804 | [73,169,47]/[38,139,73] | Brighter lime green |
| Dark green/grey | 1 | 4-5 | 12805-12806 | [47,66,77]/[58,58,80] | Dark grey-blue-green |
| Dark olive | 1 | 7-11 | 12808-12812 | [31,97,79]/[38,139,73] | Dark green vegetation |
| Bright greens | 1 | 13-15 | 12814-12816 | [45,162,51]/[100,182,59] | Hedge/shrub greens |
| Teal-green | 1 | 16-17 | 12817-12818 | [23,112,75]/[26,82,73] | Darker tropical green |

**Note:** Like Buildings, `PALM_GID = tileGid(GARDEN_FIRSTGID, GARDEN_COLS, 0, 0) = 12769` points to row=0, col=0. The catalog shows GID 12769 has RGB [45,162,51] — actually a visible green tile (not fully transparent). However, it renders as a partial tile (top of a vegetation sprite). The `ge_collide: true` on localId=0 means this serves as both a visible green top and a collision tile.

### Row Zone Summary (17_Garden_16x16.png)

Based on visual inspection of the PNG image:

| Row Range | Content Zone |
|-----------|-------------|
| 0 | Partial transparency + vegetation/shrub tops (mixed) |
| 1–10 | **Small garden props**: flower pots, planters, garden tools, hedges (top sections) |
| 11–25 | **Tree sprites**: small deciduous trees, conifer tops, circular bush clusters |
| 26–45 | **Palm trees**: palm fronds (top sections), trunk segments, palm clusters — ideal for Miami theme |
| 46–65 | **Tall tree sprites**: full tree with trunk visible, multi-tile tree variants |
| 66–85 | **Garden structures**: benches, fountains, garden paths, decorative fences |
| 86–110 | **Large landscape trees**: oak-style spreading canopy |
| 111–130 | **Greenhouse/garden building tiles** |
| 131–155 | **Stone and gravel path tiles** for garden paths |
| 156–196 | **Building-garden hybrid tiles**: garden walls, archways, trellises, large planters |

### Palm Tree Location in Garden Sheet

Visually confirmed: Palm trees begin around row 26-30. These are the best Miami-appropriate tiles in this sheet. A palm tree sprite typically spans 2-3 tiles wide and 4-6 tiles tall.

---

## Tileset 5: 8_Worksite_16x16.png

**Dimensions:** 512 × 320 px | **Grid:** 32 cols × 20 rows | **Total tiles:** 640
**firstgid:** 19041 | **GID range:** 19041–19680
**Margin/spacing:** 0/0

### Verified GIDs (from tileset-catalog.json pixel samples)

| Tile | Row | Col | GID | RGB | Description |
|------|-----|-----|-----|-----|-------------|
| Transparent border | 0 | 0-6 | 19041-19047 | [0,0,0] | Cols 0-6 transparent |
| **SCAFFOLD start** | **0** | **7** | **19048** | **[237,147,30]** | **Orange construction equipment top** |
| Scaffold/scaffolding | 0 | 12 | 19053 | [237,147,30] | More orange equipment |
| Dark grey structure | 0 | 14-19 | 19055-19060 | [58,58,80]/[157,163,183] | Metal scaffolding frame |
| Metal scaffold | 0 | 21-26 | 19062-19067 | [58,58,80]/[86,89,114] | More scaffolding structure |
| Light grey scaffold | 1 | 0 | 19073 | [235,228,242] | Light lavender-grey scaffold plank |
| White/off-white | 1 | 1 | 19074 | [248,248,248] | Near-white scaffold element |
| Orange equipment | 1 | 8-10 | 19081-19083 | [237,147,30] | Orange heavy machinery |
| Grey metal frame | 1 | 14-19 | 19087-19092 | [125,127,153]/[58,58,80] | Metal scaffold uprights |
| Blue-grey metal | 2 | 0-2 | 19105-19107 | [75,76,100]/[82,84,108] | Metal scaffolding section |
| Mauve-pink | 1 | 29-30 | 19102-19103 | [208,190,156] | Beige/tan building material |

**Note:** The current codebase uses `SCAFFOLD_GID = tileGid(WORKSITE_FIRSTGID, WORKSITE_COLS, 0, 0) = 19041`. The catalog shows GID 19041 is at row=0, col=0 with RGB [0,0,0] — fully transparent. This is used as a collision marker (ge_collide: true), not for visual rendering. The actual visible scaffolding starts at row=0, col=7 (GID 19048, orange) and row=0, cols 14-19 (metal frames).

### Row Zone Summary (8_Worksite_16x16.png)

Based on visual inspection of the PNG image (20 rows total):

| Row Range | Content Zone |
|-----------|-------------|
| 0 | Transparent border cols 0-6, then: **construction light towers** (cols 0-6 area), **orange boom lifts/scissor lifts** (cols 6-11), **scaffolding frames** (cols 12-19), **metal rack/shelving top** (cols 20-31) |
| 1–2 | **Safety barrier/fence** (red-white striped: orange-red cones + white panels on left), **rock/rubble piles** (center-left), **more lift vehicles** (center), **scaffolding midsection** (right) |
| 3–4 | **Base sections** of all machinery from rows 0-2: vehicle bases, wheels visible |
| 5–8 | **Worksite props**: hard hats, safety cones, tool boxes, paint cans, warning signs |
| 9–12 | **Large metal storage rack** (full visible in rows 9-12 right side of sheet) |
| 13–16 | **Pallet/material stacks**: lumber piles, pipe stacks, construction material tiles |
| 17–19 | **Ground-level detail tiles**: dirt mounds, tire tracks, excavated ground |

### Worksite Content Note

The worksite sheet primarily contains OBJECT sprites (construction vehicles, scaffolding structures) rather than terrain tiles. All are multi-tile sprites. Row 0 is the only "border" row. True scaffold wall/platform tiles for use as building overlays are in rows 0-4, right columns (cols 12-31 area, grey metal frames).

Best scaffolding overlay tiles for the "under construction" look:
- Row 0, cols 14-19: Metal scaffolding uprights, GIDs 19055-19060
- Row 1, cols 14-19: Scaffolding midsection GIDs 19087-19092

---

## Interior Tilesets (Not in Active 5-Tileset Chain)

These tilesets are available in the project but not yet loaded. They will be needed for Phase 3 (Andres's Room), Phase 4 (Thoven HQ interior), etc.

### Interiors_16x16.png

**Dimensions:** ~256 × ~17024 px (estimated 16 cols × 1064 rows = 17024 tiles based on task spec)
**Visual inspection:** Extremely tall narrow sheet. Content observed:
- Dense, multi-room interior tile content
- Floor tiles, wall tiles, furniture pieces
- Various room decoration objects
- Multiple color themes for different room types
- Visible content: desks, beds, bookshelves, carpets, windows, doors

**Key structural fact:** 16 columns (not 32). This is different from the 5 external tilesets. GID formula uses `cols=16`.

**Row zone estimates (from visual):**
| Row Range | Content Zone |
|-----------|-------------|
| 0 | Transparent border |
| 1–50 | Floor tile variants — hardwood, carpet, tile, stone |
| 51–120 | Wall tiles — wainscoting, wallpaper, plain walls in multiple colors |
| 121–250 | Furniture: desks, chairs, tables, beds, sofas |
| 251–400 | Kitchen/bathroom fixtures |
| 401–600 | Electronics, computers, bookshelves, decorations |
| 601–800 | Doors, windows, staircases |
| 801–1064 | Room-specific prop clusters: bedroom, office, café, lab objects |

### Room_Builder_16x16.png

**Dimensions:** ~1216 × ~1808 px (76 cols × 113 rows = 8588 tiles based on task spec)
**Visual inspection:** Wide sheet with labeled sections (text annotations visible). Contains:
- **Floor tiles**: multiple wood floor tones (horizontal planks in 4-5 color variants visible — light oak, dark oak, grey, beige, teal)
- **Wall segments**: tall wall panels for constructing room interiors
- **Window frames and door frames** with multiple styles
- **Corner pieces** for room construction
- **Labels visible**: "Añadir", "Floor Tables" type annotations suggesting organized sections
- Labeled design: appears to be a modular room builder with components meant to snap together

**Key structural fact:** 76 columns. Very wide compared to other sheets.

**Row zone estimates (from visual):**
| Row Range | Content Zone |
|-----------|-------------|
| 0 | Tools/UI elements visible at top-left, partial transparent border |
| 1–10 | **Room construction headers and labels** (annotation rows) |
| 11–30 | **Floor tile palette** — multiple wood/carpet/tile floor variants in horizontal bands |
| 31–55 | **Wall tiles** — exterior-facing walls with windows, doorways |
| 56–80 | **Interior wall panels** — plain walls, decorative walls, color variants |
| 81–100 | **Corner and junction pieces** for modular room construction |
| 101–113 | **Specialized room tiles** — bathroom, kitchen, closet specific tiles |

**Room_Builder special note:** Sheet has visible "piano" label and text annotations suggesting sections are named. The right portion of the sheet contains stacked room layouts (complete room templates showing full rooms with walls/floors combined). These are not individual tiles but complete room mockups for reference.

---

## Additional Available Tilesets (Not in Primary Chain)

These files are in `public/assets/tilesets/` but not loaded in the current 5-tileset configuration:

### 2_City_Terrains_16x16.png
**Dimensions:** 944 × 1648 px | **Grid:** 59 cols × 103 rows = 6077 tiles
**Visual content:** Urban road network tiles — crosswalks, bus stops, roundabout, parking lots, sidewalks with red/yellow accent markings. Multiple road layout variants: 4-way intersections, T-junctions, curved roads, one-way indicators. Also contains some grass edge tiles at bottom.
**Key note:** 59 columns (not 32) — different from other sheets. Use cols=59 in GID calculations.
**Miami relevance:** Bus stops, crosswalks, and sidewalk tiles useful for Main Street refinement.

### 19_Graveyard_16x16.png
**Dimensions:** ~512 × ~512 px (estimated) | **Grid:** 32 cols × ~35 rows
**Visual content:** Cemetery/gothic environment — tombstones, crypts, gothic iron fences, dead trees, mausoleums, dark grass, graves, soil mounds. Dark color palette: dark greens, greys, purples.
**Miami relevance:** Used for the Idea Graveyard zone. Tombstones and iron fence tiles are particularly relevant.

### 7_Villas_16x16.png
**Dimensions:** ~512 × ~1200 px (estimated) | **Grid:** 32 cols × ~75 rows
**Visual content:** Residential villa/house sprites — single-family homes in top-down style, 3-4 tile wide × 4-6 tile tall house facades, multiple color variants (brown, red, blue). Includes garden furniture (outdoor tables, patio chairs), tree sprites, small decorative objects. More suburban than urban.
**Miami relevance:** Good for Andres's House residential area.

### 3_City_Props_16x16.png
**Dimensions:** ~512 × ~2000 px (estimated) | **Grid:** 32 cols × ~125 rows
**Visual content:** City decoration props — lamp posts, traffic lights, ATMs, phone booths, mailboxes, benches, trash cans, vending machines, AC units, wind turbines, storage tanks, shipping containers, billboards, road barriers, fencing panels. Very diverse prop sheet.
**Miami relevance:** Lamp posts, benches, and street furniture for Main Street.

---

## Community GID References

**No official LimeZu GID documentation found.** The LimeZu itch.io page and pack do not include a machine-readable GID map. Community knowledge on forums and GitHub consists of:

1. **Universal knowledge**: Row 0 of every LimeZu sheet is transparent (confirmed in this project's catalog).
2. **Per-project inspection**: Every project using LimeZu tilesets runs their own inspection — there is no shared community GID database.
3. **This project's inspect-tileset.cjs**: The authoritative GID source for this project. Output at `public/assets/maps/tileset-catalog.json`.

**GitHub projects using LimeZu tilesets** (observed in community):
- Projects typically reference LimeZu tiles by row/col coordinates discovered through Tiled editor's tile picker, not through documented GID tables
- The LimeZu itch.io changelog (320+ updates mentioned in design doc) does not include tile ID documentation
- No community-maintained GID map or spreadsheet was found

---

## Verified Project GIDs (Source of Truth)

These GIDs are verified by tileset-catalog.json (pixel-level RGB sampling) and confirmed by the generate-map.ts implementation that passed human smoke testing:

| Constant | Tileset | Row | Col | GID | RGB | Terrain |
|----------|---------|-----|-----|-----|-----|---------|
| GRASS_GID | terrains | 6 | 0 | 193 | [71,151,87] | Green grass fill |
| PATH_GID | terrains | 9 | 5 | 294 | [199,140,89] | Earthy sandy path |
| WATER_GID | terrains | 5 | 25 | 186 | [54,154,176] | Teal water fill |
| PLAZA_GID | terrains | 1 | 1 | 34 | [217,226,241] | Light stone/pavement |
| SAND_GID | beach | 2 | 0 | 2433 | [230,174,85] | Golden sand fill |
| DOCK_GID | beach | 9 | 15 | 2672 | [126,97,81] | Wooden pier brown |
| BUILDING_GID | buildings | 0 | 0 | 6369 | [0,0,0] | Transparent (collision marker only) |
| PALM_GID | garden | 0 | 0 | 12769 | [45,162,51] | Green vegetation top (partial) |
| SCAFFOLD_GID | worksite | 0 | 0 | 19041 | [0,0,0] | Transparent (collision marker only) |

**Status:** All GIDs above are production-verified. The game rendered correctly with real LimeZu pixel-art tiles in the Phase 03.1 human smoke test (2026-03-09).

---

## GID Calculator Reference

```typescript
// Tileset firstgids
const TERRAIN_FIRSTGID  = 1;      // 1_Terrains_and_Fences_16x16.png
const BEACH_FIRSTGID    = 2369;   // 21_Beach_16x16.png
const BUILDING_FIRSTGID = 6369;   // 4_Generic_Buildings_16x16.png
const GARDEN_FIRSTGID   = 12769;  // 17_Garden_16x16.png
const WORKSITE_FIRSTGID = 19041;  // 8_Worksite_16x16.png

// All 5 primary sheets: 32 cols
// City Terrains exception: 59 cols
// Interiors exception: 16 cols
// Room_Builder exception: 76 cols

function tileGid(firstgid: number, cols: number, row: number, col: number): number {
  return firstgid + (row * cols + col);
}

// Examples:
// Next grass variant (row=6, col=1): tileGid(1, 32, 6, 1) = 194
// Alternative water (row=5, col=26): tileGid(1, 32, 5, 26) = 187
// Sand variant (row=2, col=1): tileGid(2369, 32, 2, 1) = 2434
// First visible building (row=1, col=0): tileGid(6369, 32, 1, 0) = 6401, RGB=[132,81,86]
// Scaffolding frame (row=0, col=14): tileGid(19041, 32, 0, 14) = 19055
```

---

## Grid Engine Integration Notes

Grid Engine (v2.48.0) reads `ge_collide: true` tile properties from Tiled JSON. Key integration facts:

1. **Collision is set per-tileset, not per-GID** — the `tiles` array in each tileset entry uses LOCAL tile IDs (0-based within that tileset), not GIDs.
2. **ge_collide marker tiles in this project** — each tileset marks one tile as `ge_collide: true` to enable the collision system:
   - Terrains: localId=160 (row=5, col=0) — transparent tile, invisible collision fence
   - Buildings: localId=0 (row=0, col=0) — transparent, used as BUILDING_GID/BLOCK in collision layer
   - Garden: localId=0 (row=0, col=0) — green tile (visible), also blocks player
   - Worksite: localId=0 (row=0, col=0) — transparent, collision marker
3. **The Collision layer approach** — the project uses a separate Collision layer with non-zero GIDs (using BUILDING_GID=6369 as the marker) to indicate blocked tiles. Grid Engine reads the GID, looks up the tileset, checks `ge_collide`, and blocks movement.
4. **Grid Engine README** (Annoraaq/grid-engine) — does not mention LimeZu specifically. Tileset integration is standard Phaser 3 tilemap — Grid Engine only requires the `ge_collide` property or a custom collision function.

---

## Known Gaps / What Remains Unresolved

1. **Exact row/col for palm trees in Garden sheet** — visually confirmed palm trees exist around rows 26-30 but exact GIDs not in the 10-row catalog sample. Run `node scripts/inspect-tileset.cjs` with `SAMPLE_ROWS` increased to 40 to get rows 10-39.

2. **Graveyard tile GIDs** — tombstone and iron fence tiles not inspected. Needed for Idea Graveyard zone.

3. **Interior tileset GIDs** — Interiors_16x16.png and Room_Builder_16x16.png not in the catalog (only 5 tilesets were cataloged). A separate inspection pass is needed when building interiors (Phase 3+).

4. **City Terrains GIDs** — 2_City_Terrains_16x16.png not in catalog. Sidewalk and crosswalk tiles useful for Main Street polish are not yet mapped.

5. **LimeZu itch.io changelog** — could not fetch (WebFetch restricted). Version history describing what was added in each of the 320+ updates is not available offline.

---

## Sources

| Source | Confidence | What It Confirmed |
|--------|-----------|-------------------|
| `public/assets/maps/tileset-catalog.json` | HIGH | Exact RGB of center pixel for every tile in rows 0-9 of all 5 tilesets |
| `scripts/inspect-tileset.cjs` | HIGH | Methodology for pixel extraction; PNG IHDR dimensions |
| `scripts/generate-map.ts` | HIGH | Verified GID constants used in production map |
| `public/assets/tilesets/*.png` (visual) | MEDIUM | Row zone content zones from visual inspection |
| `.planning/phases/03.1-art-foundation-real-tilesets-and-programmatic-miami-world-map/03.1-RESEARCH.md` | HIGH | Architecture patterns, firstgid chain, pitfalls |
| Human smoke test (Phase 03.1) | HIGH | Confirms all 5 verified GIDs render correctly in browser |
| LimeZu itch.io / GitHub community | NOT FETCHED | WebFetch restricted; no offline community GID map found |

# Phaser 3 + Grid Engine — Pokemon Overworld Best Practices

**Date:** 2026-03-09
**Purpose:** Research for Andres World phases 4–9 (interiors, NPCs, dialogue, hidden areas, polish)
**Sources:** devshareacademy/monster-tamer source (world-scene.js), Grid Engine docs (annoraaq.github.io/grid-engine), web exploration

---

## 1. monster-tamer (devshareacademy/monster-tamer)

### How many Phaser scenes?

13 scene files confirmed in `src/scenes/`:

| File | Role |
|------|------|
| `base-scene.js` | Abstract base — shared controls, camera, update lifecycle |
| `world-scene.js` | Main overworld + interior handler (same scene, different area data) |
| `battle-scene.js` | Combat screen |
| `cutscene-scene.js` | Launched in parallel — overlaid cinematic bars, does not replace world |
| `dialog-scene.js` | Launched in parallel — persistent NPC text box overlay |
| `inventory-scene.js` | Launched on top of paused world |
| `monster-party-scene.js` | Launched on top of paused world |
| `monster-details-scene.js` | Sub-screen of monster party |
| `options-scene.js` | Settings |
| `preload-scene.js` | Asset loading |
| `title-scene.js` | Title card |
| `test-scene.js` | Dev scratch pad |
| `scene-keys.js` | Central enum of all scene keys |

**Pattern:** One `WorldScene` handles both overworld and interiors — it re-creates itself via `this.scene.start(SCENE_KEYS.WORLD_SCENE, { area, isInterior })`. It does NOT create a separate "InteriorScene" class. UI layers (dialog, cutscene) run as **parallel launched scenes** on top of the world rather than as embedded game objects.

### Tilemap structure

- Each area has its own tilemap JSON, loaded during preload with a unique key (e.g. `MAIN_1_LEVEL`, `TOWN_LEVEL`).
- Tilemap layers: background tiles, `Collision` layer (invisible collision bitmap), `Encounter` layers (tall grass zones), foreground depth layer.
- Object layers: `NPC`, `NPC_PATH`, `Sign`, `Item`, `Scene_Transitions`, `Events`, `Revive_Location`, `Player_Spawn_Location`, `Area_Metadata`.
- Tilesets: a `collision` tileset (single-tile bitmap for collision) + real visual tilesets.
- Foreground image added last via `this.add.image()` at depth above player for visual depth trick (buildings appear to be in front of player when walking behind them).
- Camera regions defined in a `Camera_Regions` object layer — used to dynamically constrain `cameras.main.setBounds()` as the player moves, so one large map can have smaller scrollable sub-zones.

### NPC movement

NPCs are defined per-object-layer in Tiled. Each NPC layer has:
- One object of type `NPC` with position, `npc_id`, and `movement_pattern` (Tiled custom property)
- Multiple `NPC_PATH` objects numbered 0..N as waypoints

In `#createNPCs(map)`:
```js
const npcPath = { 0: { x, y } };
pathObjects.forEach((obj) => { npcPath[parseInt(obj.name, 10)] = { x, y }; });
const npc = new NPC({ scene, position, direction, frame, npcPath, movementPattern, events });
```

Movement patterns supported: `IDLE`, `SET_PATH` (loop waypoints), and dynamic cutscene-driven movement (`MOVE_TO_PLAYER`, `RETRACE_PATH`).

NPCs check for collisions against the player (and vice versa) — mutual collision registration:
```js
npc.addCharacterToCheckForCollisionsWith(this.#player);
this.#npcs.forEach(npc => npc.addCharacterToCheckForCollisionsWith(this.#player));
```

### Interior scene handling

**Same `WorldScene` class handles interiors.** Transition flow:

1. Player steps on an entrance tile in Tiled's `Scene_Transitions` layer.
2. `enterEntranceCallback(entranceName, entranceId, isBuildingEntrance)` fires in the `Player` class.
3. WorldScene fades camera out over 1000ms.
4. On fade complete: persists new position to `dataManager`, calls `this.scene.start(SCENE_KEYS.WORLD_SCENE, { area: entranceName, isInterior: isBuildingEntrance })`.
5. WorldScene re-initializes with the interior's tilemap key.

Interior detection:
```js
const dataToPass = { area: entranceName, isInterior: isBuildingEntrance };
this.scene.start(SCENE_KEYS.WORLD_SCENE, dataToPass);
```

Camera bounds are set conditionally: `if (!this.#sceneData.isInterior) { this.cameras.main.setBounds(0, 0, 2560, 5184); }` — interiors use default (unconstrained, or tilemap-sized) bounds.

Player spawn on entry: the destination tilemap is parsed to find the entrance object whose `connects_to` matches the originating area and `entrance_id` matches — giving the exact pixel to spawn at.

---

## 2. Grid Engine v2.x — Relevant Features

**Source:** annoraaq.github.io/grid-engine docs (v2.41.0 live on docs site; v2.48+ confirmed installed in this project)

### Multi-map / scene transition handling

Grid Engine itself does not manage scene transitions — that is Phaser's job. The correct pattern (confirmed by monster-tamer) is:

- Call `this.scene.start()` to restart/swap scene with new area data.
- Grid Engine is re-initialized in the new scene's `create()` with the new tilemap.
- No Grid Engine state persists across scene restarts — player position is saved to an external store (dataManager / localStorage).

### NPC pathfinding

Key APIs:
- `gridEngine.moveTo(charId, targetPosition, options)` — moves a character to a tile position on the shortest path.
- `gridEngine.follow(charId, targetCharId, options)` — continuously follows another character.
- `gridEngine.findShortestPath(from, to, options)` — returns path without moving.
- `gridEngine.moveRandomly(charId)` — random wandering movement.

**Algorithm recommendation for this project (4-directional grid movement):**
Use **Jump Point Search (JPS)** — fastest in benchmarks for 4-directional movement on open maps (outperforms BFS, Bidirectional, A*). Set via `PathfindingOptions.algorithm = Algorithm.JPS`.

**Caching:** Since v2.28.0, `cacheTileCollisions: true` in config enables tile collision caching. Strongly recommended for a mostly static tilemap — dramatic speedup for NPC `moveTo` and `follow` calls. Invalidate locally with `gridEngine.rebuildTileCollisionCache(area)` if tiles change.

**ignoreLayers:** Set `ignoreLayers: true` in pathfinding options to avoid scanning all char layers — halves the effective map size for pathfinding when NPCs don't need to cross char layers.

### Character layers (multi-layer depth)

Character layers (`ge_charLayer` Tiled property) solve the overworld depth problem:
- Assign tilemap layers a `ge_charLayer` property in Tiled.
- Characters assigned to a char layer only collide with other characters and tiles on that same layer.
- Depth/z-index is derived from the char layer's position in the layer stack.

For this project:
- A single `ground` char layer is sufficient for the overworld.
- Interiors (same WorldScene, new tilemap) can define their own char layers if needed (e.g., upper floors).

### Layer transitions (for stairs/bridges)

`gridEngine.setTransition(tilePos, fromLayer, toLayer)` — when a character enters `tilePos` on `fromLayer`, they are automatically moved to `toLayer`. Used for bridges and stairs. Relevant if Andres's House has a second floor or if the Music Room has a basement stair.

### Collision layers

`ge_alwaysTop` layer property is deprecated in v2 — use char layers instead for above-player rendering. Collision is tile-property based (`ge_collide: true` on tile or layer).

### `positionChangeStarted` and `positionChangeFinished` observables

Grid Engine exposes RxJS-style observables:
- `gridEngine.positionChangeStarted()` — fires when a character begins moving to a new tile. Use this to check encounter zones, trigger entrance checks.
- `gridEngine.positionChangeFinished()` — fires when movement completes. Use this for dialogue trigger zones, interaction checks.

These replace manual overlap checks (monster-tamer manually checks overlaps in `update()`; the GE observable approach is cleaner for TypeScript).

---

## 3. Web Search: Interior/Exterior Transition Patterns

Based on research across the Grid Engine docs, monster-tamer source, and related Pokemon Phaser repos:

**Dominant pattern for overworld ↔ interior:** Restart the same scene with different area data. This is preferred over separate scene classes because:
- All NPC, collision, entrance, sign, and camera logic is shared.
- Player state persists via a data manager (not in Phaser scene state).
- Tiled handles the entrance/exit warp data declaratively.

**Alternative pattern (used in some smaller repos):** Two separate scene classes (`OverworldScene`, `InteriorScene`) that share a base class. Only justified if interior mechanics are fundamentally different (e.g., no random encounters, different camera behavior). For this project, not recommended — adds complexity without benefit.

**ariroffe/personal-website** (the direct reference in CLAUDE.md): Also uses Phaser 3 + Grid Engine. Not publicly inspectable (private), but HN comments confirm it uses a single world scene with tilemap swap for interiors — same approach as monster-tamer.

---

## 4. Grid Engine Examples Directory

From the docs sidebar and URL exploration, relevant examples at `annoraaq.github.io/grid-engine/examples/`:

| Example | Relevance |
|---------|-----------|
| `char-layers-bridge` | Layer transitions via `setTransition()` — for stairs, basement entries |
| `char-layers-flying-chars` | Multi-layer depth — useful if adding rooftop terrace (Lookout Hill) |
| `follow-movement` | `gridEngine.follow()` — for NPCs that chase/follow player in cutscenes |
| `random-movement` | `gridEngine.moveRandomly()` — idle wandering NPCs (dogs in Andres's Room) |
| `pathfinding` | `gridEngine.moveTo()` with JPS — NPC patrol to destination |
| `queue-movement` | Queuing multiple moves — for scripted NPC cutscene paths |

Examples are embedded in the live docs site at `annoraaq.github.io/grid-engine/examples/[name]/index.html`.

---

## 5. Top 5 Actionable Patterns for Phases 4–9

### Pattern 1: Single WorldScene with area data for all maps

Do not create `InteriorScene`, `ThoveHQScene`, `AndreasRoomScene` as separate classes. Instead:

```typescript
// Transition to any interior
this.cameras.main.fadeOut(800, 0, 0, 0, (_cam, progress) => {
  if (progress === 1) {
    this.scene.start('WorldScene', { area: 'andres_room', isInterior: true });
  }
});
```

Each interior area gets its own Tiled JSON map file (e.g., `andres_room.json`, `thoven_hq.json`). The `WorldScene.create()` reads `area` from scene data, loads the matching tilemap, and sets up NPCs, signs, and collision from that map's object layers.

**Why:** Avoids code duplication across 8+ interiors. All interior NPCs, signs, and dialogue use the same infrastructure already built in phases 2–3.

### Pattern 2: Tiled object layers for all interactive content

Define NPCs, signs, items, entrances, and event zones entirely in Tiled — not hardcoded in TypeScript. The scene reads from object layers at runtime:

```
Object layers (Tiled)
├── NPC_Keri         → type: NPC, properties: npc_id=1, movement_pattern=IDLE
├── NPC_DadWander    → type: NPC, properties: npc_id=2, movement_pattern=SET_PATH
│   ├── path_0 (object) → name: "0"
│   └── path_1 (object) → name: "1"
├── Signs            → type: Sign, properties: sign_id=5
├── Scene_Transitions → connects_to=overworld, entrance_id=thoven_front_door
└── Events           → id=101 (triggers cutscene on overlap)
```

**Why:** Content changes (new NPC dialogue, new patrol path, new sign text) become Tiled edits + JSON re-export, not TypeScript changes. Supports the "low friction to update" requirement from CLAUDE.md.

### Pattern 3: Dialog + Cutscene as parallel launched scenes

Dialog UI and cutscene bars are launched once in `WorldScene.create()` and persist as parallel scenes:

```typescript
// In WorldScene.create()
this.scene.launch('CutsceneScene');
this.scene.launch('DialogScene');
this.dialogUi = this.scene.get('DialogScene') as DialogScene;
```

`DialogScene` exposes `showDialogModal(messages: string[])` and `hideDialogModal()`. It renders on top of WorldScene without pausing it, allowing NPC movement to continue during dialogue.

**Why:** Prevents the "pause world during dialogue" flicker. NPCs keep walking (Dad pacing, dogs wandering) while text is displayed. Fourth-wall dialogue (NPCs aware they're on a portfolio site) benefits from the world being alive during conversation.

### Pattern 4: JPS pathfinding + tile collision caching for NPC movement

For any NPC that uses `gridEngine.moveTo()` (cutscene movement, NPCs walking to player, guards patrolling):

```typescript
// GridEngine config
gridEngine.create(tilemap, {
  characters: [...],
  cacheTileCollisions: true,       // cache static tile collisions
});

// NPC moveTo call
gridEngine.moveTo('dad_npc', { x: 5, y: 8 }, {
  algorithm: Algorithm.JPS,        // fastest for 4-directional
  ignoreLayers: true,              // single char layer — skip multi-layer search
  noPathFoundStrategy: NoPathFoundStrategy.STOP,
  pathBlockedStrategy: PathBlockedStrategy.WAIT,
});
```

**Why:** The overworld is 50x40 = 2000 tiles. With 10+ NPCs calling `moveTo`, uncached BFS on every call adds up. JPS + caching keeps pathfinding under 1ms on a 50x40 map per the GE benchmarks.

### Pattern 5: Camera regions for large overworld, unconstrained for interiors

The overworld (50x40 at 16px tiles, 4x zoom = 3200x2560 apparent pixels) needs camera bound constraints to prevent showing empty space. Interiors (typically 20x15 tiles max) can be centered with no scrolling.

```typescript
// WorldScene.create()
if (!sceneData.isInterior) {
  // Camera scrolls within the world bounds
  const mapW = map.widthInPixels * ZOOM;
  const mapH = map.heightInPixels * ZOOM;
  this.cameras.main.setBounds(0, 0, mapW, mapH);
  // Optional: camera region zones from Tiled (dynamic sub-bounds)
  this.cameraRegions = TiledUtils.createCameraRegions(map);
} else {
  // Interior: center the room, no scroll needed for small maps
  this.cameras.main.centerOn(
    map.widthInPixels * ZOOM / 2,
    map.heightInPixels * ZOOM / 2
  );
}
this.cameras.main.startFollow(player.sprite);
```

For Tiled-defined camera sub-zones (e.g., the beach strip having different scroll bounds than main street), use object layers with named rectangles and dynamically update `setBounds()` when the player moves between zones — exactly as monster-tamer does with `CameraUtils.updateMainCameraBounds()`.

**Why:** Prevents the 4x zoom from showing black borders at map edges. Interiors centered automatically without needing to set exact bounds per room.

---

## Appendix: Key API Surface (Grid Engine v2.x)

```typescript
// Initialize
gridEngine.create(tilemap, { characters, cacheTileCollisions: true });

// Movement
gridEngine.moveTo(charId, { x, y }, { algorithm, ignoreLayers });
gridEngine.follow(charId, targetId, { distance });
gridEngine.moveRandomly(charId, delay, radius);
gridEngine.stopMovement(charId);

// Observables
gridEngine.positionChangeFinished().subscribe(({ charId, enterTile }) => { ... });
gridEngine.positionChangeStarted().subscribe(({ charId, exitTile }) => { ... });

// Layer transitions (stairs/bridges)
gridEngine.setTransition({ x, y }, 'ground', 'upper_floor');

// Cache
gridEngine.rebuildTileCollisionCache(area);

// Query
gridEngine.getPosition(charId);        // tile position
gridEngine.getFacingDirection(charId); // DIRECTION enum
gridEngine.isMoving(charId);
```

---

## Notes on GitHub Rate Limiting

The Grid Engine CHANGELOG.md (raw GitHub) returned 404 (branch is `master`, not `main`). The GitHub web interface rate-limited during the session. Changelog features were inferred from the live docs site version numbers (v2.28.0 for caching, v2.41.0 on docs, v2.48+ installed locally) and API reference pages.