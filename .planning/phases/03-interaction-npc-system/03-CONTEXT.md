# Phase 3: Interaction + NPC System - Context

**Gathered:** 2026-03-09
**Status:** Ready for planning

<domain>
## Phase Boundary

Build Space/E interaction detection, a Pokemon-style dialog text box, NPC sprite placement on the overworld, and John Collison's patrol movement. This phase does NOT build building interiors — interior scenes are Phase 4+. Phase 3 wires the routing system (building entrance → placeholder "coming soon" scene transition) so the interaction infrastructure is real even if destinations aren't yet.

</domain>

<decisions>
## Implementation Decisions

### Dialog Box Feel
- **Instant text display** — no typewriter effect; full text appears immediately
- **2 lines per page** — Space/E advances to next page, closes on last page (classic Pokemon Gen 1/2 pagination)
- **Game stays visible behind box** — no dim overlay, world remains fully rendered and unpaused
- **Visual style**: white box, dark pixel border, pixel/monospace font — authentic Gen 1/2 aesthetic

### Interaction Targeting
- **Player must face the NPC/sign to interact** — standing adjacent is not enough; facing direction required
- **Space/E behavior during dialog**: advance to next page → close on last page
- **Movement locked while dialog is open** — player cannot move during a conversation; movement resumes on dialog close
- **Finished buildings**: pressing Space/E at an entrance triggers an immediate scene transition (Phase 3 uses a placeholder stub — the routing logic is real, destinations built in Phase 4+)

### NPC Sprites
- **Placeholder colored sprites** — same approach as Phase 2's character sprite; swapped for custom commissioned art in Phase 9
- **NPC positions defined in a TypeScript config file** — `src/game/config/npcs.ts` — each NPC is an object with tile coordinates, sprite key, name, and dialog text. OverworldScene imports and iterates this config.
- **All 14 NPCs placed** in Phase 3: Paul Graham, Brian Chesky, Tobi Lütke, Dalton Caldwell, Ben Horowitz, Marc Andreessen, Vinod Khosla, Dario Amodei, Michael Seibel, Patrick Collison, John Collison, Keri, Dad, and both dachshunds — each at their correct map location from the NPC roster

### John Collison Patrol
- **Implement patrol in Phase 3** — back-and-forth on a fixed tile path on Main Street (walk north to end tile, turn around, walk south, repeat)
- **When interacted with**: patrol pauses, he turns to face the player, dialog opens; patrol resumes after dialog closes
- **Non-blocking** — player can walk through him; no tile-based collision on patrol NPCs

### Claude's Discretion
- Exact placeholder sprite dimensions and color-coding per NPC (e.g., colors to distinguish characters)
- Specific tile coordinates for John Collison's patrol start/end points
- Dialog box exact pixel dimensions, padding, and font size
- Interior stub scene name and transition animation

</decisions>

<code_context>
## Existing Code Insights

### Reusable Assets
- `src/game/scenes/Overworld.ts`: `update()` already has keyboard handling (cursors + WASD). Space/E key detection added here. Dialog state check blocks movement input when dialog is open.
- `src/game/main.ts`: GridEngine registered as scene plugin (`mapping: 'gridEngine'`). NPC sprites register as additional characters in `gridEngine.create()`.
- `src/game/scenes/Boot.ts`: Asset preloading pattern established — NPC sprite sheet(s) loaded here alongside existing tileset/map/character assets.

### Established Patterns
- **Public/ for all assets** — NPC sprite PNGs go in `public/assets/sprites/`, never `src/`
- **PIPOYA row order** — any NPC sprite sheet with directional animation uses Down/Left/Right/Up row order (walkingAnimationMapping compatible)
- **Grid Engine character registration** — NPCs added to the `characters` array in `gridEngine.create()` alongside the player; Grid Engine manages their tile positions
- **Keyboard creation in `create()`** — key objects must be created once, not per frame

### Integration Points
- `OverworldScene.create()` — NPC sprites spawned here, Grid Engine characters registered, patrol movement initialized
- `OverworldScene.update()` — Space/E key check, facing-tile lookup, interaction dispatch
- New `DialogBox` UI component (Phaser.GameObjects.Container or DOM overlay) — rendered as a persistent scene-level UI element, shown/hidden per interaction
- New interaction router: `handleInteraction(type: 'npc' | 'sign' | 'building', data)` dispatches to dialog or scene transition
- `src/game/config/npcs.ts` — new file; consumed by OverworldScene

</code_context>

<specifics>
## Specific Ideas

- NPC dialogue tone is self-aware/funny and fourth-wall breaking — the quotes in PROJECT.md and the NPC roster are the source of truth. Do not soften or rewrite them.
- John Collison "walks laps" on Main Street — the back-and-forth patrol directly reflects this description
- Phase 3 interaction system is the foundation all later phases build on — get the facing + dialog + routing architecture right here so Phase 4+ can just add scenes

</specifics>

<deferred>
## Deferred Ideas

- None — discussion stayed within phase scope

</deferred>

---

*Phase: 03-interaction-npc-system*
*Context gathered: 2026-03-09*
