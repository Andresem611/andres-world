---
id: T04
parent: S03
milestone: M001
provides:
  - Boot.ts preloads 15 NPC sprite images using npc-{id} key pattern
  - OverworldScene interaction system: Space/E detection (JustDown), interactionMap, NPC spawn + Grid Engine registration
  - handleInteraction() dispatcher routing npc/sign/building/under_construction payloads
  - Movement locked during dialog; resumes on close
  - Scene transition to InteriorStub for finished buildings
  - Under-construction popup for scaffolded buildings
requires: []
affects: []
key_files: []
key_decisions: []
patterns_established: []
observability_surfaces: []
drill_down_paths: []
duration: 5min
verification_result: passed
completed_at: 2026-03-09
blocker_discovered: false
---
# T04: 03-interaction-npc-system 04

**# Phase 3 Plan 04: Interaction System + NPC Spawn Summary**

## What Happened

# Phase 3 Plan 04: Interaction System + NPC Spawn Summary

**Full Space/E interaction system wired into OverworldScene: 14 NPCs visible on map, dialog routing for NPC/sign/building/under-construction, movement locked during dialog, scene transition to InteriorStub**

## Performance

- **Duration:** ~5 min
- **Started:** 2026-03-09T20:50:19Z
- **Completed:** 2026-03-09T20:55:00Z
- **Tasks:** 2
- **Files modified:** 3

## Accomplishments
- Boot.ts now preloads 15 NPC PNG sprites (14 NPCs + dog-2) using the npc-{id} key pattern
- All 14 NPCs spawned as Phaser sprites and registered with Grid Engine (collides:false, no walk animation)
- interactionMap built in create() with O(1) tile coordinate lookup for 14 NPCs + 2 building entrances + 2 under-construction + 1 welcome sign
- update() uses JustDown for Space/E — no more every-frame dialog skip; movement completely locked while dialogOpen=true
- handleInteraction() routes all 4 payload types: NPC turns to face player + dialog, sign dialog, building scene.start("InteriorStub"), under-construction popup

## Task Commits

Each task was committed atomically:

1. **Task 1: Boot.ts — preload all NPC sprites** - `61a055e` (feat)
2. **Task 2: OverworldScene — interaction system, NPC spawn, facing-tile dispatch** - `c71f96f` (feat)

## Files Created/Modified
- `src/game/scenes/Boot.ts` - Added 15 NPC sprite preloads in preload()
- `src/game/scenes/Overworld.ts` - Full interaction system: new fields, NPC spawn, interactionMap, updated update(), handleInteraction()
- `src/game/ui/DialogBox.ts` - Fixed InteractionPayload field names (npcId→id, sceneKey→key, added returnPos to building type)

## Decisions Made
- Used `npc.startPosition.x / .y` instead of `npc.tileX / .y` — NPC_CONFIG actual data shape uses `startPosition`, not separate tile fields as the plan template assumed
- Fixed InteractionPayload field mismatch in DialogBox.ts (auto-detected during implementation — tests use `id` and `key`)
- Set `collides: false` on all 14 NPCs — player walks through them; patrol logic deferred to Plan 05

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] InteractionPayload field names corrected in DialogBox.ts**
- **Found during:** Task 2 (OverworldScene interaction wiring)
- **Issue:** DialogBox.ts had `npcId` (not `id`) and `sceneKey` (not `key`) and no `returnPos` on building type — mismatched what tests and plan's interactionMap code expected
- **Fix:** Updated InteractionPayload union in DialogBox.ts: `npcId→id`, `sceneKey→key`, added `returnPos: { x: number; y: number }` to building variant
- **Files modified:** `src/game/ui/DialogBox.ts`
- **Verification:** All 19 tests pass (including interaction-router.test.ts INTER-01/02/03)
- **Committed in:** `c71f96f` (Task 2 commit)

**2. [Rule 1 - Bug] NPC_CONFIG uses startPosition.x/y — plan template referenced tileX/tileY**
- **Found during:** Task 2 (interactionMap registration loop)
- **Issue:** Plan template code used `npc.tileX` and `npc.tileY` but actual NPC_CONFIG uses `npc.startPosition.x` and `npc.startPosition.y`
- **Fix:** Used `npc.startPosition.x` / `npc.startPosition.y` in interactionMap registration and gridEngine.create() characters array
- **Files modified:** `src/game/scenes/Overworld.ts`
- **Verification:** Build passes, all tests green
- **Committed in:** `c71f96f` (Task 2 commit)

---

**Total deviations:** 2 auto-fixed (both Rule 1 - data shape mismatches between plan template and actual implementation)
**Impact on plan:** Both auto-fixes essential for correctness. No scope creep.

## Issues Encountered
None beyond the two auto-fixed field name mismatches above.

## Next Phase Readiness
- Plan 05 (John Collison patrol) can wire his back-and-forth movement — NPC already spawned and registered in Grid Engine
- Plan 05 and any interior scene (AndresRoom, ThovenHQ) can receive returnPos data from the building interaction
- All 19 tests green, build clean

---
*Phase: 03-interaction-npc-system*
*Completed: 2026-03-09*
