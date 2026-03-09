# Phase 1: Infrastructure - Research

**Researched:** 2026-03-09
**Domain:** Phaser 3 + Vite + TypeScript + Grid Engine scaffold + Vercel deployment
**Confidence:** HIGH

---

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-----------------|
| FOUND-01 | Project builds with `vite build` and runs locally with `vite dev` (Phaser 3 + Grid Engine + TypeScript + Vite) | Official phaserjs/template-vite-ts covers this exactly — use it as the base scaffold |
| FOUND-02 | Deployed build is accessible at andresmartinez.com via Vercel CI/CD | Vercel auto-detects Vite; static output, no SSR needed; vercel.json with SPA rewrite required |
| FOUND-03 | Pixel-perfect rendering with no anti-aliasing or blurring artifacts at 1x scale | Phaser `pixelArt: true` config + CSS `image-rendering: pixelated` on canvas element; avoid devicePixelRatio multiplication at this stage |
</phase_requirements>

---

## Summary

Phase 1 creates the project skeleton: a working Phaser 3 game that boots to a blank canvas, deploys to Vercel, and renders pixel art without blur. No gameplay is in scope here — just the scaffolding that every later phase builds on.

The official `phaserjs/template-vite-ts` repository is the definitive starting point. It ships with Phaser 3.90.0, Vite 6.x, and TypeScript 5.7 pre-configured with hot-reload. Grid Engine (v2.48.0) is a Phaser scene plugin that installs via npm and is registered in the game config. Vercel auto-detects Vite and needs only a `vercel.json` with a single SPA rewrite rule.

The one non-obvious requirement is pixel-perfect rendering (FOUND-03). Phaser provides a shorthand config flag `pixelArt: true` that simultaneously sets `antialias: false` and `roundPixels: true` on the renderer. Pairing this with CSS `image-rendering: pixelated` on the canvas element closes the last gap where browsers may re-introduce smoothing during CSS scaling. These two lines of config are the entire solution — no custom render loop, no Canvas API calls needed.

**Primary recommendation:** Clone `phaserjs/template-vite-ts`, add Grid Engine as a scene plugin, add `pixelArt: true` to the game config, and wire Vercel with a `vercel.json` SPA rewrite. This phase is complete when the blank game boots locally and deploys green.

---

## Standard Stack

### Core

| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| phaser | 3.90.0 | HTML5 game framework | Industry standard; tilemap support, pixel-perfect config, active maintenance |
| grid-engine | 2.48.0 | Tile-based grid movement plugin | The standard Phaser 3 grid movement solution; full TypeScript, Pokemon-style movement built-in |
| vite | 6.x | Dev server + bundler | Fast HMR, native ESM, tree-shaking; official Phaser template uses it |
| typescript | 5.7.x | Type safety | Official Phaser template includes it; Grid Engine ships with types |

### Supporting

| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| @types/node | latest | Node type definitions | Needed for Vite config TypeScript |

### Alternatives Considered

| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| phaserjs/template-vite-ts | Manual scaffold | Template is maintained by the Phaser team — no reason to hand-roll |
| grid-engine | Custom movement | Custom grid movement is hundreds of lines of bug-prone code; Grid Engine handles pathfinding, collision, multi-character |
| Vercel | Netlify / GitHub Pages | Vercel is locked in per design doc |

**Installation (after cloning template):**
```bash
npm install grid-engine
```

Full install from scratch:
```bash
npm install phaser grid-engine
npm install --save-dev vite typescript @types/node
```

---

## Architecture Patterns

### Recommended Project Structure

Based on `phaserjs/template-vite-ts` (the official Phaser team template):

```
andres-world/
├── index.html              # Entry HTML — mounts game canvas
├── public/
│   ├── assets/             # Sprites, tilesets, audio (served as-is)
│   └── style.css           # Global styles (canvas centering, image-rendering)
├── src/
│   ├── main.ts             # App entry point — creates Phaser.Game
│   └── game/
│       ├── main.ts         # Game config (width, height, pixelArt, plugins, scenes)
│       └── scenes/
│           └── Boot.ts     # Minimal boot scene (placeholder for Phase 1)
├── vite.config.ts          # Vite config
├── tsconfig.json           # TypeScript config
└── vercel.json             # SPA rewrite rule
```

### Pattern 1: Phaser Game Config with Pixel Art Mode

**What:** The central game config object passed to `new Phaser.Game()`. All rendering behavior is set here.
**When to use:** Phase 1 — this is the only config object needed.

