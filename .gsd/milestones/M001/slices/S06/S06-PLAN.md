# S06: Map Layout Design

**Goal:** Fix building footprints and overlaps, add all missing map zones (tall grass, hidden areas, boardwalk, dock detail), wire the full path network. Every building coordinate locked here is the permanent contract for Phase 4+ interior entrance/exit tile detection.
**Demo:** All buildings have correct non-overlapping footprints. Tall grass zones, east boardwalk, cross-streets, dock welcome zone, and Secret Beach are all walkable. Player can reach every zone on the map.

## Must-Haves

- 6 building footprints corrected with no overlaps
- Tall grass zones at 4 locations (Music Room, Idea Graveyard, Secret Beach entrance, Heights)
- East boardwalk column x=37 fully walkable
- Dock welcome zone extended walkable at y=36
- Secret Beach accessible via palm path

## Tasks

- [x] **T01: TDD RED gate — 9 geometry assertions** `est:57min`
  - Confirm TALL_GRASS_GID (human visual confirm) + write 9 failing test assertions for building footprints, boardwalk, and zone changes.
- [x] **T02: Fix building footprints + NPC coordinates** `est:12min`
  - Fix 6 building footprints in generate-map.ts (Thoven HQ x=12-21, etc.), update NPC coordinates in npcs.ts to match.
- [x] **T03: Add zones + boardwalk + streets + Secret Beach** `est:6min`
  - Add tall grass zones, east boardwalk, cross-streets, dock welcome zone, and Secret Beach. All 9 RED assertions turn GREEN.

## Files Likely Touched

- `tests/overworld-map.test.ts`
- `scripts/generate-map.ts`
- `src/game/config/npcs.ts`
- `public/assets/maps/overworld.json`
