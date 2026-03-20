# S01: React + Vite Scaffold + Tile Renderer

**Goal:** A 50×40 tile grid renders in the browser from TypeScript 2D arrays with camera scrolling, 4x pixel zoom, and LimeZu tileset visuals. No movement yet — just the rendered map proving DOM performance is viable.

**Demo:** Open localhost:5173, see the full Miami overworld rendered as DOM elements with real LimeZu pixel art tiles. Drag or scroll to pan camera. Tiles are crisp at 4x zoom with no blur.

## Must-Haves

- React 19 + Vite + TypeScript project scaffold (replacing Phaser entry point)
- `TileRenderer` component rendering a 2D tile array as positioned DOM elements
- CSS sprite-sheet backgrounds using `background-position` to extract tiles from LimeZu PNGs
- `CameraViewport` component with CSS `transform` scrolling within a fixed viewport
- `OVERWORLD_MAP` constant — full 50×40 tile data as TypeScript 2D arrays (ground, above, collision layers)
- 4x pixel zoom via CSS (`image-rendering: pixelated`, scale transform)
- Visible tile culling — only render tiles within (or near) the viewport for performance
- Smooth camera panning when dragging or using keyboard
- All existing content files preserved (dialogue.ts, npcs.ts, sprites, tilesets)

## Proof Level

- This slice proves: integration (DOM rendering + real tileset art + camera viewport + 50×40 scale)
- Real runtime required: yes (browser verification of rendering and performance)
- Human/UAT required: no (browser tools can verify tile rendering, zoom, and scroll)

## Verification

- `tests/tile-renderer.test.ts` — unit tests for tile-to-CSS mapping, map data structure, visible tile culling logic
- `npm run build` exits 0 (production build succeeds)
- `npx tsc --noEmit` exits 0 (type safety)
- Browser verification: 50×40 grid renders without jank, tiles show LimeZu pixel art, 4x zoom is crisp, camera scrolls

## Observability / Diagnostics

- Runtime signals: console.log tile count rendered per frame (dev mode only)
- Inspection surfaces: React DevTools component tree showing TileRenderer > tile divs
- Failure visibility: blank viewport = tile CSS mapping broken, jank = too many DOM nodes (culling issue)

## Integration Closure

- Upstream surfaces consumed: `public/assets/tilesets/*.png` (LimeZu sprite sheets from M001), `src/content/dialogue.ts`, `src/game/config/npcs.ts`
- New wiring introduced: React app entry point replaces Phaser entry point. New `src/` structure for React components.
- What remains before the milestone is truly usable end-to-end: movement (S02), NPCs (S03), interiors (S04-S05), hidden areas (S06), title/mobile/SEO (S07), polish (S08)

## Tasks

- [x] **T01: React + Vite scaffold with tile data types** `est:30m`
  - Why: Foundation — React app entry point, TypeScript types for tile maps, and test framework setup
  - Files: `src/main.tsx`, `src/App.tsx`, `src/types/map.ts`, `src/maps/overworld.ts`, `tests/tile-renderer.test.ts`, `vitest.config.ts`
  - Do:
    1. Install React 19, react-dom, @types/react, @types/react-dom. Update vite.config.ts for React (add @vitejs/plugin-react).
    2. Create `src/types/map.ts` with `TileId`, `TileLayer` (2D number array), `MapData` (layers: ground, above, collision), and `TilesetConfig` (image path, tile size, columns count, tile-id-to-position mapping).
    3. Create `src/maps/overworld.ts` that defines the full 50×40 `OVERWORLD_MAP` constant. Use the existing `overworld.json` and `generate-map.ts` as reference — translate the 3-layer Tiled map into TypeScript 2D arrays. Ground layer = terrain tile IDs, Above layer = building/tree/decoration tile IDs, Collision layer = 0 (walkable) or 1 (blocked).
    4. Create `src/maps/tilesets.ts` with tileset configs for each LimeZu PNG — image path, tile pixel size (16), columns per sheet, and a helper function `getTileStyle(tilesetConfig, localTileId)` → `{ backgroundImage, backgroundPosition, width, height }`.
    5. Create `src/main.tsx` and `src/App.tsx` as minimal React entry points rendering "Andres World" text (game components come in T02).
    6. Preserve existing `src/content/dialogue.ts` and `src/game/config/npcs.ts` — don't move or modify them.
    7. Write `tests/tile-renderer.test.ts` with tests: MapData has 3 layers of 50×40, getTileStyle returns correct backgroundPosition for known tile IDs, collision layer is all 0 or 1.
  - Verify: `npx vitest run` passes, `npx tsc --noEmit` passes, `npm run dev` shows React app
  - Done when: React app runs, MapData types defined, OVERWORLD_MAP constant exists with correct 50×40 dimensions, tile-to-CSS mapping tested

