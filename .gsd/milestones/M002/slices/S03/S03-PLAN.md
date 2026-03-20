# S03: NPC System + Dialog UI

**Goal:** All 14+ overworld NPCs visible at their positions, Space/E opens Pokemon-style dialog box, NPC turns to face player, dialog advances and closes. John Collison patrols Main Street.

**Demo:** Walk up Main Street, see NPCs at their positions. Press Space near Marc Andreessen — dialog box appears: "Software is eating the world." Press Space to dismiss. John Collison walks back and forth.

## Must-Haves

- NPC sprites rendered at correct map positions from NPC_CONFIG
- Space/E triggers interaction when player faces an NPC
- Pokemon-style dialog box (DOM/CSS, not canvas) with typed text
- Dialog advances on Space/E, closes on last line
- NPC turns to face player on interaction
- John Collison patrol movement via GridEngineHeadless
- Movement locked during dialog
- All 14 overworld NPCs functional

## Verification

- `tests/npc-dialog.test.ts` — NPC config, dialogue content, interaction logic
- Browser verification: NPCs visible, dialog opens/closes, patrol works

## Tasks

- [ ] **T01: NPC sprites + dialog box component** `est:30m`
- [ ] **T02: Interaction system + patrol + wiring** `est:30m`

## Files Likely Touched

- `src/components/NpcSprite.tsx`
- `src/components/DialogBox.tsx`
- `src/hooks/useDialog.ts`
- `src/hooks/useGridEngine.ts`
- `src/components/GameContainer.tsx`
- `src/components/CameraViewport.tsx`
- `tests/npc-dialog.test.ts`
