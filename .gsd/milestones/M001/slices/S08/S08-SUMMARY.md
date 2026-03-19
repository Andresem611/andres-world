---
id: S08
parent: M001
milestone: M001
provides:
  - DialogEntry interface (src/types/dialog.ts) with speaker, lines, condition, link, onComplete
  - DIALOGUE content map (src/content/dialogue.ts) keyed by NPC/object id
  - GameState placeholder interface for conditional dialogue
  - npcs.ts decoupled from inline dialogue — uses dialogId string references
  - Player spritesheet via Retro Diffusion API (96×128, 4-dir walk, PIPOYA row order)
  - 4 NPC sprites generated via Retro Diffusion (Paul Graham, Marc Andreessen, Keri, Michael Seibel)
  - SPRITE-SOURCES.md documenting generation method and licensing
requires:
  - slice: S06
    provides: Map layout with building footprints locked
affects:
  - S09+ (content layer and sprite assets used by all interior scenes)
key_files:
  - src/types/dialog.ts
  - src/content/dialogue.ts
  - src/game/config/npcs.ts
  - public/assets/sprites/player.png
  - SPRITE-SOURCES.md
key_decisions:
  - "DialogEntry interface matches ADR Decision 2 spec"
  - "DIALOGUE keyed by NPC id string — dialogId on NpcDefinition references DIALOGUE map key"
  - "Content layer pattern: game config holds position/sprite data, content holds text"
  - "Retro Diffusion API used instead of PixelLab for sprite generation"
  - "Remaining NPC sprites deferred — 4 generated, 11 remain as colored-box placeholders"
patterns_established:
  - "Content layer pattern: game config holds position/sprite data, content holds text"
  - "dialogId string on NpcDefinition references DIALOGUE map key — no inline strings in config"
observability_surfaces: []
drill_down_paths: []
duration: 20min
verification_result: passed
completed_at: 2026-03-14
blocker_discovered: false
---

# S08: Character + NPC Sprites

**Dialogue content layer extracted from inline strings into typed DialogEntry interface. Player spritesheet and 4 NPC sprites generated via Retro Diffusion API.**

## What Happened

T01 created the DialogEntry interface and DIALOGUE content map. All 14 NPC dialogue strings extracted from inline arrays in npcs.ts into src/content/dialogue.ts. Added 6 new NPC-06 tests. TDD with RED/GREEN commits.

T02 generated a player spritesheet (96×128, 32×32 frames, 4-directional walk) and 4 NPC sprites (Paul Graham, Marc Andreessen, Keri, Michael Seibel) via Retro Diffusion API. Remaining NPCs kept as colored-box placeholders. SPRITE-SOURCES.md created at project root.

## Verification

- ✅ 37/37 tests pass (6 new NPC-06 tests)
- ✅ Build clean
- ✅ Player sprite 96×128 with correct PIPOYA row order
- ✅ 4 NPC sprites are real pixel art (file sizes >> 100 bytes vs placeholder ~100 bytes)

## Requirements Advanced

- NPC-06 — All NPC dialogue extracted to typed content layer
- CHAR-01 partial — Player sprite generated (hoodie+backpack format)
- CHAR-02 partial — 4-directional walk animation frames present

## Deviations

- PixelLab replaced with Retro Diffusion API for sprite generation
- Only 4 of 15 NPC sprites generated as real pixel art — rest remain placeholders

## Files Created/Modified

- `src/types/dialog.ts` — DialogEntry + GameState interfaces
- `src/content/dialogue.ts` — DIALOGUE content map with all NPC entries
- `src/game/config/npcs.ts` — dialogId references replace inline strings
- `public/assets/sprites/player.png` — 96×128 player spritesheet
- `public/assets/sprites/npc-paul-graham.png`, `npc-marc-andreessen.png`, `npc-keri.png`, `npc-michael-seibel.png` — real pixel art
- `SPRITE-SOURCES.md` — sprite generation documentation