```typescript
// src/game/main.ts
import Phaser from "phaser";
import { GridEngine } from "grid-engine";
import { BootScene } from "./scenes/Boot";

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  pixelArt: true,         // Sets antialias: false + roundPixels: true simultaneously
  backgroundColor: "#000000",
  plugins: {
    scene: [
      {
        key: "GridEngine",
        plugin: GridEngine,
        mapping: "gridEngine",
      },
    ],
  },
  scene: [BootScene],
};

export default new Phaser.Game(config);
```

`pixelArt: true` is the Phaser shorthand that handles all of:
- `render.antialias: false` — no WebGL texture smoothing
- `render.roundPixels: true` — sprites snap to integer pixel positions (default true since Phaser 3.70)

### Pattern 2: CSS for Canvas Pixel Rendering

**What:** CSS applied to the canvas element to prevent the browser from re-smoothing pixels during CSS scaling.
**When to use:** Always — browser CSS can override the WebGL setting.

```css
/* public/style.css */
canvas {
  image-rendering: pixelated;       /* Chrome, Firefox, Edge */
  image-rendering: crisp-edges;     /* Safari fallback */
  -ms-interpolation-mode: nearest-neighbor; /* IE fallback */
}
```

### Pattern 3: Vercel SPA Rewrite

**What:** `vercel.json` rewrite that routes all requests to `index.html`. Required for SPAs on Vercel.
**When to use:** Always — Vercel's default is to resolve paths to files, which breaks single-file SPAs.

```json
{
  "$schema": "https://openapi.vercel.sh/vercel.json",
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

### Pattern 4: Minimal Boot Scene

**What:** A Scene subclass that just shows a blank canvas — Phase 1 proves the loop works, nothing more.
**When to use:** Phase 1 deliverable.

```typescript
// src/game/scenes/Boot.ts
import Phaser from "phaser";

export class BootScene extends Phaser.Scene {
  constructor() {
    super({ key: "Boot" });
  }

  create(): void {
    // Phase 1: blank canvas confirms scaffold works
    // Phase 2 will load the tilemap here
    console.log("Andres World scaffold running");
  }
}
```

### Anti-Patterns to Avoid

- **Multiplying canvas dimensions by `devicePixelRatio`:** This is for retina support (Phase 9 concern), not 1x pixel art. Doing it now will scale the game incorrectly.
- **Using `Phaser.Scale.FIT` or `Phaser.Scale.FILL` before art is designed for a target resolution:** Scale mode depends on the final canvas dimensions, which belong to Phase 2 when the tilemap size is known.
- **Setting `type: Phaser.CANVAS` explicitly:** Let Phaser.AUTO choose (WebGL first, canvas fallback). Grid Engine works with both.
- **Skipping `vercel.json`:** Without the SPA rewrite, deep links and page refreshes return 404 on Vercel.

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Grid movement | Custom tile-snapping logic | grid-engine | Collision, pathfinding, diagonal movement, multi-character — hundreds of tested edge cases |
| Pixel art rendering config | Custom canvas ImageData manipulation | `pixelArt: true` in Phaser config | One line; covers WebGL and Canvas renderers |
| HMR dev server | Custom Webpack/Rollup config | Vite (via official template) | Official Phaser team maintains the template; HMR works out of the box |
| Vite build config | Writing vite.config.ts from scratch | Clone `phaserjs/template-vite-ts` | Template handles asset path resolution, TypeScript, and game-specific settings |

**Key insight:** This phase is infrastructure, not game logic. The right move is to use the official Phaser scaffold exactly as designed and add Grid Engine on top. Any deviation creates maintenance debt with zero gameplay benefit.

---

## Common Pitfalls

### Pitfall 1: Blurry Canvas on High-DPI Displays

**What goes wrong:** Game canvas appears blurry on retina/HiDPI screens even with `pixelArt: true`. Sprites look soft.
**Why it happens:** The CSS canvas element is rendered at 1x but displayed at 2x on retina displays. CSS scaling adds smoothing.
**How to avoid:** Apply `image-rendering: pixelated` CSS to the canvas. This is separate from Phaser's WebGL setting and must be added explicitly in `style.css`.
**Warning signs:** Sprites look fine in dev tools at 1:1 but blurry when zoomed out.

### Pitfall 2: Grid Engine Not Initialized Before Scene Use

**What goes wrong:** `this.gridEngine` is undefined when called in `create()`.
**Why it happens:** Grid Engine must be initialized with `this.gridEngine.create(tilemap, characters)` after the Tiled tilemap is loaded. The plugin is available but not initialized until you call `create()` with a tilemap.
**How to avoid:** Phase 1 does not use Grid Engine at all — just register the plugin in the game config. Actual `gridEngine.create()` call is Phase 2.
**Warning signs:** TypeScript error `Property 'gridEngine' does not exist on type 'Scene'` — resolve by declaring the plugin type on the scene.

### Pitfall 3: Vite Asset Path Issues with Phaser Loader

**What goes wrong:** `this.load.image('key', 'assets/sprite.png')` works in dev but returns 404 in production build.
**Why it happens:** Vite hashes asset filenames during build. Phaser's loader uses string paths, not import statements, so Vite doesn't know to include/transform them.
**How to avoid:** Put all game assets in `public/assets/` (not `src/assets/`). Files in `public/` are served as-is without Vite transformation. Phaser path strings work correctly.
**Warning signs:** Assets load in `npm run dev` but fail after `npm run build`.

### Pitfall 4: Vercel Build Output Directory

**What goes wrong:** Vercel deploys but shows a blank page or 404. Build appears to succeed.
**Why it happens:** Vite outputs to `dist/` by default. Vercel auto-detects this for known frameworks but may need explicit configuration if it misdetects the framework.
**How to avoid:** Confirm Vercel project settings: Framework = "Vite" (or "Other"), Output Directory = `dist`. This is set in the Vercel dashboard, not in code.
**Warning signs:** Green deploy in Vercel CI but blank page at the domain.

### Pitfall 5: TypeScript `gridEngine` Property Missing from Scene Type

**What goes wrong:** TypeScript errors on `this.gridEngine` throughout the codebase.
**Why it happens:** Phaser scenes have typed `this` but the Grid Engine plugin mapping isn't known to TypeScript automatically.
**How to avoid:** Declare the plugin property on the scene. Grid Engine ships a type for this:
```typescript
declare module "phaser" {
  interface Scene {
    gridEngine: GridEngine;
  }
}
```
Or add it to a `src/types/global.d.ts` file. Check Grid Engine docs for the recommended approach at the version in use.
**Warning signs:** Red squiggles on `this.gridEngine` everywhere.

---

## Code Examples

Verified patterns from official sources:

### Full Phase 1 Game Config (Phaser 3.90 + Grid Engine 2.x)

```typescript
// src/game/main.ts
// Source: phaserjs/template-vite-ts + annoraaq.github.io/grid-engine/p/installation
import Phaser from "phaser";
import { GridEngine } from "grid-engine";
import { BootScene } from "./scenes/Boot";

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  pixelArt: true,
  backgroundColor: "#1a1a2e",
  plugins: {
    scene: [
      {
        key: "GridEngine",
        plugin: GridEngine,
        mapping: "gridEngine",
      },
    ],
  },
  scene: [BootScene],
};

