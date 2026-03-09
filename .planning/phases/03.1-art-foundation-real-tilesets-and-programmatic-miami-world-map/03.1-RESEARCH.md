# Phase 03.1: Art Foundation - Real Tilesets and Programmatic Miami World Map — Research

**Researched:** 2026-03-09
**Domain:** Phaser 3 tilemaps, Tiled JSON format, LimeZu Modern Exteriors 16x16, programmatic map generation
**Confidence:** HIGH

---

## Summary

The current game uses a placeholder 16-column colored-block tileset (modern-exteriors-32.png, 32px tiles) generated programmatically. The real LimeZu Modern Exteriors 16x16 PNG files are already in `public/assets/tilesets/`. This phase replaces the placeholder with real tiles — updating generate-map.ts to reference actual LimeZu tile IDs, switching the tile size from 32 to 16, updating Boot.ts to load the correct PNGs, adjusting Phaser camera zoom from 2x to 4x to compensate, and regenerating overworld.json.

The core technical challenge is identifying which tile IDs in each LimeZu PNG correspond to the terrain categories needed (grass, path, water, sand, palm tree, building, scaffolding, dock). The tile ID formula is deterministic: `localId = row * columns + col` (0-indexed), `GID = firstgid + localId`. Since multiple separate PNG sheets will be used, each sheet gets its own entry in the Tiled JSON `tilesets` array with a sequential `firstgid`.

**Primary recommendation:** Use 5 individual LimeZu PNGs (Terrains, Beach, Buildings, Garden, Worksite) as separate Tiled tilesets in one JSON map. Write a Node.js script (`scripts/inspect-tileset.cjs`) that opens each PNG, extracts the 16x16 grid, and exports a visual catalog or JSON of tile positions — agents run this first to identify actual tile IDs before regenerating the map.

---

## What's Already Built (Current State)

| File | Current State | What Must Change |
|------|--------------|-----------------|
| `public/assets/tilesets/modern-exteriors-32.png` | Placeholder 9-row colored PNG, 32px tiles | Replace references — do NOT delete, keep as fallback |
| `public/assets/maps/overworld.json` | Uses `modern-exteriors-32.png`, 32px tiles, 16 columns | Regenerate with real tile IDs, 16px tiles, multiple tilesets |
| `scripts/generate-map.ts` | Hardcoded TILE_SIZE=32, 9-category local IDs | Rewrite constants for real LimeZu IDs |
| `src/game/scenes/Boot.ts` | Loads `modern-exteriors-32.png` as single image | Load 5 LimeZu PNGs with correct keys |
| `src/game/scenes/Overworld.ts` | `addTilesetImage("modern-exteriors", ...)`, zoom=2 | Load all 5 tileset images, zoom=4 |
| `src/game/main.ts` | 800x600 canvas | May need canvas resize |
| `tests/overworld-map.test.ts` | Asserts `tilewidth: 32` | Update to `tilewidth: 16` |

---

## Standard Stack

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| Phaser 3 | ^3.90.0 (installed) | Tilemap rendering, scene management | Already in use, industry standard |
| Grid Engine | ^2.48.0 (installed) | Grid movement, collision via ge_collide | Already wired |
| Vitest | ^4.0.18 (installed) | Tests for map structure validation | Already in use |
| tsx | Already in PATH | Run TypeScript scripts with npx | Used by existing generate-map.ts |

### LimeZu Tilesets Already in `public/assets/tilesets/`
| File | Dimensions | Cols | Rows | Total Tiles | Primary Use |
|------|-----------|------|------|-------------|-------------|
| `1_Terrains_and_Fences_16x16.png` | 512x1184px | 32 | 74 | 2368 | Grass, paths, ground terrain |
| `21_Beach_16x16.png` | 512x2000px | 32 | 125 | 4000 | Sand, ocean water tiles |
| `4_Generic_Buildings_16x16.png` | 512x3200px | 32 | 200 | 6400 | Building shells, walls |
| `17_Garden_16x16.png` | 512x3136px | 32 | 196 | 6272 | Palm trees, vegetation |
| `8_Worksite_16x16.png` | 512x320px | 32 | 20 | 640 | Scaffolding, construction |
| `2_City_Terrains_16x16.png` | 944x1648px | 59 | 103 | 6077 | City terrain (optional) |

