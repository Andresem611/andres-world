# T02: 03-interaction-npc-system 02

**Slice:** S03 — **Milestone:** M001

## Description

Create the NPC config, placeholder sprites, and InteriorStub scene. These are the data contracts and assets that Plan 03 (DialogBox/router) and Plan 04 (OverworldScene wiring) consume. No Phaser scene code is modified in this plan — only new files are created and main.ts gets the stub scene registered.

Purpose: Establish the data layer before wiring it into the scene. Executor for Plan 03 and Plan 04 can reference these files directly.
Output: 15 PNG files, npcs.ts config, InteriorStub.ts scene, main.ts updated with stub scene.

## Must-Haves

- [ ] "All 14 NPC definitions exist in a single TypeScript config file"
- [ ] "All NPC placeholder PNGs exist in public/assets/sprites/"
- [ ] "InteriorStub scene is registered in main.ts and handles scene transitions"
- [ ] "All 14 NPC configs have correct dialogue from the NPC roster"

## Files

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
