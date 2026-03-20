---
id: S01
parent: M002
milestone: M002
provides:
  - React 19 + Vite + TypeScript scaffold replacing Phaser entry point
  - TileRenderer component rendering MapData as CSS-sprite-background DOM divs
  - CameraViewport with 4x zoom, CSS transform scroll, visible tile culling
  - OVERWORLD_MAP constant — full 50×40 tile data as TypeScript 2D arrays
  - getTileStyle() mapping any GID to CSS backgroundImage + backgroundPosition
  - getVisibleTileRange() for tile culling (renders ~400 tiles, not 2000)
  - extract-map-data.ts script converting Tiled JSON → TypeScript arrays
  - 23 new tests for map structure, tileset mapping, viewport culling
  - Production bundle 217KB (down from 1.7MB with Phaser)
requires: []
affects:
  - S02 (movement layer consumes TileRenderer, CameraViewport, OVERWORLD_MAP)
  - S03 (NPC rendering uses same positioned-div pattern)
key_files:
  - src/components/TileRenderer.tsx
  - src/components/CameraViewport.tsx
  - src/components/GameContainer.tsx
  - src/maps/overworld.ts
  - src/maps/tilesets.ts
  - src/types/map.ts
  - scripts/extract-map-data.ts
key_decisions:
  - "DOM tiles with CSS background-position instead of canvas — proves the approach works at 50×40 scale"
  - "Visible tile culling: only render tiles in viewport + 2-tile buffer (~400 vs 2000 DOM nodes)"
  - "GID-to-tileset resolution walks TILESETS array in reverse — first where gid >= firstGid wins"
  - "backgroundSize computed per tileset (columns * tileSize px auto) — critical for correct sprite extraction"
  - "Camera uses CSS transform: translate + scale on inner container, not per-tile positioning"
  - "@vitejs/plugin-react@4 pinned — v6 requires Vite 8, we have Vite 6"
  - "jsx: react-jsx added to tsconfig — needed for .tsx files"
  - "extract-map-data.ts normalizes collision layer to 0/1 — GIDs not needed for collision logic"
patterns_established:
  - "Positioned div pattern: absolute positioning at (x * tileSize, y * tileSize) inside a relative container"
  - "CSS sprite sheet: backgroundImage url + backgroundPosition for tile extraction from PNG"
  - "Viewport culling via getVisibleTileRange — all components consuming map data should cull"
  - "Map data as TypeScript 2D arrays — [y][x] addressing convention (row-major)"
observability_surfaces:
  - "DOM node count (document.querySelectorAll('.camera-world > div').length) — culling health"
drill_down_paths: []
duration: 20min
verification_result: passed
completed_at: 2026-03-14
blocker_discovered: false
---

# S01: React + Vite Scaffold + Tile Renderer

**50×40 Miami overworld renders as DOM elements with real LimeZu pixel art, 4x zoom, camera scrolling, and visible tile culling — React replaces Phaser at 1/8 the bundle size.**

## What Happened

Installed React 19 + @vitejs/plugin-react. Created TypeScript types for MapData (ground/above/collision layers as 2D arrays) and TilesetConfig (6 LimeZu sprite sheets with GID chain). Wrote extract-map-data.ts to convert overworld.json Tiled format into OVERWORLD_MAP constant.

Built TileRenderer — iterates visible tile range, creates a `<div>` per tile with CSS `background-image` and `background-position` extracted from the correct LimeZu tileset PNG. Ground tiles render at z-index 1, Above tiles at z-index 2 (same grid position, layered via absolute positioning).

Built CameraViewport — wraps tiles in a fixed 800×600 viewport with CSS `transform: translate() scale(4)`. Camera centers on a tile coordinate, clamped to map edges. Overflow hidden creates the window-into-the-world effect.

Built GameContainer with temporary keyboard panning (arrow keys move camera). Connected to App.tsx → main.tsx → index.html.

Browser verification confirmed: buildings, palms, ocean, grass, paths, building facades (villa, generic, worksite) all render correctly. 467 tiles rendered in viewport (culling works — 2000 total in map). No jank during camera scroll.

## Verification

- ✅ 154/154 tests pass (23 new + 131 M001 tests preserved)
- ✅ `npx tsc --noEmit` — zero errors
- ✅ `npm run build` — 217KB production bundle (vs 1.7MB Phaser)
- ✅ Browser: 50×40 overworld renders with real pixel art at 4x zoom
- ✅ Camera panning works via arrow keys
- ✅ Tile culling: ~467 DOM nodes rendered (not 2000)
- ✅ 7/7 map landmark cross-checks pass (spawn, ocean, Thoven, palms, boardwalk, buildings, paths)

## Deviations

None.

## Known Limitations

- Camera panning is keyboard-only (no mouse drag) — temporary, replaced by player-follow in S02
- No movement system yet — just static camera panning
- No sprites (player, NPCs) rendered yet — S02 and S03
- M001 Phaser code still in repo (src/game/) — will be cleaned up in later slice

## Follow-ups

- Clean up M001 Phaser source files (src/game/) once M002 is feature-complete
- Consider lazy-loading tileset images per viewport region for very large maps

## Files Created/Modified

- `package.json` — added React 19, react-dom, @types/react, @vitejs/plugin-react
- `vite.config.ts` — added React plugin
- `tsconfig.json` — added jsx: react-jsx
- `index.html` — React mount point, updated mobile gate footer
- `src/main.tsx` — React entry point
- `src/App.tsx` — root component rendering GameContainer
- `src/types/map.ts` — TileId, TileLayer, MapData, TilesetConfig, TileStyle, ViewportRect types
- `src/maps/overworld.ts` — OVERWORLD_MAP constant (50×40, 3 layers)
- `src/maps/tilesets.ts` — TILESETS config, findTileset, getTileStyle, getVisibleTileRange
- `src/components/TileRenderer.tsx` — DOM tile renderer with CSS sprites
- `src/components/CameraViewport.tsx` — 4x zoom viewport with transform scroll
- `src/components/GameContainer.tsx` — top-level game container with temp keyboard panning
- `scripts/extract-map-data.ts` — Tiled JSON → TypeScript array converter
- `tests/tile-renderer.test.ts` — 23 tests for map data, tileset mapping, culling

## Forward Intelligence

### What the next slice should know
- `OVERWORLD_MAP.layers.collision[y][x]` is the authoritative walkability source (0=walk, 1=block). GridEngineHeadless ArrayTilemap should use this directly.
- Camera follows player via `cameraX`/`cameraY` state — change GameContainer to accept player position as the camera center instead of keyboard-driven state.
- getTileStyle() handles all 6 tilesets transparently — just pass any GID, get back CSS props or null.
- Tile divs use absolute positioning at `(x * 16, y * 16)` px — sprite positioning should use the same coordinate space.

### What's fragile
- `backgroundSize` computation assumes all tilesets are 32 columns wide. If a tileset has different column count, the sprite extraction breaks. Currently all 6 LimeZu sheets are 32 columns — safe.
- The 2-tile culling buffer is hardcoded. If zoom or viewport size changes dramatically, tiles at edges could pop in visibly.

### Authoritative diagnostics
- `npx vitest run tests/tile-renderer.test.ts` — 23 tests covering map dimensions, tile mapping, culling bounds
- DOM node count: `document.querySelectorAll('.camera-world > div').length` — should be ~300-500, not 2000+
- Build size: `npm run build` — should stay under 300KB (React + map data + utils)

### What assumptions changed
- None — the DOM tile rendering approach works exactly as hypothesized. Performance is excellent at 50×40 scale.