**Key fact:** All individual LimeZu sheets have 0 margin and 0 spacing. The `Modern_Exteriors_Complete_Tileset.png` (2816x8224px, 176 cols) is the combined mega-sheet — do NOT use this for production as it would give enormous firstgid numbers and is slow to load. Use the individual sheets.

---

## Architecture Patterns

### Pattern 1: Multiple Tilesets in One Tiled JSON Map

When a Phaser 3 map references multiple tilesets, each tileset gets its own entry in the `tilesets` array with a unique `firstgid`. The `firstgid` of the first tileset is always 1. Each subsequent tileset's `firstgid = previous_firstgid + previous_tilecount`.

**GID calculation formula:**
```
localId = row * columns + col   (0-indexed, row is the y-row, col is x-column)
GID = firstgid + localId
```

**Example for 5-tileset layout (in generate-map.ts):**
```typescript
// Tileset 1: Terrains (firstgid=1)
// cols=32, 2368 tiles total
const TERRAIN_FIRSTGID = 1;
const TERRAIN_COLS = 32;

// Tileset 2: Beach (firstgid=2369)
const BEACH_FIRSTGID = TERRAIN_FIRSTGID + 2368; // 2369
const BEACH_COLS = 32;

// Tileset 3: Buildings (firstgid=6369)
const BUILDING_FIRSTGID = BEACH_FIRSTGID + 4000; // 6369
const BUILDING_COLS = 32;

// Tileset 4: Garden (firstgid=12769)
const GARDEN_FIRSTGID = BUILDING_FIRSTGID + 6400; // 12769
const GARDEN_COLS = 32;

// Tileset 5: Worksite (firstgid=19041)
const WORKSITE_FIRSTGID = GARDEN_FIRSTGID + 6272; // 19041
const WORKSITE_COLS = 32;

// Helper: gid(tileset_firstgid, row, cols, col)
function tileGid(firstgid: number, cols: number, row: number, col: number): number {
  return firstgid + (row * cols + col);
}
```

### Pattern 2: Tiled JSON Structure for Multiple Tilesets

The `tilesets` array in overworld.json must list all tilesets in ascending `firstgid` order:

```json
{
  "tilesets": [
    {
      "firstgid": 1,
      "name": "terrains",
      "image": "../../assets/tilesets/1_Terrains_and_Fences_16x16.png",
      "imagewidth": 512,
      "imageheight": 1184,
      "tilewidth": 16,
      "tileheight": 16,
      "tilecount": 2368,
      "columns": 32,
      "margin": 0,
      "spacing": 0,
      "tiles": [
        {
          "id": 42,
          "properties": [{"name": "ge_collide", "type": "bool", "value": true}]
        }
      ]
    },
    {
      "firstgid": 2369,
      "name": "beach",
      "image": "../../assets/tilesets/21_Beach_16x16.png",
      "imagewidth": 512,
      "imageheight": 2000,
      "tilewidth": 16,
      "tileheight": 16,
      "tilecount": 4000,
      "columns": 32,
      "margin": 0,
      "spacing": 0,
      "tiles": []
    }
  ]
}
```

**Critical:** The `"id"` field in the `tiles` array is a LOCAL tile ID (0-based within that tileset). The `ge_collide: true` property tells Grid Engine that tile is non-walkable.

### Pattern 3: Phaser 3 Loading Multiple Tilesets

Boot.ts must load each PNG as a named image, then Overworld.ts calls `addTilesetImage` once per tileset:

```typescript
// Boot.ts preload()
this.load.image("terrains", "assets/tilesets/1_Terrains_and_Fences_16x16.png");
this.load.image("beach", "assets/tilesets/21_Beach_16x16.png");
this.load.image("buildings", "assets/tilesets/4_Generic_Buildings_16x16.png");
this.load.image("garden", "assets/tilesets/17_Garden_16x16.png");
this.load.image("worksite", "assets/tilesets/8_Worksite_16x16.png");

// Overworld.ts create()
const map = this.make.tilemap({ key: "overworld" });
const terrainTileset = map.addTilesetImage("terrains", "terrains")!;
const beachTileset = map.addTilesetImage("beach", "beach")!;
const buildingTileset = map.addTilesetImage("buildings", "buildings")!;
const gardenTileset = map.addTilesetImage("garden", "garden")!;
const worksiteTileset = map.addTilesetImage("worksite", "worksite")!;

// Pass ALL tilesets to createLayer as an array
const allTilesets = [terrainTileset, beachTileset, buildingTileset, gardenTileset, worksiteTileset];
map.createLayer("Ground", allTilesets, 0, 0);
map.createLayer("Above", allTilesets, 0, 0);
const collisionLayer = map.createLayer("Collision", allTilesets, 0, 0);
collisionLayer?.setVisible(false);
```

