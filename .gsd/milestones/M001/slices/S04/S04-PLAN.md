# S04: Art Foundation — Real Tilesets

**Goal:** Replace placeholder colored-block tileset with real LimeZu Modern Exteriors 16x16 tiles. Generate the complete Miami overworld map programmatically with real tile IDs.
**Demo:** The overworld renders actual pixel art — real buildings, paths, palm trees, beach, dock, Main Street — not colored blocks.

## Must-Haves

- overworld.json uses 16px tilewidth with 5 LimeZu tilesets
- All 5 tileset PNGs loaded in Boot.ts and wired in Overworld.ts
- Camera zoom = 4 for 16px tiles
- All overworld-map.test.ts assertions GREEN

## Tasks

- [x] **T01: TDD gate + tileset inspection** `est:5min`
  - Update test contract to expect tilewidth:16 and 5 LimeZu tilesets. Write PNG inspection script (inspect-tileset.cjs) producing tileset-catalog.json with RGB tile data.
- [x] **T02: Rewrite generate-map.ts with real GIDs** `est:8min`
  - Rewrite generate-map.ts with 5-tileset GID chain (terrains→beach→buildings→garden→worksite). Regenerate overworld.json so TDD tests turn GREEN.
- [x] **T03: Wire Phaser runtime + human smoke test** `est:15min`
  - Update Boot.ts to load 5 LimeZu PNGs, Overworld.ts to use 5-tileset array with 4x zoom, fix Vinod Khosla NPC position. Human smoke test confirms real tiles visible.

## Files Likely Touched

- `tests/overworld-map.test.ts`
- `scripts/inspect-tileset.cjs`
- `scripts/generate-map.ts`
- `public/assets/maps/overworld.json`
- `src/game/scenes/Boot.ts`
- `src/game/scenes/Overworld.ts`
