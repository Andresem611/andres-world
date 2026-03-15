# T04: 03-interaction-npc-system 04

**Slice:** S03 — **Milestone:** M001

## Description

Wire the interaction system into OverworldScene and Boot. This is the largest plan in Phase 3 — it touches the two core scene files. Boot.ts gets NPC sprite preloading. OverworldScene.ts gets: Space/E keys, dialogOpen flag, interactionMap, NPC sprite registration with Grid Engine, handleInteraction dispatcher, and the facing-tile lookup loop in update().

Purpose: After this plan, all static NPCs are visible and talkable, signs show dialogs, and building entrances route correctly.
Output: Modified Boot.ts + substantially extended Overworld.ts.

## Must-Haves

- [ ] "Pressing Space or E while facing an interactive tile triggers the correct response"
- [ ] "All 14 NPC sprites are visible on the overworld at their tile positions"
- [ ] "Dialog box appears at screen bottom (not world space) when any NPC or sign is interacted with"
- [ ] "Movement is locked while dialog is open; resumes on dialog close"
- [ ] "Finished building entrance triggers InteriorStub scene transition"
- [ ] "Under-construction building shows popup message (not scene transition)"

## Files

- `src/game/scenes/Boot.ts`
- `src/game/scenes/Overworld.ts`