**Critical:** `createLayer` accepts an array of Tileset objects when multiple tilesets are used on the same layer. Both the `tilesets[N].name` in JSON and the first argument to `addTilesetImage` must match exactly.

### Pattern 4: Phaser Config for 16x16 Tiles

With 16x16 tiles, the map is 50x40 = 800x640 pixels. At 1:1 zoom this looks tiny. The standard Pokemon-style approach is 3x or 4x zoom:

```typescript
// At 4x zoom: 16px tiles appear as 64px on screen
// 800px canvas / 64px effective tile = 12.5 tiles visible width
// This is the authentic Pokemon viewport feel

this.cameras.main.setZoom(4); // Grid Engine first-game example uses zoom=4

// Canvas config in main.ts — increase height slightly to allow more tiles visible
const config: Phaser.Types.Core.GameConfig = {
  width: 800,
  height: 576,  // 576 = 36 tiles * 16px — clean multiple
  pixelArt: true, // MUST remain true for pixel-perfect rendering
  // ... rest unchanged
};
```

**Alternative:** Keep 800x600 canvas and use zoom=3 (16px * 3 = 48px apparent size, ~16 tiles visible). The tradeoff is that zoom=4 looks more Pokemon-authentic. Either works — recommend zoom=4 with canvas height adjusted to clean multiple of (16*4=64).

### Pattern 5: addTilesetImage Full Signature

```typescript
// Full signature:
map.addTilesetImage(
  tilesetName,   // string: MUST match tilesets[N].name in JSON
  key,           // string: Phaser cache key from this.load.image(key, ...)
  tileWidth,     // optional: overrides JSON value (leave undefined to use JSON)
  tileHeight,    // optional: overrides JSON value
  tileMargin,    // optional: defaults to 0 or JSON value
  tileSpacing    // optional: defaults to 0 or JSON value
)
```

For LimeZu 16x16 sheets: `tileWidth=16, tileHeight=16, tileMargin=0, tileSpacing=0`. Since these values are in the JSON already (tilewidth/tileheight=16, margin=0, spacing=0), you can omit them and let Phaser read from JSON. Pass them explicitly only if JSON values are wrong.

### Pattern 6: Tile ID Inspection Script

The critical enabler for the plan: agents need to know which row/column in each PNG contains the desired terrain before they can write generate-map.ts constants. The plan must include a Wave 0 task that writes `scripts/inspect-tileset.cjs` — a Node.js script using the `pngjs` or manual PNG decoder to extract pixel data from each sheet and output a JSON catalog:

```javascript
// scripts/inspect-tileset.cjs
// Usage: node scripts/inspect-tileset.cjs
// Output: public/assets/maps/tileset-catalog.json
// Reads each PNG, takes 1 representative pixel from center of each tile cell,
// outputs { filename, cols, rows, tiles: [{row, col, localId, rgb}] }
// Agent reads this to identify tiles visually by color and position.
```

**Alternative approach (simpler):** Use sharp or jimp npm packages to slice tiles. But since the project avoids external dev deps beyond vitest/vite/ts, use Node's built-in approach or the existing manual PNG encoder pattern already in generate-map.ts (which already uses zlib and manual PNG building without external deps).

### Recommended Project Structure After Phase 03.1

```
scripts/
├── generate-map.ts          # UPDATED: 16px tiles, real LimeZu GIDs, multiple tilesets
├── inspect-tileset.cjs      # NEW: reads LimeZu PNGs, outputs tile color catalog
└── generate-npc-sprites.ts  # UNCHANGED

public/assets/
├── tilesets/
│   ├── 1_Terrains_and_Fences_16x16.png   # PRIMARY: grass, paths
│   ├── 21_Beach_16x16.png                # sand, water
│   ├── 4_Generic_Buildings_16x16.png     # building shells
│   ├── 17_Garden_16x16.png               # palm trees
│   ├── 8_Worksite_16x16.png              # scaffolding
│   └── modern-exteriors-32.png           # DEPRECATED: keep for rollback
├── maps/
│   ├── overworld.json                    # REGENERATED: 16px, 5 tilesets
│   └── tileset-catalog.json             # NEW: tile color catalog from inspect script

src/game/
├── scenes/Boot.ts           # UPDATED: load 5 PNGs
├── scenes/Overworld.ts      # UPDATED: addTilesetImage x5, zoom=4
└── config/npcs.ts           # UPDATED: positions adjusted if real map changes zones

tests/
└── overworld-map.test.ts    # UPDATED: tilewidth=16, tileheight=16
```

