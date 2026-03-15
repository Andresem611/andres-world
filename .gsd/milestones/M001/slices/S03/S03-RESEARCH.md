# Phase 3: Interaction + NPC System — Research

**Researched:** 2026-03-09
**Domain:** Phaser 3 interaction detection, dialog UI, Grid Engine NPC registration + patrol, scene transitions
**Confidence:** HIGH

## Summary

Phase 3 builds on a complete Phase 2 codebase: `OverworldScene.ts` has keyboard input working, Grid Engine registered as a scene plugin at `this.gridEngine`, and a programmatic tilemap with known building footprint coordinates. The interaction architecture has three moving parts: (1) Space/E key detection in `update()` that calls `gridEngine.getFacingPosition("player")` to find the target tile, (2) a lookup table mapping tile coordinates to interaction payloads (NPC dialog, sign text, building transition, or under-construction popup), and (3) a `DialogBox` Phaser `GameObjects.Container` that renders at the bottom of the camera viewport. NPC sprites register as additional `CharacterData` objects in `gridEngine.create()` alongside the player — the same pattern already working for the player character.

Grid Engine 2.48.2 (installed) provides exactly the APIs needed: `getFacingDirection`, `getFacingPosition`, `turnTowards`, `addQueueMovements`, `stopMovement`, `isMoving`, and `collides: false` on the character config for non-blocking patrol NPCs. Phaser's `this.scene.start(key, data)` handles building transitions — the overworld passes its state as `data`, and the destination scene returns it when the player exits.

The hardest part of this phase is not the individual features but the interaction dispatch architecture. The `handleInteraction(type, data)` router must be designed cleanly in Wave 1 because every future phase (4–7) adds new interaction types that call into it. Get the interface right once and subsequent phases are just config additions.

**Primary recommendation:** Build the interaction router and dialog box first (Wave 1), then layer NPCs onto it (Wave 2), then patrol (Wave 3). All three depend on the router existing first.

---

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions

**Dialog Box Feel**
- Instant text display — no typewriter effect; full text appears immediately
- 2 lines per page — Space/E advances to next page, closes on last page (classic Pokemon Gen 1/2 pagination)
- Game stays visible behind box — no dim overlay, world remains fully rendered and unpaused
- Visual style: white box, dark pixel border, pixel/monospace font — authentic Gen 1/2 aesthetic

**Interaction Targeting**
- Player must face the NPC/sign to interact — standing adjacent is not enough; facing direction required
- Space/E behavior during dialog: advance to next page → close on last page
- Movement locked while dialog is open — player cannot move during a conversation; movement resumes on dialog close
- Finished buildings: pressing Space/E at an entrance triggers an immediate scene transition (Phase 3 uses a placeholder stub — the routing logic is real, destinations built in Phase 4+)

**NPC Sprites**
- Placeholder colored sprites — same approach as Phase 2's character sprite; swapped for custom commissioned art in Phase 9
- NPC positions defined in a TypeScript config file — `src/game/config/npcs.ts` — each NPC is an object with tile coordinates, sprite key, name, and dialog text. OverworldScene imports and iterates this config.
- All 14 NPCs placed in Phase 3: Paul Graham, Brian Chesky, Tobi Lütke, Dalton Caldwell, Ben Horowitz, Marc Andreessen, Vinod Khosla, Dario Amodei, Michael Seibel, Patrick Collison, John Collison, Keri, Dad, and both dachshunds — each at their correct map location from the NPC roster

**John Collison Patrol**
- Implement patrol in Phase 3 — back-and-forth on a fixed tile path on Main Street (walk north to end tile, turn around, walk south, repeat)
- When interacted with: patrol pauses, he turns to face the player, dialog opens; patrol resumes after dialog closes
- Non-blocking — player can walk through him; no tile-based collision on patrol NPCs

### Claude's Discretion
- Exact placeholder sprite dimensions and color-coding per NPC (e.g., colors to distinguish characters)
- Specific tile coordinates for John Collison's patrol start/end points
- Dialog box exact pixel dimensions, padding, and font size
- Interior stub scene name and transition animation

### Deferred Ideas (OUT OF SCOPE)
- None — discussion stayed within phase scope
</user_constraints>

