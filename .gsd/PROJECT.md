# Andres World

Pokemon Gen 1/2-style pixel art overworld → andresmartinez.com

## Current State

**M002 complete** — Full React DOM rebuild. 440KB bundle, 230 tests, 19 test files.

### Architecture (M002 — React DOM)
- **Rendering:** DOM divs with CSS `background-position` from LimeZu tilesets, viewport culling
- **Movement:** GridEngineHeadless via `useGridEngine` React hook, `setInterval(50ms)` tick
- **NPCs:** 14 overworld NPCs with dialogue, facing, patrol (John Collison)
- **Dialog:** Pokemon-style React/CSS dialog box with `useDialog` hook
- **Interiors:** 4 rooms (Andres's Room, Thoven HQ, Starbucks, Engineering Lab) via InteriorView
- **Transitions:** `useSceneTransition` with 300ms fade between overworld and interiors
- **Interactions:** Overworld interaction map (signs, buildings, hidden areas, bulletin board)
- **Title:** Press-any-key title screen → game
- **Mobile:** Touch detection gate with static landing + social links
- **SEO:** OG tags, Twitter card, noscript fallback
- **Music:** `useMusic` hook with graceful missing-file handling

### Stack
Vite 6 + React 19 + TypeScript + GridEngineHeadless → Vercel

### Key Directories
- `src/components/` — React components (TileRenderer, CameraViewport, GameContainer, InteriorView, etc.)
- `src/hooks/` — Game system hooks (useGridEngine, useDialog, useSceneTransition, useMusic)
- `src/maps/` — Map data constants (overworld, interiors, tilesets, interactions, collision)
- `src/content/` — Dialogue content
- `src/game/config/` — NPC configs
- `public/assets/` — Tilesets, sprites, maps (Tiled JSON)
- `scripts/` — Map extraction scripts
- `tests/` — 19 test files, 230 tests

### Commands
```bash
npm run dev        # Dev server at :5173
npm run build      # Production build (~440KB)
npx vitest run     # 230 tests
npx tsc --noEmit   # Type check
```

### Legacy
`src/game/` contains the M001 Phaser code — safe to remove now.
