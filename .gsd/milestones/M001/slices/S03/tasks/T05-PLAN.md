# T05: 03-interaction-npc-system 05

**Slice:** S03 — **Milestone:** M001

## Description

Wire John Collison's patrol movement and add the human smoke test checkpoint. This plan touches only OverworldScene.ts (adding patrol setup + movementStopped subscription). The human checkpoint verifies the full Phase 3 experience: all 14 NPCs visible, dialog working, patrol moving, building entrances routing correctly.

Purpose: Patrol is the only moving NPC in Phase 3. After this plan Phase 3 is functionally complete and ready for verify-work.
Output: OverworldScene.ts with John patrol. Human confirms the full interaction loop works.

## Must-Haves

- [ ] "John Collison walks north on Main Street then turns around and walks south repeatedly"
- [ ] "Patrol pauses when player interacts with John — he turns to face the player, dialog opens"
- [ ] "Patrol resumes after dialog closes"
- [ ] "John does not block the player's path (collides: false already set in Plan 04)"

## Files

- `src/game/scenes/Overworld.ts`
