# M002: Andres World v2.0 (Path A+)

**Vision:** Rebuild andresmartinez.com as a React DOM game using GridEngineHeadless for movement and code-defined maps. Same Pokemon Gen 1/2 pixel-art overworld, same content, dramatically simpler implementation. Every feature from M001 preserved, rendering moved from canvas to DOM.

## Success Criteria

- Visitors can walk the full Miami-themed overworld map with grid-locked movement and talk to all 14+ NPCs
- Every building entrance either loads a React interior view or shows an under-construction dialog
- All 5 hidden areas are reachable via correct paths through tall grass
- Pokemon-style dialog boxes render via nes-ui-react (or equivalent DOM components)
- The site loads with a Pokemon-style title card before entering the overworld
- Mobile shows a graceful static landing page (no broken game)
- The site is live at andresmartinez.com with correct Open Graph meta tags
- All content from M001 is present — zero dialogue, NPC, or interaction regressions

## Key Risks / Unknowns

- DOM tile rendering performance with 50×40 grid during camera scroll — could jank on low-end devices
- CSS movement interpolation feel — may not match canvas smoothness without extra work
- GridEngineHeadless + React integration pattern — no established reference implementation exists

## Proof Strategy

- DOM rendering performance → retire in S01 by proving 50×40 tile grid renders and scrolls smoothly
- CSS movement feel → retire in S02 by proving grid movement with sprite animation feels right
- GridEngineHeadless integration → retire in S02 by proving movement, collision, and character position updates work via React state

## Verification Classes

- Contract verification: Vitest unit tests for map data, NPC config, dialogue content, interaction routing
- Integration verification: browser-based verification of movement, dialog, transitions, rendering
- Operational verification: Vercel deployment, page load time, pixel-perfect rendering at 4x zoom
- UAT / human verification: movement feel, visual quality, content completeness

## Milestone Definition of Done

This milestone is complete only when all are true:

- All 8 slices are complete with passing tests and browser verification
- A visitor can walk from dock to every building, enter all interiors, talk to all NPCs, find all hidden areas
- The site is deployed to andresmartinez.com and loads in <3s
- Movement feels grid-locked and responsive (no float, no drift)
- All M001 dialogue content is present (verified via content diff)
- Title card, mobile gate, and OG meta tags are functional

## Requirement Coverage

- Covers: all M001 requirements (overworld, movement, NPCs, interiors, hidden areas, construction, bulletin board, title screen, mobile gate, SEO)
- Partially covers: none
- Leaves for later: audio/music (infrastructure only), real-time data (Thoven metrics static), mobile touch controls
- Orphan risks: none

## Slices

- [x] **S01: React + Vite Scaffold + Tile Renderer** `risk:high` `depends:[]`
  > After this: A 50×40 tile grid renders in the browser from a TypeScript 2D array with camera scrolling, 4x pixel zoom, and smooth viewport panning. No movement yet — just the rendered map with ground, paths, buildings, water, and trees visible.

- [x] **S02: GridEngineHeadless + Character Movement** `risk:high` `depends:[S01]`
  > After this: Player sprite moves on the tile grid with arrow keys / WASD, grid-locked 4-directional movement, collision with buildings/water/trees, camera follows player. GridEngineHeadless manages all movement state, React renders position via CSS transform.

- [x] **S03: NPC System + Dialog UI** `risk:medium` `depends:[S02]`
  > After this: All 14+ overworld NPCs are visible at their positions, Space/E opens Pokemon-style dialog box (nes-ui-react or custom DOM), NPC turns to face player, dialog advances and closes. John Collison patrols Main Street.

- [x] **S04: Building Interactions + Interior Framework** `risk:medium` `depends:[S03]`
  > After this: Player can enter Andres's Room (first interior). Camera fades, interior React view loads with its own tile grid, objects, and NPCs. Player can exit back to overworld at correct position. Under-construction buildings show dialog popup. VC Office door is locked.

- [x] **S05: Remaining Interiors** `risk:medium` `depends:[S04]`
  > After this: Thoven HQ (metrics board, shipped corkboard, practice rooms, 3 NPCs), Starbucks Café (essays, Paul Graham, barista), and Engineering Lab (experiments, stack wall, rubber duck, 3 NPCs) are all enterable and fully interactive.
  > **Note: Collapsed into S04 — all 4 interiors delivered together.**