### Anti-Patterns to Avoid

- **Using Modern_Exteriors_Complete_Tileset.png:** This 176-column mega-sheet would work but gives thousands of GIDs per sheet and is ~90K tiles — enormous JSON. Use individual sheets.
- **Hardcoding Tiled image path as absolute:** The `image` field in tilesets JSON must be a relative path from the JSON file location (`../../assets/tilesets/filename.png`) — same pattern as current overworld.json.
- **Forgetting to pass all tilesets to createLayer:** If `createLayer("Ground", terrainTileset)` is called with only one tileset but the layer has tiles from multiple, those tiles render black. Always pass the array.
- **Mismatching tileset name:** The string in `tilesets[N].name` (JSON) MUST match the first arg to `addTilesetImage()`. The second arg is the Phaser cache key from `this.load.image(key, path)`.
- **Keeping zoom=2 with 16px tiles:** 16px * 2 = 32px apparent tile size — too small. Pokemon Gen 1 rendered at ~3-4x equivalent on physical hardware. Use zoom=3 or 4.

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| PNG pixel reading | Custom PNG decoder | pngjs OR existing manual approach in generate-map.ts (already handles PNG format) | PNG format is complex; the project already has a working raw PNG encoder |
| Tileset column counting | Manual pixel math | Python/Node script reading PNG IHDR chunk for width/height | Already done above: 1_Terrains=32cols, Beach=32cols, Buildings=32cols, Garden=32cols, Worksite=32cols |
| GID lookup table | Manual spreadsheet | Computed constants in generate-map.ts: `TERRAIN_FIRSTGID=1`, `BEACH_FIRSTGID=2369` etc. | Math is deterministic given sheet dimensions |
| Multiple tileset Phaser wiring | Custom loader | Phaser's built-in `createLayer([tilesetA, tilesetB])` array support | Already supported, just needs array syntax |

**Key insight:** The PNG inspection step is unavoidable — someone must visually identify which row/col in each tileset holds grass, paths, buildings, palm trees, etc. This cannot be automated without computer vision. The plan must include a task where the agent renders each sheet as an HTML page or outputs pixel color samples, then makes tile ID decisions from visual inspection. Alternatively, agents can use well-known LimeZu tile positions documented in the community (e.g., row 0 col 0 of Terrains is the basic grass tile).

---

## Common Pitfalls

### Pitfall 1: tilewidth in map vs tileset
**What goes wrong:** The Tiled JSON has `tilewidth` at both map level AND tileset level. Phaser reads the tileset's `tilewidth` for rendering. If the map says `tilewidth: 32` but tilesets say `tilewidth: 16`, Phaser uses 16 for rendering but the map grid is still 32-based — tiles offset incorrectly.
**How to avoid:** Set both map-level `tilewidth: 16, tileheight: 16` AND each tileset's `tilewidth: 16, tileheight: 16` in the JSON.
**Warning signs:** Tiles render shifted or doubled up.

### Pitfall 2: Existing test asserts tilewidth=32
**What goes wrong:** `tests/overworld-map.test.ts` line 13 asserts `expect(mapData.tilewidth).toBe(32)`. After regenerating the map with 16px tiles, this test fails.
**How to avoid:** Update the test assertion to `toBe(16)` as part of this phase's Wave 0.
**Warning signs:** CI fails with "expected 16 to be 32".

### Pitfall 3: NPC positions based on 32px grid may be semantically wrong on 16px grid
**What goes wrong:** The NPC positions in npcs.ts (e.g., john-collison at x=25, y=20) are tile coordinates, not pixel coordinates. Tile coordinates are grid-based and don't change when tile size changes. However, the map layout (building footprints) may shift if generate-map.ts building positions are redesigned for the 16px grid.
**How to avoid:** Keep NPC tile coordinates the same initially. Only update if building footprint tile coordinates change in the new map.
**Warning signs:** NPCs spawn inside walls or off-map.