---

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-----------------|
| INTER-01 | Press Space or E near a building/sign triggers interaction | `gridEngine.getFacingPosition("player")` returns the tile the player faces; coordinate lookup dispatches the interaction |
| INTER-02 | Interacting with a finished building loads its interior map (full page transition) | `this.scene.start("InteriorScene", { returnPos: ... })` — Phaser scene start with data payload; stub scene registered in main.ts |
| INTER-03 | Interacting with an under-construction building shows popup: "Builder still hammering away... check back soon." | Same dialog box infrastructure as NPC dialog — pass a single-page message string |
| INTER-04 | Interacting with signs shows Pokemon-style dialog text box at bottom of screen | `Phaser.GameObjects.Container` fixed to camera viewport using `setScrollFactor(0)`, rendered above all layers with `setDepth()` |
| INTER-05 | Dialog text box supports multi-line text and advances with Space/E | Text string split into pages (2 lines each); `dialogState.currentPage` index tracked in scene; `justDown` check on Space/E to advance |
| NPC-01 | NPCs render as distinct pixel sprites on the overworld | Each NPC is a `Phaser.GameObjects.Sprite` registered in `gridEngine.create()` characters array; same flow as existing player sprite |
| NPC-02 | Pressing Space/E near an NPC opens dialog with their quote (Pokemon-style text box) | Facing tile lookup hits `npcMap` keyed by tile coord string; dispatches to `showDialog(npc.dialog)` |
| NPC-03 | NPC dialogue is self-aware/funny, fourth-wall breaking in tone | Content-only: dialogue strings defined in `src/game/config/npcs.ts`; exact quotes from CLAUDE.md NPC roster |
| NPC-04 | Walking NPCs (John Collison on Main Street) have patrol movement patterns | `gridEngine.addQueueMovements()` with Direction array; `QueueMovementFinished` observable to detect end-of-path and re-queue reverse; `collides: false` in CharacterData |
| NPC-05 | All 14 NPCs from the NPC roster are placed in their correct map locations | NPC config iterates 14 entries; tile coordinates derived from generate-map.ts building footprint data |
</phase_requirements>

---

## Standard Stack

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| Phaser 3 | 3.90.0 (installed) | Game framework, sprites, scene management, input | Already in project |
| Grid Engine | 2.48.2 (installed) | NPC registration, facing detection, patrol movement | Already in project; owns character position management |
| Vitest | 4.0.18 (installed) | Unit tests for config and interaction router logic | Already configured with `vitest.config.ts` |

### No New Dependencies Needed
All interaction, dialog, and NPC functionality is achievable with existing Phaser 3 + Grid Engine. No Rex Rainbow Dialog Plugin is needed — the Phase 3 dialog box is a custom `Phaser.GameObjects.Container` with `BitmapText` or `Text` objects. Rex Rainbow is appropriate for complex RPG dialog systems; the Phase 3 requirements (instant text, 2 lines/page, Space/E advance) are straightforward enough to build directly.

**Why not Rex Rainbow:** Adding a new dependency for a dialog box that can be implemented in ~80 lines of Phaser code introduces version lock-in and API surface area that future phases would need to learn. Custom implementation is the right call here given the simplicity of the requirements.

### Installation
```bash
# Nothing to install — all dependencies are present
```

---

## Architecture Patterns

### Recommended Project Structure (Phase 3 additions)
```
src/
├── game/
│   ├── scenes/
│   │   ├── Boot.ts            # existing — add NPC sprite preloading
│   │   ├── Overworld.ts       # existing — add interaction system, NPC spawn
│   │   └── InteriorStub.ts    # NEW — placeholder interior scene for Phase 3 transitions
│   ├── config/
│   │   └── npcs.ts            # NEW — 14 NPC definitions (tile pos, sprite key, dialog)
│   └── ui/
│       └── DialogBox.ts       # NEW — Pokemon-style text box UI component
scripts/
├── generate-map.ts            # existing — reference for building footprint coordinates
├── generate-npc-sprites.ts    # NEW — programmatic NPC placeholder PNGs (one per NPC)
tests/
├── overworld-map.test.ts      # existing
├── npc-config.test.ts         # NEW — validates all 14 NPCs have required fields
└── interaction-router.test.ts # NEW — tests interaction dispatch logic (pure TS, no Phaser)
```

### Pattern 1: Facing Tile Lookup for Interaction Dispatch

**What:** On Space/E keypress, get the tile the player is facing and look it up in an interaction registry. The registry maps `"x,y"` string keys to `InteractionPayload` objects.

