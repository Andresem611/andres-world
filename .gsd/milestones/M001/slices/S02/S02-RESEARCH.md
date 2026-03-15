# Phase 2: Overworld Map - Research

**Researched:** 2026-03-09
**Domain:** Phaser 3 + Grid Engine + Tiled JSON + Sprite Animation
**Confidence:** HIGH

---

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions
- Use **LimeZu Modern Exteriors** tileset (free tier / $2.50 paid on itch.io) — exterior + beach packs included. Tile size is **16x16** (also available as 32x32 and 48x48 in the same pack).
- All tileset images go in `public/` (not `src/assets/`) — Vite hashes `src/` assets, breaking Phaser's string loader.
- LimeZu is the Phase 2 prototype tileset; Miami-specific paid assets (KR Art Deco, Tropical Shores) are a Phase 9 art swap.
- No custom art purchased for Phase 2.
- **Full ~50×40 tile map built in one pass** — all zones placed correctly from the start.
- All zones represented: dock (south entry), main street spine, central plaza, west side, east beach strip, heights (north).
- Building shells painted for every building with **explicit collision layer** in the Tiled JSON — separate layer marks walkable vs blocked tiles.
- Map authored as Tiled JSON programmatically (agents write the JSON, not Tiled GUI).
- Under-construction buildings (Chalk Lab, VC Office) get scaffolding tile overlay on their building shell.
- Palm trees rendered as Miami-appropriate trees (not Pokemon oaks) — LimeZu has palm variants.
- Ocean renders as static water tiles on east edge (animated water is Phase 9 polish).
- No zone labels or sign text embedded in map — interaction system doesn't exist yet (Phase 3).
- Buildings are purely visual in Phase 2 — walking into one blocks movement, no dialog, no interaction prompt.
- **Placeholder sprite for Phase 2** — free RPG/Gen-1-style character sprite from a compatible free pack (Claude's discretion on exact pack).
- Placeholder must be compatible with LimeZu tile scale and have 4-directional walk animation (3 frames per direction, ~32×32px).
- Custom founder sprite (hoodie + laptop backpack) is a Phase 9 art swap.
- `public/` is the sprite directory.
- **No NPC sprites in Phase 2** — map is buildings, terrain, trees, and ocean only.
- `BootScene` transitions to a new `OverworldScene` for the map. `BootScene` handles asset preloading then hands off.
- Grid Engine configured in `OverworldScene`. Camera configured to follow player character with appropriate bounds.

### Claude's Discretion
- Exact Grid Engine configuration (tile size, character speed, camera offset)
- Phaser game canvas resize / responsive behavior
- Specific free sprite pack chosen for placeholder character
- Tiled JSON layer naming conventions

### Deferred Ideas (OUT OF SCOPE)
- Animated water tiles — Phase 9 polish
- Patrol NPCs (John Collison walking laps) — after Phase 3 static NPCs
- Custom founder sprite commission — Phase 9 art swap
- Miami-specific paid tilesets (KR Art Deco, Tropical Shores, LimeZu paid) — Phase 9 art swap
- Zone labels / sign text embedded in map — Phase 3 (needs interaction system)
- Palm tree idle animation (swaying) — V2 requirement
</user_constraints>

---

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-----------------|
| WORLD-01 | Overworld tilemap loads and renders (~50×40 tiles, Miami-themed) | Tiled JSON format spec; Phaser `load.tilemapTiledJSON` + `make.tilemap` + `addTilesetImage` + `createLayer` pipeline documented |
| WORLD-02 | Player character spawns at south dock entry point facing north | Grid Engine `startPosition` field in `CharacterData`; `facingDirection` field sets initial facing |
| WORLD-03 | Tile-based grid movement: character moves one tile at a time (arrow keys + WASD) | Grid Engine `this.gridEngine.move()` in `update()`; Phaser `createCursorKeys()` + `addKeys({W,A,S,D})` for dual input |
| WORLD-04 | Camera follows character, world scrolls as player moves | Phaser `cameras.main.startFollow(sprite)` + `setFollowOffset()` + `setBounds()` |
| WORLD-05 | Collision system blocks movement on buildings, water, trees, and signs | Grid Engine `ge_collide: true` custom property on tileset tiles; explicit collision layer in Tiled JSON |
| WORLD-06 | Map has distinct zones visible on overworld: dock, main street, beach strip, plaza, heights | Map design: zones encoded in tile data and building shell placement; no runtime system needed |
| WORLD-07 | Palm trees render as Miami-appropriate trees (not generic Pokemon oaks) | LimeZu Modern Exteriors includes palm/tropical variants; pick correct tile GIDs during map authoring |
| WORLD-08 | Ocean renders on east edge as natural world boundary | LimeZu includes water/beach tiles; mark as `ge_collide: true` so character cannot walk into water |
| CHAR-01 | Original founder sprite renders (hoodie, laptop backpack — not Red/Ash) | PIPOYA FREE RPG Character Sprites 32x32 is recommended placeholder (64 characters, 4-direction, free for commercial use); custom sprite is Phase 9 swap |
| CHAR-02 | 4-directional walking animation (3 frames each, ~32×32px, Gen 1 style) | Grid Engine `walkingAnimationMapping: number` selects character row; `FrameRow` has `leftFoot`, `standing`, `rightFoot` fields; 3 frames per direction matches |
| CHAR-03 | Idle animation plays when character is stationary | Grid Engine stops animation at `standing` frame (center frame) when no movement input; no extra config needed — the middle frame of each FrameRow IS the idle frame |
</phase_requirements>

---

## Summary

Phase 2 builds the complete walkable overworld — a ~50×40 tile Miami-themed map in Phaser 3 using the Grid Engine plugin for tile-based movement. The technical stack is already wired: Phaser 3.90 + Grid Engine 2.48 are installed, `pixelArt: true` is set, and Grid Engine is registered as a scene plugin mapped to `this.gridEngine`. The primary work is: (1) authoring the Tiled JSON map programmatically with correct layer structure and `ge_collide` tile properties, (2) loading assets in `BootScene` and transitioning to a new `OverworldScene`, (3) wiring Grid Engine with the tilemap and player sprite, and (4) implementing keyboard input for arrow keys + WASD.

The most important design decision is that the map JSON is authored programmatically by agents — no Tiled GUI needed. This requires understanding the exact Tiled JSON format: a top-level map object with `layers` array, where each layer has a `data` array of GIDs (1-based tile IDs), and the tileset defines which tiles have `ge_collide: true` custom properties. Grid Engine reads this custom property to determine which tiles block movement, eliminating the need for any Phaser arcade physics collision setup.

LimeZu Modern Exteriors is 16x16 per tile (the pack also ships 32x32 and 48x48 variants). The character sprite placeholder (PIPOYA FREE RPG Character Sprites 32x32) is 32x32 per frame. These can coexist if the Phaser game is configured with `tileWidth: 16, tileHeight: 16` and the character sprite is rendered at 2x zoom or the camera zoom compensates. Alternatively, use the 32x32 LimeZu variant to match the character sprite dimensions exactly — this is the recommended approach (Claude's discretion per CONTEXT.md).

**Primary recommendation:** Use LimeZu's 32x32 variant, PIPOYA sprite at 32x32, tile size 32 in `GridEngineConfig`. Author the map JSON with three layers: `Ground`, `Above`, `Collision` — Grid Engine reads the collision layer by `ge_collide` tile property.

---

## Standard Stack

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| phaser | ^3.90.0 (installed) | Game framework — tilemap rendering, sprite management, camera, input | Industry standard for browser 2D games; already installed |
| grid-engine | ^2.48.0 (installed) | Tile-based grid movement, collision via tile properties | Purpose-built for Pokemon-style movement; already registered in main.ts |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| LimeZu Modern Exteriors | $2.50 itch.io | Tileset — buildings, paths, water, palm trees, beach | Phase 2 map tiles; Phase 9 art swap |
| PIPOYA FREE RPG Character Sprites 32x32 | Free itch.io | Placeholder 4-directional character sprite | Phase 2 placeholder; Phase 9 custom sprite swap |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| PIPOYA 32x32 placeholder | LPC (Liberated Pixel Cup) sprites | LPC has more variety but requires attribution stacking; PIPOYA is simpler |
| Programmatic JSON authoring | Tiled GUI | GUI is easier for humans but not agent-friendly; JSON authoring is more controllable and repeatable |
| 16x16 LimeZu variant | 32x32 LimeZu variant | 16x16 requires camera zoom 2x+ for readability; 32x32 matches PIPOYA sprite scale directly |

**Installation:**
No additional installs needed — phaser and grid-engine are already in `package.json`. Assets are placed in `public/`.

---

## Architecture Patterns

### Recommended Project Structure
```
public/
├── assets/
│   ├── tilesets/
│   │   └── modern-exteriors-32.png   # LimeZu tileset image
│   ├── sprites/
│   │   └── character-placeholder.png  # PIPOYA sprite sheet
│   └── maps/
│       └── overworld.json             # Programmatically authored Tiled JSON
src/
└── game/
    ├── main.ts                        # Already exists — add OverworldScene to scene array
    └── scenes/
        ├── Boot.ts                    # Transform: preload assets, transition to Overworld
        └── Overworld.ts               # New scene: tilemap, Grid Engine, player, camera, input
```

### Pattern 1: BootScene as Preloader

**What:** `BootScene` loads all Phase 2 assets in `preload()` then transitions to `OverworldScene` in `create()`.

**When to use:** Any time assets must be ready before a scene runs.

**Example:**
```typescript
// Source: Phaser 3 official docs - https://phaser.io/examples/v3.85.0/loader/tile-maps/view/load-tile-map-json
export class BootScene extends Phaser.Scene {
  constructor() {
    super({ key: "Boot" });
  }

  preload(): void {
    // Tileset image — key must match name used in Tiled tileset definition
    this.load.image("modern-exteriors", "assets/tilesets/modern-exteriors-32.png");
    // Tiled JSON map
    this.load.tilemapTiledJSON("overworld", "assets/maps/overworld.json");
    // Character sprite sheet — frameWidth/Height must match your sprite sheet
    this.load.spritesheet("player", "assets/sprites/character-placeholder.png", {
      frameWidth: 32,
      frameHeight: 32,
    });
  }

  create(): void {
    this.scene.start("Overworld");
  }
}
```

### Pattern 2: OverworldScene — Tilemap + Grid Engine Init

**What:** Create tilemap, create all layers, add player sprite, configure Grid Engine, configure camera.

**When to use:** Once in `create()` of `OverworldScene`.

**Example:**
```typescript
// Source: Grid Engine docs - https://annoraaq.github.io/grid-engine/p/create-first-game/index.html
export class OverworldScene extends Phaser.Scene {
  constructor() {
    super({ key: "Overworld" });
  }

  create(): void {
    // 1. Build tilemap from loaded JSON
    const map = this.make.tilemap({ key: "overworld" });
    // addTilesetImage(tiledTilesetName, phaserImageKey)
    const tileset = map.addTilesetImage("modern-exteriors", "modern-exteriors");

    // 2. Create all tile layers (order = draw order, bottom to top)
    map.createLayer("Ground", tileset, 0, 0);
    map.createLayer("Above", tileset, 0, 0);
    // Collision layer can be hidden — Grid Engine reads ge_collide property, not the rendered layer
    const collisionLayer = map.createLayer("Collision", tileset, 0, 0);
    collisionLayer?.setVisible(false);

    // 3. Player sprite
    const playerSprite = this.add.sprite(0, 0, "player");

    // 4. Camera follows player
    this.cameras.main.startFollow(playerSprite, true);
    this.cameras.main.setFollowOffset(-playerSprite.width / 2, -playerSprite.height / 2);
    this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);

    // 5. Grid Engine config
    const gridEngineConfig = {
      characters: [
        {
          id: "player",
          sprite: playerSprite,
          walkingAnimationMapping: 0, // row 0 of PIPOYA sheet = first character
          startPosition: { x: 25, y: 38 }, // south dock (adjust to actual dock tile)
          facingDirection: Direction.UP,
          offsetY: 0,
          speed: 4, // tiles per second
        },
      ],
    };
    this.gridEngine.create(map, gridEngineConfig);
  }

  update(): void {
    const cursors = this.input.keyboard!.createCursorKeys();
    const wasd = this.input.keyboard!.addKeys({ up: "W", down: "S", left: "A", right: "D" }) as any;

    if (cursors.left.isDown || wasd.left.isDown) {
      this.gridEngine.move("player", Direction.LEFT);
    } else if (cursors.right.isDown || wasd.right.isDown) {
      this.gridEngine.move("player", Direction.RIGHT);
    } else if (cursors.up.isDown || wasd.up.isDown) {
      this.gridEngine.move("player", Direction.UP);
    } else if (cursors.down.isDown || wasd.down.isDown) {
      this.gridEngine.move("player", Direction.DOWN);
    }
  }
}
```

### Pattern 3: Tiled JSON Map Structure (Programmatic Authoring)

**What:** The complete JSON structure agents must produce to create a valid Phaser/Grid Engine tilemap without a Tiled GUI.

**When to use:** Agents write `overworld.json` directly.

**Key structure:**
```json
{
  "version": "1.6",
  "tiledversion": "1.11.0",
  "type": "map",
  "orientation": "orthogonal",
  "renderorder": "right-down",
  "width": 50,
  "height": 40,
  "tilewidth": 32,
  "tileheight": 32,
  "infinite": false,
  "nextlayerid": 4,
  "nextobjectid": 1,
  "tilesets": [
    {
      "firstgid": 1,
      "name": "modern-exteriors",
      "tilewidth": 32,
      "tileheight": 32,
      "tilecount": 1024,
      "columns": 32,
      "image": "../tilesets/modern-exteriors-32.png",
      "imagewidth": 1024,
      "imageheight": 1024,
      "tiles": [
        {
          "id": 5,
          "properties": [
            { "name": "ge_collide", "type": "bool", "value": true }
          ]
        }
      ]
    }
  ],
  "layers": [
    {
      "type": "tilelayer",
      "id": 1,
      "name": "Ground",
      "width": 50,
      "height": 40,
      "x": 0,
      "y": 0,
      "opacity": 1,
      "visible": true,
      "data": [ ... ]
    },
    {
      "type": "tilelayer",
      "id": 2,
      "name": "Above",
      "width": 50,
      "height": 40,
      "x": 0,
      "y": 0,
      "opacity": 1,
      "visible": true,
      "data": [ ... ]
    }
  ]
}
```

**GID rules:**
- GID 0 = empty tile (no tile rendered, walkable by default in Grid Engine)
- GID 1 = first tile in first tileset (local tile ID 0)
- GID = `firstgid + localTileId`
- `data` array is flat: index = `x + y * mapWidth`, length = `mapWidth * mapHeight`
- Source: [Tiled JSON Map Format](https://doc.mapeditor.org/en/stable/reference/json-map-format/)

### Pattern 4: Grid Engine Collision via Tile Property

**What:** Mark blocking tiles in the tileset `tiles` array with `ge_collide: true`. Grid Engine reads this at runtime — no Phaser arcade physics needed.

**When to use:** Every tile that should block movement (buildings, water, trees, signs, fences).

```json
// Inside the tileset definition in overworld.json
"tiles": [
  { "id": 42, "properties": [{ "name": "ge_collide", "type": "bool", "value": true }] },
  { "id": 43, "properties": [{ "name": "ge_collide", "type": "bool", "value": true }] }
]
```

Grid Engine treats tiles with NO entry in the `tiles` array as walkable (when `ignoreMissingTiles` is not set). Tiles with `ge_collide: true` block all characters.

### Pattern 5: PIPOYA Sprite Sheet Layout

**What:** How PIPOYA 32x32 sprite sheets are laid out and how `walkingAnimationMapping` maps to them.

PIPOYA sheets have characters arranged in rows of 3 frames x 4 directions. Standard RPG Maker / PIPOYA convention:
- Row 0 (top): facing DOWN — frames: leftFoot, standing, rightFoot
- Row 1: facing LEFT
- Row 2: facing RIGHT
- Row 3: facing UP

When `walkingAnimationMapping` is a **number N**, Grid Engine assumes rows 4N through 4N+3 follow this convention. For a single-character sprite sheet with character at N=0, rows 0-3 cover all four directions.

When `walkingAnimationMapping` is a **WalkingAnimationMapping object**, you specify exact frame numbers per direction — use this if your sprite sheet deviates from the 4-row convention.

The `standing` (middle) frame of the last-moved direction becomes the idle pose. No additional idle configuration needed.

### Anti-Patterns to Avoid

- **Using `src/assets/` for tileset images**: Vite hashes files in `src/`, breaking Phaser's string-based URL loader. All game assets go in `public/`.
- **Setting tile collision with Phaser arcade physics**: Grid Engine manages collision entirely via `ge_collide` tile properties. Do not call `layer.setCollisionByProperty()` — this is the Phaser arcade physics approach and conflicts with Grid Engine.
- **Creating OverworldScene before assets load**: `BootScene` must fully preload before transitioning. `scene.start("Overworld")` goes in `BootScene.create()`, not `preload()`.
- **Missing `tileset.name` match**: The first argument to `map.addTilesetImage()` must exactly match the tileset name as defined in the Tiled JSON (`tilesets[0].name`). Mismatch = silent `null` tileset, blank map.
- **GID 0 misuse**: GID 0 means "empty" in Tiled JSON. Never use 0 to reference a real tile. Real tile IDs start at `firstgid` (usually 1).
- **Flat data array wrong length**: `data.length` must equal `width * height`. Any mismatch causes Phaser to fail silently or render garbled tiles.
- **Missing `scene` registration**: `OverworldScene` must be added to the `scene` array in `main.ts` alongside `BootScene`.

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Grid-based movement | Custom keyboard + tweening logic | Grid Engine `gridEngine.move()` | Handles tile queuing, collision, animation sync, diagonal prevention — 100s of edge cases |
| Tile collision detection | Custom `getBoundsAtPosition` checks | Grid Engine `ge_collide` tile property | Grid Engine blocks movement before it happens, not after — no collision response needed |
| Walking animation state machine | Phaser AnimationManager with manual direction tracking | Grid Engine `walkingAnimationMapping` | Grid Engine auto-selects correct animation frame based on movement direction and walk cycle |
| Camera bounds clamping | Manual camera position math | Phaser `cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels)` | One call handles all edge clamping |
| Sprite sheet frame math | Manual frame index calculation per direction | Grid Engine `walkingAnimationMapping: 0` | Engine handles leftFoot/standing/rightFoot cycling per direction automatically |

**Key insight:** Grid Engine was built exactly for Pokemon-style games. Every mechanism that Pokemon uses for movement exists in Grid Engine already. Custom implementations will be buggier and require ongoing maintenance.

---

## Common Pitfalls

### Pitfall 1: Tile Size Mismatch Between Tileset and GridEngineConfig
**What goes wrong:** LimeZu ships in 16x16, 32x32, and 48x48 variants. If the tileset image is 16x16 but the map JSON says `tilewidth: 32`, tiles render at wrong scale or are sliced incorrectly.
**Why it happens:** Agents may assume a tile size without checking the actual image dimensions of the chosen LimeZu variant.
**How to avoid:** Pick ONE variant (recommend 32x32) and make it consistent across: tileset image, `tilewidth`/`tileheight` in map JSON, `frameWidth`/`frameHeight` in sprite preload, and camera zoom level.
**Warning signs:** Tiles render as thin strips, or wrong parts of tileset appear on map.

### Pitfall 2: `addTilesetImage` Name Mismatch
**What goes wrong:** Tilemap renders as black/empty with no error thrown.
**Why it happens:** First argument to `addTilesetImage('NAME', 'key')` must exactly match the `name` field of the tileset in the Tiled JSON. The Phaser image `key` (second arg) must match what was used in `this.load.image('key', ...)`.
**How to avoid:** Define a constant for the tileset name string and use it in both the JSON and the `addTilesetImage` call.
**Warning signs:** Console is clean but the canvas is black or shows no tiles.

### Pitfall 3: Grid Engine `create()` Called Before Tilemap Layers Are Created
**What goes wrong:** Grid Engine cannot read tile data and defaults to treating everything as blocked, or throws a runtime error.
**Why it happens:** `this.gridEngine.create(map, config)` must be called AFTER all `map.createLayer()` calls.
**How to avoid:** Create all layers first, then call `this.gridEngine.create()` last in `OverworldScene.create()`.

### Pitfall 4: Empty Tiles Treated as Blocked
**What goes wrong:** Character cannot move through areas with no tiles placed (GID = 0), because Grid Engine's default is to treat missing tiles as blocking.
**Why it happens:** Grid Engine default behavior: missing tile = not walkable.
**How to avoid:** Fill the entire Ground layer with a walkable ground tile (path tile, grass tile). Never leave GID 0 in areas the player should walk through. Alternatively set `ignoreMissingTiles: true` in the character's `collides` config.

### Pitfall 5: `Direction` import missing
**What goes wrong:** TypeScript compile error `Cannot find name 'Direction'`.
**Why it happens:** `Direction` enum must be imported from `grid-engine`.
**How to avoid:** `import { GridEngine, Direction } from "grid-engine";` in `OverworldScene.ts`.

### Pitfall 6: Map Data Array Index Error
**What goes wrong:** Tiles appear in wrong positions or the map is garbled.
**Why it happens:** Tiled JSON `data` array is flat with index = `x + (y * mapWidth)`. Off-by-one in programmatic generation shifts everything.
**How to avoid:** When generating `data`, use `data[x + y * width] = gid`. Verify `data.length === width * height`.

### Pitfall 7: Camera Zoom Makes Tilemap Look Blurry
**What goes wrong:** Pixel art looks blurry or anti-aliased at zoom > 1.
**Why it happens:** `pixelArt: true` in GameConfig handles in-canvas rendering, but CSS `image-rendering: pixelated` must also be set on the canvas element.
**How to avoid:** `public/style.css` already exists — confirm `canvas { image-rendering: pixelated; image-rendering: crisp-edges; }` is present. This was established in Phase 1.

---

## Code Examples

Verified patterns from official sources:

### Full OverworldScene Shell
```typescript
// Source: Grid Engine docs https://annoraaq.github.io/grid-engine/p/create-first-game/index.html
// + Phaser docs https://phaser.io/examples/v3.85.0/loader/tile-maps/view/load-tile-map-json
import Phaser from "phaser";
import { Direction } from "grid-engine";

export class OverworldScene extends Phaser.Scene {
  constructor() {
    super({ key: "Overworld" });
  }

  create(): void {
    const map = this.make.tilemap({ key: "overworld" });
    const tileset = map.addTilesetImage("modern-exteriors", "modern-exteriors")!;

    map.createLayer("Ground", tileset, 0, 0);
    map.createLayer("Above", tileset, 0, 0);
    const collisionLayer = map.createLayer("Collision", tileset, 0, 0);
    collisionLayer?.setVisible(false);

    const playerSprite = this.add.sprite(0, 0, "player");
    this.cameras.main.startFollow(playerSprite, true);
    this.cameras.main.setFollowOffset(-playerSprite.width / 2, -playerSprite.height / 2);
    this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);

    this.gridEngine.create(map, {
      characters: [{
        id: "player",
        sprite: playerSprite,
        walkingAnimationMapping: 0,
        startPosition: { x: 25, y: 38 }, // south dock — tune to actual dock tile
        facingDirection: Direction.UP,
        speed: 4,
      }],
    });
  }

  update(): void {
    const cursors = this.input.keyboard!.createCursorKeys();
    const wasd = this.input.keyboard!.addKeys({
      up: Phaser.Input.Keyboard.KeyCodes.W,
      down: Phaser.Input.Keyboard.KeyCodes.S,
      left: Phaser.Input.Keyboard.KeyCodes.A,
      right: Phaser.Input.Keyboard.KeyCodes.D,
    }) as { up: Phaser.Input.Keyboard.Key; down: Phaser.Input.Keyboard.Key; left: Phaser.Input.Keyboard.Key; right: Phaser.Input.Keyboard.Key };

    if (cursors.left.isDown || wasd.left.isDown) {
      this.gridEngine.move("player", Direction.LEFT);
    } else if (cursors.right.isDown || wasd.right.isDown) {
      this.gridEngine.move("player", Direction.RIGHT);
    } else if (cursors.up.isDown || wasd.up.isDown) {
      this.gridEngine.move("player", Direction.UP);
    } else if (cursors.down.isDown || wasd.down.isDown) {
      this.gridEngine.move("player", Direction.DOWN);
    }
  }
}
```

### Register OverworldScene in main.ts
```typescript
// Add OverworldScene to the scene array in GameConfig
import { OverworldScene } from "./scenes/Overworld";

const config: Phaser.Types.Core.GameConfig = {
  // ... existing config ...
  scene: [BootScene, OverworldScene], // BootScene first = loads first
};
```

### Tiled JSON GID Data Array Pattern
```typescript
// Source: Tiled JSON Map Format https://doc.mapeditor.org/en/stable/reference/json-map-format/
// When generating map data programmatically:
const WIDTH = 50;
const HEIGHT = 40;
const data = new Array(WIDTH * HEIGHT).fill(0); // 0 = empty

// Place a ground tile (GID 1 = firstgid + 0) everywhere the player can walk
for (let y = 0; y < HEIGHT; y++) {
  for (let x = 0; x < WIDTH; x++) {
    data[x + y * WIDTH] = 1; // ground tile
  }
}

// Place a blocking tile (e.g., GID 6 = firstgid + 5, marked ge_collide:true in tileset)
// at position (10, 20) — a building corner
data[10 + 20 * WIDTH] = 6;
```

---

## Map Design: Zone Layout Reference

The ASCII map from the design doc defines zone positions. This is the coordinate system agents should use when placing tiles:

```
y=0  [LOOKOUT HILL/ROOFTOP]     [HIDDEN NPC]
     [ENGINEERING LAB]           [BOARDWALK + OCEAN]
     [MUSIC ROOM][THOVEN HQ][CHALK LAB][RECORD SHOP][GITHUB LIB]
     [ANDRES HOUSE][PLAZA + VC OFFICE]              [OCEAN]
     [IDEA GRAVEYARD][VENTANITA][STARBUCKS]         [OCEAN]
     [tall grass]   [BULLETIN BOARD]           [SECRET BEACH]
y=39 [DOCK / BOAT SPAWN]                       [BOARDWALK]
```

**Coordinate conventions:**
- x=0 is west edge, x=49 is east edge
- y=0 is north edge, y=39 is south edge (spawn point is high y value)
- Dock: approximately x=20-30, y=36-39
- Ocean/beach strip: x=40-49 along full height
- Heights zone: y=0-8
- Main street spine: x=20-30, full north-south

**Tile layer plan (3 layers minimum):**
1. `Ground` — base terrain: grass, paths, water fill, sand, floor tiles
2. `Above` — building facades, trees, fences, decorative overlays (rendered above ground, below player)
3. `Collision` — invisible layer; tiles with `ge_collide: true` placed wherever movement is blocked

A fourth optional layer `Player` can be used for depth ordering, but Grid Engine manages sprite depth automatically.

---

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Phaser Arcade Physics for tile collision | Grid Engine `ge_collide` tile property | Grid Engine v2+ | No physics bodies needed; collision is tile-property driven |
| Manual `StaticTilemapLayer` | `TilemapLayer` via `map.createLayer()` | Phaser 3.50+ | StaticTilemapLayer removed; use `createLayer()` for all layers |
| Animation state machine per direction | Grid Engine `walkingAnimationMapping` | Grid Engine v2 | Engine auto-manages animation frames per direction |
| `this.cameras.main.roundPixels = true` | `pixelArt: true` in GameConfig | Phaser 3.x | `pixelArt: true` sets roundPixels automatically |

**Deprecated/outdated:**
- `map.createStaticLayer()`: Removed in Phaser 3.50. Use `map.createLayer()` only.
- `GridEngine` imported as default and instantiated manually: Grid Engine v2+ is a Phaser plugin; it registers via the `plugins.scene` config (already done in `main.ts`).

---

## Open Questions

1. **Exact LimeZu tile GID mapping for blocking tiles**
   - What we know: LimeZu Modern Exteriors 32x32 includes building walls, water, palm trees — all need `ge_collide: true`
   - What's unclear: The exact tile IDs (local IDs) for each category require examining the actual tileset image to count tiles per row and identify which are trees/water/buildings
   - Recommendation: Agents should download the tileset, count `columns = imageWidth / tileWidth`, then enumerate which local tile IDs correspond to blocking terrain. A tileset catalog document (a simple mapping of visual tile → local ID) should be created in Wave 0 before map authoring begins.

2. **Camera zoom level for 32x32 tiles on 800x600 canvas**
   - What we know: 50 tiles × 32px = 1600px wide, 40 tiles × 32px = 1280px tall. Canvas is 800×600. Zoom 1x shows ~25×18 tiles at once. No zoom needed for full scroll.
   - What's unclear: Whether the default zoom (1x) provides adequate visual clarity for pixel art, or if 2x zoom with a smaller visible area is preferable UX.
   - Recommendation: Default to zoom 2x (`this.cameras.main.setZoom(2)`) for clear pixel art display, matching Pokemon's feel. Camera follows player in the 1600×1280 world.

3. **PIPOYA sprite sheet direction row order**
   - What we know: PIPOYA is 32x32, 4-directional, Gen 1 style. The convention is Down/Left/Right/Up (standard RPG Maker row order).
   - What's unclear: PIPOYA may deviate from this convention — the exact row order should be verified by examining the actual downloaded PNG before `walkingAnimationMapping: 0` is used.
   - Recommendation: Download PIPOYA pack in Wave 0, inspect the PNG, and confirm row order. If it deviates, use the `WalkingAnimationMapping` object format to specify exact frame numbers per direction.

---

## Validation Architecture

### Test Framework
| Property | Value |
|----------|-------|
| Framework | No test framework currently installed — Wave 0 must add one |
| Config file | none — Wave 0 creates vitest.config.ts |
| Quick run command | `npx vitest run --reporter=verbose` |
| Full suite command | `npx vitest run` |

**Note:** Phase 2 is primarily visual/interactive — the meaningful validation is a human playing the game, not unit tests. The test map below focuses on what CAN be unit-tested (JSON structure, data utilities) and what must be smoke-tested manually.

### Phase Requirements to Test Map
| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| WORLD-01 | Tilemap JSON is valid and parseable | unit | `npx vitest run tests/overworld-map.test.ts` | ❌ Wave 0 |
| WORLD-02 | Spawn position is within map bounds | unit | `npx vitest run tests/overworld-map.test.ts` | ❌ Wave 0 |
| WORLD-03 | Input handler calls gridEngine.move() per direction | unit (mock) | `npx vitest run tests/input.test.ts` | ❌ Wave 0 |
| WORLD-04 | Camera startFollow is called with player sprite | unit (mock) | `npx vitest run tests/camera.test.ts` | ❌ Wave 0 |
| WORLD-05 | Blocking tiles have ge_collide:true in tileset tiles array | unit | `npx vitest run tests/overworld-map.test.ts` | ❌ Wave 0 |
| WORLD-06 | Map JSON contains all named layers (Ground, Above, Collision) | unit | `npx vitest run tests/overworld-map.test.ts` | ❌ Wave 0 |
| WORLD-07 | At least one tile in palm tree GID range is placed in the map data | unit | `npx vitest run tests/overworld-map.test.ts` | ❌ Wave 0 |
| WORLD-08 | East edge columns (x=42-49) contain water tile GIDs | unit | `npx vitest run tests/overworld-map.test.ts` | ❌ Wave 0 |
| CHAR-01 | Character sprite file exists at public/assets/sprites/ | smoke | manual browser check | N/A |
| CHAR-02 | Walking animation plays on movement (4 directions) | smoke | manual — move character in all 4 directions | N/A |
| CHAR-03 | Idle frame shows when stationary | smoke | manual — stop moving, verify middle frame | N/A |

### Sampling Rate
- **Per task commit:** `npx vitest run tests/overworld-map.test.ts` (map JSON structure checks)
- **Per wave merge:** `npx vitest run` (full suite)
- **Phase gate:** Full suite green + manual smoke test: spawn, walk all zones, verify collision on buildings/water/trees

### Wave 0 Gaps
- [ ] `tests/overworld-map.test.ts` — covers WORLD-01, WORLD-02, WORLD-05, WORLD-06, WORLD-07, WORLD-08
- [ ] `tests/input.test.ts` — covers WORLD-03
- [ ] `tests/camera.test.ts` — covers WORLD-04
- [ ] `vitest.config.ts` — test framework config
- [ ] Framework install: `npm install -D vitest` — if none detected (currently none in package.json)

---

## Sources

### Primary (HIGH confidence)
- [Grid Engine Documentation — Collisions](https://annoraaq.github.io/grid-engine/p/collision/index.html) — `ge_collide` tile property, collision layer approach
- [Grid Engine Documentation — Collision Layers](https://annoraaq.github.io/grid-engine/p/collision-layers/index.html) — separate collision layer pattern
- [Grid Engine Documentation — Create Your First Game](https://annoraaq.github.io/grid-engine/p/create-first-game/index.html) — `create()` API, `GridEngineConfig`, `walkingAnimationMapping`, camera follow, keyboard input
- [Grid Engine API — CharacterData](https://annoraaq.github.io/grid-engine/api/interfaces/CharacterData) — all character config fields including `startPosition`, `facingDirection`, `speed`, `offsetY`
- [Grid Engine API — WalkingAnimationMapping](https://annoraaq.github.io/grid-engine/api/interfaces/WalkingAnimationMapping) — up/down/left/right fields mapped to `FrameRow`
- [Grid Engine API — FrameRow](https://annoraaq.github.io/grid-engine/api/interfaces/FrameRow) — `leftFoot`, `standing`, `rightFoot` frame numbers
- [Tiled JSON Map Format](https://doc.mapeditor.org/en/stable/reference/json-map-format/) — complete JSON structure spec, GID rules, layer and tileset object schemas

### Secondary (MEDIUM confidence)
- [Phaser 3 Tilemap Loading Example](https://phaser.io/examples/v3.85.0/loader/tile-maps/view/load-tile-map-json) — `load.tilemapTiledJSON`, `make.tilemap`, `addTilesetImage`, `createLayer` pattern
- [Michael Hadley's Phaser 3 Tilemap Series](https://medium.com/@michaelwesthadley/modular-game-worlds-in-phaser-3-tilemaps-1-958fc7e6bbd6) — recommended in design doc; covers `createLayer` vs static layer
- [LimeZu Modern Exteriors](https://limezu.itch.io/modernexteriors) — 16x16 primary (also 32x32, 48x48); $2.50; includes beach, palm, water; confirmed

### Tertiary (LOW confidence — verify on download)
- [PIPOYA FREE RPG Character Sprites 32x32](https://pipoya.itch.io/pipoya-free-rpg-character-sprites-32x32) — 64 characters, 4-direction, 32x32, free for commercial use; row order (Down/Left/Right/Up) is assumed RPG Maker standard, verify on actual file
- WASD input pattern via `this.input.keyboard.addKeys()` — standard Phaser 3 pattern, confirmed via community forum; exact TypeScript typing for the return value should be verified against installed Phaser version

---

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — Phaser 3 and Grid Engine are already installed and documented; all APIs verified against official docs
- Architecture: HIGH — Tiled JSON format is fully specified; Grid Engine create() pattern is verified; layer naming is Claude's discretion (no wrong answer)
- Pitfalls: HIGH — all pitfalls are verified from official docs or direct API inspection (e.g., StaticTilemapLayer removal is in Phaser changelog)
- Sprite sheet row order: LOW — PIPOYA is free and well-known but exact frame row order requires file inspection at download time

**Research date:** 2026-03-09
**Valid until:** 2026-09-09 (stable libraries — Grid Engine and Phaser 3 have stable APIs; LimeZu asset content is stable)