export default new Phaser.Game(config);
```

### Grid Engine Plugin Registration Only (No Initialization)

```typescript
// Source: annoraaq.github.io/grid-engine/p/installation
// Phase 1: register the plugin. Do NOT call gridEngine.create() yet.
// gridEngine.create() requires a loaded tilemap — that's Phase 2.
plugins: {
  scene: [
    {
      key: "GridEngine",
      plugin: GridEngine,
      mapping: "gridEngine",
    },
  ],
},
```

### Vercel SPA Config

```json
// vercel.json
// Source: vercel.com/docs/frameworks/frontend/vite
{
  "$schema": "https://openapi.vercel.sh/vercel.json",
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

### Pixel Art CSS

```css
/* public/style.css */
/* Source: MDN + Phaser community */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  background: #000;
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
}

canvas {
  image-rendering: pixelated;
  image-rendering: crisp-edges;
  -ms-interpolation-mode: nearest-neighbor;
}
```

---

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Webpack bundler | Vite | 2021-present | 10-100x faster HMR; official Phaser template now uses Vite |
| `phaser-grid-movement-plugin` (npm) | `grid-engine` (npm) | Package renamed | Install `grid-engine`, NOT `phaser-grid-movement-plugin` |
| Manual `roundPixels` + `antialias` config | `pixelArt: true` shorthand | Phaser 3.60+ | One flag replaces two separate render config keys |
| `roundPixels` defaulting to false | `roundPixels: true` by default | Phaser 3.70 | Pixel snapping now on by default; `pixelArt: true` still recommended for explicitness |

**Deprecated/outdated:**
- `phaser-grid-movement-plugin`: The old npm package name. The current package is `grid-engine`.
- Separate `render.antialias: false` + `render.roundPixels: true`: Still works but `pixelArt: true` is the preferred single-flag shorthand.

---

## Open Questions

1. **Canvas dimensions for Phase 1**
   - What we know: Phase 2 will define the final game width/height based on the tilemap (~50x40 tiles). Tile size is likely 16px or 32px (Gen 1 style).
   - What's unclear: Should Phase 1 use a placeholder dimension (800x600) or anticipate the Phase 2 canvas size?
   - Recommendation: Use 800x600 as placeholder in Phase 1. Phase 2 will set the real dimensions once tile size and map size are confirmed. Changing game dimensions in config is a one-line edit.

2. **Domain configuration (andresmartinez.com)**
   - What we know: Vercel handles domain routing; the custom domain is pre-configured per the design doc.
   - What's unclear: Whether the domain is already pointed to Vercel or needs DNS updates.
   - Recommendation: Check Vercel dashboard during Phase 1 execution. If DNS isn't pointed, it's a 5-minute fix but not a code task — flag as operational, not a development blocker.

3. **Grid Engine TypeScript module augmentation**
   - What we know: Grid Engine ships types. The `this.gridEngine` mapping requires declaration.
   - What's unclear: Exact declaration syntax for Grid Engine 2.48 — the package may have changed its export types.
   - Recommendation: Check `node_modules/grid-engine/dist` types after install and confirm the module augmentation pattern. Low risk to defer to Phase 2 when gridEngine is first used.

---

## Validation Architecture

### Test Framework

| Property | Value |
|----------|-------|
| Framework | None detected — greenfield project |
| Config file | none — see Wave 0 |
| Quick run command | `npm run build` (build smoke test — no unit test framework yet) |
| Full suite command | `npm run build && npx tsc --noEmit` |

**Note:** Phase 1 is pure infrastructure scaffolding. The meaningful validation is the build and deploy pipeline itself, not unit tests. The "test" is: `vite dev` starts, `vite build` produces `dist/`, Vercel deploy goes green, and pixel art renders without blur. No unit test framework is needed at this phase — introduce it in Phase 2 or 3 when game logic exists to test.

### Phase Requirements → Test Map

| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| FOUND-01 | `vite build` produces `dist/` with no errors; `vite dev` starts on localhost:8080 | smoke | `npm run build` | Wave 0 (create package.json with these scripts) |
| FOUND-02 | Vercel deploy succeeds and URL responds 200 | deploy smoke | `vercel --prod` (CI/CD trigger) | Wave 0 (create vercel.json) |
| FOUND-03 | Canvas has no anti-aliasing blur at 1x scale | visual / manual | Visual inspection in browser dev tools at 100% zoom | Wave 0 (set `pixelArt: true` in config) |

### Sampling Rate

- **Per task commit:** `npm run build` — confirms no TypeScript or Vite errors
- **Per wave merge:** `npm run build && npx tsc --noEmit` — full type check + build
- **Phase gate:** Build green + Vercel deploy green + visual pixel check before `/gsd:verify-work`

### Wave 0 Gaps

- [ ] `package.json` — create with `dev`, `build`, `preview` scripts
- [ ] `vite.config.ts` — create (clone from official template or minimal manual config)
- [ ] `tsconfig.json` — create (clone from official template)
- [ ] `src/main.ts` — entry point
- [ ] `src/game/main.ts` — Phaser game config with `pixelArt: true` and Grid Engine plugin
- [ ] `src/game/scenes/Boot.ts` — minimal scene
- [ ] `public/style.css` — canvas `image-rendering: pixelated`
- [ ] `index.html` — mounts canvas
- [ ] `vercel.json` — SPA rewrite rule

*(No existing test infrastructure — full scaffold is Wave 0)*

---

## Sources

### Primary (HIGH confidence)
- `github.com/phaserjs/template-vite-ts` — Versions confirmed (Phaser 3.90.0, Vite 6.x, TypeScript 5.7.2), project structure, scripts
- `annoraaq.github.io/grid-engine/p/installation` — Grid Engine npm install command and plugin config code
- `vercel.com/docs/frameworks/frontend/vite` — SPA rewrite vercel.json pattern confirmed from official Vercel docs
- `docs.phaser.io/api-documentation/class/core-config` — `pixelArt: true` behavior confirmed from official Phaser docs

### Secondary (MEDIUM confidence)
- `phaser.discourse.group/t/settings-for-crisp-rendering/10000` — Community confirmation of `pixelArt: true` + CSS pattern; cross-verified with official docs
- WebSearch: grid-engine v2.48.0 latest version — cross-referenced against Annoraaq/grid-engine GitHub description ("last published 2 months ago")

### Tertiary (LOW confidence)
- None — all critical claims are verified against official sources

---

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — versions from official Phaser template repo and official Grid Engine install docs
- Architecture: HIGH — project structure from official phaserjs/template-vite-ts; patterns from official docs
- Pitfalls: MEDIUM — Vite asset path pitfall is well-documented community knowledge; Grid Engine TypeScript typing confirmed from install docs; Vercel output dir from official docs

**Research date:** 2026-03-09
**Valid until:** 2026-09-09 (stable ecosystem — Phaser, Vite, Grid Engine release infrequently in breaking ways)
