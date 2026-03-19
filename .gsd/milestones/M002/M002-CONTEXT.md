# M002: Andres World v2.0 — Context

**Gathered:** 2026-03-14
**Status:** Ready for planning

## Project Description

Andres World is a personal website at andresmartinez.com built as a playable Pokemon Gen 1/2 pixel-art overworld game. Visitors control a character and walk around a Miami-themed, top-down tile-based map where every building is a project, section, or piece of Andres's life. Buildings have interiors with NPCs, signs, and interactive objects.

M001 shipped the full site using Phaser 3 + Grid Engine + Tiled. It works, but the Tiled JSON/GID complexity made AI-assisted iteration painful — every map change required understanding GID translation layers, tileset offset math, and a 463-line enhancement script. Canvas-rendered text (dialog boxes, menus) was the hardest UI work, requiring pixel-level adjustment that's trivial in CSS.

## Why This Milestone

**Stack pivot to Path A+**: React DOM rendering + GridEngineHeadless + nes-ui-react. Same game, dramatically simpler implementation.

- **Maps become TypeScript arrays** — `ArrayTilemap` takes `{ data: [[0,0,1],[0,1,0]] }`. No Tiled, no GIDs, no tileset offset math
- **UI is DOM/CSS** — dialog boxes, menus, popups are React components with CSS. The LennyRPG creator's hardest problem ("Phaser UI polish") becomes trivial
- **Grid Engine stays** — `GridEngineHeadless` provides the same movement/collision/pathfinding without Phaser. Our movement concepts carry over
- **Claude Code autonomy jumps to ~95%** — everything is TypeScript/React/CSS, all verifiable with browser tools
- **All content carries over** — dialogue.ts (247 lines), npcs.ts (175 lines), 16 NPC sprites, player sprite, LimeZu tilesets

## User-Visible Outcome

### When this milestone is complete, the user can:

