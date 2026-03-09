---
phase: 03-interaction-npc-system
plan: "05"
subsystem: ui
tags: [phaser3, grid-engine, npc, patrol, rxjs, typescript]

# Dependency graph
requires:
  - phase: 03-04
    provides: OverworldScene with 14 NPCs spawned + interactionMap + dialog system; john-collison registered in gridEngine with collides:false

provides:
  - John Collison patrol: back-and-forth on Main Street via addQueueMovements + movementStopped observable
  - Patrol pause on dialog open (stopMovement) + resume on dialog close (onDialogClose hook)
  - patrolSubscription stored on scene instance, unsubscribed on scene shutdown (memory leak prevention)
  - Human smoke test checkpoint verifying full Phase 3 interaction loop

affects:
  - phase-verify-03 (verify-work checks John patrol + all 14 NPCs + dialog + building transitions)

# Tech tracking
tech-stack:
  added: []
  patterns:
    - addQueueMovements with Array(10).fill(Direction.UP/DOWN) for simple back-and-forth patrol
    - movementStopped() RxJS observable subscription stored on scene, unsubscribed in shutdown event
    - johnDialogOpen flag guards movementStopped handler from re-queueing during active dialog
    - onDialogClose hook pattern (established in Plan 04) reused to resume patrol after dialog closes

key-files:
  created: []
  modified:
    - src/game/scenes/Overworld.ts

key-decisions:
  - "Patrol subscription typed as { unsubscribe: () => void } (not full RxJS Subscription) — satisfies TypeScript without importing rxjs types into OverworldScene"
  - "initJohnPatrol() called at end of create() after gridEngine.create() and all interactionMap setup — ensures Grid Engine has registered john-collison before addQueueMovements is called"
  - "onDialogClose hook set only when payload.id === john-collison — non-John NPCs leave onDialogClose null so existing null-safe onDialogClose?.() call in update() is sufficient"

patterns-established:
  - "Pattern: store observable subscription on scene instance as nullable field; unsubscribe in shutdown event handler"
  - "Pattern: guard movementStopped handler with entity-specific dialog flag (johnDialogOpen) to prevent patrol re-queue during active dialog"

requirements-completed: [NPC-04]

# Metrics
duration: 3min
completed: 2026-03-09
---

# Phase 3 Plan 05: John Collison Patrol Summary

**John Collison patrols Main Street back-and-forth via Grid Engine addQueueMovements + movementStopped observable, with dialog pause/resume via stopMovement and onDialogClose hook — awaiting human smoke test to complete Phase 3**

## Performance

- **Duration:** ~3 min
- **Started:** 2026-03-09T21:04:24Z
- **Completed:** 2026-03-09T21:07:30Z
- **Tasks:** 1 of 2 (Task 2 is human-verify checkpoint — awaiting human approval)
- **Files modified:** 1

## Accomplishments
- Added `johnPatrolDirection`, `johnDialogOpen`, and `patrolSubscription` private fields to OverworldScene
- Implemented `initJohnPatrol()` method: queues 10-tile north path on start, subscribes to `movementStopped()` observable to reverse direction when queue empties
- Updated `handleInteraction()` npc case: when `payload.id === "john-collison"`, calls `stopMovement`, sets `johnDialogOpen = true`, sets `onDialogClose` hook to resume patrol in the current direction
- Updated shutdown event handler to `patrolSubscription?.unsubscribe()` before dialog close (memory leak prevention)
- All 19 tests pass, build clean

## Task Commits

Each task was committed atomically:

1. **Task 1: John Collison patrol movement** - `0ec1949` (feat)

## Files Created/Modified
- `src/game/scenes/Overworld.ts` - Added patrol fields, initJohnPatrol(), patrol pause/resume in handleInteraction(), shutdown cleanup

## Decisions Made
- Typed `patrolSubscription` as `{ unsubscribe: () => void } | null` rather than importing RxJS `Subscription` type — avoids importing rxjs into the scene file while satisfying TypeScript
- Called `initJohnPatrol()` at end of `create()` (step 12) after all gridEngine and interactionMap setup — ensures john-collison is registered before `addQueueMovements` is called

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered
None.

## User Setup Required
None - no external service configuration required.

## Next Phase Readiness
- Phase 3 Task 2 (human-verify checkpoint) is the next step — run `npm run dev`, open http://localhost:5173, work through the 9-point checklist in the plan
- After human smoke test approves, Phase 3 is complete and ready for `/gsd:verify-work`
- Phase 4 (Thoven HQ interior) can proceed once Phase 3 is verified

---
*Phase: 03-interaction-npc-system*
*Completed: 2026-03-09*

## Self-Check: PASSED
- `src/game/scenes/Overworld.ts` - FOUND (modified with patrol logic)
- Commit `0ec1949` - FOUND (confirmed by git)