### Pitfall 4: Grid Engine ge_collide on local IDs
**What goes wrong:** The `tiles` array in each tileset uses LOCAL tile IDs (0-based within that tileset), not GIDs. A blocking tile in the Beach tileset with local ID 5 is NOT GID 5 — it's GID 2374 (firstgid 2369 + 5). The JSON `tiles[N].id` field must be the local ID.
**How to avoid:** In generate-map.ts, when writing the `tiles` (ge_collide) array, use `localId` not `gid`. Grid Engine resolves this correctly via the Tiled JSON standard.
**Warning signs:** Grid Engine ignores collisions, player walks through walls.

### Pitfall 5: Collision layer using wrong GID markers
**What goes wrong:** The current collision layer marks blocked tiles using `gid(BUILDING_WALL)` — a GID from the old single-tileset. After switching to multiple tilesets, the collision layer must use valid GIDs from one of the new tilesets, OR rely entirely on `ge_collide` tile properties without a separate collision layer.
**How to avoid:** The cleanest approach for multiple tilesets: use the `ge_collide` tile property approach. Mark blocking tiles in each tileset's `tiles` array, and use the Collision layer only to OVERRIDE walkability (0 = walkable, non-zero = use tileset's ge_collide). Grid Engine checks the Collision layer's tile GID, looks up the tileset for that tile, and checks its `ge_collide` property.
**Warning signs:** All tiles become walkable (forgot to mark any tiles as ge_collide) OR no tiles are walkable (too many marked).

### Pitfall 6: Camera follow offset with new sprite size
**What goes wrong:** The current code calculates `setFollowOffset(-sprite.width/2, -sprite.height/2)`. If the character sprite is still 32x32, this gives -16, -16. With 16x16 tiles at 4x zoom, the 32x32 sprite renders as 128x128 on screen — the camera may feel off-center.
**How to avoid:** The player sprite is still 32x32 per frame (3 cols x 4 rows). The camera follow offset should compensate for the tile size, not the sprite size. Keep offset at `(-16, -16)` which centers the player on a 32x32 sprite. Or use `(-tileSize, -tileSize)` where tileSize=16, giving `(-16, -16)`.
**Warning signs:** Camera follows character's feet or head instead of center.

---

## Code Examples

### Tiled JSON Tileset Entry (verified pattern from Tiled docs)
```json
{
  "firstgid": 1,
  "name": "terrains",
  "image": "../../assets/tilesets/1_Terrains_and_Fences_16x16.png",
  "imagewidth": 512,
  "imageheight": 1184,
  "tilewidth": 16,
  "tileheight": 16,
  "tilecount": 2368,
  "columns": 32,
  "margin": 0,
  "spacing": 0,
  "tiles": [
    {
      "id": 0,
      "properties": [{"name": "ge_collide", "type": "bool", "value": true}]
    }
  ]
}
```

### generate-map.ts Constants Pattern (updated for 16px + multiple sheets)
```typescript
const TILE_SIZE = 16;
const MAP_WIDTH = 50;
const MAP_HEIGHT = 40;

// Tileset: Terrains (1_Terrains_and_Fences_16x16.png — 32 cols, 74 rows)
const TERRAIN_FIRSTGID = 1;
const TERRAIN_COLS = 32;
const TERRAIN_COUNT = 32 * 74; // 2368

// Tileset: Beach (21_Beach_16x16.png — 32 cols, 125 rows)
const BEACH_FIRSTGID = TERRAIN_FIRSTGID + TERRAIN_COUNT; // 2369
const BEACH_COLS = 32;
const BEACH_COUNT = 32 * 125; // 4000

// Tileset: Buildings (4_Generic_Buildings_16x16.png — 32 cols, 200 rows)
const BUILDING_FIRSTGID = BEACH_FIRSTGID + BEACH_COUNT; // 6369
const BUILDING_COLS = 32;
const BUILDING_COUNT = 32 * 200; // 6400

// Tileset: Garden (17_Garden_16x16.png — 32 cols, 196 rows)
const GARDEN_FIRSTGID = BUILDING_FIRSTGID + BUILDING_COUNT; // 12769
const GARDEN_COLS = 32;
const GARDEN_COUNT = 32 * 196; // 6272

// Tileset: Worksite (8_Worksite_16x16.png — 32 cols, 20 rows)
const WORKSITE_FIRSTGID = GARDEN_FIRSTGID + GARDEN_COUNT; // 19041
const WORKSITE_COLS = 32;

// GID helper
function tileGid(firstgid: number, cols: number, row: number, col: number): number {
  return firstgid + (row * cols + col);
}

// Once tile IDs are identified from visual inspection:
// Example (THESE ARE PLACEHOLDERS — agent must verify from PNG inspection):
const GRASS_GID   = tileGid(TERRAIN_FIRSTGID, TERRAIN_COLS, 0, 0);  // row 0, col 0
const PATH_GID    = tileGid(TERRAIN_FIRSTGID, TERRAIN_COLS, 1, 0);  // row 1, col 0 (likely path)
const WATER_GID   = tileGid(BEACH_FIRSTGID, BEACH_COLS, 0, 0);      // first beach tile (water)
const SAND_GID    = tileGid(BEACH_FIRSTGID, BEACH_COLS, 2, 0);      // sand row (visual inspect)
const BUILDING_GID = tileGid(BUILDING_FIRSTGID, BUILDING_COLS, 0, 0);
const PALM_GID    = tileGid(GARDEN_FIRSTGID, GARDEN_COLS, 0, 0);
const SCAFFOLD_GID = tileGid(WORKSITE_FIRSTGID, WORKSITE_COLS, 0, 0);
```