- Visit andresmartinez.com and see a Pokemon-style title card
- Control a character with arrow keys / WASD on a Miami-themed pixel-art overworld map
- Talk to 14+ NPCs with Pokemon-style dialog boxes (self-aware, funny, fourth-wall breaking)
- Enter 4 building interiors (Andres's Room, Thoven HQ, Starbucks Café, Engineering Lab)
- Find 5 hidden areas through tall grass (Secret Beach, Music Room, Idea Graveyard, Lookout Hill, Hidden NPC)
- Read 7 bulletin board pins about learning topics
- See under-construction scaffolding on Chalk Lab and locked door on VC Office
- Experience the same game feel as M001 but with cleaner rendering and better text/UI

### Entry point / environment

- Entry point: https://andresmartinez.com
- Environment: browser (desktop primary, mobile gate)
- Live dependencies involved: none (static site on Vercel)

## Completion Class

- Contract complete means: all interactions, transitions, dialogues work correctly; movement feels grid-locked and responsive
- Integration complete means: the full site works end-to-end in a browser — overworld → interiors → back, all NPCs talkable, all hidden areas reachable
- Operational complete means: deployed to Vercel, loads in <3s, renders pixel-perfect at all common viewport sizes

## Final Integrated Acceptance

To call this milestone complete, we must prove:

- A visitor can walk from dock spawn to every building, enter all 4 interiors, talk to every NPC, and find all 5 hidden areas
- The game feel (grid movement, camera follow, sprite animation) is indistinguishable from a quality pixel-art game
- All M001 content is present — no dialogue, NPC, or interaction was lost in the port
- The site loads with title card, renders at pixel-perfect quality, and deploys to Vercel

## Risks and Unknowns

- **Movement feel in DOM** — CSS transform transitions may not feel as smooth as canvas rendering. Mitigation: GridEngineHeadless handles the logic; CSS `steps()` + `transition` handles interpolation. Escape hatch: embed a tiny canvas layer just for character movement if needed
- **Tile rendering performance** — 50×40 = 2000 tile divs. Modern browsers handle this fine, but need to verify no jank during camera scroll. Mitigation: CSS `will-change: transform` on viewport container, only render visible tiles
- **react-super-tilemap maturity** — 11 GitHub stars, small project. May need to build custom tile renderer instead. Mitigation: the custom renderer is ~200 lines of React — just divs with CSS background-position
- **NES.css / nes-ui-react styling integration** — may need customization to match Pokemon Gen 1/2 dialog box aesthetic exactly

## Existing Codebase / Prior Art

- `src/content/dialogue.ts` — 247 lines, all NPC/sign/building dialogue. Carries over as-is
- `src/game/config/npcs.ts` — 175 lines, NPC positions/sprites/config. Carries over with minor interface changes
- `public/assets/sprites/` — 16 NPC PNGs + player sprite sheet. Carries over as-is
- `public/assets/tilesets/` — 13 LimeZu tileset PNGs. Carries over as CSS sprite sheets
- `docs/plans/2026-03-08-andres-world-personal-site-design.md` — 447-line design doc with full world geography, NPC roster, building specs, interaction model. The canonical reference
- `docs/research/alternative-approaches-pixel-art-interactive-site.md` — 1148-line research doc evaluating frameworks, case studies, and tooling. Led to Path A+ decision
- `.gsd/milestones/M001/` — complete M001 history (15 slices). Reference for what worked and what was painful

> See `.gsd/DECISIONS.md` for all architectural and pattern decisions — it is an append-only register; read it during planning, append to it during execution.

## Relevant Requirements

All original requirements carry forward. The stack changes but the features don't:

- Overworld map: Miami-themed, ~50×40 tiles, tile-based grid movement, collision, camera follow
- Character sprite: original founder sprite with 4-directional walk animation
- Building interaction system: Space/E to interact, different behaviors per building type
- NPC dialogue system: Pokemon-style text box, self-aware/funny tone
- 4 interiors: Andres's Room, Thoven HQ, Starbucks Café, Engineering Lab
- Under-construction buildings: Chalk Lab (scaffolding + popup), VC Office (locked)
- 5 hidden areas: Secret Beach, Music Room, Idea Graveyard, Lookout Hill, Hidden NPC
- Bulletin board: 7 pressable pins + PC link
- Loading screen: Pokemon-style title card
- Mobile gate: graceful static landing for touch devices
- SEO: OG meta tags, structured data

## Scope

### In Scope

- Full rewrite of rendering layer (Phaser → React DOM)
- GridEngineHeadless integration for movement/collision
- Code-defined maps (TypeScript 2D arrays, no Tiled)
- nes-ui-react dialog boxes and UI chrome
- All 4 interior scenes rebuilt as React views
- All NPC interactions, hidden areas, bulletin board
- Title screen, mobile gate, SEO meta tags
- Vercel deployment

### Out of Scope / Non-Goals

- New content beyond what M001 shipped (no new NPCs, buildings, or areas)
- Real-time data fetching (Thoven metrics stay as static dialogue)
- Audio/music implementation (infrastructure only, same as M001)
- Custom pixel art creation (reuse existing sprites)
- Mobile touch controls (mobile gate blocks touch devices, same as M001)

## Technical Constraints

- **Stack**: React 19 + Vite + TypeScript + GridEngineHeadless + nes-ui-react — no game engine
- **Rendering**: DOM elements (divs with CSS backgrounds), not canvas
- **Maps**: TypeScript 2D arrays via ArrayTilemap, not Tiled JSON
- **Movement**: Grid Engine handles logic, CSS handles visual interpolation
- **Deploy**: Vercel, domain andresmartinez.com, static site (no SSR)
- **Tile size**: 16×16 pixel tiles, rendered at 4x zoom (64px apparent) via CSS
- **Sprites**: Existing LimeZu tilesets as CSS sprite sheets, existing NPC PNGs

## Integration Points

- **GridEngineHeadless** — movement commands, collision detection, character position updates, pathfinding for patrol NPCs
- **Vercel** — static site deployment, custom domain
- **LimeZu tilesets** — CSS background-position math to extract individual tiles from sprite sheets

## Open Questions

- Whether to use react-super-tilemap or build a custom ~200-line tile renderer — will decide during S01 prototyping
- Whether CSS movement interpolation needs a canvas fallback — will evaluate after S02 prototype
- Whether nes-ui-react dialog style matches the desired Gen 1/2 aesthetic or needs customization — will evaluate during S03
