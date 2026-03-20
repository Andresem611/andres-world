---
id: S04
parent: M002
milestone: M002
provides:
  - Interaction map for overworld (signs, building entrances, under-construction)
  - Scene transition system (overworld ↔ interior) with fade
  - InteriorView component with movement, NPCs, object interactions
  - All 4 interior maps as TypeScript arrays (andres-room, thoven-hq, starbucks, engineering-lab)
  - Interior tilesets (Room_Builder, Interiors) configured
  - 14 new tests for interiors, interactions, dialogue
requires:
  - slice: S03
    provides: NPC system, dialog UI, interaction pattern
affects:
  - S06 (hidden areas use same interaction map pattern)
key_files:
  - src/maps/interactions.ts
  - src/maps/interiors.ts
  - src/components/InteriorView.tsx
  - src/hooks/useSceneTransition.ts
key_decisions:
  - "All 4 interiors delivered in one slice — S05 collapsed into S04"
  - "Interior tilesets separate from overworld tilesets — getTileStyle accepts tileset array param"
  - "Interior rooms small enough to render entirely (no culling needed)"
  - "Exit detection via positionChangeFinished + exitPositions match"
patterns_established:
  - "Interior interaction maps defined as static records keyed by 'x,y'"
  - "Scene transition: 300ms fade out → switch scene state → render new view"
observability_surfaces: []
drill_down_paths: []
duration: 20min
verification_result: passed
completed_at: 2026-03-14
blocker_discovered: false
---

# S04: Building Interactions + Interior Framework

**All 4 interiors, building entrances, under-construction popups, signs, and scene transitions — S05 collapsed into this slice.**

## What Happened

Built the overworld interaction map with signs, building entrances, and under-construction markers. Created scene transition hook with 300ms fade. Built InteriorView component that creates its own GridEngineHeadless instance for interior movement, renders tiles with Room_Builder/Interiors tilesets, and handles object interactions + interior NPCs.

Extracted all 4 interior maps from Tiled JSON to TypeScript arrays via extract-interiors.ts. Each interior has ground/above/collision layers, exit positions, and tileset configs. Interior-specific interaction maps and NPC configs are defined statically in InteriorView.

## Verification

- ✅ 189/189 tests pass (14 new)
- ✅ TypeScript clean, build 438KB
- ✅ All interaction map entries have valid dialogue references

## Deviations

- S05 (Remaining Interiors) collapsed into S04 — all 4 interiors delivered together since the interior framework made them trivial to add.

## Files Created/Modified

- `src/maps/interactions.ts` — overworld interaction map
- `src/maps/interiors.ts` — 4 interior map data constants
- `src/maps/tilesets.ts` — added INTERIOR_TILESETS, parameterized findTileset/getTileStyle
- `src/components/InteriorView.tsx` — interior rendering + movement + interactions
- `src/components/GameContainer.tsx` — building entrance routing, scene transitions
- `src/hooks/useSceneTransition.ts` — scene transition state
- `src/hooks/useGridEngine.ts` — added setPosition
- `src/components/TileRenderer.tsx` — accepts tilesets prop
- `scripts/extract-interiors.ts` — Tiled JSON → TypeScript converter
- `tests/interior.test.ts` — 14 tests