### Phaser createLayer with Multiple Tilesets (verified from Phaser 3 docs)
```typescript
const map = this.make.tilemap({ key: "overworld" });
const terrains  = map.addTilesetImage("terrains", "terrains")!;
const beach     = map.addTilesetImage("beach", "beach")!;
const buildings = map.addTilesetImage("buildings", "buildings")!;
const garden    = map.addTilesetImage("garden", "garden")!;
const worksite  = map.addTilesetImage("worksite", "worksite")!;

const allSets = [terrains, beach, buildings, garden, worksite];
map.createLayer("Ground", allSets, 0, 0);
map.createLayer("Above", allSets, 0, 0);
const collisionLayer = map.createLayer("Collision", allSets, 0, 0);
collisionLayer?.setVisible(false);
```

### Camera Zoom for 16px Tiles
```typescript
// 16px tiles at 4x zoom = 64px apparent tile size
// Map: 50*64 = 3200px x 40*64 = 2560px world space
// Canvas: 800x576 → 12.5 tiles wide x 9 tiles tall visible
this.cameras.main.setZoom(4);
this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
// widthInPixels = 50 * 16 = 800, heightInPixels = 40 * 16 = 640
```

---

## Tile ID Determination Strategy

This is the critical unknown that agents must resolve. Two valid approaches:

### Approach A: Inspection Script (Recommended)
Write `scripts/inspect-tileset.cjs` that reads each PNG using Node's `zlib` (no new deps) and extracts a color sample from the center of each tile cell. Output JSON with `{row, col, localId, centerPixelRGB}`. The agent then assigns terrain categories based on color:
- Green pixels → grass tiles
- Gray/beige pixels → path tiles
- Blue pixels → water tiles
- Tan/yellow pixels → sand tiles
- Brown/tan pixels → building walls
- Dark green → palm trees
- Yellow-gray → scaffolding

### Approach B: Row 0 Safe Defaults
For many LimeZu sheets, the first row contains the most basic terrain type. Agents can use `row=0, col=0` as the "primary" tile for each sheet category:
- Terrains sheet row 0 col 0 → likely grass (GID=1)
- Beach sheet row 0 col 0 → likely first beach/water tile (GID=2369)
- Buildings sheet row 0 col 0 → likely first building wall tile (GID=6369)
- Garden sheet row 0 col 0 → likely first garden/tree tile (GID=12769)
- Worksite sheet row 0 col 0 → likely first worksite tile (GID=19041)

This approach produces a valid, playable map immediately even if the tile appearances aren't perfect. The tileset can be refined in later passes as tile IDs are confirmed visually.

**Recommendation:** Use Approach B as the default path, with Approach A as an optional enhancement task. The map just needs to be non-placeholder — exact tile aesthetics are better than perfection-paralysis.

---

## World Map Tile Coordinate Layout (50x40 grid)

The existing generate-map.ts already defines correct building positions. Preserve these in the rewrite:

