---
id: S12
parent: M001
milestone: M001
provides:
  - Starbucks Café interior (10×8) with essays, Paul Graham NPC, barista
  - Engineering Lab interior (10×8) with experiments, stack wall, rubber duck, 3 NPCs
  - 11 new dialogue entries (3 café + 6 lab + barista + rubber duck)
  - Overworld entrances for both buildings
  - 16 new tests covering CAFE and LAB requirements
requires:
  - slice: S11
    provides: Interior interaction pattern
affects: []
key_files:
  - src/game/scenes/StarbucksCafe.ts
  - src/game/scenes/EngineeringLab.ts
  - public/assets/maps/starbucks.json
  - public/assets/maps/engineering-lab.json
  - src/content/dialogue.ts
  - src/game/main.ts
  - src/game/scenes/Overworld.ts
  - tests/cafe-lab.test.ts
key_decisions:
  - "Essays as multi-line dialogue, not HTML overlay"
  - "Barista reuses keri sprite"
  - "Stack wall as single dialogue listing all tools"
patterns_established: []
observability_surfaces: []
drill_down_paths: []
duration: 15min
verification_result: passed
completed_at: 2026-03-14
blocker_discovered: false
---

# S12: Starbucks Cafe + Engineering Lab

**Two interiors: Starbucks with essays and Paul Graham, Engineering Lab with experiments, stack wall, rubber duck easter egg, and three tech NPCs.**

## Verification

- ✅ 90/90 tests pass (16 new in cafe-lab.test.ts)
- ✅ `vite build` clean
- ✅ All CAFE-01 through CAFE-05 and LAB-01 through LAB-07 requirements covered

## Requirements Advanced

- CAFE-01 through CAFE-05, LAB-01 through LAB-07 — all addressed

## Deviations

- Essay "reading system" is multi-line dialogue instead of HTML overlay — simpler, consistent with game aesthetic.

## Files Created/Modified

- `scripts/generate-starbucks.ts`, `scripts/generate-engineering-lab.ts` — map generators
- `public/assets/maps/starbucks.json`, `engineering-lab.json` — interior maps
- `src/game/scenes/StarbucksCafe.ts`, `EngineeringLab.ts` — full interior scenes
- `src/content/dialogue.ts` — 11 new entries
- `src/game/main.ts` — registered both scenes
- `src/game/scenes/Overworld.ts` — added building entrances
- `tests/cafe-lab.test.ts` — 16 tests
