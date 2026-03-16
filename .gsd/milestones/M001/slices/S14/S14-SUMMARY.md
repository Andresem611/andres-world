---
id: S14
parent: M001
milestone: M001
provides:
  - Pokemon-style "ANDRES WORLD" title card with character sprite
  - Loading progress bar during asset preload
  - Press any key or click to start game
  - Fade-out camera transition to overworld
  - Boot now preloads all interior maps and tilesets centrally
duration: 10min
verification_result: passed
completed_at: 2026-03-14
blocker_discovered: false
---

# S14: Loading Screen

**Pokemon-style title card: "ANDRES WORLD" with character sprite, loading bar, press any key to start.**

## What Happened

Split Boot scene into Boot (asset loading + progress bar) → TitleScreen (title card + input). Boot now loads all interior maps and tilesets centrally. TitleScreen shows "ANDRES WORLD" with a 3x-scaled player sprite, blinking "PRESS ANY KEY" text, and fades out to Overworld on input.

## Verification

- ✅ 118/118 tests pass (11 new)
- ✅ `vite build` clean
- ✅ LOAD-01, LOAD-02, LOAD-03 all covered

## Files Created/Modified

- `src/game/scenes/Boot.ts` — rewritten with progress bar + central asset loading
- `src/game/scenes/TitleScreen.ts` — new title card scene
- `src/game/main.ts` — registered TitleScreenScene
- `tests/loading-screen.test.ts` — 11 tests
