---
id: S03
parent: M002
milestone: M002
provides:
  - NpcSprite component rendering NPCs at grid positions
  - DialogBox component (Pokemon-style, DOM/CSS)
  - useDialog hook for dialog state management
  - Interaction system (Space/E, facing detection, NPC turn-to-face)
  - John Collison patrol via GridEngineHeadless
  - Movement locked during dialog
  - 12 new tests
requires:
  - slice: S02
    provides: useGridEngine, PlayerSprite, keyboard input
affects:
  - S04 (building interactions extend the interaction system)
  - S06 (hidden area interactions use same dialog/NPC pattern)
key_files:
  - src/components/NpcSprite.tsx
  - src/components/DialogBox.tsx
  - src/hooks/useDialog.ts
  - src/components/GameContainer.tsx
key_decisions:
  - "Dialog box is pure DOM/CSS — no canvas, no nes-ui-react (simpler, matches aesthetic fine)"
  - "Interaction checks facing tile via FACING_OFFSET map — O(1) lookup"
  - "NPCs added to GridEngine via addCharacter() in useEffect"
  - "Patrol uses movementStopped subscription + direction reversal"
patterns_established:
  - "Dialog flow: openDialog(entry, speaker) → advanceDialog() → closeDialog()"
  - "NPC interaction: check facing tile → match NPC position → open dialog"
  - "splitIntoPages pure function exported for testability"
observability_surfaces: []
drill_down_paths: []
duration: 15min
verification_result: passed
completed_at: 2026-03-14
blocker_discovered: false
---

# S03: NPC System + Dialog UI

**14 NPCs rendered on the overworld, Pokemon-style dialog box in DOM/CSS, Space/E interaction with facing detection, John Collison patrol.**

## What Happened

Built NpcSprite component (32×32 PNG at grid position), DialogBox component (dark box with white text, page advance, close indicator), and useDialog hook. Wired interaction into GameContainer: on Space/E, check the tile the player is facing, match against NPC positions, open dialog with that NPC's lines from dialogue.ts.

Added all 14 NPCs to GridEngineHeadless via addCharacter(). John Collison patrols Main Street using movementStopped subscription to reverse direction. Movement is locked while dialog is open — keyboard handler gates on dialog.isOpen.

## Verification

- ✅ 175/175 tests pass (12 new)
- ✅ `npx tsc --noEmit` clean
- ✅ `npm run build` — 425KB
- ✅ NPCs render at correct positions in browser
- ✅ Patrol movement functional (movementStopped reversal)

## Deviations

- Used custom DOM dialog box instead of nes-ui-react — simpler and matches the Gen 1/2 aesthetic well enough. nes-ui-react can be added later for visual polish.

## Known Limitations

- Dialog font is system monospace — "Press Start 2P" Google Font not yet loaded
- No sign/building interactions yet (only NPC interactions) — S04 will add those
- NPC sprites are placeholder 32×32 PNGs (from M001)

## Files Created/Modified

- `src/components/NpcSprite.tsx` — NPC sprite rendering
- `src/components/DialogBox.tsx` — dialog box + splitIntoPages
- `src/hooks/useDialog.ts` — dialog state management
- `src/components/GameContainer.tsx` — interaction system, NPC wiring, patrol
- `src/components/CameraViewport.tsx` — NPC rendering with viewport culling
- `tests/npc-dialog.test.ts` — 12 tests

## Forward Intelligence

### What the next slice should know
- Interaction system in GameContainer.tryInteract() currently only checks NPCs. Extend it to check a sign/building interaction map for S04.
- The dialog system supports `link` field on DialogEntry — not yet rendered in the UI. S04 or S08 should add clickable links.
- NPC positions are tracked in npcPositionsRef — patrol NPCs update dynamically.

### What's fragile
- `tryInteract` does linear scan of NPC_CONFIG — fine for 14 NPCs, but O(n). Could use a Map if NPC count grows.
- Patrol relies on movementStopped which fires for ALL characters — filtered by charId but subscription accumulates if startPatrol called multiple times via HMR.