- [x] **S06: Hidden Areas + Bulletin Board** `risk:low` `depends:[S03]`
  > After this: All 5 hidden areas accessible (Secret Beach, Music Room, Idea Graveyard, Lookout Hill, Hidden NPC) with correct signs and NPCs. Bulletin board has 7 pressable pins and adjacent PC. Dalton Caldwell NPC on bench.

- [x] **S07: Title Screen + Mobile Gate + SEO** `risk:low` `depends:[S05,S06]`
  > After this: Pokemon-style "ANDRES WORLD" title card with loading bar. Mobile gate blocks touch devices with static landing. OG meta tags and structured data for social sharing.

- [x] **S08: Visual Polish + Deploy** `risk:low` `depends:[S07]`
  > After this: Pixel-perfect rendering verified. Multi-tile building facades match M001 visual quality. Music infrastructure ready. Deployed to andresmartinez.com on Vercel. Content parity with M001 verified.

## Boundary Map

### S01 → S02

Produces:
- `TileRenderer` React component that renders a 2D tile array as positioned DOM elements with CSS sprite-sheet backgrounds
- `MapData` TypeScript type defining tile grid structure (layers: ground, above, collision)
- `CameraViewport` component that scrolls the map within a fixed viewport using CSS transform
- `OVERWORLD_MAP` constant — the full 50×40 tile data as TypeScript arrays
- Tile-to-CSS mapping: function converting tile IDs to CSS `background-position` values for LimeZu sprite sheets

Consumes:
- nothing (first slice)

### S02 → S03

Produces:
- `useGridEngine` React hook wrapping GridEngineHeadless — exposes move commands, character positions (reactive), facing direction
- `PlayerSprite` component rendering the player at grid position with walk animation via CSS sprite sheet
- Keyboard input system (arrow keys + WASD) dispatching movement commands to GridEngineHeadless
- Camera follow behavior — viewport centers on player position

Consumes:
- `TileRenderer`, `CameraViewport`, `OVERWORLD_MAP` from S01

### S03 → S04

Produces:
- `NpcSprite` component rendering NPCs at grid positions with facing direction
- `DialogBox` React component (nes-ui-react or custom) — shows lines, advances on Space/E, closes on last line
- `InteractionSystem` — detects player facing position, looks up interaction target, triggers appropriate handler
- `useDialog` hook managing dialog state (open/close, current lines, advance)
- NPC turn-to-face behavior when player interacts
- John Collison patrol via GridEngineHeadless queue movements

Consumes:
- `useGridEngine`, `PlayerSprite`, keyboard input from S02
- `dialogue.ts` content (carried from M001)
- `npcs.ts` config (adapted from M001)

### S04 → S05

Produces:
- `InteriorView` component — renders an interior tile grid with its own map data, NPCs, and interactable objects
- Scene transition system: fade out overworld → load interior → fade in. Reverse on exit
- `useInteriorTransition` hook managing transition state and return position
- `AndresRoom` interior view with all objects (bed, PC, DJ, bookshelf, jersey, flags, pennant, poster, window) and NPCs (Dad, 2 dachshunds)
- Under-construction interaction type: shows dialog, no scene transition
- Locked door interaction type: shows "door's locked" dialog

Consumes:
- `InteractionSystem`, `DialogBox`, `NpcSprite` from S03
- `TileRenderer` from S01 (reused for interior grids)

### S05 → S07

Produces:
- `ThovenHQ` interior view (metrics board, shipped corkboard, 4 practice rooms, Keri + Michael Seibel + Brian Chesky NPCs)
- `StarbucksCafe` interior view (barista, 2 essay tables, Paul Graham NPC)
- `EngineeringLab` interior view (3 experiments, stack wall, rubber duck, Tobi + Patrick + Dario NPCs)

Consumes:
- `InteriorView`, scene transition system from S04

### S03 → S06

Produces:
- Hidden area map regions with tall grass visual treatment
- Bulletin board interaction: 7 pins each showing different learning topic dialog
- Bulletin PC link interaction
- 3 hidden area NPCs (Vinod Khosla, Ben Horowitz, Dalton Caldwell) at correct positions

Consumes:
- `InteractionSystem`, `DialogBox`, `NpcSprite` from S03
- `OVERWORLD_MAP` from S01 (map data includes hidden area regions)

### S06 → S07, S05 → S07

Produces:
- All game content is interactive and accessible

Consumes:
- All interior views from S05
- All hidden areas and bulletin board from S06

### S07 → S08

Produces:
- `TitleScreen` component with pixel-art title card, loading bar, press-to-start
- Mobile detection + gate component
- HTML meta tags (OG, Twitter card, description)

Consumes:
- Full game from S05 + S06
