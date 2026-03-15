---
id: T01
parent: S08
milestone: M001
provides:
  - DialogEntry interface (src/types/dialog.ts) with speaker, lines, condition, link, onComplete
  - DIALOGUE content map (src/content/dialogue.ts) keyed by NPC id
  - GameState placeholder interface for Phase 4+ conditional dialogue
  - npcs.ts decoupled from dialogue — uses dialogId string references
  - Overworld.ts reads interaction text from DIALOGUE import
requires: []
affects:
  - S10 (Andres's Room uses DialogEntry for conditional dialogue)
key_files:
  - src/types/dialog.ts
  - src/content/dialogue.ts
  - src/game/config/npcs.ts
  - src/game/scenes/Overworld.ts
key_decisions:
  - "DialogEntry interface matches ADR Decision 2 spec exactly"
  - "DIALOGUE keyed by NPC id string — dialogId on NpcDefinition references DIALOGUE map key"
  - "Sign and under-construction text also extracted to DIALOGUE map for consistency"
patterns_established:
  - "Content layer pattern: game config holds position/sprite data, content holds text"
  - "dialogId string on NpcDefinition references DIALOGUE map key — no inline strings in config"
observability_surfaces: []
drill_down_paths: []
duration: 3min
verification_result: passed
completed_at: 2026-03-14
blocker_discovered: false
---
# T01: Dialogue Content Layer Extraction

Typed DialogEntry interface + DIALOGUE content map. All 14 NPC dialogue strings extracted from inline arrays into a decoupled content layer. 16 tests passing across 4 test files (6 new NPC-06 tests). TDD with separate RED and GREEN commits.

## Requirements Completed
- NPC-06 — All NPC string arrays extracted into src/content/dialogue.ts with DialogEntry interface
