---
id: S06
parent: M001
milestone: M001
provides:
  - Corrected building footprints (Thoven HQ x=12-21, Andres House x=6-9, etc.)
  - Tall grass zones at 4 locations (Music Room, Idea Graveyard, Secret Beach, Heights)
  - East boardwalk column x=37 fully walkable (zero Above/Collision tiles)
  - Secret Beach accessible via palm path at x=38
  - Dock welcome zone extended walkable at y=36
  - Dad NPC at x=10,y=18 in walkway gap between houses
  - Permanent building coordinate contract for Phase 4+ interior entrance/exit detection
requires:
  - slice: S05
    provides: Correct visible tile GIDs for buildings, palms, scaffolding
affects:
  - S07 (Tiled session depends on correct geometry)
  - S10+ (interior scenes depend on building footprint coordinates)
key_files:
  - scripts/generate-map.ts
  - src/game/config/npcs.ts
  - tests/overworld-map.test.ts
key_decisions:
  - "Thoven HQ footprint x=12-21 (not x=10-19) — 2-tile walkway gap at x=10-11"
  - "Dad NPC at x=10,y=18 — walkway gap between Andres's House and Thoven HQ"
  - "East boardwalk column x=37 is sacred — zero Above/Collision for full y=0-39"
  - "Music Room tall grass gap at y=8 only — y=9 blocked to prevent stranding"
  - "Dock welcome zone y=36 extended walkable — landing strip above spawn"
  - "Secret Beach palms at x=38 exclusively — x=37 boardwalk untouched"
patterns_established:
  - "Building footprint coordinates are the permanent contract for interior scenes"
  - "TDD geometry assertions enforce pixel-level map accuracy"
observability_surfaces: []
drill_down_paths: []
duration: 75min
verification_result: passed
completed_at: 2026-03-10
blocker_discovered: false
---
# S06: Map Layout Design

**Fixed all building footprints, added tall grass zones, east boardwalk, cross-streets, dock welcome zone, and Secret Beach — locking the permanent coordinate contract for all future interior scenes.**

## What Happened

Plan 01 established the TDD RED gate: 9 failing assertions covering building footprints, boardwalk, and zone changes. TALL_GRASS_GID=257 confirmed by Andres via tileset-preview.html (human visual confirm workflow).

Plan 02 fixed 6 building footprints in generate-map.ts. Thoven HQ moved to x=12-21 (from x=10-19) to create a 2-tile walkway gap. Updated NPC coordinates in npcs.ts (Dad to x=10,y=18 in the walkway gap). Stale test assertions updated to match new footprints.

Plan 03 added all missing map zones: 4 tall grass locations, east boardwalk at x=37 (fully walkable), west + east cross-streets, dock welcome zone at y=36, and Secret Beach via palm path at x=38. All 9 RED assertions turned GREEN.

## Verification

- 9/9 geometry assertions GREEN
- All NPCs at correct coordinates post-footprint fix
- vite build clean

## Requirements Advanced

- WORLD-06 — distinct zones visible on overworld (tall grass, boardwalk, Secret Beach)
- HIDE-01 through HIDE-05 foundations — geometry for hidden areas in place

## Deviations

None.
