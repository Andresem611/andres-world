# Phase 03.3.1: Tiled Visual Map Design Pass - Research

**Researched:** 2026-03-10
**Domain:** Tiled GUI workflow, LimeZu tileset facade patterns, Phaser 3 tileset integration
**Confidence:** HIGH (codebase is fully inspected; findings are grounded in the actual files on disk)

---

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions
- Work done in Tiled GUI: open overworld.json, do the visual pass, save as .tmx + export overworld.json
- `.tmx` file committed to `public/assets/maps/` as the source of truth going forward
- `overworld.json` remains the Phaser-consumed build artifact (Tiled exports it)
- `generate-map.ts` is fully retired — add prominent warning comment: "RETIRED — overworld.json is now owned by Tiled. Running this will overwrite all Tiled visual work."
- Tiled owns the overworld permanently after 03.3.1 — no regeneration, no reconciliation
- `overworld-map.test.ts` is deleted — programmatic tile tests don't apply to Tiled-authored maps; visual verification replaces them
- All available tilesets in `/public/assets/tilesets/` added to the Tiled map's tileset registry upfront
- Tilesets to register: 1_Terrains, 2_City_Terrains, 3_City_Props, 4_Generic_Buildings, 7_Villas, 8_Worksite, 17_Garden, 19_Graveyard, 21_Beach, Interiors_16x16, Modern_Exteriors_Complete, Room_Builder_16x16
- Only the tilesets actually used will have tiles placed; the rest are just available in the palette

### Tileset Selection (Claude's Discretion — guided by project)
- General guidance: City Terrains/City Props for Main Street commercial buildings; Villas for Andres's House; Modern Exteriors Complete available as catch-all
- No new purchases required — use only what is in `/public/assets/tilesets/`

### Visual Scope — Buildings
- Key buildings get unique facade treatment: Thoven HQ, Andres's House, Starbucks/Ventanita, Engineering Lab
- All other buildings: shared facade pattern (roof + wall + base that works generically)
- No more single-tile BUILDING_GID (7689) blocks — every building has multi-tile treatment

### Visual Scope — Ground and Water
- Ground texture variety is in scope (grass variants, path edges/transitions)
- Water visual treatment is in scope (water border improvements, beach/sand transitions)
- Scope level: meaningful improvement, not Phase 9 final polish

### Done Criteria — all three required
1. Human walk-through approval: walk around the map in browser, judge it looks right
2. Screenshot checklist: Main Street, Thoven HQ, Andres's House, Beach strip, Water border — each reviewed
3. No flat BUILDING_GID blocks: every building has multi-tile facade treatment

### Claude's Discretion
- Which specific tileset tiles to use per building type (subject to visual confirm)
- Exact tile compositions for each building facade (roof/wall/base/door/window arrangement)
- Ground transition tile choices (path edges, grass-to-path)
- Water border / sand-to-water transition approach

### Deferred Ideas (OUT OF SCOPE)
- None — discussion stayed within phase scope.
</user_constraints>

---

## Summary

Phase 03.3.1 is a human-driven workflow phase, not a code-generation phase. The executor opens `overworld.json` in Tiled 1.11, does a visual tile pass replacing flat BUILDING_GID blocks with multi-tile facades, adds ground/water variety, saves as `.tmx` + re-exports `overworld.json`, then commits both files. The collision layer and all geometry from Phase 3.3 are strictly preserved — only the Ground and Above layers change.

The key technical risks are: GID disruption from registering tilesets in the wrong order, layer rename accidents in Tiled, and the Collision layer accidentally getting edited. The key process risk is losing the Phase 3.3 geometry if `generate-map.ts` is re-run after Tiled edits — the retirement warning comment must be in place before any Tiled work begins.

Validation for this phase is entirely human-driven: a browser walk-through, a screenshot checklist, and a one-time automated check confirming BUILDING_GID=7689 no longer appears in the Above layer of the exported `overworld.json`.

**Primary recommendation:** Do the tileset registration step first and confirm all 12 PNGs load cleanly in Tiled before placing a single tile. Any tileset that fails to load (wrong path) must be fixed before the GID chain is established.

---

## Standard Stack

