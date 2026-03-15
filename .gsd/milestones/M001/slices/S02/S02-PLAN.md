# S02: Overworld Map

**Goal:** Author the 50×40 Miami-themed Tiled JSON overworld map programmatically and set up the Vitest test framework to verify map structure.
**Demo:** Author the 50×40 Miami-themed Tiled JSON overworld map programmatically and set up the Vitest test framework to verify map structure.

## Must-Haves


## Tasks

- [x] **T01: 02-overworld-map 01** `est:4min`
  - Author the 50×40 Miami-themed Tiled JSON overworld map programmatically and set up the Vitest test framework to verify map structure.

Purpose: The map is the world. Every subsequent phase adds content on top of it. Getting the geography, collision, and zone placement right now prevents expensive rework later.
Output: `public/assets/maps/overworld.json` (complete map data) + `tests/overworld-map.test.ts` (automated structural checks) + `vitest.config.ts` + vitest dev dependency.
- [x] **T02: 02-overworld-map 02** `est:3min`
  - Transform BootScene into an asset preloader, create OverworldScene with Grid Engine movement and camera, place the placeholder character sprite, and wire everything into main.ts.

Purpose: This is the playable layer — keyboard input, grid movement, camera tracking, and character animation all live here. Once Plan 02-01 (map JSON) and this plan are both complete, Plan 02-03 can wire them together for the full playable world.
Output: `src/game/scenes/Overworld.ts` (full scene), updated `Boot.ts` (preloader), updated `main.ts` (scene registration), `public/assets/sprites/character-placeholder.png`.
- [x] **T03: 02-overworld-map 03** `est:2min`
  - Full-stack smoke test: verify the complete Phase 2 system works end-to-end in a browser. The map (Plan 02-01) and scene code (Plan 02-02) are built independently — this plan confirms they integrate correctly and the world is playable.

Purpose: Human verification is the only way to confirm pixel art looks right, movement feels like Pokemon, collision is accurate across the map, and the world reads as Miami.
Output: Phase 2 declared complete. Human confirms playability.

## Files Likely Touched

- `public/assets/maps/overworld.json`
- `tests/overworld-map.test.ts`
- `vitest.config.ts`
- `package.json`
- `src/game/scenes/Boot.ts`
- `src/game/scenes/Overworld.ts`
- `src/game/main.ts`
- `public/assets/sprites/character-placeholder.png`