- [x] **T02: TileRenderer + CameraViewport components** `est:45m`
  - Why: Core rendering — proves DOM tiles work at scale with real LimeZu art
  - Files: `src/components/TileRenderer.tsx`, `src/components/CameraViewport.tsx`, `src/components/GameContainer.tsx`, `src/App.tsx`, `public/style.css`
  - Do:
    1. Create `TileRenderer` component. Takes `MapData` + `TilesetConfig[]` + `viewportRect` (visible tile range). For each tile in the visible range, renders a `<div>` with CSS `background-image` and `background-position` from `getTileStyle()`. Ground layer renders first, Above layer renders on top (position: absolute, same grid position). Each tile div is 16×16px (the zoom is on the parent).
    2. Create `CameraViewport` component. Wraps the tile renderer in a fixed-size viewport div. Uses CSS `transform: translate(x, y) scale(4)` on an inner container to position the camera and zoom. `transform-origin: 0 0`. The viewport clips overflow. Accept a `cameraCenter` prop (tile x, y) to compute the transform offset.
    3. Create `GameContainer` as the top-level game component. For now, set `cameraCenter` to `{x: 25, y: 25}` (center of map). Pass `OVERWORLD_MAP` and tileset configs to the renderer.
    4. Implement visible tile culling in `TileRenderer`: compute which tiles fall within the viewport (plus 2-tile buffer) given the camera position and viewport pixel size. Only render those tiles as DOM elements.
    5. Add `image-rendering: pixelated` to tile divs and the viewport container. Add `will-change: transform` to the scrolling container for GPU compositing.
    6. Wire into `App.tsx` — render `GameContainer`.
    7. Add keyboard-based camera panning (arrow keys move cameraCenter) for testing — this is temporary, replaced by player-follow in S02.
  - Verify: `npm run build` passes, browser shows LimeZu tiles in a scrollable viewport at 4x zoom, tile count stays bounded (~200-400 visible tiles, not 2000)
  - Done when: 50×40 overworld renders with real pixel art, camera pans via keyboard, visible tiles are culled, no scroll jank

- [x] **T03: Map data extraction + visual verification** `est:30m`
  - Why: The OVERWORLD_MAP must faithfully reproduce M001's map — same buildings, paths, palms, ocean, grass zones
  - Files: `src/maps/overworld.ts`, `src/maps/tilesets.ts`, `tests/tile-renderer.test.ts`
  - Do:
    1. Write a script `scripts/extract-map-data.ts` that reads `public/assets/maps/overworld.json` and converts the Tiled JSON layers into the TypeScript 2D array format used by `OVERWORLD_MAP`. For each layer, convert the flat `data[]` array into a 2D array `[row][col]`. For the collision layer, normalize to 0/1.
    2. Run the extraction script and verify the output matches the programmatic OVERWORLD_MAP. Fix any discrepancies.
    3. Verify tileset CSS mapping is correct: for each tileset PNG, confirm `getTileStyle()` returns the right `background-position` for a sample of known tile IDs (grass, path, building wall, palm, water).
    4. Add tests verifying key map features: buildings at known coordinates have non-zero Above tiles, ocean strip x≥42 has water ground tiles, spawn area x=25 y=38 is walkable.
    5. Browser verification: navigate to localhost:5173, visually confirm buildings, palms, ocean, paths, and grass zones render correctly.
  - Verify: extraction script matches overworld.json data, tests pass, browser shows correct map layout
  - Done when: OVERWORLD_MAP data is verified correct against M001's overworld.json, tileset CSS renders real pixel art for all tile types

## Files Likely Touched

- `package.json` — add React deps, update scripts
- `vite.config.ts` — add React plugin
- `src/main.tsx` — React entry point
- `src/App.tsx` — root component
- `src/types/map.ts` — tile/map type definitions
- `src/maps/overworld.ts` — 50×40 map data constant
- `src/maps/tilesets.ts` — tileset CSS configs
- `src/components/TileRenderer.tsx` — tile rendering component
- `src/components/CameraViewport.tsx` — camera/viewport component
- `src/components/GameContainer.tsx` — top-level game container
- `scripts/extract-map-data.ts` — Tiled JSON → TypeScript array converter
- `tests/tile-renderer.test.ts` — map data + rendering tests
- `public/style.css` — pixel rendering CSS
- `index.html` — update to mount React app
