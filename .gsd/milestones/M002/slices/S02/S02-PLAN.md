# S02: GridEngineHeadless + Character Movement

**Goal:** Player sprite moves on the tile grid with arrow keys / WASD, grid-locked 4-directional movement, collision with buildings/water/trees, camera follows player. GridEngineHeadless manages all movement state, React renders position via CSS transform.

**Demo:** Open localhost:5173, see the player character at the south dock (x=25, y=38). Press arrow keys or WASD — character moves tile-by-tile with walk animation. Can't walk through buildings or into the ocean. Camera follows smoothly.

## Must-Haves

- GridEngineHeadless integrated with React via custom hook
- Player sprite rendered at grid position with 4-directional walk animation (CSS sprite sheet)
- Arrow keys + WASD dispatch movement commands to GridEngineHeadless
- Collision detection using OVERWORLD_MAP.layers.collision
- Camera follows player position (CameraViewport receives player pos)
- Movement feels grid-locked — no float, no drift, no diagonal
- Player spawns at south dock (x=25, y=38) facing up

## Proof Level

- This slice proves: integration (GridEngineHeadless + React + DOM rendering + keyboard input)
- Real runtime required: yes (browser verification of movement feel)
- Human/UAT required: no (browser tools can verify movement and collision)

## Verification

- `tests/movement.test.ts` — unit tests for GridEngineHeadless integration, collision map, movement commands
- `npm run build` exits 0
- Browser verification: player moves tile-by-tile, collides with blocked tiles, camera follows

## Tasks

- [ ] **T01: GridEngineHeadless + useGridEngine hook** `est:30m`
  - Why: Core movement engine — wires GridEngineHeadless to React state
  - Files: `src/hooks/useGridEngine.ts`, `src/maps/collision.ts`, `tests/movement.test.ts`
  - Do:
    1. Create `src/maps/collision.ts` — converts OVERWORLD_MAP.layers.collision into ArrayTilemap format for GridEngineHeadless: `{ collision: { data: collision2DArray } }` where 1=blocked, 0=walkable.
    2. Create `src/hooks/useGridEngine.ts` — custom hook that: (a) instantiates GridEngineHeadless once, (b) creates ArrayTilemap from collision data, (c) calls gridEngine.create() with player character at spawn position, (d) runs gridEngine.update() via setInterval(50ms), (e) exposes reactive player position + facing direction via useState, (f) subscribes to positionChangeFinished to update React state, (g) exposes move(direction) function, (h) cleans up on unmount.
    3. Write `tests/movement.test.ts` with tests: collision map has correct blocked/walkable values, ArrayTilemap created successfully, player starts at spawn position.
  - Verify: `npx vitest run tests/movement.test.ts` passes
  - Done when: useGridEngine hook works with GridEngineHeadless, collision map matches OVERWORLD_MAP

- [ ] **T02: PlayerSprite + keyboard input + camera follow** `est:30m`
  - Why: Visual rendering — player sprite with walk animation, keyboard dispatch, camera tracks player
  - Files: `src/components/PlayerSprite.tsx`, `src/components/GameContainer.tsx`, `src/components/CameraViewport.tsx`
  - Do:
    1. Create `src/components/PlayerSprite.tsx` — renders the player sprite at grid position using CSS. Uses the existing player spritesheet (public/assets/sprites/player.png or character-placeholder.png). Walk animation via CSS sprite-sheet + `animation` or class toggle based on movement state. Position: absolute at `(x * tileSize, y * tileSize)`. z-index above ground tiles but at same level as above tiles.
    2. Update GameContainer to use `useGridEngine` hook instead of manual camera state. Pass `move(direction)` to keyboard handler. Pass player position as camera center to CameraViewport.
    3. Add keyboard input: on keydown, call `gridEngine.move(direction)` for the pressed arrow/WASD key. Only dispatch if no dialog is open (future-proof).
    4. Update CameraViewport to accept player position as camera center. Remove temporary keyboard panning.
    5. Add smooth camera interpolation — lerp toward player position for natural feel (CSS transition on transform).
  - Verify: `npm run build` passes, browser shows player sprite moving tile-by-tile with camera follow
  - Done when: Player moves with arrow keys, collides with buildings/ocean, camera follows, walk animation plays

- [ ] **T03: Movement polish + browser verification** `est:15m`
  - Why: Ensure movement feels right — grid-locked, responsive, no edge cases
  - Files: `tests/movement.test.ts`
  - Do:
    1. Browser verification: walk from spawn to Thoven HQ, verify collision with buildings, try to walk into ocean.
    2. Verify walk animation plays during movement and stops on idle.
    3. Add tests for edge cases: player can't move off-map, collision tiles block movement, spawn position is correct.
    4. Verify camera clamps correctly at map edges.
  - Verify: All tests pass, browser verification screenshots confirm grid movement
  - Done when: Movement feels grid-locked and responsive, no drift or float

## Files Likely Touched

- `src/hooks/useGridEngine.ts` — GridEngineHeadless React hook
- `src/maps/collision.ts` — collision data for ArrayTilemap
- `src/components/PlayerSprite.tsx` — player sprite rendering
- `src/components/GameContainer.tsx` — wire movement + camera
- `src/components/CameraViewport.tsx` — accept player position
- `tests/movement.test.ts` — movement + collision tests
