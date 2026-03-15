---
id: T02
parent: S03
milestone: M001
provides:
  - src/game/config/npcs.ts with NPC_CONFIG array (14 entries) and NpcDefinition/PatrolNpcDefinition types
  - 15 NPC placeholder PNGs in public/assets/sprites/npc-*.png
  - src/game/scenes/InteriorStub.ts placeholder interior scene
  - InteriorStubScene registered in main.ts scene array
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
# T02: 03-interaction-npc-system 02

**# Phase 3 Plan 02: NPC Config + Sprites + InteriorStub Summary**

## What Happened

# Phase 3 Plan 02: NPC Config + Sprites + InteriorStub Summary

**14-entry NPC TypeScript config with exact design-doc dialogue, 15 placeholder PNG sprites, and InteriorStub scene registered in Phaser scene array**

## Performance

- **Duration:** 5 min
- **Started:** 2026-03-09T20:44:31Z
- **Completed:** 2026-03-09T20:49:00Z
- **Tasks:** 2 (1 TDD, 1 auto)
- **Files modified:** 19

## Accomplishments
- All 5 npc-config.test.ts tests (NPC-01 through NPC-05) pass GREEN
- 14 NPC entries with exact quotes from design doc — no placeholder dialogue, no softening
- john-collison configured as patrol NPC with 20-step north/south patrolPath on Main Street
- 15 placeholder PNGs generated (32x32, solid color + 2px border) distinguishable per NPC
- InteriorStub scene handles building transitions with SPACE/E return — registered in main.ts
- TypeScript build passes with no errors

## Task Commits

Each task was committed atomically:

1. **Task 1: NPC config file with all 14 entries** - `a6ae032` (feat)
2. **Task 2: NPC placeholder sprites + InteriorStub scene + main.ts registration** - `d31a7bc` (feat)

## Files Created/Modified
- `src/game/config/npcs.ts` - NPC_CONFIG array (14 entries), NpcDefinition and PatrolNpcDefinition interfaces
- `src/game/scenes/InteriorStub.ts` - Placeholder interior scene, returns to Overworld on SPACE/E
- `scripts/generate-npc-sprites.ts` - Programmatic PNG generator for 15 NPC sprites
- `src/game/main.ts` - Added InteriorStubScene import and scene array registration
- `public/assets/sprites/npc-*.png` (15 files) - 32x32 solid color placeholder sprites

## Decisions Made
- 14 NPC_CONFIG entries (not 15) — dog-2 gets a PNG sprite but a config entry would exceed the test's exact count constraint. dog-2 will be placed in Phase 4's interior scene.
- `PatrolNpcDefinition` extends `NpcDefinition` with `collides: false` as a typed field — OverworldScene (Plan 04) can check `npc.collides` statically instead of casting.
- PNG sprites use 2px dark border (#202020) for better visual separation on any tile background.

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

None.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness
- Plan 03 (DialogBox implementation) can now import `splitIntoPages` from DialogBox.ts — the dialog-box.test.ts tests will go GREEN
- Plan 04 (OverworldScene NPC wiring) can import `NPC_CONFIG` from `src/game/config/npcs.ts` and iterate to spawn sprites + register Grid Engine characters
- `InteriorStubScene` is registered and ready — Plan 04 just needs to call `scene.start('InteriorStub', {buildingKey, returnPos})` at building entrances
- All sprite keys in NPC_CONFIG match the `npc-{id}` pattern that Boot.ts will use with `this.load.image()`

## Self-Check: PASSED

- `src/game/config/npcs.ts` — FOUND
- `src/game/scenes/InteriorStub.ts` — FOUND
- `scripts/generate-npc-sprites.ts` — FOUND
- `public/assets/sprites/npc-*.png` (15 files) — FOUND (confirmed by glob)
- `src/game/main.ts` imports InteriorStubScene and registers in scene array — FOUND
- Commits a6ae032 and d31a7bc — present in git log

---
*Phase: 03-interaction-npc-system*
*Completed: 2026-03-09*
