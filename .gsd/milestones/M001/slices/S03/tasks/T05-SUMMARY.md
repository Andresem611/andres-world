---
id: T05
parent: S03
milestone: M001
provides:
  - John Collison patrol: back-and-forth on Main Street via addQueueMovements + movementStopped observable
  - Patrol pause on dialog open (stopMovement) + resume on dialog close (onDialogClose hook)
  - patrolSubscription stored on scene instance, unsubscribed on scene shutdown (memory leak prevention)
  - Human smoke test checkpoint verifying full Phase 3 interaction loop
requires: []
affects: []
key_files: []
key_decisions: []
patterns_established: []
observability_surfaces: []
drill_down_paths: []
duration: 3min
verification_result: passed
completed_at: 2026-03-09
blocker_discovered: false
---
# T05: 03-interaction-npc-system 05

**# Phase 3 Plan 05: John Collison Patrol Summary**

## What Happened

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
