---
phase: 03-interaction-npc-system
plan: 03
subsystem: ui
tags: [phaser3, dialog, pokemon, vitest, tdd, typescript]

# Dependency graph
requires:
  - phase: 03-interaction-npc-system
    provides: Wave 0 test scaffolds (tests/dialog-box.test.ts in RED state)
provides:
  - src/game/ui/DialogBox.ts with DialogBox class, InteractionPayload type, splitIntoPages pure function
  - INTER-04 and INTER-05 tests now GREEN
affects: [03-04, 03-05]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Camera-fixed Phaser Container: setScrollFactor(0) + setDepth(100) for HUD elements"
    - "Pure function export pattern: splitIntoPages exported standalone so Vitest can import without Phaser instantiation"
    - "Pokemon Gen 1/2 dialog pagination: 2 lines per page, instant display, Space/E advance"

key-files:
  created:
    - src/game/ui/DialogBox.ts
  modified: []

key-decisions:
  - "splitIntoPages exported as standalone pure function (not class method) so dialog-box.test.ts imports it without instantiating a Phaser class"
  - "Container positioned at (0,0) with setScrollFactor(0) — text/rect objects use absolute screen coordinates matching 800x600 canvas"
  - "InteractionPayload union type defined here (four variants: npc, sign, building, under_construction) as the contract for Plan 04 interaction router"

patterns-established:
  - "DialogBox pattern: Phaser Container at (0,0) + setScrollFactor(0) + setDepth(100) is the correct approach for all future HUD/overlay elements"
  - "Pure export pattern: any function that needs Vitest coverage must be exported at module level, not as a class method"

requirements-completed: [INTER-04, INTER-05]

# Metrics
duration: 2min
completed: 2026-03-09
---

# Phase 3 Plan 03: DialogBox Component Summary

**Camera-fixed Pokemon Gen 1/2 dialog box (white rect, dark border, monospace font, 2 lines/page) with InteractionPayload union type and pure splitIntoPages export making INTER-04 and INTER-05 tests green**

## Performance

- **Duration:** 2 min
- **Started:** 2026-03-09T20:44:39Z
- **Completed:** 2026-03-09T20:46:30Z
- **Tasks:** 1
- **Files modified:** 1

## Accomplishments
- DialogBox class implements full Pokemon Gen 1/2 text box: show/advance/isOpen/close API
- splitIntoPages pure function exported at module level — Vitest can import it without Phaser class instantiation
- InteractionPayload union type defined as contract for Plan 04 interaction router
- All 3 dialog-box tests pass (INTER-04: pagination, INTER-05a/b: advance logic)
- Build succeeds with no TypeScript errors

## Task Commits

Each task was committed atomically:

1. **Task 1: DialogBox component + InteractionPayload + splitIntoPages** - `45d457a` (feat)

## Files Created/Modified
- `src/game/ui/DialogBox.ts` - DialogBox class (camera-fixed Phaser Container), InteractionPayload union type, splitIntoPages pure function

## Decisions Made
- Container origin at (0,0), scrollFactor(0) — all child objects use absolute screen coordinates so the box stays in the bottom 25% of the 800x600 viewport regardless of camera position
- Rectangle background uses center-origin positioning (`x = BOX_WIDTH/2, y = BOX_Y + BOX_HEIGHT/2`) to match Phaser's `add.rectangle` center-anchor default
- Chunk size warning in `npm run build` is pre-existing (Phaser 3 bundle) — not introduced by this plan

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

None.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness
- DialogBox and InteractionPayload are the two missing contracts Plan 04 (OverworldScene wiring) depends on
- Plan 04 can now import `DialogBox` and `InteractionPayload` from `src/game/ui/DialogBox.ts`
- Plan 02 (NPC config + types) runs in parallel — no dependency between 03-02 and 03-03

---
*Phase: 03-interaction-npc-system*
*Completed: 2026-03-09*