**When to use:** Every interactive object in the game — NPCs, signs, buildings, bulletin board, PC desks — registers in this registry. Future phases only add entries to the registry; the dispatch loop never changes.

**Example:**
```typescript
// Source: Grid Engine 2.48.2 type definitions (installed)
// In OverworldScene.update():
const spaceJustDown = Phaser.Input.Keyboard.JustDown(this.spaceKey);
const eJustDown = Phaser.Input.Keyboard.JustDown(this.eKey);

if ((spaceJustDown || eJustDown) && !this.dialogBox.isOpen()) {
  const facingPos = this.gridEngine.getFacingPosition("player");
  const key = `${facingPos.x},${facingPos.y}`;
  const interaction = this.interactionMap.get(key);
  if (interaction) {
    this.handleInteraction(interaction);
  }
}

// When dialog IS open, Space/E advances it:
if ((spaceJustDown || eJustDown) && this.dialogBox.isOpen()) {
  this.dialogBox.advance();
}
```

**CRITICAL:** Use `Phaser.Input.Keyboard.JustDown()` not `.isDown`. `isDown` fires every frame; `JustDown` fires once per press. Using `isDown` will skip through entire dialog sequences on a single keypress.

### Pattern 2: InteractionMap Registration

**What:** A `Map<string, InteractionPayload>` populated in `create()` from the NPC config and a building/sign config. The key is `"tileX,tileY"`.

**When to use:** Register every interactive tile here. For NPCs, register the tile they stand on. For buildings, register the entrance tile (the walkable tile directly in front of the door). For signs, register the sign tile itself.

**Example:**
```typescript
// src/game/ui/DialogBox.ts — interaction payload type
export type InteractionPayload =
  | { type: "npc"; id: string; dialog: string[] }
  | { type: "sign"; text: string[] }
  | { type: "building"; key: string; returnPos: { x: number; y: number } }
  | { type: "under_construction"; message: string };

// In OverworldScene.create() — register NPCs
for (const npc of NPC_CONFIG) {
  const key = `${npc.tileX},${npc.tileY}`;
  this.interactionMap.set(key, {
    type: "npc",
    id: npc.id,
    dialog: npc.dialog,
  });
}
```

### Pattern 3: DialogBox as Camera-Fixed Container

**What:** A `Phaser.GameObjects.Container` with `setScrollFactor(0)` so it stays fixed to the screen regardless of camera position. Uses `setDepth(100)` to render above all map layers.

**When to use:** Any UI element that must stay on screen while the world scrolls (dialog boxes, popups, HUD elements).

**Example:**
```typescript
// Source: Phaser 3.90.0 type definitions (installed)
// In DialogBox constructor:
const container = scene.add.container(0, 0);
container.setScrollFactor(0);    // fixed to camera
container.setDepth(100);         // above everything
container.setVisible(false);     // hidden by default

// Position at bottom of viewport (not world):
// With 800x600 game, dialog box at y=450 (bottom ~25% of screen)
const bg = scene.add.rectangle(0, 450, 800, 130, 0xffffff);
bg.setStrokeStyle(3, 0x000000);
bg.setOrigin(0, 0);
container.add(bg);
```

**CRITICAL:** The container's position is in screen coordinates (0,0 = top-left of screen) when `setScrollFactor(0)` is set. Do not use world coordinates.

### Pattern 4: Grid Engine NPC Registration

**What:** NPCs are registered in the same `characters` array as the player in `gridEngine.create()`. Grid Engine then manages their tile positions.

**When to use:** Any character that needs tile-based positioning (static or moving).

**Example:**
```typescript
// Source: Grid Engine 2.48.2 CharacterDataHeadless interface (verified in node_modules)
// In OverworldScene.create():
const characters: CharacterData[] = [
  {
    id: "player",
    sprite: playerSprite,
    walkingAnimationMapping: 0,
    startPosition: { x: 25, y: 38 },
    facingDirection: Direction.UP,
    speed: 4,
  },
  // Static NPC (no collision with player):
  {
    id: "marc-andreessen",
    sprite: npcSprites["marc-andreessen"],
    walkingAnimationMapping: 0,
    startPosition: { x: 25, y: 20 },
    facingDirection: Direction.DOWN,
    collides: false,  // non-blocking — player walks through
  },
  // Patrol NPC:
  {
    id: "john-collison",
    sprite: npcSprites["john-collison"],
    walkingAnimationMapping: 0,
    startPosition: { x: 25, y: 28 },
    facingDirection: Direction.UP,
    collides: false,  // non-blocking per design decision
    speed: 2,         // slower patrol pace than player
  },
];

this.gridEngine.create(map, { characters });
```

