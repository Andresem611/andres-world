# M001 Context

## Milestone Overview

Full build of Andres World — a Pokemon Gen 1/2 pixel-art overworld personal website at andresmartinez.com. From infrastructure scaffold through all interiors, hidden areas, loading screen, and final polish.

## Current Position

**Active slice:** S08 (Character + NPC Sprites)
**Active task:** T02 (AI sprite generation via PixelLab — waiting on human session)
**Completed:** S01-S06 fully done, S07 T01 done (T02-T03 pending Tiled session), S08 T01 done

## Key Context for Active Work

- Player sprite must be 32x32, 4-directional walk, PIPOYA row order (Down/Left/Right/Up)
- NPC sprites are static 32x32 single-frame PNGs (not spritesheets)
- Boot.ts currently loads `character-placeholder.png` — needs update to `player.png`
- DialogEntry interface and DIALOGUE content map already created (S08 T01)
- PixelLab ($9/mo) is the chosen AI sprite generation tool
- Grid Engine walkingAnimationMapping:0 must stay unchanged

## Dependencies

No upstream milestone dependencies — this is the first milestone.

## Migration Note

Migrated from `.planning/` directory. Original phases 1-3, 3.1-3.4, 3.5, 4-9 mapped to slices S01-S15.
