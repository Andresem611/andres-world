---
id: S13
parent: M001
milestone: M001
provides:
  - Hidden area signs for all 5 locations (Secret Beach, Music Room, Idea Graveyard, Lookout Hill, Hidden Mentor)
  - Construction buildings (Chalk Lab with hardhat NPC, VC Office locked door)
  - Bulletin board with header + 7 pressable pins + PC reading list
  - 20 new dialogue entries
  - 17 new tests covering CONST, HIDE, and BULL requirements
requires:
  - slice: S12
affects: []
key_files:
  - src/content/dialogue.ts
  - src/game/scenes/Overworld.ts
  - tests/s13-hidden-construction-bulletin.test.ts
duration: 12min
verification_result: passed
completed_at: 2026-03-14
blocker_discovered: false
---

# S13: Hidden Areas + Under-Construction + Bulletin Board

**All overworld content interactions: 5 hidden area signs, 2 construction buildings, bulletin board with 7 learning pins.**

## Verification

- ✅ 107/107 tests pass (17 new)
- ✅ `vite build` clean
- ✅ All CONST-01-04, HIDE-01-05, BULL-01-05 requirements covered

## Requirements Advanced

- CONST-01 through CONST-04, HIDE-01 through HIDE-05, BULL-01 through BULL-05 — all addressed

## Files Modified

- `src/content/dialogue.ts` — 20 new entries (construction, hidden areas, bulletin)
- `src/game/scenes/Overworld.ts` — registered all interaction coordinates
- `tests/s13-hidden-construction-bulletin.test.ts` — 17 tests
