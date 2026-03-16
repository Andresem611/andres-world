---
id: S09
parent: M001
milestone: M001
provides:
  - InteriorBaseScene keyboard bug fixed (keys created once in create(), not every frame in update())
  - Interior camera zoom 4x (matching overworld)
  - Mobile gate — touch-only/small screen devices see static landing page with social links
  - 16 tests covering scene transitions, interior implementation, and mobile gate
requires:
  - slice: S08
    provides: Character sprites and dialogue content layer
affects:
  - S10 (Andres's Room uses InteriorBaseScene — now bug-free)
  - S11-S12 (all interiors inherit fixed base class)
key_files:
  - src/game/scenes/InteriorBaseScene.ts
  - index.html
  - public/style.css
  - tests/interior-base.test.ts
key_decisions:
  - "Keyboard creation moved from update() to create() — same fix as Overworld.ts"
  - "Interior camera zoom set to 4x to match overworld pixel art scale"
  - "Mobile gate uses dual detection: touch-only (ontouchstart + no fine pointer) OR small screen (<768px)"
  - "Mobile gate shows static landing with social links — doesn't try to run game"
  - "Removed debug window.__SCENE_DEBUG surface — not needed for production"
patterns_established:
  - "All scene input creation in create(), never update() — consistent across Overworld and InteriorBase"
  - "Mobile gate pattern: inline script checks device, toggles display of #mobile-gate vs #game-container"
observability_surfaces: []
drill_down_paths: []
duration: 15min
verification_result: passed
completed_at: 2026-03-14
blocker_discovered: false
---

# S09: Pre-Interior Architecture

**Fixed InteriorBaseScene keyboard/zoom bugs, added mobile gate for touch devices, verified transition architecture with 16 tests.**

## What Happened

T01 fixed the keyboard creation bug in InteriorBaseScene.update() — same issue that was previously fixed in Overworld.ts. Cursors and WASD keys are now created once in create() as class fields. Added 4x camera zoom to match overworld. Removed the debug window surface.

T02 added mobile gate detection to index.html. Touch-only devices or screens under 768px wide see a styled static landing page with "ANDRES WORLD" title, description, social links (Twitter, LinkedIn, GitHub, Email), and "Best experienced on desktop" messaging. Game canvas is hidden. Desktop browsers see the game normally.

T03 expanded the test suite from 5 to 16 tests covering: scene transition data contracts (both directions), building entrance registration in Overworld, interior map existence and required layers, keyboard bug fix verification, camera zoom verification, subclass pattern verification, mobile gate HTML/CSS/JS content.

## Verification

- ✅ 41/41 tests pass (16 in interior-base.test.ts)
- ✅ `vite build` clean
- ✅ Mobile gate renders on small viewport (390px) — verified via accessibility tree
- ✅ Desktop shows game normally — mobile gate hidden
- ✅ InteriorBaseScene.update() no longer creates keys every frame

## Requirements Advanced

- POLI-03 — Mobile D-pad overlay → replaced with mobile gate (graceful static landing page)

## Deviations

None.

## Known Limitations

- Mobile gate uses inline `<script>` for detection — runs before Phaser loads, so game module still downloads (just isn't displayed). Could be optimized with conditional script loading.
- Social links are placeholder URLs (twitter.com/andresmartinez etc.) — need real URLs from Andres.

## Follow-ups

- Update social link URLs when Andres provides real handles

## Files Created/Modified

- `src/game/scenes/InteriorBaseScene.ts` — keyboard bug fix, 4x zoom, debug surface removed
- `index.html` — added mobile gate div, detection script, game-container wrapper
- `public/style.css` — added mobile gate styles
- `tests/interior-base.test.ts` — expanded from 5 to 16 tests

## Forward Intelligence

### What the next slice should know
- InteriorBaseScene is now production-ready. Subclass it, override getMapKey() and onInteriorCreate(). See ThovenHQ.ts and AndresRoom.ts for pattern.
- Interior maps need `ground`, `exits`, and `collision` layers (lowercase). Exit tiles in the `exits` layer trigger return to overworld.
- Room_Builder_16x16 and Interiors_16x16 tilesets are auto-loaded by the base class.

### What's fragile
- The `exitPositions` collection relies on layer name being exactly "exits" (lowercase). If a Tiled map uses "Exits" it won't work.
- Interior maps are 8x8 stubs. Real content maps need proper tile placement.

### Authoritative diagnostics
- `npx vitest run` — 41 tests, all pass
- Mobile gate: set viewport to 390px wide, reload, check `#mobile-gate` display is `flex`

### What assumptions changed
- None — S09 delivered exactly what was planned.