| Zone | Tile Coordinates | Layer |
|------|-----------------|-------|
| Main street spine | x=22-28, y=0-39 | Ground (PATH) |
| Dock area | x=18-32, y=34-39 | Ground (DOCK) |
| Beach sand strip | x=38-41, y=5-39 | Ground (SAND) |
| Ocean water | x=42-49, y=0-39 | Ground + Above (WATER) |
| Central plaza | x=20-35, y=16-22 | Ground (PLAZA) |
| Thoven HQ | x=10-17, y=14-22 | Above (BUILDING) |
| Starbucks Cafe | x=29-34, y=24-28 | Above (BUILDING) |
| Chalk Lab (construction) | x=18-22, y=8-13 | Above (BUILDING + SCAFFOLD) |
| Andres's House | x=6-12, y=16-22 | Above (BUILDING) |
| Engineering Lab | x=38-44, y=2-8 | Above (BUILDING) |
| GitHub Library | x=38-44, y=12-18 | Above (BUILDING) |
| Record Shop | x=29-33, y=10-14 | Above (BUILDING) |
| Ventanita | x=23-27, y=26-29 | Above (BUILDING) |
| VC Office (construction) | x=28-33, y=16-20 | Above (BUILDING + SCAFFOLD) |
| Music Room | x=3-8, y=10-14 | Above (BUILDING) |
| Idea Graveyard | x=2-10, y=24-32 | Above (BUILDING) |
| Lookout Hill | x=20-30, y=0-6 | Above (BUILDING) |
| Bulletin Board | x=23-25, y=30-31 | Above (BUILDING) |
| Player spawn | x=25, y=38 | Dock — MUST be walkable |

**NPC positions (from npcs.ts — keep unchanged):**
| NPC | Tile Position |
|-----|--------------|
| marc-andreessen | x=25, y=31 |
| john-collison | x=25, y=20 |
| michael-seibel | x=14, y=24 |
| keri | x=12, y=24 |
| brian-chesky | x=11, y=24 |
| paul-graham | x=26, y=27 |
| dalton-caldwell | x=23, y=7 |
| ben-horowitz | x=6, y=34 |
| vinod-khosla | x=42, y=25 |
| tobi-lutke | x=40, y=5 |
| patrick-collison | x=42, y=5 |
| dario-amodei | x=41, y=6 |
| dad | x=9, y=18 |
| dog-1 | x=7, y=20 |

**NPC position notes:** vinod-khosla at x=42 is currently in the ocean zone (x=42-49). After the art switch, this NPC should be moved to the boardwalk at x=40-41 to be in the sand/beach strip zone, not the ocean. This is the ONE known position fix needed.

---

## Validation Architecture

Nyquist validation is enabled (`workflow.nyquist_validation: true`).

### Test Framework
| Property | Value |
|----------|-------|
| Framework | Vitest 4.0.18 |
| Config file | `vitest.config.ts` |
| Quick run command | `npx vitest run tests/overworld-map.test.ts` |
| Full suite command | `npm test` |

### Phase Requirements → Test Map

This phase has no formally assigned requirement IDs. The testable behaviors map to:

| Behavior | Test Type | Automated Command | File Exists? |
|----------|-----------|-------------------|-------------|
| overworld.json tilewidth=16 | unit | `npx vitest run tests/overworld-map.test.ts` | ✅ (needs assertion update) |
| overworld.json has 3 layers | unit | `npx vitest run tests/overworld-map.test.ts` | ✅ |
| Each layer has 2000 tiles | unit | `npx vitest run tests/overworld-map.test.ts` | ✅ |
| Dock spawn (x=24-26, y=37-39) walkable | unit | `npx vitest run tests/overworld-map.test.ts` | ✅ |
| Ocean strip blocked | unit | `npx vitest run tests/overworld-map.test.ts` | ✅ |
| Map has 5 tileset entries | unit | `npx vitest run tests/overworld-map.test.ts` | ❌ Wave 0 |
| All tileset names match expected keys | unit | `npx vitest run tests/overworld-map.test.ts` | ❌ Wave 0 |
| ge_collide tiles exist in at least one tileset | unit | `npx vitest run tests/overworld-map.test.ts` | ✅ (assertion fine) |

### Sampling Rate
- **Per task commit:** `npx vitest run tests/overworld-map.test.ts`
- **Per wave merge:** `npm test`
- **Phase gate:** Full suite green before `/gsd:verify-work`

