---
id: M002
provides:
  - Full React DOM rebuild of Andres World (no Phaser dependency)
  - DOM tile renderer with CSS background-position and viewport culling
  - GridEngineHeadless integration via custom React hook
  - 14 overworld NPCs with dialogue, facing, and patrol
  - Pokemon-style dialog box (React/CSS)
  - 4 fully interactive interiors (Andres's Room, Thoven HQ, Starbucks, Engineering Lab)
  - Scene transition system (overworld ↔ interior) with fade
  - Building entrance routing, signs, under-construction popups
  - 5 hidden areas with signs and hidden NPCs
  - 7 bulletin board pins + PC interaction
  - Title screen with press-any-key flow
  - Mobile gate (touch detection + static landing page)
  - SEO/OG tags + noscript fallback
  - Music infrastructure (graceful missing-file handling)
  - 440KB production bundle (74% reduction from 1.7MB Phaser)
key_decisions:
  - "DOM tiles with CSS background-position — proved viable at 50×40 scale with ~400 visible nodes"
  - "GridEngineHeadless via useGridEngine hook — setInterval(50ms) drives update loop"
  - "ArrayTilemap from collision layer — 0=walk, 1=block"
  - "CSS sprite animation with @keyframes steps(3) for pixel-art walk cycles"
  - "Interior tilesets separate from overworld — getTileStyle accepts tileset array param"
  - "All 4 interiors delivered in S04 — S05 collapsed since framework made them trivial"
  - "InteriorView creates its own GridEngineHeadless instance per room"
  - "Scene transition: 300ms setTimeout fade → switch scene state"
patterns_established:
  - "React hooks as game systems: useGridEngine, useDialog, useSceneTransition, useMusic"
  - "Map data as TypeScript constants extracted from Tiled JSON via scripts"
  - "Interaction map keyed by 'x,y' string for O(1) tile lookup"
  - "Interior-specific NPC/interaction configs as static records in InteriorView"
  - "TileRenderer accepts tilesets prop for overworld vs interior rendering"
observability_surfaces:
  - "Console logs for missing music files (graceful fallback)"
  - "Test suite: 230 tests across 19 files — run with npx vitest run"
requirement_outcomes: []
duration: 1 session
verification_result: passed
completed_at: 2026-03-14
---

# M002: Andres World v2.0 — React DOM Rebuild

**Complete rebuild from Phaser 3 to React DOM + GridEngineHeadless. 440KB bundle (74% reduction), 230 tests, full content parity with M001.**

## What Happened

S01 established the foundation: React + Vite scaffold with a DOM-based tile renderer that renders LimeZu 16x16 tilesets as positioned divs with CSS `background-position`. The 50×40 overworld uses viewport culling (~400 visible nodes) with 4x zoom. This proved DOM rendering was viable for pixel-art games at this scale.

S02 integrated GridEngineHeadless through a custom `useGridEngine` hook. The hook wraps engine lifecycle, exposes `playerState`/`move()`/`engine` ref, and drives updates via `setInterval(50ms)`. CSS `@keyframes` with `steps(3)` handles player walk animation. Camera follow centers on the player within a CameraViewport component.

S03 added all 14 NPCs from M001 content. NpcSprite renders 32×32 PNGs, DialogBox implements Pokemon-style typewriter dialog in pure React/CSS, and `useDialog` manages dialog state. GameContainer handles Space/E interaction with facing detection, NPC turn-to-face, and movement locking. John Collison patrols via `movementStopped` subscription.

S04 delivered all 4 interiors in one slice (collapsing S05). An overworld interaction map routes signs, building entrances, and under-construction markers. `useSceneTransition` manages fade transitions. InteriorView creates its own GridEngineHeadless instance per room with Room_Builder/Interiors tilesets, interior-specific NPCs, and object interactions. Exit detection works via `positionChangeFinished` + exit positions from Tiled maps.

S06 added hidden area signs (Secret Beach, Music Room, Idea Graveyard, Lookout Hill, Hidden Mentor) and 7 bulletin board pins with a PC interaction. S07 built a Pokemon-style title screen with player sprite and press-any-key flow, preserving the M001 mobile gate and SEO tags. S08 added music infrastructure and comprehensive content parity tests.

## Cross-Slice Verification

- **230 tests pass** across 19 test files (`npx vitest run`)
- **TypeScript clean** — zero errors with `npx tsc --noEmit`
- **Production build**: 440KB (was 1.7MB with Phaser — 74% reduction)
- **Content parity**: 14 NPCs, 247+ lines dialogue, 4 interiors, 5 hidden areas, 7 bulletin pins — all verified by tests
- **Asset verification**: All 15 NPC sprites, player sprite, 6 overworld tilesets, 2 interior tilesets exist
- **Interior maps**: 4 rooms extracted from Tiled JSON with correct dimensions and exit positions
- **Interaction routing**: All dialog references resolve to valid DIALOGUE entries
- **Mobile gate**: Touch detection + static landing verified in index.html
- **SEO**: OG tags, Twitter card, meta description, noscript fallback present

## Requirement Changes

No requirement transitions in M002 — all 79 M001 requirements remain validated.

## Forward Intelligence

### What the next milestone should know
- The old Phaser code in `src/game/` is still present — safe to delete now that React rebuild is complete
- Interior NPC positions and object interaction coordinates are hardcoded in InteriorView.tsx — consider extracting to config files if interiors grow
- The `useGridEngine` hook creates the engine on mount and never destroys it — watch for memory if adding scene reloading
- `scripts/extract-map-data.ts` and `scripts/extract-interiors.ts` convert Tiled JSON to TypeScript — rerun after map edits

### What's fragile
- Interior tilesets have approximate tileCount (10000 for Interiors_16x16) — works because we only look up GIDs that exist, but could be an issue if new tiles use high GIDs
- Scene transition uses 300ms setTimeout — no actual animation frame coordination, just trust that 300ms is long enough for the CSS fade
- John Collison patrol uses setInterval(500ms) fallback — could accumulate intervals if the component re-mounts rapidly

### Authoritative diagnostics
- `npx vitest run` — 230 tests covering maps, NPCs, dialog, interactions, interiors, title screen, SEO, assets
- `npx tsc --noEmit` — TypeScript strictness
- `npm run build` — production bundle size (should stay under 500KB)
- Browser console — music fallback logs show which audio files are missing

### What assumptions changed
- Originally planned S04 (Andres's Room only) + S05 (remaining 3 interiors) — collapsed into one slice because the interior framework made adding rooms trivial
- Assumed DOM rendering might struggle at 50×40 — viewport culling keeps it under 400 nodes, no performance issues

## Files Created/Modified

- `src/App.tsx` — TitleScreen → GameContainer flow
- `src/components/TileRenderer.tsx` — DOM tile renderer with tilesets prop
- `src/components/CameraViewport.tsx` — viewport with culling + NPC rendering
- `src/components/GameContainer.tsx` — movement, NPCs, interactions, scene transitions
- `src/components/PlayerSprite.tsx` — CSS sprite animation
- `src/components/NpcSprite.tsx` — 32×32 NPC rendering
- `src/components/DialogBox.tsx` — Pokemon-style dialog
- `src/components/InteriorView.tsx` — interior rooms with own GridEngine
- `src/components/TitleScreen.tsx` — title card + press any key
- `src/hooks/useGridEngine.ts` — GridEngineHeadless React hook
- `src/hooks/useDialog.ts` — dialog state management
- `src/hooks/useSceneTransition.ts` — overworld ↔ interior transitions
- `src/hooks/useMusic.ts` — audio playback with graceful fallback
- `src/maps/overworld.ts` — 50×40 overworld map data
- `src/maps/collision.ts` — collision layer
- `src/maps/tilesets.ts` — overworld + interior tileset configs
- `src/maps/interiors.ts` — 4 interior map data constants (auto-generated)
- `src/maps/interactions.ts` — interaction map (signs, buildings, hidden areas, bulletin)
- `src/content/dialogue.ts` — all dialogue content (carried from M001)
- `src/game/config/npcs.ts` — 14 NPC configs (carried from M001)
- `scripts/extract-interiors.ts` — Tiled JSON → TypeScript converter
- `tests/` — 19 test files, 230 tests