### Core
| Tool | Version | Purpose | Why Standard |
|------|---------|---------|--------------|
| Tiled Map Editor | 1.11.0 | Author and export the .tmx map | Already in use (overworld.json reports `"tiledversion": "1.11.0"`); Phaser-native format |
| Phaser 3 | 3.90 | Consumes the exported overworld.json | Locked stack |
| LimeZu Modern Exteriors 16x16 | Current (pinned) | All 5 active tilesets + 7 additional registered | Already on disk in `public/assets/tilesets/` |

### Supporting
| Tool | Purpose | When to Use |
|------|---------|-------------|
| `public/tileset-preview.html` | Inspect GIDs by hover before placing in Tiled | Use to identify exact tiles for each building type before Tiled session |
| `vite dev` | Run game in browser for walk-through verification | Human walk-through after Tiled export |
| Browser screenshot | Screenshot checklist evidence | Per-zone screenshots during walk-through |

### Installation
No new packages required. All tilesets are on disk. Tiled 1.11 is the only tool needed externally.

---

## Architecture Patterns

### Tiled File Relationships After This Phase

```
public/assets/maps/
├── overworld.tmx          ← NEW: Tiled source file (committed, owned by Tiled)
└── overworld.json         ← MODIFIED: Tiled export artifact (Phaser consumes this)

scripts/
└── generate-map.ts        ← MODIFIED: RETIRED warning comment added
```

### Pattern 1: Open JSON in Tiled → Work → Save as TMX → Export as JSON