### Pattern 5: Back-and-Forth Patrol with addQueueMovements

**What:** Use `gridEngine.addQueueMovements()` with a Direction array to move John Collison north, then observe movement completion to re-queue the reverse path.

**When to use:** Any NPC with a fixed patrol route.

**Example:**
```typescript
// Source: Grid Engine 2.48.2 type definitions (verified in node_modules)
// QueueMovementFinished observable fires when the queue empties

// Set up patrol in create():
const PATROL_NORTH_STEPS = 8; // tiles to walk north
const northPath = Array(PATROL_NORTH_STEPS).fill(Direction.UP);
const southPath = Array(PATROL_NORTH_STEPS).fill(Direction.DOWN);

let patrolDirection: "north" | "south" = "north";

this.gridEngine.addQueueMovements("john-collison", northPath);

// React to queue completion:
this.gridEngine.movementStopped().subscribe(({ charId }) => {
  if (charId !== "john-collison" || this.johnDialogOpen) return;
  // Re-queue reverse direction
  patrolDirection = patrolDirection === "north" ? "south" : "north";
  const path = patrolDirection === "north" ? northPath : southPath;
  this.gridEngine.addQueueMovements("john-collison", path);
});
```

**Pause on interaction:**
```typescript
// When player interacts with John Collison:
this.gridEngine.stopMovement("john-collison");
this.johnDialogOpen = true;

// When dialog closes:
this.johnDialogOpen = false;
// Re-queue current patrol direction
this.gridEngine.addQueueMovements("john-collison", currentPatrolPath);
```

### Pattern 6: Facing-Direction Turn on Interaction

**What:** When the player initiates dialog with an NPC, turn the NPC to face the player using `gridEngine.turnTowards()`.

**Example:**
```typescript
// Source: Grid Engine 2.48.2 type definitions (verified in node_modules)
// turnTowards(charId, direction) — turns character sprite without moving

function getOppositeDirection(dir: Direction): Direction {
  const opposites = {
    [Direction.UP]: Direction.DOWN,
    [Direction.DOWN]: Direction.UP,
    [Direction.LEFT]: Direction.RIGHT,
    [Direction.RIGHT]: Direction.LEFT,
  };
  return opposites[dir] ?? Direction.DOWN;
}

// When NPC interaction triggers:
const playerFacing = this.gridEngine.getFacingDirection("player");
const npcFacingPlayer = getOppositeDirection(playerFacing);
this.gridEngine.turnTowards(npcId, npcFacingPlayer);
```

### Pattern 7: Movement Lock During Dialog

**What:** A boolean flag `this.dialogOpen` checked at the top of `update()` before processing movement input.

**Example:**
```typescript
// In OverworldScene:
private dialogOpen = false;

update(): void {
  // All key presses checked with JustDown first
  const spaceJustDown = Phaser.Input.Keyboard.JustDown(this.spaceKey);
  const eJustDown = Phaser.Input.Keyboard.JustDown(this.eKey);

  if (this.dialogOpen) {
    // Only allow dialog advance — no movement
    if (spaceJustDown || eJustDown) {
      const closed = this.dialogBox.advance();
      if (closed) {
        this.dialogOpen = false;
        this.onDialogClose(); // hook for patrol resume, etc.
      }
    }
    return; // ← early return blocks all movement
  }

  // Normal movement handling below...
}
```

### Pattern 8: Placeholder NPC Sprite Generation

**What:** Generate NPC placeholder PNGs programmatically (same technique as Phase 2 character sprite), using distinct colors per NPC for visual distinction.

**When to use:** All 14 NPCs need sprites before Phase 9 art replacement.

