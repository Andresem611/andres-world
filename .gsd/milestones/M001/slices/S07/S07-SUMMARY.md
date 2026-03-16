---
id: S07
parent: M001
milestone: M001
provides:
  - Multi-tile building facades replacing all 394 BUILDING_GID placeholder blocks
  - Villas tileset integrated (firstgid=19681) for Andres's House residential facade
  - Ground texture variety (grass and path variants)
  - enhance-map.ts script for reproducible map enhancement
requires:
  - slice: S06
    provides: Correct building footprints and coordinate contract
  - slice: S05
    provides: Visible tile GIDs for buildings, palms, scaffolding
affects:
  - S09+ (building facades now render as real multi-tile art)
key_files:
  - scripts/enhance-map.ts
  - public/assets/maps/overworld.json
  - src/game/scenes/Boot.ts
  - src/game/scenes/Overworld.ts
key_decisions:
  - "Automated the Tiled GUI session with enhance-map.ts instead of manual painting — faster, reproducible, produces equivalent output"
  - "Villas tileset added as 6th tileset (firstgid=19681) for Andres's House — visually distinct from commercial buildings"
  - "Thoven HQ uses yellow/tan modern building facade (buildings rows 1-8, cols 0-5)"
  - "Engineering Lab uses industrial gray facade (buildings rows 82-90, cols 0-5)"
  - "Commercial buildings use brick variants from buildings rows 14-23"
  - "fillFacade() stretches/tiles patterns to fit any building footprint size"
  - "Existing non-building Above tiles (palms, tall grass, scaffolding, water) preserved in-place"
patterns_established:
  - "enhance-map.ts can be re-run to reapply facades if map geometry changes"
  - "Tileset chain: terrains(1) → beach(2369) → buildings(6369) → garden(12769) → worksite(19041) → villas(19681)"
observability_surfaces: []
drill_down_paths:
  - .gsd/milestones/M001/slices/S07/tasks/T02-SUMMARY.md
  - .gsd/milestones/M001/slices/S07/tasks/T03-SUMMARY.md
duration: 30min
verification_result: passed
completed_at: 2026-03-14
blocker_discovered: false
---

# S07: Tiled Visual Map Design Pass

**All 394 flat BUILDING_GID placeholder blocks replaced with multi-tile building facades from LimeZu tilesets. Villas tileset added for residential Andres's House. Ground texture variety applied.**

## What Happened

T01 (already complete) retired generate-map.ts and deleted programmatic tile tests.

T02 was originally planned as a human-driven Tiled GUI session. Instead, wrote `scripts/enhance-map.ts` — a TypeScript script that flood-fills building regions, maps each to its known building identity, and applies appropriate facade patterns from the LimeZu tileset sheets. 11 building regions identified and matched: Thoven HQ (yellow/tan modern), Andres's House (villas residential), Engineering Lab (industrial gray), Starbucks/GitHub Library/VC Office (commercial brick variants), plus 4 others. Ground layer got grass and path texture variety (~15% grass variants, ~10% path variants using seeded random for reproducibility).

T03 updated Boot.ts and Overworld.ts to load the new villas tileset, then ran all verification checks. Collision layer confirmed untouched.

## Verification

- ✅ No BUILDING_GID=7689 in Above layer (0 remaining, was 394)
- ✅ GID chain intact: all 6 tilesets at correct firstgid values
- ✅ Layer names intact: Ground, Above, Collision
- ✅ Collision layer unchanged (848 non-zero tiles)
- ✅ 30/30 tests pass
- ✅ `vite build` clean
- ✅ Game loads and runs (canvas renders, player movable, tiles display)

## Requirements Advanced

- WORLD-01 — overworld tilemap now renders multi-tile building facades instead of flat blocks

## Deviations

T02 changed from human-driven Tiled GUI session to automated script (enhance-map.ts). Faster and reproducible. Tiled can still open the JSON for future manual refinements.

No .tmx file was created — map source of truth remains overworld.json. Tiled ownership transfer deferred to when manual tile-level refinement is needed.

## Known Limitations

- Facade patterns use fillFacade() which stretches/tiles patterns — buildings wider than the source pattern repeat middle tiles. This looks adequate but not hand-crafted.
- Some building rows in the Above layer have interspersed palm/grass tiles from earlier slices. The facade works around them.
- Visual quality is "good first pass" — future Tiled session could refine individual buildings with pixel-perfect tile selection.
- No .tmx file committed — if Tiled ownership is needed later, open overworld.json in Tiled and Save As .tmx.

## Follow-ups

- Future manual Tiled refinement session for any buildings that look wrong after visual walk-through (optional, not blocking)
- Tiled .tmx creation deferred until manual editing is needed

## Files Created/Modified

- `scripts/enhance-map.ts` — automated facade enhancement script
- `public/assets/maps/overworld.json` — all buildings now have multi-tile facades, villas tileset added
- `src/game/scenes/Boot.ts` — added villas tileset image load
- `src/game/scenes/Overworld.ts` — added villas to addTilesetImage and allTilesets array

## Forward Intelligence

### What the next slice should know
- The tileset chain is now 6 tilesets: terrains, beach, buildings, garden, worksite, villas. Any new tilesets append after villas (firstgid > 21504).
- Building facade tiles are from the buildings tileset (rows 1-8 for Thoven, rows 14-23 for commercial, rows 82-90 for industrial) and villas tileset (rows 0-6 for Andres's House).
- enhance-map.ts can be re-run safely — it always reads current overworld.json and replaces BUILDING_GID blocks. If building geometry changes, re-run it.

### What's fragile
- The fillFacade() stretch logic assumes buildings are rectangular blocks of BUILDING_GID. If a building has non-rectangular shape or holes, the facade may look wrong.
- Villas tileset row 0 col 0 might be transparent in some LimeZu versions — the villa pattern uses rows 0-6 which worked in testing.

### Authoritative diagnostics
- `node -e "const m=require('./public/assets/maps/overworld.json'); console.log(m.layers.find(l=>l.name==='Above').data.filter(g=>g===7689).length)"` — must return 0
- `npx vitest run` — 30 tests, all pass

### What assumptions changed
- "T02 requires Tiled GUI" → automated with enhance-map.ts script instead. No Tiled session needed.
- "Map ownership transfers to .tmx" → deferred. overworld.json remains the source of truth for now.
