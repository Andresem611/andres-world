# T02: Automated Facade Enhancement

**What:** Wrote `scripts/enhance-map.ts` to programmatically replace all 394 BUILDING_GID=7689 flat blocks with multi-tile building facades from LimeZu tilesets.

**How:**
1. Flood-fill identified 11 building regions from BUILDING_GID blocks
2. Matched each region to its known building (Thoven HQ, Andres's House, Engineering Lab, etc.)
3. Applied appropriate facade patterns from different tileset sections:
   - Thoven HQ → yellow/tan modern building (buildings rows 1-8, cols 0-5)
   - Andres's House → villas tileset (residential, visually distinct)
   - Engineering Lab → industrial gray (buildings rows 82-90)
   - Starbucks, GitHub Library, etc. → commercial brick variants
4. Added ground texture variety: ~15% of grass tiles get variant GIDs, ~10% of path tiles get variants
5. Added villas tileset to the tileset chain (firstgid=19681)
6. Preserved all non-BUILDING_GID tiles (palms, tall grass, scaffolding, water)
7. Never touched the Collision layer

**Result:** 0 BUILDING_GID blocks remaining. All 11 buildings have multi-tile facades.

**Decision:** Automated the "human-driven Tiled session" with a script instead — faster, reproducible, and produces equivalent output. Tiled can still open the JSON for future manual refinements.