Color scheme suggestion (Claude's discretion as noted in CONTEXT.md):
- Paul Graham: light blue
- Marc Andreessen: orange
- Brian Chesky: purple
- Michael Seibel: red
- John Collison: yellow (patrol NPC — easy to spot)
- Dad: brown
- Dogs: light grey/white

Each NPC sprite: 32x32px, single direction (DOWN-facing idle) or 4-directional 96x128 (PIPOYA format) for walk animation if desired. Static NPCs don't need walk animation — a single 32x32 frame sprite is sufficient.

### Anti-Patterns to Avoid

- **Using `.isDown` for Space/E interaction:** Fires every frame; player will zip through entire dialog in one keypress. Always use `Phaser.Input.Keyboard.JustDown()`.
- **Placing dialog box at world coordinates:** `setScrollFactor(0)` is mandatory; without it the box scrolls with the camera and appears in wrong screen positions.
- **Registering NPC tile position as the blocking tile for interaction:** The player stands adjacent and faces the NPC tile — the interaction lookup fires on the NPC's tile (the faced tile). The NPC tile is where the NPC stands, not a separate "in front" tile.
- **Building `interactionMap` entries during `update()`:** Build it once in `create()`. Rebuilding every frame is a performance problem and introduces subtle bugs.
- **Forgetting to preload NPC sprites in Boot.ts:** Sprites referenced in Overworld.ts must be loaded in Boot.ts `preload()`. Missing sprites cause silent render failures with no helpful error.

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| NPC tile position management | Custom coordinate tracking | `gridEngine.getPosition(charId)` | Grid Engine already owns all character positions; duplicating state causes sync bugs |
| NPC facing direction | Manual sprite frame switching | `gridEngine.getFacingDirection()` + `turnTowards()` | Grid Engine manages facing state as part of its character model |
| Patrol movement timing | Manual tile-step timers in update() | `gridEngine.addQueueMovements()` + `movementStopped()` observable | Grid Engine handles movement queueing, speed, and timing correctly across frame rate variations |
| Adjacent-tile detection for interaction | Manual distance math | `gridEngine.getFacingPosition("player")` | Returns the exact tile the player is currently facing — one API call, zero math |

**Key insight:** Grid Engine's character system is the source of truth for all character state. Any custom tracking of NPC positions or facing directions will drift from Grid Engine's internal state.

---

## Common Pitfalls

### Pitfall 1: JustDown vs isDown on Interaction Keys
**What goes wrong:** Dialog opens and immediately advances through all pages because Space/E registers as held each frame.
**Why it happens:** `isDown` is true for every frame the key is held. `JustDown` is true only on the single frame the key transitions from up to down.
**How to avoid:** Create key objects once in `create()` with `this.input.keyboard!.addKey()`, then call `Phaser.Input.Keyboard.JustDown(key)` in `update()`.
**Warning signs:** Dialog closes immediately on first keypress, or skips multiple pages.

### Pitfall 2: Dialog Box Scrolls with Camera
**What goes wrong:** Dialog box appears in world-space and scrolls off-screen as the player moves.
**Why it happens:** Phaser game objects default to scrollFactor(1) — they move with the camera.
**How to avoid:** Call `container.setScrollFactor(0)` on the dialog container immediately after creating it.
**Warning signs:** Dialog box visible at map origin (tile 0,0) rather than bottom of screen.

### Pitfall 3: NPC Sprites Not Preloaded
**What goes wrong:** NPC sprites are invisible or throw WebGL errors at runtime.
**Why it happens:** Phaser loads assets in Boot.ts `preload()` before Overworld.ts `create()` runs. Any sprite key referenced in `create()` must be preloaded.
**How to avoid:** For every NPC sprite key in `npcs.ts`, add a corresponding `this.load.image()` or `this.load.spritesheet()` in `Boot.ts preload()`.
**Warning signs:** Transparent NPC sprites or console errors about missing texture keys.

### Pitfall 4: Building Entrance Interaction Tile Conflicts with Collision
**What goes wrong:** Player can't reach the entrance tile to trigger building interaction because it's on the collision layer.
**Why it happens:** Building footprints in `generate-map.ts` block the entire building rectangle including entrance tiles.
**How to avoid:** Building entrance tiles are the walkable tiles immediately in front of the building — the player stands on them and faces toward the building wall. The interaction fires on the wall tile (the faced tile, which IS blocked), not the entrance tile (where the player stands). Verify entrance tile is walkable before wiring interactions.
**Warning signs:** Player can't trigger building interaction despite pressing Space/E.

### Pitfall 5: John Collison Patrol Blocking Player Path
**What goes wrong:** John Collison's patrol NPC physically blocks the player on Main Street.
**Why it happens:** Grid Engine characters default to `collides: true` which blocks other characters.
**How to avoid:** Set `collides: false` in John Collison's `CharacterData` registration. This is explicitly specified in CONTEXT.md decisions.
**Warning signs:** Player stops moving when approaching John Collison's position.

### Pitfall 6: Observable Memory Leak on Scene Restart
**What goes wrong:** `movementStopped()` subscription fires for the previous scene's NPCs after a scene transition.
**Why it happens:** RxJS observables from Grid Engine persist if not explicitly unsubscribed. When Overworld scene stops and restarts (player exits interior and returns), stale subscriptions fire.
**How to avoid:** Store subscription references and call `.unsubscribe()` in the scene's `shutdown` event handler.
**Warning signs:** Patrol NPCs double-speed or log errors about unknown character IDs after returning from an interior.

---

## Code Examples

### Building the Interaction Map
```typescript
// Source: project codebase patterns from generate-map.ts + Grid Engine v2.48.2 API
// In OverworldScene.create() — after gridEngine.create():

this.interactionMap = new Map<string, InteractionPayload>();

// Register NPCs
for (const npc of NPC_CONFIG) {
  this.interactionMap.set(`${npc.tileX},${npc.tileY}`, {
    type: "npc",
    id: npc.id,
    dialog: npc.dialog,
  });
}

// Register building entrances (tile in front of door, facing INTO the building)
// Andres's House entrance: player stands at y=23, faces UP into house at y=22
this.interactionMap.set("9,23", {
  type: "building",
  key: "AndresRoom",
  returnPos: { x: 9, y: 23 },
});

// Under-construction building
this.interactionMap.set("20,14", {
  type: "under_construction",
  message: "Builder still hammering away... check back soon.",
});
```

### NPC Config File Shape
```typescript
// src/game/config/npcs.ts
export interface NpcDefinition {
  id: string;
  name: string;
  tileX: number;
  tileY: number;
  spriteKey: string;
  facingDirection: Direction;
  dialog: string[];  // array of strings; each string is one "page" of 2 lines
  patrol?: false;    // most NPCs are static
}

export interface PatrolNpcDefinition extends Omit<NpcDefinition, "patrol"> {
  patrol: true;
  patrolPath: Direction[];  // e.g., 8x Direction.UP, then 8x Direction.DOWN
}

export const NPC_CONFIG: (NpcDefinition | PatrolNpcDefinition)[] = [
  {
    id: "marc-andreessen",
    name: "Marc Andreessen",
    tileX: 25,  // Claude's discretion — on Main Street near bulletin board
    tileY: 20,
    spriteKey: "npc-marc",
    facingDirection: Direction.DOWN,
    dialog: ["Software is eating the world.", "You're standing in the proof."],
  },
  {
    id: "john-collison",
    name: "John Collison",
    tileX: 25,
    tileY: 28,
    spriteKey: "npc-john",
    facingDirection: Direction.UP,
    patrol: true,
    patrolPath: [
      ...Array(8).fill(Direction.UP),
      ...Array(8).fill(Direction.DOWN),
    ],
    dialog: ["Growth solves most problems.", "Also, have you tried talking to your users?"],
  },
  // ... 12 more NPCs
];
```

### Dialog Box advance() Return Value
```typescript
// src/game/ui/DialogBox.ts — minimal interface
export class DialogBox {
  private pages: string[][];
  private currentPage = 0;
  private container: Phaser.GameObjects.Container;

  show(lines: string[]): void {
    // Split lines into pages of 2
    this.pages = [];
    for (let i = 0; i < lines.length; i += 2) {
      this.pages.push(lines.slice(i, i + 2));
    }
    this.currentPage = 0;
    this.renderPage(0);
    this.container.setVisible(true);
  }

  // Returns true when dialog closes (last page advanced through)
  advance(): boolean {
    this.currentPage++;
    if (this.currentPage >= this.pages.length) {
      this.container.setVisible(false);
      return true;  // dialog closed
    }
    this.renderPage(this.currentPage);
    return false;   // more pages remain
  }

  isOpen(): boolean {
    return this.container.visible;
  }
}
```

### InteriorStub Scene (Phase 3 Placeholder)
```typescript
// src/game/scenes/InteriorStub.ts
export class InteriorStubScene extends Phaser.Scene {
  constructor() {
    super({ key: "InteriorStub" });
  }

  create(data: { returnPos: { x: number; y: number }; buildingKey: string }): void {
    this.add.text(400, 300, `[${data.buildingKey} — coming in a future phase]`, {
      color: "#ffffff",
      fontSize: "16px",
    }).setOrigin(0.5);

    // Press Space/E to return
    const spaceKey = this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    this.input.keyboard!.once("keydown-SPACE", () => {
      this.scene.start("Overworld", { returnFrom: data });
    });
    this.input.keyboard!.once("keydown-E", () => {
      this.scene.start("Overworld", { returnFrom: data });
    });
  }
}
```

---

## Building Footprint Reference

From `scripts/generate-map.ts` (project source of truth for all tile coordinates):

| Building | Tile Rect | Entrance Tile Candidates |
|----------|-----------|--------------------------|
| Thoven HQ | x=10–17, y=14–22 | x=13, y=23 (south face, facing UP) |
| Starbucks Café | x=29–34, y=24–28 | x=31, y=29 (south face, facing UP) |
| Chalk Lab (under construction) | x=18–22, y=8–13 | x=20, y=14 (south face) |
| Andres's House | x=6–12, y=16–22 | x=9, y=23 (south face, facing UP) |
| Engineering Lab | x=38–44, y=2–8 | x=41, y=9 (south face) |
| GitHub Library | x=38–44, y=12–18 | x=41, y=19 (south face) |
| Record Shop | x=29–33, y=10–14 | x=31, y=15 (south face) |
| Ventanita | x=23–27, y=26–29 | x=25, y=30 (south face) |
| VC Office (under construction) | x=28–33, y=16–20 | x=30, y=21 (south face) |
| Bulletin Board | x=23–25, y=30–31 | x=24, y=32 (south face) |
| Lookout Hill | x=20–30, y=0–6 | x=25, y=7 (south face, facing UP) |
| Idea Graveyard | x=2–10, y=24–32 | x=6, y=33 (south face) |
| Music Room | x=3–8, y=10–14 | x=5, y=15 (south face) |

**Note:** Entrance tile candidates need verification against the actual collision layer to confirm they are walkable (GID=0 in collision layer). The generate-map.ts script only blocks building footprint rectangles, so adjacent tiles should be walkable.

**John Collison patrol zone (Claude's discretion recommendation):** x=25, y=20 to y=30 — the central Main Street spine. 10 tiles of north-south patrol avoids all building footprints.

---

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Rex Rainbow Dialog Plugin (external) | Custom Phaser Container (built-in) | Phase 3 design decision | Zero new dependencies; simpler API surface |
| Free-roam proximity detection | Grid Engine `getFacingPosition` | Grid Engine v2.x | Exact facing tile, no distance math |
| Manual NPC position tracking arrays | Grid Engine `getPosition(charId)` | Grid Engine v2.x | Single source of truth |

---

## Open Questions

1. **Entrance tile walkability per building**
   - What we know: Building collision rects block the building footprint rectangle exactly as defined in generate-map.ts
   - What's unclear: Whether any proposed entrance tiles (south face of each building, y+1 from footprint bottom) overlap with palm tree collision or other blocking tiles
   - Recommendation: The planner should include a Wave 0 task to run a quick check of the overworld.json collision layer for each entrance tile before hardcoding interaction coordinates

2. **Return position handling when Overworld restarts from interior**
   - What we know: `this.scene.start("Overworld", data)` passes data to `create(data)` in OverworldScene
   - What's unclear: OverworldScene.create() currently doesn't accept data — needs to be updated to check for `data.returnFrom` and set player start position accordingly
   - Recommendation: Add `create(data?: { returnFrom?: { returnPos: { x: number; y: number } } })` signature; fall back to default dock spawn if data is absent

3. **Sprite sheet vs single-frame for static NPCs**
   - What we know: `walkingAnimationMapping: 0` on player uses a 96x128 PIPOYA spritesheet; static NPCs don't walk
   - What's unclear: Whether to use full 4-directional spritesheets for all 14 NPCs (future-proofing for Phase 9 custom art) or single 32x32 frames for static ones
   - Recommendation: Use single 32x32 frames for Phase 3 placeholder sprites to minimize generation complexity; the `walkingAnimationMapping` field can be omitted entirely for static sprites — Grid Engine will not attempt frame animation

---

## Validation Architecture

### Test Framework
| Property | Value |
|----------|-------|
| Framework | Vitest 4.0.18 |
| Config file | `vitest.config.ts` |
| Quick run command | `npm test` (runs `vitest run`) |
| Full suite command | `npm test` |

### Phase Requirements → Test Map
| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| INTER-01 | Space/E facing lookup finds interactable tile | unit | `npm test -- tests/interaction-router.test.ts` | ❌ Wave 0 |
| INTER-02 | Building type payload triggers scene start | unit | `npm test -- tests/interaction-router.test.ts` | ❌ Wave 0 |
| INTER-03 | Under-construction payload produces correct message | unit | `npm test -- tests/interaction-router.test.ts` | ❌ Wave 0 |
| INTER-04 | Dialog box show/hide state | unit | `npm test -- tests/dialog-box.test.ts` | ❌ Wave 0 |
| INTER-05 | Dialog pages split correctly; advance() returns true on last page | unit | `npm test -- tests/dialog-box.test.ts` | ❌ Wave 0 |
| NPC-01 | All 14 NPCs have valid spriteKey | unit | `npm test -- tests/npc-config.test.ts` | ❌ Wave 0 |
| NPC-02 | All 14 NPCs have non-empty dialog array | unit | `npm test -- tests/npc-config.test.ts` | ❌ Wave 0 |
| NPC-03 | NPC dialog strings contain no placeholder text | unit | `npm test -- tests/npc-config.test.ts` | ❌ Wave 0 |
| NPC-04 | John Collison config has patrol:true and patrolPath length > 0 | unit | `npm test -- tests/npc-config.test.ts` | ❌ Wave 0 |
| NPC-05 | Exactly 14 entries in NPC_CONFIG (includes 2 dogs) | unit | `npm test -- tests/npc-config.test.ts` | ❌ Wave 0 |

**Note:** Phaser scene behavior (DialogBox rendering, Grid Engine movement) cannot be tested with Vitest in a Node environment (no WebGL/DOM). All automated tests cover pure TypeScript logic only: config shape validation, interaction router dispatch logic, and dialog pagination math. Scene-level behavior is verified by human smoke test (Phase 3 success criteria).

### Sampling Rate
- **Per task commit:** `npm test`
- **Per wave merge:** `npm test`
- **Phase gate:** Full suite green before `/gsd:verify-work`

### Wave 0 Gaps
- [ ] `tests/npc-config.test.ts` — covers NPC-01, NPC-02, NPC-03, NPC-04, NPC-05
- [ ] `tests/interaction-router.test.ts` — covers INTER-01, INTER-02, INTER-03
- [ ] `tests/dialog-box.test.ts` — covers INTER-04, INTER-05 (pure logic, no Phaser)

---

## Sources

### Primary (HIGH confidence)
- Grid Engine 2.48.2 type definitions — `node_modules/grid-engine/dist/mjs/src/GridEngine.d.ts` — `getFacingPosition`, `getFacingDirection`, `turnTowards`, `addQueueMovements`, `stopMovement`, `isMoving`, `movementStopped()`, `CharacterData.collides`, `QueueMovementConfig`
- Grid Engine 2.48.2 type definitions — `node_modules/grid-engine/dist/mjs/src/GridEngineHeadless.d.ts` — `CharacterDataHeadless` interface full field list
- Phaser 3.90.0 type definitions — `node_modules/phaser/types/phaser.d.ts` — `ScenePlugin.start()`, `GameObjects.Container`, `Input.Keyboard.JustDown()`
- Project source `scripts/generate-map.ts` — all building footprint coordinates and tile GID constants
- Project source `src/game/scenes/Overworld.ts` — existing keyboard, Grid Engine create() pattern
- Project source `src/game/scenes/Boot.ts` — established preload pattern
- Project source `tests/overworld-map.test.ts` — Vitest test pattern for this project
- Project source `vitest.config.ts` — test framework configuration

### Secondary (MEDIUM confidence)
- None needed — primary sources covered all research domains

### Tertiary (LOW confidence)
- None

---

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — all libraries already installed; APIs verified directly from type definitions in node_modules
- Architecture: HIGH — patterns derived from existing codebase code + Grid Engine API types; no speculation
- Building coordinates: HIGH — sourced directly from generate-map.ts constants
- Entrance tile walkability: MEDIUM — coordinates are logically derived (y+1 of building footprint bottom) but not programmatically verified against the collision layer JSON
- Pitfalls: HIGH — JustDown/isDown, scrollFactor, preloading, and patrol collision are all confirmed through code inspection

**Research date:** 2026-03-09
**Valid until:** 2026-06-09 (Grid Engine and Phaser are stable; 90-day window is conservative)