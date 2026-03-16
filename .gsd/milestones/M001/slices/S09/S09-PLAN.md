# S09: Pre-Interior Architecture

**Goal:** Fix interior scene bugs, add mobile gate, verify enter→walk→exit round-trip works. End with interiors fully functional for S10-S12 content.

**Demo:** Player enters Thoven HQ from overworld → walks inside → walks to exit tile → returns to overworld at correct position. Mobile devices see a static landing page instead of broken canvas.

## Must-Haves

- InteriorBaseScene `update()` keyboard bug fixed (keys created in `create()`, not every frame)
- Interior camera zoom matches overworld (4x)
- Mobile gate: touch devices get a static landing page, not a broken game canvas
- Enter→walk→exit round-trip verified working (Thoven HQ and Andres's Room)
- `vite build` clean, all tests pass

## Tasks

- [x] **T01: Fix InteriorBaseScene bugs** `est:5min`
  - Move keyboard creation from `update()` to `create()`. Add 4x camera zoom. Remove debug surface.
- [x] **T02: Mobile gate** `est:10min`
  - Touch-only or small screen → show static landing page with social links. Hide game canvas.
- [x] **T03: Verify transitions + write test** `est:10min`
  - 16 tests covering transition contracts, interior implementation, mobile gate HTML/CSS/JS.

## Files Likely Touched

- `src/game/scenes/InteriorBaseScene.ts`
- `index.html`
- `style.css`
- `tests/interior-base.test.ts`
