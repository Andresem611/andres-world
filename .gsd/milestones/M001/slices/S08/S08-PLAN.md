# S08: Character + NPC Sprites

**Goal:** Real pixel art character (hoodie + backpack, 32x32, 4-directional walk) replaces the placeholder. Dialogue content extracted from scene files into a typed content layer. AI-generated sprites via PixelLab replace colored-box placeholders.
**Demo:** Player character shows hoodie+backpack sprite with 4-directional walk animation. At least 5 NPCs are real pixel art. All dialogue strings in typed content layer.

## Must-Haves

- DialogEntry interface in src/types/dialog.ts
- All NPC strings extracted to src/content/dialogue.ts
- Player spritesheet with 4-directional walk (PIPOYA row order)
- At least 5 NPC sprites are real pixel art (not colored boxes)
- All sprite sources documented in SPRITE-SOURCES.md

## Tasks

- [x] **T01: Dialogue content layer extraction** `est:3min`
  - Create DialogEntry interface + DIALOGUE content map. Rewire npcs.ts and Overworld.ts to use content layer. NPC-06 requirement complete.
- [ ] **T02: AI sprite generation + integration** `est:TBD`
  - Generate player spritesheet + NPC sprites via PixelLab. Update Boot.ts. Create SPRITE-SOURCES.md. Human visual verify. (CHAR-04, CHAR-05)

## Files Likely Touched

- `src/types/dialog.ts`
- `src/content/dialogue.ts`
- `src/game/config/npcs.ts`
- `src/game/scenes/Overworld.ts`
- `src/game/scenes/Boot.ts`
- `public/assets/sprites/player.png`
- `public/assets/sprites/npc-*.png`
- `.planning/SPRITE-SOURCES.md`
