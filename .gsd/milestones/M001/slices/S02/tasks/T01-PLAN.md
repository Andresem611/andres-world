# T01: 02-overworld-map 01

**Slice:** S02 — **Milestone:** M001

## Description

Author the 50×40 Miami-themed Tiled JSON overworld map programmatically and set up the Vitest test framework to verify map structure.

Purpose: The map is the world. Every subsequent phase adds content on top of it. Getting the geography, collision, and zone placement right now prevents expensive rework later.
Output: `public/assets/maps/overworld.json` (complete map data) + `tests/overworld-map.test.ts` (automated structural checks) + `vitest.config.ts` + vitest dev dependency.

## Must-Haves

- [ ] "overworld.json parses as valid JSON and Phaser can load it as a Tiled tilemap"
- [ ] "All 6 zones are spatially represented: dock (south), main street spine, central plaza, west side, east beach strip, heights (north)"
- [ ] "Building shells for every building are placed and marked as blocking tiles"
- [ ] "Ocean tiles cover the east edge (x=42-49) and are blocked (ge_collide:true)"
- [ ] "Palm trees appear in zone-appropriate positions (not generic oaks)"
- [ ] "Under-construction buildings (Chalk Lab, VC Office) have scaffolding tile overlay"

## Files

- `public/assets/maps/overworld.json`
- `tests/overworld-map.test.ts`
- `vitest.config.ts`
- `package.json`
