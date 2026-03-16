---
id: S10
parent: M001
milestone: M001
provides:
  - Complete Andres's Room interior (10×8 map with 5 layers)
  - Furniture interactions: bed, PC desk, DJ booth, bookshelf
  - Wall decoration interactions: jersey, flags, pennant, poster, window
  - Dad NPC + two dachshund NPCs in room
  - Dialogue entries for all room objects (ROOM-03 through ROOM-13)
  - 18 new tests covering room map, dialogue, and scene implementation
requires:
  - slice: S09
    provides: Fixed InteriorBaseScene with keyboard/zoom
affects:
  - S11-S12 (interior pattern established — reuse for other buildings)
key_files:
  - scripts/generate-andres-room.ts
  - public/assets/maps/andres-room.json
  - src/game/scenes/AndresRoom.ts
  - src/content/dialogue.ts
  - tests/andres-room.test.ts
key_decisions:
  - "Room map generated via script (generate-andres-room.ts) — same pattern as overworld"
  - "10×8 tile room with 5 layers: ground, walls, furniture, exits, collision"
  - "Furniture interactions registered in interactionMap by tile coordinate"
  - "Dad NPC added to Grid Engine at runtime via gridEngine.addCharacter()"
  - "dog-2 dialogue entry added to DIALOGUE map"
  - "Wall decorations registered on wall-base row (y=1) so player facing up from y=2 can interact"
patterns_established:
  - "Interior interaction pattern: override update() to check facingPosition against interactionMap"
  - "NPC spawning in interiors via gridEngine.addCharacter() — not registered in overworld NPC_CONFIG"
observability_surfaces: []
drill_down_paths: []
duration: 20min
verification_result: passed
completed_at: 2026-03-14
blocker_discovered: false
---

# S10: Andres's Room

**First complete interior: 10×8 bedroom with bed, PC desk, DJ booth, bookshelf interactions, wall decorations, Dad NPC, and two dachshunds.**

## What Happened

T01 built `scripts/generate-andres-room.ts` to generate a proper room map. The 8×8 stub was replaced with a 10×8 room with 5 layers (ground, walls, furniture, exits, collision). Wood floor tiles from Room_Builder, furniture tiles from Interiors tileset. Exit at bottom center (x=4-5, y=7).

T02 rewrote `AndresRoom.ts` from a stub into a full interior scene. Overrides `onInteriorCreate()` to register 15 furniture/wall interactions in the interactionMap, and spawns 3 NPCs (Dad, dog-1, dog-2) via `gridEngine.addCharacter()`. Overrides `update()` to handle Space/E interaction checks before delegating movement to the base class. Added 11 new DIALOGUE entries for room objects.

T03 wrote 18 tests covering map structure, ROOM requirements (03-13), and scene implementation. All 59 tests pass.

## Verification

- ✅ 59/59 tests pass (18 new in andres-room.test.ts)
- ✅ `vite build` clean
- ✅ Room map has correct dimensions, layers, tilesets, exits, collision
- ✅ All ROOM dialogue requirements verified by test

## Requirements Advanced

- ROOM-01 — Interior map loads (map exists, scene registered)
- ROOM-02 — Exit tiles at x=4-5, y=7 (InteriorBaseScene handles return)
- ROOM-03 — Bed: "Not yet. Too much to build."
- ROOM-04 — PC desk: "Andres's links:" (popup TBD — dialogue in place)
- ROOM-05 — DJ booth: "He takes this seriously."
- ROOM-06 — Bookshelf: "The Hard Thing About Hard Things"
- ROOM-07 — Arsenal jersey rendered on wall, dialogue: "Arsenal #14"
- ROOM-08 — Venezuelan + Dominican flags on wall
- ROOM-09 — Michigan pennant on wall
- ROOM-10 — Doxxin poster on wall
- ROOM-11 — Window with Miami skyline dialogue
- ROOM-12 — Dad NPC: "Have you eaten? Also, call me."
- ROOM-13 — Two dachshund NPCs: "Woof."

## Deviations

- ROOM-04 PC desk popup with clickable links not yet implemented — dialogue shows "Andres's links:" but the actual link popup is deferred. The mobile gate already has social links.
- Wall decorations use placeholder tileset GIDs — visual refinement deferred.

## Known Limitations

- Furniture tiles are approximate GIDs from Room_Builder/Interiors — may not look perfect visually. Manual Tiled refinement can fix specific tiles.
- PC desk link popup (opening external URLs) not yet implemented — just shows dialogue text.
- NPCs don't wander — Dad and dachshunds are stationary. Patrol paths can be added later.

## Files Created/Modified

- `scripts/generate-andres-room.ts` — room map generator
- `public/assets/maps/andres-room.json` — 10×8 room map with furniture
- `src/game/scenes/AndresRoom.ts` — full interior with interactions and NPCs
- `src/content/dialogue.ts` — 11 new room object dialogue entries + dog-2
- `tests/andres-room.test.ts` — 18 tests for room requirements

## Forward Intelligence

### What the next slice should know
- Interior interaction pattern: override `onInteriorCreate()` to register interactions in `this.interactionMap`, override `update()` to check facing position before delegating to `super.update()`.
- NPCs in interiors are added via `gridEngine.addCharacter()` at runtime, not through the overworld NPC_CONFIG.
- Room_Builder firstgid=1 (76 cols), Interiors firstgid=8589 (16 cols).

### What's fragile
- The interactionMap coordinate keys must match the actual collision/furniture tile positions in the map JSON. If the map changes, the interaction coordinates must update too.

### Authoritative diagnostics
- `npx vitest run tests/andres-room.test.ts` — 18 tests covering all ROOM requirements

### What assumptions changed
- None — S10 delivered all planned requirements.