**What:** Tiled can open an existing JSON tilemap directly (File > Open). All edits are done visually. The map is then saved as `.tmx` (Tiled's native XML format) and also exported as `.json` (File > Export As).

**Critical detail:** "Save" writes `.tmx`. "Export As" writes `.json`. These are two separate operations. The planner must include both as explicit task steps — Andres must do both before committing.

**Step-by-step:**
1. `File > Open` — select `public/assets/maps/overworld.json`
2. Tiled parses the JSON and opens the 50×40 map with 3 layers (Ground, Above, Collision)
3. Register all 12 tilesets (see Tileset Registration section)
4. Do the visual pass (Ground, Above layers only — do NOT touch Collision)
5. `File > Save As` — save as `public/assets/maps/overworld.tmx`
6. `File > Export As` — export as `public/assets/maps/overworld.json` (overwrite)
7. Verify the JSON still has the correct layer names and tileset order before committing

**Why TMX and JSON both:** The `.tmx` is the editable source (XML, Tiled-native). The `.json` is what Phaser loads. Going forward, Andres edits the `.tmx` and re-exports to `.json` for any future map changes.

### Pattern 2: Tileset Registration Order (GID Safety)

**What:** When Tiled opens `overworld.json`, it reads the existing 5 tilesets with their locked `firstgid` values (terrains=1, beach=2369, buildings=6369, garden=12769, worksite=19041). Adding new tilesets via "Map > Tilesets > Add Tileset" appends them AFTER the existing chain.

**Safe order for adding the 7 new tilesets:**
The existing chain ends at GID 19680 (worksite last GID). Any new tilesets registered will start at 19681+. Tiled assigns `firstgid` automatically based on the previous tileset's last GID. The order of registration determines GID assignment for new tilesets.

**Registration procedure:**
1. Open the Tilesets panel (View > Tilesets)
2. Click "New Tileset" for each additional PNG
3. Set tile size to 16×16, margin=0, spacing=0
4. Point to the PNG in `public/assets/tilesets/`
5. Add in this order to create a predictable chain after worksite (19041–19680):

| Register Order | File | Expected firstgid |
|---------------|------|------------------|
| 6th | `2_City_Terrains_16x16.png` | 19681 |
| 7th | `3_City_Props_16x16.png` | ~25758 (19681 + 6077) |
| 8th | `7_Villas_16x16.png` | ~TBD after City Props |
| 9th | `19_Graveyard_16x16.png` | ~TBD |
| 10th | `Interiors_16x16.png` | ~TBD |
| 11th | `Modern_Exteriors_Complete_Tileset.png` | ~TBD |
| 12th | `Room_Builder_16x16.png` | ~TBD |

**The critical rule:** The first 5 tilesets (terrains, beach, buildings, garden, worksite) MUST remain in their current positions with their current `firstgid` values. Adding new tilesets only appends to the end — it never shifts existing firstgids. Tiled honors this automatically when opening an existing JSON with embedded tileset definitions.

**IMPORTANT — `columns` per tileset:**
Each tileset has a specific number of columns that the GID formula depends on. Mismatch here causes silent tile misalignment:
- `2_City_Terrains_16x16.png`: 59 columns (NOT 32 — visually confirmed wider sheet)
- `3_City_Props_16x16.png`: 32 columns
- `7_Villas_16x16.png`: 32 columns
- `19_Graveyard_16x16.png`: 32 columns
- `Interiors_16x16.png`: 16 columns (NOT 32 — narrow sheet)
- `Modern_Exteriors_Complete_Tileset.png`: unknown (inspect before placing tiles)
- `Room_Builder_16x16.png`: 76 columns (NOT 32 — very wide sheet)

Tiled reads columns from the image width automatically if you specify 16×16 tile size — verify the auto-detected column count in the tileset editor before saving.

### Pattern 3: Three-Layer Discipline

**What:** The map has exactly three layers. Each has a strict role:
- `Ground` — terrain base (grass, path, water, sand, plaza). Everything here is walkable by definition. Edit freely.
- `Above` — buildings, trees, props. Non-walkable objects are placed here. Replace BUILDING_GID blocks with multi-tile facades here.
- `Collision` — invisible blocking layer (ge_collide tiles). **DO NOT EDIT.** Phase 3.3 geometry is locked here.

**In Tiled:** Lock the Collision layer before starting. Click the lock icon next to the "Collision" layer in the Layers panel. This prevents accidental edits. The layer should also be set to `visible: false` in the export (it already is in the current JSON).

### Pattern 4: Multi-Tile Building Facades (Top-Down Pokemon Style)

**What:** In top-down Gen 1/2 Pokemon style, buildings are viewed from a slightly elevated angle. The visible face of a building is its front wall + roof. There is no 3D side. A typical 4×3 tile building in this style looks like:

```
[roof-left][roof-mid][roof-mid][roof-right]   ← row 0: roof edge/overhang
[wall-left][wall-mid][wall-mid][wall-right]   ← row 1: upper wall (windows if large enough)
[door-left][door   ][door    ][door-right]    ← row 2: ground floor (door, windows)
```

For the LimeZu buildings sheet (`4_Generic_Buildings_16x16.png`), the sprite is organized as complete building sections. Rows 1-8 are modern building facades (yellow/tan towers cols 0-7, brick-detailed cols 8-15, etc.). Rows 21-35 are ground floor / storefront tiles. A 2-tile wide building facade from this sheet:

- Top section (roof): row ≈ 1-3, matching cols for the building style
- Mid section (wall/windows): row ≈ 4-9
- Base section (door/storefront): row ≈ 21-35

The exact tiles must be confirmed via `tileset-preview.html` before placing in Tiled.

### Pattern 5: LimeZu 7_Villas for Andres's House

The Villas sheet contains single-family homes in top-down style, 3-4 tiles wide × 4-6 tiles tall, in multiple color variants. This is the correct source for a residential building that reads differently from Main Street commercial buildings.

**Anti-Patterns to Avoid**
- **Editing the Collision layer:** Any change to collision breaks Phase 4+ entrance detection. Lock it before touching any tile.
- **Renaming layers in Tiled:** `Overworld.ts` uses `map.createLayer("Ground", ...)`, `map.createLayer("Above", ...)`, `map.createLayer("Collision", ...)` by exact name. Renaming in Tiled will silently break the game.
- **Using `generate-map.ts` after Tiled work begins:** Running the script overwrites all visual work. The retirement comment must go in before Tiled opens the file.
- **Registering tilesets in the wrong name field:** Tiled's "Name" field for a tileset must match the `name` in the JSON. For the 5 existing tilesets, the names are: `terrains`, `beach`, `buildings`, `garden`, `worksite`. Do not change these names. New tilesets can be named freely.

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Tile ID discovery | Don't guess row/col from memory | `tileset-preview.html` + hover to confirm GID | LimeZu row 0 is always transparent; tile positions are not where you expect |
| Building facade patterns | Don't assemble from scratch | Use the 4_Generic_Buildings sprite sections — they are pre-designed as coherent facade sets | Building tiles in LimeZu are sprite sections that are designed to pair together; mixing across sections looks wrong |
| Column count for new tilesets | Don't assume 32 cols | Inspect each PNG: City Terrains = 59, Interiors = 16, Room_Builder = 76 | Wrong column count silently corrupts GID calculation for every tile placed from that tileset |

**Key insight:** Every tile you place in Tiled generates a GID = firstgid + (row × cols + col). If `cols` is wrong in the tileset definition, Tiled will store the wrong GID in the JSON, and Phaser will render a different tile than what you see in Tiled. Always verify the auto-detected column count in Tiled's tileset editor matches the table above.

---

## Common Pitfalls

### Pitfall 1: GID Chain Disruption from Removing a Tileset
**What goes wrong:** If any of the 5 existing tilesets is removed from the Tiled project and re-added, Tiled will assign it a new `firstgid` at the end of the chain. Every existing tile using that tileset renders a completely different tile or empty space.
**Why it happens:** `firstgid` is positional — it depends on cumulative tile counts of preceding tilesets.
**How to avoid:** Never remove any existing tileset. Only add new ones. If a tileset fails to load (bad path), fix the path in the tileset properties — do not delete and re-add.
**Warning signs:** After saving/exporting, if tiles that previously looked correct now show wrong graphics, check the `firstgid` values in `overworld.json` — they should still be: terrains=1, beach=2369, buildings=6369, garden=12769, worksite=19041.

### Pitfall 2: Collision Layer Edits
**What goes wrong:** Accidentally painting a tile on the Collision layer while working on Above. The player hits an invisible wall where none existed, or a previously blocked tile becomes walkable.
**Why it happens:** Layer switching in Tiled is easy to miss, especially when zoomed in. The Collision layer has the same visual tile (BUILDING_GID) as the Above layer's current building blocks.
**How to avoid:** Lock the Collision layer immediately after opening the file. Use the layer visibility toggle to hide it while working.
**Warning signs:** Player movement behavior changes after the export.

### Pitfall 3: Layer Rename
**What goes wrong:** Tiled's auto-suggest or a typo renames "Ground" to "ground" or "Collision" to "Collisions". Phaser's `createLayer()` call silently returns `null`, and the game either crashes or renders a black screen.
**Why it happens:** Tiled allows free layer renaming with no warning.
**How to avoid:** After the export, verify the three layer names in `overworld.json`: `"name": "Ground"`, `"name": "Above"`, `"name": "Collision"` (exact case). This takes 10 seconds with a text search.
**Warning signs:** `TypeError: Cannot read property 'setVisible' of null` in browser console.

### Pitfall 4: Export Path Divergence
**What goes wrong:** The `.tmx` file embeds tileset image paths as relative paths from the `.tmx` file location. If the `.tmx` is in `public/assets/maps/`, the paths must be `../../assets/tilesets/filename.png` (matching what the current `overworld.json` already has). If Tiled uses absolute paths or different relative paths, the exported JSON will have wrong image paths and Boot.ts `addTilesetImage()` will fail to find the image.
**Why it happens:** Tiled picks the path based on where the tileset PNG is relative to the `.tmx` save location.
**How to avoid:** Save the `.tmx` to `public/assets/maps/overworld.tmx` (same directory as `overworld.json`). The PNG files in `public/assets/tilesets/` will then have the correct `../../assets/tilesets/` relative path. After exporting, confirm the image paths in `overworld.json` match the existing pattern.

### Pitfall 5: BUILDING_GID=7689 Still in Above Layer After Pass
**What goes wrong:** The done criteria requires zero flat BUILDING_GID blocks remaining in the Above layer. If the pass is done building-by-building but one building is missed (e.g., a small VC Office block), it fails the automated check.
**Why it happens:** There are ~12 buildings on the map. It is easy to miss one.
**How to avoid:** After the pass, run the no-BUILDING_GID check (see Validation Architecture section) against the exported `overworld.json` before the walk-through.

### Pitfall 6: Boot.ts Not Updated for New Tilesets
**What goes wrong:** New tilesets are registered in Tiled and tiles from them are placed on the map. But `Boot.ts` only loads the original 5 images. Phaser cannot find the tileset image at runtime, and the map renders with missing tiles (black patches where new tiles should be).
**Why it happens:** Phaser's `load.image()` must be called for every tileset PNG the tilemap references. Tiled does not know about Phaser's preload step.
**How to avoid:** For every new tileset that has actual tiles placed on the map (not just registered for palette access), add a corresponding `this.load.image(name, path)` call in `Boot.ts`. The `name` must exactly match the tileset's `name` field in the exported JSON.

---

## Code Examples

### Boot.ts Pattern for New Tileset Additions

If new tilesets are used (tiles placed on map, not just registered), Boot.ts needs new preload lines following the exact existing pattern:

```typescript
// Existing (do not change these):
this.load.image("terrains",  "assets/tilesets/1_Terrains_and_Fences_16x16.png");
this.load.image("beach",     "assets/tilesets/21_Beach_16x16.png");
this.load.image("buildings", "assets/tilesets/4_Generic_Buildings_16x16.png");
this.load.image("garden",    "assets/tilesets/17_Garden_16x16.png");
this.load.image("worksite",  "assets/tilesets/8_Worksite_16x16.png");

// Add new tilesets only if tiles from them are actually placed:
// (key must match tileset "name" in overworld.json exactly)
this.load.image("villas",       "assets/tilesets/7_Villas_16x16.png");
this.load.image("city-props",   "assets/tilesets/3_City_Props_16x16.png");
this.load.image("graveyard",    "assets/tilesets/19_Graveyard_16x16.png");
// etc.
```

The corresponding `Overworld.ts` `addTilesetImage()` and the `allTilesets` array must also be updated:

```typescript
// In Overworld.ts create():
const terrains  = map.addTilesetImage("terrains",  "terrains")!;
const beach     = map.addTilesetImage("beach",     "beach")!;
const buildings = map.addTilesetImage("buildings", "buildings")!;
const garden    = map.addTilesetImage("garden",    "garden")!;
const worksite  = map.addTilesetImage("worksite",  "worksite")!;
// Add new only if used:
const villas    = map.addTilesetImage("villas",    "villas")!;
const allTilesets = [terrains, beach, buildings, garden, worksite, villas]; // add to array
```

### No-BUILDING_GID Automated Check

After exporting `overworld.json`, this Node.js one-liner confirms the Above layer has no flat BUILDING_GID=7689 tiles:

```bash
node -e "
const map = require('./public/assets/maps/overworld.json');
const above = map.layers.find(l => l.name === 'Above');
const count = above.data.filter(g => g === 7689).length;
console.log(count === 0 ? 'PASS: no flat BUILDING_GID blocks' : 'FAIL: ' + count + ' flat blocks remain');
"
```

This is the automated gate for Done Criterion 3. It takes under 1 second and should be run before the human walk-through.

### GID Verification After Export

After saving `.tmx` and exporting `.json`, verify the firstgid chain is intact:

```bash
node -e "
const map = require('./public/assets/maps/overworld.json');
const expected = {terrains: 1, beach: 2369, buildings: 6369, garden: 12769, worksite: 19041};
map.tilesets.slice(0, 5).forEach(ts => {
  const ok = expected[ts.name] === ts.firstgid;
  console.log(ok ? 'OK' : 'BROKEN', ts.name, 'firstgid=' + ts.firstgid, 'expected=' + expected[ts.name]);
});
"
```

---

## Tileset Selection Guide (Claude's Discretion)

This section is the primary planning artifact for the visual design decisions the planner must encode as task actions.

### Key Building Treatments

#### Thoven HQ (x=12-21, y=14-22 — 10 tiles wide × 9 tiles tall)
**Character:** Dominant, largest, polished. Must read as the headquarters of the map.
**Recommended tileset:** `4_Generic_Buildings_16x16.png` — use the modern tower sections (rows 1-20, cols 0-7 for yellow/tan or cols 8-15 for brick-detail).
**Facade pattern:**
- Row 14 (top): Roof tiles spanning x=12-21 — use the top-edge/roofline tiles from the buildings sheet
- Rows 15-20 (walls): Window rows — alternate wall and window tiles to fill the 6-row wall height
- Row 22 (base/entrance): Ground floor with a visible entrance door section centered on the building
**Differentiator:** Width (10 tiles) alone makes it the largest. Use a lighter, more polished facade color than surrounding buildings.

#### Andres's House (x=6-9, y=16-22 — 4 tiles wide × 7 tiles tall)
**Character:** Residential, personal, tucked behind Thoven HQ.
**Recommended tileset:** `7_Villas_16x16.png` — residential single-family home sprites in suburban style. Different texture from the commercial Main Street buildings immediately communicates "this is someone's home."
**Facade pattern:** The Villas sheet provides complete house sprites. Pick one 4-tile-wide variant and use it to fill the x=6-9 footprint. If the sprite is taller than 7 tiles, start from the correct row to show the roof at y=16 and the door at the bottom.

#### Starbucks Café (Main Street east side, confirm coordinates from map)
**Character:** Polished, familiar, draws people in.
**Recommended tileset:** `4_Generic_Buildings_16x16.png` — modern building facade section. Use a green-accent or glass-front storefront tile at the base row to evoke the Starbucks visual language.
**Differentiator from Thoven HQ:** Narrower footprint, ground-floor storefront prominence over multi-story wall height.

#### Ventanita (small kiosk on Main Street west)
**Character:** Tiny walk-up window, Cuban coffee stand. Should feel like a small structure, not a building.
**Recommended tileset:** `3_City_Props_16x16.png` — city props sheet has kiosk/booth structures, vending structures, and small standalone objects. A 2×2 or 2×3 tile kiosk structure is the goal.
**Alternative:** If City Props has no suitable kiosk, use a narrow 2-column section from `4_Generic_Buildings` with a prominent awning tile at the base.

#### Engineering Lab (northeast, off main path, industrial)
**Character:** Hacker/industrial. Feels discovered, not obvious. Different vibe from Main Street polish.
**Recommended tileset:** `4_Generic_Buildings_16x16.png` — use the darker brick facade section (rows 1-20, cols 16-23 per the zone survey). Industrial color tone reads differently from Thoven HQ's lighter facade.
**Alternative accent:** Add `8_Worksite_16x16.png` scaffold tiles as overlay details on the exterior to reinforce the industrial/construction vibe.

#### Generic Commercial Buildings (all others)
**Pattern:** Shared facade. Pick one 3-4 tile wide, 4-5 tile tall building section from `4_Generic_Buildings_16x16.png` and reuse it for all non-key commercial buildings. This creates visual consistency on Main Street while the key buildings stand out.

### Ground Texture Plan

**Grass areas:** Mix `GRASS_GID=193` (terrains row=6, col=0) with the grass variant at row=7 col=0 (GID=225) and row=8 col=0 (GID=257, the tall grass tile, only in tall grass zones). The grass variants are identical-looking green tiles that reduce the "tiled texture" monotony.

**Path edges:** The terrains sheet has transition tiles between grass and path (around rows 6-9, cols 5-7 area). Using path edge tiles on the border rows of paths (instead of just flat PATH_GID fills) creates a professional-looking border.

**Water borders:** The terrains sheet has aqua transition tile at row=8, col=20 (GID=277, RGB=[60,163,178]). This lighter water tile can be used as the water-edge row (next to beach/sand) to create a shore gradient.

**Beach/Sand transitions:** The beach tileset (21_Beach_16x16.png) has sand-to-water edge tiles in rows 2-4 around cols 8-15. These create a proper shoreline rather than a hard water-sand edge.

---

## Tiled Workflow — Exact Steps

This section documents the precise workflow so the planner can encode it as task actions.

### Pre-Work (before opening Tiled)
1. Add RETIRED warning comment to `generate-map.ts` (TypeScript banner comment at the top of the file)
2. Delete `tests/overworld-map.test.ts`
3. Commit both deletions with message like `chore(03.3.1): retire generate-map.ts, delete programmatic tests`

### Tileset Registration Session
1. Open Tiled 1.11
2. `File > Open` — select `public/assets/maps/overworld.json`
3. Verify 3 layers appear in Layers panel: Ground, Above, Collision
4. Lock the Collision layer (lock icon in Layers panel)
5. Hide the Collision layer (eye icon in Layers panel)
6. For each of the 7 additional tilesets: Map > Add Tileset > New Tileset from File > select PNG, set tile width=16, tile height=16, verify column count auto-detected correctly
7. Save: `File > Save As > public/assets/maps/overworld.tmx`
8. Verify TMX saved cleanly (no Tiled error dialogs)

### Visual Design Pass
1. Work building-by-building. Start with the smallest/simplest (generic commercial) to establish the shared facade pattern before tackling key buildings.
2. For each building footprint in the Above layer: erase the current BUILDING_GID tiles, then paint the multi-tile facade using the tileset palette.
3. Do not touch the Ground layer during the building pass.
4. After buildings: do the Ground layer pass (path edges, grass variants, water borders).
5. Do not touch the Collision layer at any point.

### Export and Verification
1. `File > Save` (updates the .tmx)
2. `File > Export As` — select `public/assets/maps/overworld.json` (overwrite)
3. Run the no-BUILDING_GID check (see Code Examples section)
4. Run the GID chain verification check (see Code Examples section)
5. Verify layer names are intact: `"name": "Ground"`, `"name": "Above"`, `"name": "Collision"`
6. If new tilesets were used: update Boot.ts and Overworld.ts (see Code Examples section)
7. `vite dev` — walk the map in browser
8. Take screenshots: Main Street, Thoven HQ, Andres's House, Beach strip, Water border

---

## State of the Art

| Old Approach | Current Approach | Established | Impact |
|--------------|------------------|-------------|--------|
| Programmatic generate-map.ts | Tiled-authored .tmx as source of truth | Phase 03.3.1 | Human visual control over every tile; no code changes needed for map updates |
| Single-tile BUILDING_GID=7689 placeholder | Multi-tile facade from buildings/villas sheets | Phase 03.3.1 | Map reads as a real place, not a prototype |
| No .tmx in repo | .tmx committed as source of truth | Phase 03.3.1 | Future map edits go through Tiled GUI, not code |

**Deprecated after this phase:**
- `generate-map.ts`: Permanently retired. Comment added. Do not run.
- `tests/overworld-map.test.ts`: Deleted. Programmatic tile position tests do not apply to Tiled-authored maps.

---

## Open Questions

1. **Which tiles in 4_Generic_Buildings to use for Thoven HQ vs generic commercial?**
   - What we know: The buildings sheet has multiple facade styles across column groups (cols 0-7: yellow/tan; cols 8-15: brick detail; cols 16-23: darker brick)
   - What's unclear: Exact row/col for roof tiles, window tiles, and door tiles within each style — requires tileset-preview.html hover confirmation before Tiled session
   - Recommendation: The planner should instruct Andres to spend 10 minutes in tileset-preview.html before the Tiled session, identify 3 tiles (roof, wall, door) for Thoven HQ and note their GIDs. This is not a blocker to planning but must be a task step.

2. **Are new tilesets needed (will City Terrains, Villas, etc. actually be used)?**
   - What we know: The decision registers all 12 but only places tiles from those that have better options than the existing 5
   - What's unclear: Whether `4_Generic_Buildings` alone is sufficient for all building types, or whether `7_Villas` is truly needed for Andres's House vs using a different section of the buildings sheet
   - Recommendation: The planner should treat Boot.ts changes as conditional ("IF new tileset tiles were placed, THEN update Boot.ts") rather than prescriptive. Make this a task check step, not a mandatory change.

3. **Tiled version on Andres's machine?**
   - What we know: `overworld.json` reports `"tiledversion": "1.11.0"` — this is the version that generated it
   - What's unclear: Whether Andres has 1.11.0 installed or a different version
   - Recommendation: The plan should include a one-line check: open Tiled > Help > About, confirm version is 1.11.x. If it's a later version (1.12+), it will still open and save the file correctly but may warn about version mismatch.

---

## Validation Architecture

`workflow.nyquist_validation` is `true` in `.planning/config.json` — this section is required.

### Test Framework
| Property | Value |
|----------|-------|
| Framework | Vitest (already installed) |
| Config file | `vite.config.ts` (vitest inline config) |
| Quick run command | `npx vitest run` |
| Full suite command | `npx vitest run` |

### Phase Requirements → Test Map

This phase has no testable behavior requirements in REQUIREMENTS.md. The requirements it touches are pre-existing (WORLD-01 through WORLD-08, all marked Complete). The phase's own success criteria are:

| Done Criterion | Behavior | Test Type | Automated Command |
|----------------|----------|-----------|-------------------|
| No flat BUILDING_GID blocks in Above layer | `overworld.json` Above layer data contains zero tiles with value 7689 | Automated Node check | `node -e "const m=require('./public/assets/maps/overworld.json');const a=m.layers.find(l=>l.name==='Above');const n=a.data.filter(g=>g===7689).length;process.exit(n===0?0:1)"` |
| GID chain intact | terrains=1, beach=2369, buildings=6369, garden=12769, worksite=19041 | Automated Node check | See Code Examples section |
| Layer names intact | Ground, Above, Collision still present | Automated Node check | `node -e "const m=require('./public/assets/maps/overworld.json');const names=m.layers.map(l=>l.name);['Ground','Above','Collision'].forEach(n=>{if(!names.includes(n)){console.error('MISSING:',n);process.exit(1)}});console.log('OK')"` |
| Human walk-through approval | Game renders correctly, buildings look right | Human visual | `vite dev`, walk map in browser |
| Screenshot checklist | 5 zones captured and reviewed | Human visual | Browser screenshots |

### Sampling Rate
- **Per task commit:** Run the three Node.js automated checks (no-BUILDING_GID, GID chain, layer names)
- **Per wave merge:** Full `npx vitest run` (existing non-deleted tests should still pass: dialog-box.test.ts, interaction-router.test.ts, npc-config.test.ts)
- **Phase gate:** All three automated checks green + human walk-through approval before `/gsd:verify-work`

### Wave 0 Gaps
- [ ] `tests/overworld-map.test.ts` — DELETED in Wave 0 (not created, removed)
- None — no new test files needed. Validation for this phase is the three Node.js one-liners above, which are run inline (no test file required).

Note: `overworld-map.test.ts` deletion must happen in Wave 0 before the visual pass. After deletion, `npx vitest run` should pass with the remaining 3 test files.

---

## Sources

### Primary (HIGH confidence)
- `/Users/andresmartinez/andres-world/public/assets/maps/overworld.json` — layer structure, tileset chain (firstgids confirmed), layer names confirmed
- `/Users/andresmartinez/andres-world/src/game/scenes/Boot.ts` — exact preload pattern for tileset images
- `/Users/andresmartinez/andres-world/src/game/scenes/Overworld.ts` — layer name strings, `addTilesetImage()` pattern, `allTilesets` array usage
- `/Users/andresmartinez/andres-world/.planning/TILE-CATALOG.md` — confirmed GIDs with RGB, confirmed tileset dimensions and column counts
- `/Users/andresmartinez/andres-world/.planning/research/limezu-tileset-structure.md` — row zone descriptions for all 5 active tilesets + 7 additional available tilesets
- `/Users/andresmartinez/andres-world/.planning/ARCHITECTURE-DECISIONS.md` — locked decisions on Tiled vs programmatic authoring
- `/Users/andresmartinez/andres-world/.planning/phases/03.3-map-layout-design/03.3-VERIFICATION.md` — locked building coordinates (Andres's House x=6-9, Thoven HQ x=12-21) with verification evidence
- `/Users/andresmartinez/andres-world/.planning/config.json` — nyquist_validation: true confirmed

### Secondary (MEDIUM confidence)
- Visual inspection notes in `limezu-tileset-structure.md` for row zone contents of `7_Villas_16x16.png`, `3_City_Props_16x16.png`, `19_Graveyard_16x16.png` — these are zone descriptions from visual PNG inspection, not pixel-level GID confirms
- Building sheet row zones (rows 1-8: facades; 21-35: storefronts/doors) — from visual survey, not hover-confirmed GIDs

### Tertiary (LOW confidence, flag for validation)
- Specific tiles within `4_Generic_Buildings` for Thoven HQ facade (roof/wall/door tile rows) — row zone estimated, exact tiles must be hover-confirmed in `tileset-preview.html` before placing in Tiled

---

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — all tools and files exist on disk and have been read
- Architecture patterns (Tiled workflow): HIGH — grounded in the actual `overworld.json` structure and Tiled conventions
- GID chain safety: HIGH — firstgid values confirmed directly from the JSON file
- Tileset selection per building: MEDIUM — row zone descriptions are from visual inspection, specific tile GIDs need hover confirmation before use
- Pitfalls: HIGH — all pitfalls derive from the actual codebase structure (layer names, Boot.ts patterns, generate-map.ts risk)

**Research date:** 2026-03-10
**Valid until:** Phase 03.3.1 complete (this research is specific to the current codebase state — once the TMX is committed, the research is consumed)
