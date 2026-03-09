---
phase: 02-overworld-map
plan: 01
subsystem: testing
tags: [vitest, tiled, phaser, tilemap, json, grid-engine]

# Dependency graph
requires:
  - phase: 01-infrastructure
    provides: Vite + TypeScript + Phaser 3 build pipeline and public/assets/ path convention

provides:
  - 50x40 Tiled JSON overworld map with Ground/Above/Collision layers
  - Vitest test framework with 8 structural map tests
  - Placeholder tileset PNG at public/assets/tilesets/modern-exteriors-32.png
  - tileset-catalog.txt documenting localTileId to terrain category mapping
  - scripts/generate-map.ts for reproducible map regeneration

affects:
  - 02-overworld-map (plan 02 loads this map in BootScene via phaserMapKey "overworld")
  - 03-andres-room (interior map builds on same layer conventions)
  - 09-miami-art-assets (replaces placeholder PNG, reruns generate-map.ts with real GIDs)

# Tech tracking
tech-stack:
  added: [vitest@4.0.18, tsx (npx, map generation only)]
  patterns:
    - Tiled JSON map authored programmatically via Node.js script (not Tiled GUI)
    - Three-layer Tiled convention: Ground (base terrain) / Above (buildings + trees) / Collision (invisible blockers)
    - ge_collide:true property on tileset tiles drives Grid Engine collision at runtime
    - GID = firstgid(1) + localTileId (0-based indexing convention locked)

key-files:
  created:
    - public/assets/maps/overworld.json
    - public/assets/tilesets/modern-exteriors-32.png
    - public/assets/maps/tileset-catalog.txt
    - tests/overworld-map.test.ts
    - vitest.config.ts
    - scripts/generate-map.ts
  modified:
    - package.json (added test/test:watch scripts, vitest devDependency)

key-decisions:
  - "Placeholder tileset PNG with color-coded rows per terrain type — replaced in Phase 9 with LimeZu Modern Exteriors"
  - "Map authored programmatically (scripts/generate-map.ts) not via Tiled GUI — enables reproducible regeneration when tileset swapped"
  - "Collision layer uses BUILDING_WALL GID as the blocking marker — any non-zero GID in Collision layer blocks Grid Engine movement"
  - "Palm trees at x=21 and x=29 along main street y=5-35 are blocked (Above layer + Collision layer) matching design doc layout"

patterns-established:
  - "generate-map.ts: all zone fills use fillRect() helper; single-tile placements use setTile() — maintain this for future map edits"
  - "Tileset localTileId constants defined at top of generate-map.ts — update those constants when Phase 9 tileset lands, rerun script"
  - "Test file imports map JSON directly (vitest resolves JSON imports natively) — no build step needed for map tests"

requirements-completed: [WORLD-01, WORLD-05, WORLD-06, WORLD-07, WORLD-08]

# Metrics
duration: 4min
completed: 2026-03-09
---

# Phase 2 Plan 1: Overworld Map + Vitest Setup Summary

**50x40 Tiled JSON overworld map with 13 building shells, Miami zone geography, Vitest test framework, and 8 passing structural tests**

## Performance

- **Duration:** 4 min
- **Started:** 2026-03-09T17:39:29Z
- **Completed:** 2026-03-09T17:43:29Z
- **Tasks:** 2
- **Files modified:** 7

## Accomplishments

- Vitest installed and wired into npm test scripts; 8 map structure tests written then driven GREEN by map generation
- Complete overworld.json generated programmatically: 50x40 map, 3 layers (Ground/Above/Collision), 2000 tiles each, correct Tiled JSON schema
- All 13 building shells placed at design-doc coordinates with correct zone geography (dock south, ocean east, heights north)
- Chalk Lab and VC Office have scaffolding overlay tiles marking under-construction state
- Ocean strip x=42-49 fully blocked; dock spawn x=24-26 y=37-39 explicitly walkable
- Placeholder tileset PNG generated in-process (no external deps) with color-coded rows per terrain category
- tileset-catalog.txt documents every localTileId with replacement instructions for Phase 9

## Task Commits

1. **Task 1: Set up Vitest and create map structure tests** - `8b26e61` (test)
2. **Task 2: Author overworld.json — complete 50x40 Miami map** - `362350d` (feat)

## Files Created/Modified

- `public/assets/maps/overworld.json` - Complete 50x40 Tiled JSON map with all zones and building shells
- `public/assets/tilesets/modern-exteriors-32.png` - Placeholder tileset PNG (16 cols x 9 rows, 512x288px)
- `public/assets/maps/tileset-catalog.txt` - LocalTileId to terrain category reference, GID mapping table
- `tests/overworld-map.test.ts` - 8 structural tests: dimensions, layer names, data length, walkable paths, ocean blocking, dock spawn, tileset name, ge_collide definitions
- `vitest.config.ts` - Vitest config with node environment, tests/ glob
- `scripts/generate-map.ts` - Reproducible map generation script (fillRect/setTile helpers, GID constants, PNG generation, validation)
- `package.json` - Added test/test:watch scripts, vitest devDependency

## Decisions Made

- **Placeholder tileset over itch.io download:** LimeZu Modern Exteriors requires auth/purchase. Generated a synthetic placeholder PNG with color-coded rows (green=grass, blue=water, tan=buildings, etc.) to keep all GID logic working and tests passing. Phase 9 plan replaces it by updating localTileId constants in generate-map.ts and rerunning the script.
- **Programmatic map authoring:** Used a Node.js script instead of Tiled GUI. This enables reproducible regeneration when tileset GIDs change, and allows code review of map layout decisions. Downside: no visual preview until Phase 2 plan 2 wires up Phaser loading.
- **Collision layer uses any non-zero GID:** Chose BUILDING_WALL GID as the collision marker for all blocked tiles (buildings, ocean, palm trees). Grid Engine only checks ge_collide property on the tile definition — the specific GID in the Collision layer just needs to resolve to a tile with ge_collide:true.

## Deviations from Plan

None — plan executed exactly as written. The itch.io tileset download was noted as optional ("or use the pack if already available") and the placeholder approach fulfills all test criteria and interface contracts.

## Issues Encountered

None. The `tsx` package was installed on-demand via `npx tsx` for the generation script (no persistent install needed).

## User Setup Required

None — no external service configuration required.

## Next Phase Readiness

- `public/assets/maps/overworld.json` ready for Phaser BootScene to load via `this.load.tilemapTiledJSON("overworld", "assets/maps/overworld.json")`
- Tileset name `"modern-exteriors"` locked — matches `addTilesetImage` first arg in Plan 02-02
- `npm test` runs all 8 structural tests, provides regression coverage for future map edits
- Phase 9 tileset swap: update localTileId constants in `scripts/generate-map.ts`, run `npx tsx scripts/generate-map.ts`, commit

---
*Phase: 02-overworld-map*
*Completed: 2026-03-09*
