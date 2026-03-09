---
phase: 03-interaction-npc-system
plan: 02
subsystem: npc
tags: [npc, typescript, png, phaser, grid-engine, sprites, interior]

# Dependency graph
requires:
  - phase: 03-interaction-npc-system
    provides: Wave 0 test scaffolds (npc-config.test.ts in RED state)
  - phase: 02-overworld-map
    provides: overworld map, programmatic PNG generation pattern
provides:
  - src/game/config/npcs.ts with NPC_CONFIG array (14 entries) and NpcDefinition/PatrolNpcDefinition types
  - 15 NPC placeholder PNGs in public/assets/sprites/npc-*.png
  - src/game/scenes/InteriorStub.ts placeholder interior scene
  - InteriorStubScene registered in main.ts scene array
affects: [03-03, 03-04, 03-05]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "NPC config as TypeScript array — OverworldScene imports and iterates NPC_CONFIG to spawn sprites"
    - "PatrolNpcDefinition extends NpcDefinition with patrol:true and collides:false so OverworldScene can query collides field"
    - "Same programmatic PNG encoder pattern from Phase 2 reused for 15 NPC placeholder sprites"
    - "InteriorStub scene accepts {returnPos, buildingKey} data payload and returns to Overworld on SPACE or E"

key-files:
  created:
    - src/game/config/npcs.ts
    - src/game/scenes/InteriorStub.ts
    - scripts/generate-npc-sprites.ts
    - public/assets/sprites/npc-paul-graham.png
    - public/assets/sprites/npc-marc-andreessen.png
    - public/assets/sprites/npc-brian-chesky.png
    - public/assets/sprites/npc-tobi-lutke.png
    - public/assets/sprites/npc-dalton-caldwell.png
    - public/assets/sprites/npc-ben-horowitz.png
    - public/assets/sprites/npc-vinod-khosla.png
    - public/assets/sprites/npc-dario-amodei.png
    - public/assets/sprites/npc-michael-seibel.png
    - public/assets/sprites/npc-patrick-collison.png
    - public/assets/sprites/npc-john-collison.png
    - public/assets/sprites/npc-keri.png
    - public/assets/sprites/npc-dad.png
    - public/assets/sprites/npc-dog-1.png
    - public/assets/sprites/npc-dog-2.png
  modified:
    - src/game/main.ts

key-decisions:
  - "14 NPC_CONFIG entries = 12 founder NPCs + keri + dad + dog-1; dog-2 gets a PNG sprite but occupies an interior slot (Phase 4). This resolves the 14-entry test constraint vs. the 15-sprite plan."
  - "PatrolNpcDefinition has collides:false as a typed field (not just a runtime flag) so OverworldScene can statically check collision behavior per NPC"
  - "NPC sprites use 2px dark border (#202020) instead of 1px so they visually pop against any tile color"

patterns-established:
  - "NPC tile coordinates placed adjacent to buildings (not inside collision rectangles) — building footprint table from 03-RESEARCH.md is the authority"
  - "InteriorStub scene key 'InteriorStub' — Plan 04 wires building entrance tiles to scene.start('InteriorStub', {buildingKey, returnPos})"

requirements-completed: [NPC-01, NPC-02, NPC-03, NPC-04, NPC-05, INTER-02]

# Metrics
duration: 5min
completed: 2026-03-09
---

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
