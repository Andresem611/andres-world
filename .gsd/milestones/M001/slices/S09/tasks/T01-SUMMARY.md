---
id: T01
parent: S09
milestone: M001
provides:
  - InteriorBaseScene class (src/game/scenes/InteriorBaseScene.ts)
  - InteriorTransitionData + OverworldReturnData interfaces (src/types/scene-data.ts)
  - Tilemap load, Grid Engine init, exit-tile detection, camera fade transitions
  - Subclass hooks: getTilesetMappings(), onInteriorCreate(), getMapKey()
  - window.__SCENE_DEBUG diagnostic surface
requires: []
affects:
  - T02 (wire into game)
  - S10 (AndresRoom extends InteriorBaseScene)
  - S11 (ThovenHQ extends InteriorBaseScene)
key_files:
  - src/game/scenes/InteriorBaseScene.ts
  - src/types/scene-data.ts
  - tests/interior-base.test.ts
key_decisions:
  - "gridEngine declared public to match Grid Engine plugin mapping"
  - "Exit detection via movementStopped subscription checking exitPositions array"
  - "Camera fade 300ms in and out for smooth transitions"
  - "transitionData protected so subclasses can read buildingKey"
patterns_established:
  - "Interior scenes extend InteriorBaseScene, override getMapKey() and onInteriorCreate()"
  - "Exit tiles marked via layer named 'exits' or Tiled object layer"
observability_surfaces:
  - "window.__SCENE_DEBUG: { scene, buildingKey, entryPos, exitPositions }"
drill_down_paths: []
duration: 15min
verification_result: passed
completed_at: 2026-03-14
blocker_discovered: false
---
# T01: InteriorBaseScene + transition data contract

InteriorBaseScene with tilemap loading, Grid Engine init, exit-tile detection, camera fade transitions, and WASD+arrows movement. Typed transition data contracts for Overworld↔Interior round-trip. 5 new tests (30 total), tsc clean.

## Requirements Completed
- InteriorBaseScene base class with full scene lifecycle
- InteriorTransitionData + OverworldReturnData type contracts
