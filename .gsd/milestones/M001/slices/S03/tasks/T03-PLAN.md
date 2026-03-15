# T03: 03-interaction-npc-system 03

**Slice:** S03 — **Milestone:** M001

## Description

Build the DialogBox UI component and define the InteractionPayload type. This plan runs in parallel with Plan 02 (no shared files). DialogBox is a camera-fixed Phaser Container that implements the Pokemon Gen 1/2 text box — white box, dark pixel border, monospace font, 2 lines per page, instant display, Space/E advance.

Purpose: The dialog and interaction payload contracts must exist before Plan 04 wires them into OverworldScene.
Output: src/game/ui/DialogBox.ts with DialogBox class + InteractionPayload type + pure splitIntoPages export.

## Must-Haves

- [ ] "DialogBox is a Phaser.GameObjects.Container fixed to camera viewport (not world space)"
- [ ] "Text appears instantly — no typewriter effect"
- [ ] "Dialog pages show 2 lines per page; Space/E advances; advance() returns true on last page close"
- [ ] "Movement cannot occur while dialog is open (isOpen() returns true)"
- [ ] "splitIntoPages is a pure exported function importable by Vitest without Phaser"

## Files

- `src/game/ui/DialogBox.ts`
