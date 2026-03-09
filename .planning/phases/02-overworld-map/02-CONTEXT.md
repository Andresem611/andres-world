# Phase 2: Overworld Map - Context

**Gathered:** 2026-03-09
**Status:** Ready for planning

<domain>
## Phase Boundary

Build a fully walkable, Miami-themed overworld map (~50×40 tiles) where a player character can move from the south dock through all zones using tile-based grid movement. Camera follows the character. Collision blocks buildings, water, and trees. No NPC interaction, no interior loading, no dialog system — those are Phase 3+.

</domain>

<decisions>
## Implementation Decisions

### Tileset Source
- Use **LimeZu Modern Exteriors** tileset (free, ~$5 on itch.io) — exterior + beach packs both included
- All tileset images go in `public/` (not `src/assets/`) — Vite hashes src/ assets, breaking Phaser's string loader
- LimeZu is the Phase 2 prototype tileset; Miami-specific paid assets (KR Art Deco, Tropical Shores) are a Phase 9 art swap
- No custom art purchased for Phase 2

### Map Construction
- **Full ~50×40 tile map built in one pass** — all zones placed correctly from the start
- All zones represented: dock (south entry), main street spine, central plaza, west side, east beach strip, heights (north) — geography from the design doc
- Building shells painted for every building (Thoven HQ, Starbucks, Chalk Lab, Andres's House, Engineering Lab, GitHub Library, Record Shop, Ventanita, VC Office, etc.)
- Under-construction buildings (Chalk Lab, VC Office) get **scaffolding tile overlay** on their building shell
- Map authored as Tiled JSON programmatically (agents write the JSON, not Tiled GUI)
- **Explicit collision layer** in the Tiled JSON — separate layer marks walkable vs blocked tiles; Grid Engine reads this directly
- Palm trees rendered as Miami-appropriate trees (not Pokemon oaks) — LimeZu has palm variants
- Ocean renders as **static water tiles** on east edge (animated water is Phase 9 polish)
- No zone labels or sign text embedded in map — interaction system doesn't exist yet (Phase 3)
- Buildings are purely visual in Phase 2 — walking into one blocks movement, no dialog, no interaction prompt

### Character Sprite
- **Placeholder sprite for Phase 2** — use a free RPG/Gen-1-style character sprite from a compatible free pack (Claude's discretion on exact pack)
- Placeholder must be compatible with LimeZu tile scale and have 4-directional walk animation (3 frames per direction, ~32×32px)
- Custom founder sprite specs (for when commissioned): hoodie + laptop backpack visible from all 4 directions; backpack visible on side/back views; consistent hoodie color across all directions
- Custom sprite replacement is a Phase 9 art swap — no code changes needed, just image file swap
- `public/` is the sprite directory

### Outdoor NPC Scope
- **No NPC sprites in Phase 2** — map is buildings, terrain, trees, and ocean only
- Phase 3 adds all NPC sprites + dialog system
- When Phase 3 adds NPCs: all NPCs are **static sprites first** (stand in place); patrol movement (John Collison walking laps) is deferred to a later polish phase

### Scene Architecture
- `BootScene` transitions to a new `OverworldScene` for the map
- `BootScene` handles asset preloading (tileset images, character sprite, map JSON) then hands off to `OverworldScene`
- Grid Engine configured in `OverworldScene` — reads collision layer from Tiled JSON, controls player movement
- Camera configured to follow player character with appropriate bounds

### Claude's Discretion
- Exact Grid Engine configuration (tile size, character speed, camera offset)
- Phaser game canvas resize / responsive behavior
- Specific free sprite pack chosen for placeholder character
- Tiled JSON layer naming conventions

</decisions>

<code_context>
## Existing Code Insights

### Reusable Assets
- `src/game/main.ts`: Phaser GameConfig already has `pixelArt: true`, `backgroundColor: '#1a1a2e'`, and Grid Engine registered as a scene plugin (`mapping: 'gridEngine'`). OverworldScene inherits all of this automatically.
- `src/game/scenes/Boot.ts`: Current `BootScene` is a placeholder shell — Phase 2 transforms it into a preloader that loads tileset + map assets, then transitions to `OverworldScene`.
- `vite.config.ts`: `base: './'` set — all `public/` assets resolve correctly on Vercel.
- `public/style.css`: CSS exists — pixel rendering CSS (`image-rendering: pixelated`) should be confirmed here.

### Established Patterns
- **Asset loading pattern**: All game assets (tilesets, sprites, maps) go in `public/` — never `src/`. Phaser loads them by URL string; Vite hashes files in `src/`, breaking the loader.
- **Grid Engine plugin**: Already registered in `main.ts` as a scene plugin mapped to `this.gridEngine`. OverworldScene accesses it via `this.gridEngine` without additional setup.
- **Pixel-perfect config**: `pixelArt: true` in GameConfig disables Phaser's anti-aliasing. CSS `image-rendering: pixelated` handles the HTML canvas element.

### Integration Points
- `BootScene.create()` currently just logs — Phase 2 replaces this with `this.load.*` calls in `preload()` and a scene transition in `create()`
- New `OverworldScene` registers in the `scene` array in `main.ts`
- Grid Engine's `create()` call goes in `OverworldScene.create()` with the tilemap and player config

</code_context>

<specifics>
## Specific Ideas

- Map geography reference: the ASCII map in the design doc (`docs/plans/2026-03-08-andres-world-personal-site-design.md`) is the layout guide — zones are fixed
- "The map reads as Miami" is a success criteria — palm trees (not oaks), ocean east, Art Deco pastel building shells, distinct dock entry from south
- Character spawns at south dock facing north — this is the spawn point, not arbitrary
- Scaffold tiles on Chalk Lab and VC Office signal "under construction" without any interaction system

</specifics>

<deferred>
## Deferred Ideas

- Animated water tiles — Phase 9 polish
- Patrol NPCs (John Collison walking laps) — after Phase 3 static NPCs are in place
- Custom founder sprite commission — Phase 9 art swap
- Miami-specific paid tilesets (KR Art Deco, Tropical Shores, LimeZu paid) — Phase 9 art swap
- Zone labels / sign text embedded in map — Phase 3 (needs interaction system)
- Palm tree idle animation (swaying) — V2 requirement

</deferred>

---

*Phase: 02-overworld-map*
*Context gathered: 2026-03-09*
