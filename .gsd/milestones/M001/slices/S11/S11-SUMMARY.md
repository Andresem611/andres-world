---
id: S11
parent: M001
milestone: M001
provides:
  - Complete Thoven HQ interior (12×10 map with 5 layers)
  - Metrics board, shipped/corkboard, practice room doors
  - Keri NPC at front desk, Michael Seibel in waiting area, Brian Chesky near metrics
  - PC interaction linking to Thoven
  - 7 new dialogue entries for Thoven objects
  - 15 new tests covering all THOV-01 through THOV-08 requirements
requires:
  - slice: S10
    provides: Interior interaction pattern established
affects:
  - S12 (same pattern reused for Starbucks + Engineering Lab)
key_files:
  - scripts/generate-thoven-hq.ts
  - public/assets/maps/thoven-hq.json
  - src/game/scenes/ThovenHQ.ts
  - src/content/dialogue.ts
  - tests/thoven-hq.test.ts
key_decisions:
  - "Thoven HQ is 12×10 (larger than Andres's Room 10×8) — reflects its importance as the HQ"
  - "Practice room doors are wall interactions with under-construction dialogue"
  - "Metrics are manual static text — not live data (per THOV-03 spec)"
patterns_established: []
observability_surfaces: []
drill_down_paths: []
duration: 15min
verification_result: passed
completed_at: 2026-03-14
blocker_discovered: false
---

# S11: Thoven HQ

**Thoven HQ interior: 12×10 office with metrics board, shipped board, practice room doors, PC link, 3 NPCs (Keri, Michael Seibel, Brian Chesky).**

## What Happened

Built generate-thoven-hq.ts to create a 12×10 office map. Rewrote ThovenHQ.ts from stub to full interior with interactions and NPCs. Added 7 dialogue entries for Thoven-specific objects (metrics, shipped board, 4 practice rooms, PC). Same interaction pattern as AndresRoom.

## Verification

- ✅ 74/74 tests pass (15 new in thoven-hq.test.ts)
- ✅ `vite build` clean
- ✅ All THOV-01 through THOV-08 requirements covered by tests

## Requirements Advanced

- THOV-01 through THOV-08 — all addressed

## Deviations

None.

## Known Limitations

- Furniture tiles are placeholder GIDs — visual refinement deferred
- Practice rooms are door interactions only (no separate interior scenes)
- Thoven PC link shows dialogue text, not an actual URL popup

## Files Created/Modified

- `scripts/generate-thoven-hq.ts` — map generator
- `public/assets/maps/thoven-hq.json` — 12×10 office map
- `src/game/scenes/ThovenHQ.ts` — full interior with interactions/NPCs
- `src/content/dialogue.ts` — 7 new Thoven dialogue entries
- `tests/thoven-hq.test.ts` — 15 tests for THOV requirements
