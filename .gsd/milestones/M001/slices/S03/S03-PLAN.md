# S03: Interaction Npc System

**Goal:** Create the three Wave 0 test files that validate all 10 Phase 3 requirements.
**Demo:** Create the three Wave 0 test files that validate all 10 Phase 3 requirements.

## Must-Haves


## Tasks

- [x] **T01: 03-interaction-npc-system 01** `est:4min`
  - Create the three Wave 0 test files that validate all 10 Phase 3 requirements. These tests are written first (RED) and must fail until implementation is in place. All tests cover pure TypeScript logic — no Phaser, no DOM, no WebGL.

Purpose: Nyquist compliance requires test scaffolds exist before implementation tasks run. Every automated verify command in Plans 02-05 references these files.
Output: Three failing test files in tests/ that become green as implementation plans execute.
- [x] **T02: 03-interaction-npc-system 02** `est:5min`
  - Create the NPC config, placeholder sprites, and InteriorStub scene. These are the data contracts and assets that Plan 03 (DialogBox/router) and Plan 04 (OverworldScene wiring) consume. No Phaser scene code is modified in this plan — only new files are created and main.ts gets the stub scene registered.

Purpose: Establish the data layer before wiring it into the scene. Executor for Plan 03 and Plan 04 can reference these files directly.
Output: 15 PNG files, npcs.ts config, InteriorStub.ts scene, main.ts updated with stub scene.
- [x] **T03: 03-interaction-npc-system 03** `est:2min`
  - Build the DialogBox UI component and define the InteractionPayload type. This plan runs in parallel with Plan 02 (no shared files). DialogBox is a camera-fixed Phaser Container that implements the Pokemon Gen 1/2 text box — white box, dark pixel border, monospace font, 2 lines per page, instant display, Space/E advance.

Purpose: The dialog and interaction payload contracts must exist before Plan 04 wires them into OverworldScene.
Output: src/game/ui/DialogBox.ts with DialogBox class + InteractionPayload type + pure splitIntoPages export.
- [x] **T04: 03-interaction-npc-system 04** `est:5min`
  - Wire the interaction system into OverworldScene and Boot. This is the largest plan in Phase 3 — it touches the two core scene files. Boot.ts gets NPC sprite preloading. OverworldScene.ts gets: Space/E keys, dialogOpen flag, interactionMap, NPC sprite registration with Grid Engine, handleInteraction dispatcher, and the facing-tile lookup loop in update().

Purpose: After this plan, all static NPCs are visible and talkable, signs show dialogs, and building entrances route correctly.
Output: Modified Boot.ts + substantially extended Overworld.ts.
- [x] **T05: 03-interaction-npc-system 05** `est:3min`
  - Wire John Collison's patrol movement and add the human smoke test checkpoint. This plan touches only OverworldScene.ts (adding patrol setup + movementStopped subscription). The human checkpoint verifies the full Phase 3 experience: all 14 NPCs visible, dialog working, patrol moving, building entrances routing correctly.

Purpose: Patrol is the only moving NPC in Phase 3. After this plan Phase 3 is functionally complete and ready for verify-work.
Output: OverworldScene.ts with John patrol. Human confirms the full interaction loop works.

## Files Likely Touched

- `tests/npc-config.test.ts`
- `tests/interaction-router.test.ts`
- `tests/dialog-box.test.ts`
- `src/game/config/npcs.ts`
- `src/game/scenes/InteriorStub.ts`
- `src/game/main.ts`
- `scripts/generate-npc-sprites.ts`
- `public/assets/sprites/npc-paul-graham.png`
- `public/assets/sprites/npc-marc-andreessen.png`
- `public/assets/sprites/npc-brian-chesky.png`
- `public/assets/sprites/npc-tobi-lutke.png`
- `public/assets/sprites/npc-dalton-caldwell.png`
- `public/assets/sprites/npc-ben-horowitz.png`
- `public/assets/sprites/npc-vinod-khosla.png`
- `public/assets/sprites/npc-dario-amodei.png`
- `public/assets/sprites/npc-michael-seibel.png`
- `public/assets/sprites/npc-patrick-collison.png`
- `public/assets/sprites/npc-john-collison.png`
- `public/assets/sprites/npc-keri.png`
- `public/assets/sprites/npc-dad.png`
- `public/assets/sprites/npc-dog-1.png`
- `public/assets/sprites/npc-dog-2.png`
- `src/game/ui/DialogBox.ts`
- `src/game/scenes/Boot.ts`
- `src/game/scenes/Overworld.ts`
- `src/game/scenes/Overworld.ts`
