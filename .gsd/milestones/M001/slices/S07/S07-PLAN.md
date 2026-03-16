# S07: Tiled Visual Map Design Pass

**Goal:** Replace flat BUILDING_GID placeholder blocks with multi-tile building facades using Tiled GUI. Transition map ownership from generate-map.ts to Tiled. End with generate-map.ts retired.
**Demo:** Buildings have real multi-tile facades, ground/water has visual variety, overworld.tmx is the source of truth for the map.

## Must-Haves

- generate-map.ts retired with RETIRED warning banner
- overworld-map.test.ts deleted (programmatic GID assertions invalid)
- No flat BUILDING_GID=7689 blocks in Above layer

## Tasks

- [x] **T01: Code prep — retire generate-map.ts** `est:2min`
  - Add RETIRED banner to generate-map.ts, delete overworld-map.test.ts, verify baseline integrity.
- [x] **T02: Automated facade enhancement** `est:15min`
  - Script (enhance-map.ts) replaced all BUILDING_GID=7689 blocks with multi-tile facades. Added villas tileset. Ground texture variety added.
- [x] **T03: Post-enhancement code update + verify** `est:5min`
  - Updated Boot.ts/Overworld.ts for villas tileset. All automated checks pass. Build clean.

## Files Likely Touched

- `scripts/generate-map.ts`
- `tests/overworld-map.test.ts`
- `public/assets/maps/overworld.json`
- `public/assets/maps/overworld.tmx`
- `src/game/scenes/Boot.ts`
- `src/game/scenes/Overworld.ts`
