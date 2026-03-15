# T02: 02-overworld-map 02

**Slice:** S02 — **Milestone:** M001

## Description

Transform BootScene into an asset preloader, create OverworldScene with Grid Engine movement and camera, place the placeholder character sprite, and wire everything into main.ts.

Purpose: This is the playable layer — keyboard input, grid movement, camera tracking, and character animation all live here. Once Plan 02-01 (map JSON) and this plan are both complete, Plan 02-03 can wire them together for the full playable world.
Output: `src/game/scenes/Overworld.ts` (full scene), updated `Boot.ts` (preloader), updated `main.ts` (scene registration), `public/assets/sprites/character-placeholder.png`.

## Must-Haves

- [ ] "BootScene preloads all Phase 2 assets then transitions to OverworldScene"
- [ ] "OverworldScene builds the tilemap and starts Grid Engine with player character"
- [ ] "Player spawns at south dock (x=25, y=38) facing north"
- [ ] "Arrow keys and WASD move the character one tile at a time"
- [ ] "Camera follows the player and clamps to map bounds"
- [ ] "Character sprite is a 4-directional RPG figure (not Red/Ash) with walking animation"
- [ ] "Idle pose is the standing middle frame — no input = no animation cycling"

## Files

- `src/game/scenes/Boot.ts`
- `src/game/scenes/Overworld.ts`
- `src/game/main.ts`
- `public/assets/sprites/character-placeholder.png`
