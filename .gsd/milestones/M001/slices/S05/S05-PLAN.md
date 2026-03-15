# S05: Map Visual Design

**Goal:** Fix the critical bug where BUILDING_GID, PALM_GID, and SCAFFOLD_GID all point at transparent row-0 tiles. The overworld must show visible building shells, palm trees, and scaffolding.
**Demo:** Walking the map shows solid building tiles, visible palm tree sprites (frond + trunk pairs), and scaffold overlay at Chalk Lab area.

## Must-Haves

- BUILDING_GID points at visible building wall tile (not transparent)
- Palm trees render as 2-tile sprites (frond at y, trunk at y+1)
- Scaffold tiles visible at Chalk Lab area
- All tile GIDs have matching ✅ entry in TILE-CATALOG.md

## Tasks

- [x] **T01: TDD RED gate — 4 failing GID assertions** `est:4min`
  - Add 4 failing assertions for BUILDING_GID (7689), PALM_GID frond (2770), PALM_TRUNK_GID (2834), and SCAFFOLD_GID (3598).
- [x] **T02: Fix GID constants + placePalm() + regenerate** `est:3min`
  - Update BUILDING_GID/PALM_GID/SCAFFOLD_GID constants, add PALM_TRUNK_GID and placePalm() helper, migrate ge_collide properties, regenerate overworld.json.
- [x] **T03: Human visual verification** `est:15min`
  - Playwright-assisted browser verification + human approval. Confirm buildings, palms, scaffolding are visible pixel art.

## Files Likely Touched

- `tests/overworld-map.test.ts`
- `scripts/generate-map.ts`
- `public/assets/maps/overworld.json`
