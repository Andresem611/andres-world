---
id: S02
parent: M002
milestone: M002
provides:
  - useGridEngine React hook wrapping GridEngineHeadless
  - ArrayTilemap from OVERWORLD_MAP collision layer
  - PlayerSprite component with CSS walk animation (4 directions)
  - Arrow keys + WASD movement dispatch
  - Camera follows player with edge clamping
  - Collision detection via GridEngineHeadless (buildings, ocean, trees)
  - 9 new movement tests
requires:
  - slice: S01
    provides: TileRenderer, CameraViewport, OVERWORLD_MAP
affects:
  - S03 (NPC system uses same positioned-sprite pattern + GridEngineHeadless characters)
key_files:
  - src/hooks/useGridEngine.ts
  - src/maps/collision.ts
  - src/components/PlayerSprite.tsx
  - src/components/GameContainer.tsx
key_decisions:
  - "GridEngineHeadless update() runs at 50ms interval (20 FPS) via setInterval"
  - "Player position tracked via React state + positionChangeFinished subscription"
  - "CSS sprite-sheet animation via @keyframes + steps() for walk cycle"
  - "Player sprite offset: top shifted up by (frameHeight - tileSize) so feet align with tile"
  - "Camera center = player position — direct, no interpolation yet"
patterns_established:
  - "useGridEngine hook pattern: create engine once, subscribe to events, expose move/position via React state"
  - "CSS sprite animation: @keyframes from/to with steps(frameCount) for pixel-art walk cycles"
  - "Collision data as ArrayTilemap: { collision: { data: 2D array } } — same format for interiors"
observability_surfaces: []
drill_down_paths: []
duration: 15min
verification_result: passed
completed_at: 2026-03-14
blocker_discovered: false
---

# S02: GridEngineHeadless + Character Movement

**Player walks the overworld with grid-locked movement, collision, CSS sprite animation, and camera follow — GridEngineHeadless manages all movement logic via React state.**

## What Happened

Created `useGridEngine` hook that instantiates GridEngineHeadless once, creates ArrayTilemap from OVERWORLD_MAP collision data, and exposes player position/facing/movement state via React useState. The hook subscribes to positionChangeStarted/Finished and directionChanged events to keep React state in sync. A setInterval(50ms) drives the engine's update loop.

Built `PlayerSprite` component rendering the player.png spritesheet (96×128, 3 frames × 4 rows PIPOYA order) using CSS `backgroundImage`/`backgroundPosition`. Walk animation uses `@keyframes` with `steps(3)` for pixel-art frame stepping. Sprite is positioned absolutely in the world container with feet-aligned offset.

Updated GameContainer to use the hook — keyboard handler maps arrow keys and WASD to `Direction` enum values and calls `engine.move()`. Camera center tracks playerState.x/y directly. CameraViewport now accepts optional playerState prop to render the sprite in the world layer.

## Verification

- ✅ 163/163 tests pass (9 new + all prior)
- ✅ `npx tsc --noEmit` clean
- ✅ `npm run build` — 414KB
- ✅ Browser: player spawns at dock, moves tile-by-tile, collides with buildings, camera follows

## Deviations

None.

## Known Limitations

- No smooth camera interpolation — camera snaps to tile positions (acceptable for pixel-art style)
- No smooth movement interpolation — player teleports between tiles visually (CSS transition could smooth this)
- Walk animation plays only when `isMoving` is true — between keydowns there's a brief idle flicker

## Files Created/Modified

- `src/hooks/useGridEngine.ts` — GridEngineHeadless React hook
- `src/maps/collision.ts` — collision ArrayTilemap factory + isWalkable helper
- `src/components/PlayerSprite.tsx` — player sprite with CSS walk animation
- `src/components/GameContainer.tsx` — wired movement + camera to useGridEngine
- `src/components/CameraViewport.tsx` — accepts playerState, renders sprite in world
- `tests/movement.test.ts` — 9 tests for collision map + GE integration

## Forward Intelligence

### What the next slice should know
- `useGridEngine` hook exposes: `playerState` (x, y, facing, isMoving), `move(direction)`, `getPosition()`, `getFacingDirection()`, `engine` ref.
- NPC characters should be added to the same GridEngineHeadless instance via `engine.current.addCharacter()` after initial create.
- The `engine` ref is exposed for direct GridEngineHeadless API access (patrol, pathfinding, etc.).
- PlayerSprite pattern (CSS sprite-sheet + absolute positioning) can be reused for NPC sprites.

### What's fragile
- The 50ms setInterval for engine.update() is not synced to requestAnimationFrame — could cause occasional missed frames. Fine for now.
- positionChangeFinished only fires after full tile traversal — mid-tile position is not tracked (no smooth interpolation).

### Authoritative diagnostics
- `npx vitest run tests/movement.test.ts` — 9 tests covering collision and GE integration
- Browser: press arrow keys and visually confirm grid-locked movement
