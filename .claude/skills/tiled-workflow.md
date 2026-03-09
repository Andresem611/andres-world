---
name: tiled-workflow
description: Use when working with the Tiled map editor or map JSON for Andres World. Covers LimeZu tileset setup, layer conventions, and Phaser export workflow.
---

# Tiled Workflow Skill — Andres World

## Architecture Decision

**Maps are authored programmatically, not via Tiled GUI.**

The file `scripts/generate-map.ts` generates `public/assets/maps/overworld.json` by constructing valid Tiled JSON directly. This is intentional — it makes GID changes reproducible (just update constants and re-run `npx tsx scripts/generate-map.ts`).

**Only use Tiled GUI for:** Visual tile inspection, building new interior maps from scratch when the layout is complex. Always export to JSON.

---

## Opening a LimeZu Tileset in Tiled

1. Open Tiled → New Map
2. Set: Orientation=Orthogonal, Tile size=16×16, Map size=your dimensions
3. Map → Add External Tileset → select the PNG file
4. In the tileset editor: Tile Width=16, Tile Height=16, Margin=0, Spacing=0
5. Name the tileset exactly as it appears in overworld.json (e.g., `terrains`, `beach`)

**IMPORTANT:** The tileset name in Tiled must match:
- `tilesets[N].name` in the Tiled JSON
- The first argument to `map.addTilesetImage()` in Phaser
- The `this.load.image("key", ...)` key in BootScene

All three must match or Phaser will fail silently to render the tileset.

---

## Required Layer Structure

Interior and overworld maps must use these exact layer names (Grid Engine reads them):

| Layer | Name | Purpose |
|-------|------|---------|
| 1 (bottom) | `Ground` | Floor tiles — always visible |
| 2 | `Above` | Furniture, buildings, overlays |
| 3 | `Collision` | Invisible blocking tiles (Grid Engine reads ge_collide) |

In Tiled: Layers panel → create in this order (bottom to top).

---

## Collision Setup

Grid Engine reads tile properties to determine blocking. For each tileset:
1. In Tiled: select the tileset
2. Right-click a tile → Tile Properties → add: `ge_collide = true (bool)`
3. In the JSON, this appears under `tilesets[N].tiles[M].properties`

The Collision layer should use `ge_collide:true` tiles placed where blocking is needed.
In the programmatic generator, this is done via `buildXyzTileProperties()` functions.

---

## Exporting Phaser-Compatible JSON

1. File → Export As → JSON (not "Save As" — that's Tiled format)
2. Check: Embed tilesets = NO (keep separate, Phaser loads them individually)
3. The exported JSON must have:
   - `tilewidth: 16, tileheight: 16`
   - `layers` array with `Ground`, `Above`, `Collision`
   - `tilesets` array with correct `firstgid` values

**firstgid values in the exported JSON must match the chain in generate-map.ts:**
```
terrains: 1
beach: 2369
buildings: 6369
garden: 12769
worksite: 19041
```

If you add a tileset to Tiled, the firstgid auto-calculates. Verify it matches the chain.

---

## Integrating Tiled JSON with generate-map.ts

The programmatic generator (`scripts/generate-map.ts`) is the source of truth for:
- Map dimensions (50×40)
- GID constants (GRASS_GID, PATH_GID, etc.)
- Layer data arrays
- Tileset definitions and properties

If you create a map in Tiled GUI:
1. Export the JSON
2. Copy the `data` array from each layer into generate-map.ts as a reference
3. Convert to use GID constants (not raw numbers)
4. Add to `.planning/TILE-CATALOG.md` any new tiles used

**Never ship raw Tiled-exported JSON as the final map.** Always pass it through generate-map.ts constants to maintain the catalog.

---

## Adding NPC/Object Layers for Spawn Points

In Tiled for interior maps:
1. Add an Object Layer named `Objects`
2. Place Point objects at door positions, NPC spawn points
3. Name each object (e.g., `entrance`, `exit`, `npc-keri`)
4. Export includes `layers[N].objects` array with `{name, x, y, type}`
5. In Phaser: `map.findObject("Objects", o => o.name === "entrance")`

This is the correct pattern for dynamic interior spawn positions (vs. hardcoded tile coords).

---

## Running the Map Generator

```bash
npx tsx scripts/generate-map.ts
```

Output: `public/assets/maps/overworld.json`

The script validates and prints:
- Map dimensions
- Layer data lengths
- Tileset GID chain
- Dock spawn walkable check
- Ocean blocked check
- Main street non-zero check