### Wave 0 Gaps
- [ ] Update `tests/overworld-map.test.ts` — change `tilewidth` assertion from 32 → 16
- [ ] Add tileset count assertion: `expect(mapData.tilesets).toHaveLength(5)` (or 5)
- [ ] Add tileset name assertions: `expect(mapData.tilesets[0].name).toBe("terrains")` etc.
- [ ] NO new test files needed — existing overworld-map.test.ts covers all structural assertions

---

## Open Questions

1. **Exact tile row/col for each terrain category in LimeZu sheets**
   - What we know: Sheet dimensions are confirmed (32 cols each). Formula is deterministic.
   - What's unclear: Which row/col in each sheet visually represents grass, path, water, sand, etc.
   - Recommendation: Wave 0 inspection script, or use row=0/col=0 defaults and refine visually

2. **Should the Collision layer remain or switch to pure ge_collide properties?**
   - What we know: Current approach uses a dedicated Collision layer with BUILDING_WALL GID as blocker. Grid Engine supports both approaches.
   - What's unclear: With 5 tilesets, the Collision layer must pick a GID from one of them to use as the blocker marker. Using a generic "collision marker" tile from Terrains sheet (any non-zero GID with ge_collide=true) works.
   - Recommendation: Keep the Collision layer approach (it's working), use Terrains row=0 col=0 (GID=1) as the collision marker tile if it's marked ge_collide=true. This preserves the existing architectural decision.

3. **Canvas size with 16px tiles**
   - What we know: Current canvas is 800x600. Map is 800x640 at 1:1 scale. At 4x zoom, effective canvas shows 12.5 x 9.375 tiles.
   - What's unclear: Whether 800x600 or 800x576 (clean tile multiple) looks better.
   - Recommendation: Keep 800x600, use zoom=4. The non-clean multiple is invisible at runtime.

4. **Character sprite frame size vs tile size**
   - What we know: Character sprite is 32x32 per frame (3 cols x 4 rows = 96x128px sprite sheet). Grid Engine places characters at tile center.
   - What's unclear: Whether 32x32 sprites on 16px tiles look too large (a 2-tile-wide character).
   - Recommendation: Keep 32x32 sprites. At 4x zoom, the sprite renders as 128x128px on a 64px effective tile — slightly oversized like Gen 1 Pokemon sprites which were 1.5x the tile size. This is authentic.

---

## Sources

### Primary (HIGH confidence)
- Phaser 3 docs — `addTilesetImage` full signature (all params including tileWidth, tileHeight, tileMargin, tileSpacing)
- Grid Engine official docs — `ge_collide` property, `create()` config, zoom=4 pattern
- Tiled JSON format docs — tileset structure, firstgid rules, tile properties format
- `/Users/andresmartinez/andres-world/scripts/generate-map.ts` — existing pattern for buildTileProperties(), JSON structure
- `/Users/andresmartinez/andres-world/src/game/scenes/Overworld.ts` — current addTilesetImage usage
- Actual PNG file dimensions via Python IHDR reading (HIGH confidence — directly measured)

### Secondary (MEDIUM confidence)
- [Phaser 3 Tilemap Guide by Michael Hadley](https://medium.com/@michaelwesthadley/modular-game-worlds-in-phaser-3-tilemaps-1-958fc7e6bbd6) — multiple tileset loading patterns
- [Grid Engine Create First Game](https://annoraaq.github.io/grid-engine/p/create-first-game/index.html) — zoom=4 for 16px tiles, camera offset pattern
- [ariroffe/personal-website](https://github.com/ariroffe/personal-website) — Pokemon-style Phaser 3 site, confirmed uses Tiled-exported JSON with custom tileset

### Tertiary (LOW confidence — flag for validation)
- LimeZu tileset organization (row 0 = primary terrain): Based on community experience with LimeZu packs, not officially documented. Agent must verify via visual inspection.
- Exact tile positions in LimeZu sheets: Not documented. Row 0 col 0 defaults are safe starting points.

---

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — all libraries already installed, versions confirmed
- Architecture (multiple tilesets, firstgid): HIGH — verified from Tiled JSON spec and Phaser docs
- Tile ID identification: LOW — must be determined by visual PNG inspection (agent task)
- Pitfalls: HIGH — all verified against actual existing code and Phaser/Grid Engine docs

**Research date:** 2026-03-09
**Valid until:** 2026-04-09 (stable ecosystem — Phaser 3, Grid Engine, Tiled format are mature)
