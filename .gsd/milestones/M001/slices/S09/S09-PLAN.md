# S09: Pre-Interior Architecture

**Goal:** Everything that must be true before the first interior can be built: InteriorBaseScene with tilemap loading, Grid Engine init, exit detection, and camera fade transitions. Mobile gate shows a static landing page. Scene transition contract proven with one complete enter→walk→exit round-trip.
**Demo:** Player enters Thoven HQ door tile → camera fades → InteriorBaseScene loads a stub interior map with Grid Engine → player walks to exit tile → camera fades → returns to overworld at correct position with correct facing direction. On mobile viewport, Phaser canvas is replaced with a static landing page.

## Must-Haves

- InteriorBaseScene extends Phaser.Scene with: tilemap load from JSON, Grid Engine init, player spawn at entry position, exit-tile detection, camera fade in/out, return data passing
- Scene transition contract: Overworld passes `{ buildingKey, returnPos, entryPos }` → Interior receives and initializes → Interior passes `{ returnFrom: { returnPos, facingDirection } }` back
- Camera fade transition (not instant scene swap) on enter and exit
- Exit tile detection: player steps on a designated "exit" tile → triggers return to Overworld
- Mobile gate: viewport width < 768px → show static HTML landing page, hide Phaser canvas
- TILE-REGISTRY.md documenting all LimeZu tileset files, which scenes use them, and GID ranges

## Proof Level

- This slice proves: integration (scene lifecycle + Grid Engine re-init + data passing round-trip)
- Real runtime required: yes (Phaser scene transitions, Grid Engine state)
- Human/UAT required: no (browser automation can verify)

## Verification

- `npx vitest run tests/interior-base.test.ts` — InteriorBaseScene class shape, transition data contract types
- `npx vitest run tests/mobile-gate.test.ts` — mobile detection utility returns correct result for various widths
- Browser verification: navigate to localhost, enter Thoven HQ, confirm fade + interior loads, walk to exit, confirm return position
- Browser verification (mobile viewport): set viewport to 375×667, confirm static page shown instead of canvas

## Observability / Diagnostics

- Runtime signals: console.log on scene transitions with buildingKey, entry/exit positions
- Inspection surfaces: `window.__SCENE_DEBUG` object exposing current scene key, last transition data
- Failure visibility: Grid Engine errors surface in console if character init fails in interior
- Redaction constraints: none

## Integration Closure

- Upstream surfaces consumed: `InteriorStubScene` pattern (replaced), `Overworld.ts` building interaction handler, `src/game/main.ts` scene registration
- New wiring introduced: InteriorBaseScene registered in game config, Overworld building handler updated to pass full transition data, mobile gate wraps Phaser init
- What remains before the milestone is truly usable end-to-end: individual interior content (S10-S12), hidden areas (S13), loading screen (S14), polish (S15)

## Tasks

- [ ] **T01: InteriorBaseScene + transition data contract** `est:45m`
  - Why: Core scene class that all interiors extend. Must handle tilemap, Grid Engine, player spawn, exit detection, and camera fades. Currently InteriorStubScene is a text-only placeholder with no real scene infrastructure.
  - Files: `src/game/scenes/InteriorBaseScene.ts`, `src/types/scene-data.ts`, `tests/interior-base.test.ts`
  - Do: (1) Create `src/types/scene-data.ts` with `InteriorTransitionData` and `OverworldReturnData` interfaces. (2) Create `InteriorBaseScene` that: loads a Tiled JSON map by `buildingKey`, initializes Grid Engine with player at `entryPos`, detects exit tiles (layer named "exits" or tile property `exit: true`), triggers camera fadeOut → scene.start("Overworld", returnData) on exit. (3) Add camera fadeIn on create. (4) Write unit tests for type shapes and class method existence.
  - Verify: `npx vitest run tests/interior-base.test.ts`
  - Done when: InteriorBaseScene class exists with create/exit flow, types exported, tests pass

- [ ] **T02: Wire InteriorBaseScene into game + update Overworld transition** `est:30m`
  - Why: Connect the new scene class to the actual game. Replace InteriorStubScene with InteriorBaseScene for buildings that have maps (Thoven HQ stub), keep stub for others.
  - Files: `src/game/main.ts`, `src/game/scenes/Overworld.ts`, `src/game/scenes/InteriorStub.ts`
  - Do: (1) Register InteriorBaseScene in game config scene array. (2) Update Overworld `handleInteraction` for "building" type to: camera fadeOut → scene.start(buildingKey) with InteriorTransitionData. (3) Create a minimal `thoven-hq-stub.json` Tiled map (8×8 tiles, single ground layer + exits layer) for testing the round-trip. (4) Add `window.__SCENE_DEBUG` diagnostic surface. (5) Keep InteriorStubScene as fallback for buildings without maps.
  - Verify: `npm run dev` → browser → walk to Thoven HQ door → press Space → see fade + interior → walk to exit → return to overworld at correct position
  - Done when: Complete enter→interior→exit→return round-trip works in browser with camera fades

- [ ] **T03: Mobile gate** `est:20m`
  - Why: Mobile visitors should see a static landing page, not a broken/tiny Phaser canvas. S15 success criteria: "Mobile shows a graceful static landing page."
  - Files: `src/mobile-gate.ts`, `index.html`, `style.css`, `tests/mobile-gate.test.ts`
  - Do: (1) Create `isMobile()` utility (check viewport width < 768 or touch-only device). (2) In `index.html` or entry point, conditionally render either Phaser game or a static `<div>` with site name, tagline, and social links. (3) Style the static page with pixel-art aesthetic (Press Start 2P font, dark bg). (4) Write unit test for `isMobile()` detection logic.
  - Verify: `npx vitest run tests/mobile-gate.test.ts` + browser at 375×667 viewport shows static page
  - Done when: Mobile viewport shows styled landing page; desktop viewport shows Phaser game; tests pass

- [ ] **T04: TILE-REGISTRY.md + slice verification** `est:15m`
  - Why: Document tileset inventory before building real interiors. Success criteria requires this documentation.
  - Files: `TILE-REGISTRY.md`
  - Do: (1) Create TILE-REGISTRY.md listing all tileset PNGs in `public/assets/tilesets/`, which scenes reference them, tile size, GID ranges from overworld.json, and LimeZu pack origin. (2) Run full test suite. (3) Run browser round-trip verification one final time.
  - Verify: `npx vitest run` (full suite green) + file exists with all tilesets documented
  - Done when: TILE-REGISTRY.md complete, all tests pass, browser verification passes

## Files Likely Touched

- `src/game/scenes/InteriorBaseScene.ts` (new)
- `src/types/scene-data.ts` (new)
- `src/mobile-gate.ts` (new)
- `src/game/main.ts`
- `src/game/scenes/Overworld.ts`
- `src/game/scenes/InteriorStub.ts`
- `index.html`
- `style.css`
- `public/assets/maps/thoven-hq-stub.json` (new)
- `tests/interior-base.test.ts` (new)
- `tests/mobile-gate.test.ts` (new)
- `TILE-REGISTRY.md` (new)
