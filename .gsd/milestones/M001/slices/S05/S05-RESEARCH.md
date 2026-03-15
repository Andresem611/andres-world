# Phase 3.2: Map Visual Design - Research

**Researched:** 2026-03-09
**Domain:** TypeScript map generation, Phaser 3 tilemap GID constants, multi-tile sprite placement
**Confidence:** HIGH

## Summary

Phase 3.2 is a surgical bug-fix pass on `scripts/generate-map.ts`. Three GID constants — `BUILDING_GID`, `PALM_GID`, and `SCAFFOLD_GID` — currently point at row=0 of their respective tilesets, which is a transparent border row in every LimeZu sheet. This causes all buildings, palm trees, and scaffolding to render as invisible tiles. TILE-CATALOG.md has already confirmed the correct GIDs for all three via Andres's visual review of `tileset-preview.html`.

The fix is fully scoped: update three constants (and adjust the palm to 2-tile placement), update tileset tile property localIds to match the new GIDs, regenerate `overworld.json`, and update test assertions that hardcode old GID values. No geometry changes, no architecture changes, no new libraries. The tileset firstgid chain (TERRAIN=1, BEACH=2369, BUILDINGS=6369, GARDEN=12769, WORKSITE=19041) is locked and must not change.

The 2-tile palm (fronds at GID 2770, trunk at GID 2834 one row below) introduces the only logic complexity: a second setTile pass over all palm positions to place the trunk row. The CONTEXT.md leaves the exact mechanism (second pass vs. inline) to Claude's discretion.

**Primary recommendation:** Update the three broken GID constants, add a `PALM_TRUNK_GID` constant, add a second pass that places trunk tiles below every palm frond position, update `buildGardenTileProperties()` → `buildBeachPalmTileProperties()` (localIds now reference beach tileset), update `buildBuildingTileProperties()` and `buildWorksiteTileProperties()` to match new localIds, run `npx tsx scripts/generate-map.ts`, then update test assertions and confirm green.

---

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions
- **Building tile composition:** Solid fill only — single wall GID (7689) for all buildings — confirmed ✅ in TILE-CATALOG.md. Same tile for all building types; visual differentiation deferred to Phase 9 (Miami Art Deco assets). Multi-tile building facades (roof edge / wall face / base rows) deferred to a later phase — not Phase 3.2. Scaffold over building shell — under-construction buildings (Chalk Lab, VC Office) get SCAFFOLD_GID (3598) overlaid on top of BUILDING_GID rows (existing approach confirmed). Building footprints and positions are CORRECT from Phase 2 — only GIDs change, no geometry changes.
- **Palm trees:** 2-tile palm: fronds at GID 2770 (beach row=12, col=17, ✅) placed at the current tile position; trunk at GID 2834 (beach row=14, col=17, ✅) placed one row below the fronds tile. Keep existing palm placement positions from Phase 2 — only GIDs change. Palms have collision (ge_collide:true) — player cannot walk through them.
- **Ground tiles:** Single GRASS_GID (193) fills the ground — no variety or random scattering for Phase 3.2. Ground polish (transition tiles, texture variety) deferred to Phase 9.
- **Water and beach:** Solid WATER_GID (186) fills ocean zone — no shore/transition tiles for Phase 3.2. Solid SAND_GID (2433) fills beach strip — no sand-to-water transition. Water is impassable — ge_collide:true on water tiles (confirm existing Phase 2 collision config). Animated water deferred to Phase 9.

### Claude's Discretion
- How to handle the palm trunk row placement in `generate-map.ts` — whether to create a second pass over palm positions or embed trunk placement inline with frond placement
- Exact test assertions to update in generate-map tests (GID value checks)
- Whether to add a `PALM_TRUNK_GID` constant or derive it inline

### Deferred Ideas (OUT OF SCOPE)
- Multi-tile building facades (roof edge / wall face / base rows) — future phase before Phase 9
- 2-3 building tile variants for visual differentiation — Phase 9 with Miami Art Deco assets
- Ground tile variety (grass variants at rows 7/8, transition tiles) — Phase 9
- Shore/sand-to-water transition tiles — Phase 9
- Animated water tiles — Phase 9 (already in Phase 2 deferred list)
</user_constraints>

---

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-----------------|
| ART-06 | Building shells render visibly on the overworld (not transparent) | BUILDING_GID updated from 6369 → 7689 (buildings row=41, col=8, ✅ TILE-CATALOG.md) |
| ART-07 | Palm trees render as visible Miami-appropriate palm sprites | PALM_GID updated from 12769 → 2770 (beach row=12, col=17, ✅ TILE-CATALOG.md), trunk tile GID=2834 placed one row below |
| ART-08 | Chalk Lab and VC Office render with visible scaffolding overlay | SCAFFOLD_GID updated from 19041 → 3598 (beach row=38, col=13, ✅ TILE-CATALOG.md) |

Note: ART-06/07/08 are not in REQUIREMENTS.md (the file uses a different ID namespace for art work — these IDs come from the phase description). The closest REQUIREMENTS.md entries are WORLD-07 (palm trees), WORLD-05 (collision), CONST-01 (Chalk Lab scaffolding), CONST-04 (VC Office). Phase 3.2 directly unblocks these.
</phase_requirements>

---

## Standard Stack

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| tsx | via npx | Run generate-map.ts directly | Already in use; script header says `npx tsx scripts/generate-map.ts` |
| vitest | current | Test assertions on overworld.json | Already used in all 4 test files |
| TypeScript | current | generate-map.ts type safety | Locked project stack |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| fs (Node stdlib) | built-in | Write overworld.json | Already used in generate-map.ts |
| path (Node stdlib) | built-in | Resolve file paths | Already used in generate-map.ts |

No new dependencies needed for Phase 3.2.

**Run commands:**
```bash
npx tsx scripts/generate-map.ts   # regenerate overworld.json
npm test                           # run vitest test suite
```

## Architecture Patterns

### The tileGid() Helper (Established Pattern)
All GID derivations must use the existing helper:
```typescript
function tileGid(firstgid: number, cols: number, row: number, col: number): number {
  return firstgid + (row * cols + col);
}
```

Never hardcode raw GID numbers — always compute from (firstgid, cols, row, col). This is the project's established pattern from Phase 3.1.

### GID Constant Block (Top of File)
All tile constants are defined at the top of `generate-map.ts` with comments explaining the tileset source. The update must follow the same format:

```typescript
// Building wall: Buildings row=41, col=8 → GID 7689 (confirmed ✅ TILE-CATALOG.md)
const BUILDING_GID = tileGid(BUILDING_FIRSTGID, BUILDING_COLS, 41, 8);

// Palm fronds: Beach row=12, col=17 → GID 2770 (confirmed ✅ TILE-CATALOG.md)
const PALM_GID = tileGid(BEACH_FIRSTGID, BEACH_COLS, 12, 17);
// Palm trunk: Beach row=14, col=17 → GID 2834 (confirmed ✅ TILE-CATALOG.md)
const PALM_TRUNK_GID = tileGid(BEACH_FIRSTGID, BEACH_COLS, 14, 17);

// Scaffold X-brace: Beach row=38, col=13 → GID 3598 (confirmed ✅ TILE-CATALOG.md)
const SCAFFOLD_GID = tileGid(BEACH_FIRSTGID, BEACH_COLS, 38, 13);
```

### Tileset Tile Properties — LocalId Must Match New Positions
When GIDs change, the tile property declarations in `buildXxxTileProperties()` functions must also update their `localId` values. LocalId = GID - firstgid.

| Constant | New GID | Tileset firstgid | New localId |
|----------|---------|-----------------|-------------|
| BUILDING_GID | 7689 | 6369 | 1320 |
| PALM_GID | 2770 | 2369 | 401 |
| SCAFFOLD_GID | 3598 | 2369 | 1229 |

Critical: PALM_GID and SCAFFOLD_GID are now both in the **beach** tileset (firstgid=2369). The current `buildGardenTileProperties()` marks garden localId=0 as ge_collide. After the fix, palm collision must be declared in `buildBeachTileProperties()` instead (or alongside any existing beach properties). Similarly, SCAFFOLD_GID was previously declared in `buildWorksiteTileProperties()` but now lives in the beach tileset.

### 2-Tile Palm Placement (New Pattern)
The existing palm loop places a single PALM_GID tile at each position. The fix adds a trunk tile one row below each frond position. Recommended approach: a dedicated helper function for palm placement that writes both tiles atomically:

```typescript
function placePalm(data: number[], x: number, y: number) {
  setTile(data, x, y,     PALM_GID);       // fronds
  setTile(data, x, y + 1, PALM_TRUNK_GID); // trunk (one row below)
}
```

Then replace every `setTile(data, x, y, PALM_GID)` call with `placePalm(data, x, y)`.

This is cleaner than a two-pass approach and keeps frond+trunk co-located. The trunk tile may overlap ground-layer tiles at y+1 — this is fine since the Above layer renders on top of Ground.

### TDD Pattern (Established from Phase 3.1)
The Phase 3.1 key decision: "update test assertions before changing generate-map.ts." This means:
1. Update test assertions to expect the NEW GID values
2. Run `npm test` — tests fail (RED)
3. Update generate-map.ts constants
4. Run `npx tsx scripts/generate-map.ts` to regenerate overworld.json
5. Run `npm test` — tests pass (GREEN)

### Collision Layer — No Changes Needed
The collision layer uses `BUILDING_GID` as the `BLOCK` constant:
```typescript
const BLOCK = BUILDING_GID;
```
When BUILDING_GID is updated to 7689, the collision layer will automatically use the correct value. The collision layer's purpose is just to have a non-zero GID that Grid Engine reads with `ge_collide:true` — the actual visual tile matters less than the property.

However: palm collision is currently set via `buildGardenTileProperties()` marking localId=0. After moving PALM_GID to the beach tileset, `buildBeachTileProperties()` must declare localId=401 as `ge_collide:true`. Otherwise palm trees lose collision.

### Anti-Patterns to Avoid
- **Hardcoding raw GID numbers:** Always use `tileGid(firstgid, cols, row, col)` — never write `const BUILDING_GID = 7689` directly.
- **Changing firstgid chain:** The tileset order (terrains, beach, buildings, garden, worksite) and their firstgid values are locked. Any change cascades to all GIDs.
- **Changing building geometry:** Footprints, positions, and zone boundaries are correct from Phase 2. Only the visual tile GID changes.
- **Placing trunk without bounds check:** `setTile()` already does bounds checking (`if x >= 0 && x < MAP_WIDTH && y >= 0 && y < MAP_HEIGHT`), but palm trunk at y+1 near the bottom edge (y=39) would be out of bounds. Check that no palm frond is placed at y=39.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| GID arithmetic | Manual offset math | `tileGid(firstgid, cols, row, col)` | Already exists; errors compound in manual arithmetic |
| Tile property registration | New data structure | Existing `buildXxxTileProperties()` pattern | Consistent with how Phaser reads tileset properties |
| Test running | Custom test harness | `npm test` (vitest) | Already configured and running |

**Key insight:** Every GID in generate-map.ts must trace back to a ✅ entry in TILE-CATALOG.md. This is the permanent workflow — no GID changes without visual confirmation.

## Common Pitfalls

### Pitfall 1: Moving Palm/Scaffold to Beach Tileset, Forgetting to Move Collision Properties
**What goes wrong:** PALM_GID and SCAFFOLD_GID now resolve from the beach tileset (firstgid=2369). The current code declares their `ge_collide:true` properties in `buildGardenTileProperties()` and `buildWorksiteTileProperties()` respectively. If those functions still declare the old localId=0 entries but nothing is placed at those GIDs, the collision property registration does nothing. Palms and scaffolding would be visible but walkthrough.
**Why it happens:** The tileset mismatch between where properties are declared vs. where tiles actually appear.
**How to avoid:** Move ge_collide:true declarations for PALM_GID and SCAFFOLD_GID into `buildBeachTileProperties()`, using localId = (GID - BEACH_FIRSTGID). Remove or keep the old function entries — keeping them is harmless but wastes JSON space.
**Warning signs:** Player can walk through visible palm trees. Visible building shells can be walked through.

### Pitfall 2: Palm Trunk Overwrites Collision Layer Walkable Zone
**What goes wrong:** Palm trunk tiles placed at y+1 land on the collision layer as BLOCK. If a trunk position overlaps the dock spawn zone (x=24-26, y=37-39), it could block the player spawn.
**Why it happens:** The trunk placement pass iterates over all palm positions without checking proximity to spawn zone.
**How to avoid:** The west palm positions and main-street palms are well away from the dock spawn (y=37-39). Check that the beach-strip palms at y=32 (the last in the loop `for y = 5 to 32 step 4`) place their trunk at y=33, safely away from y=37. Verify no palm frond is within 1 tile of y=37-39. The existing `setTile()` call for the trunk in the collision layer is controlled by the palm loop — the trunk should NOT be added to the collision layer separately (the frond position's collision is sufficient to block passage).
**Warning signs:** `npm test` fails with "dock spawn x=24 y=37 is blocked."

### Pitfall 3: buildAboveLayer Palm Trunk Overlapping Building Footprints
**What goes wrong:** The trunk tile at y+1 for some palm positions may land inside a building footprint in the Above layer. This paints a palm trunk tile over a building tile.
**Why it happens:** Palm positions are placed at the edge of grass/path zones, adjacent to building regions.
**How to avoid:** Review each palm position list and verify y+1 is not inside a building footprint. The existing westPalmPositions list was chosen to avoid building footprints for the frond — the trunk at y+1 needs the same check. In practice, most building footprints start several tiles away from palm positions.
**Warning signs:** Visual inspection shows a palm trunk tile appearing inside a building shell.

### Pitfall 4: Forgetting to Regenerate overworld.json After Changing generate-map.ts
**What goes wrong:** Tests import `overworld.json` directly. If generate-map.ts is updated but the script is not re-run, tests see the old JSON and may pass falsely (or fail if assertions were updated expecting new values).
**Why it happens:** The JSON file is the artifact; the .ts file is the generator. Both must be in sync.
**How to avoid:** Always run `npx tsx scripts/generate-map.ts` before `npm test`. Order: update assertions → RED test → update generate-map.ts → regenerate JSON → GREEN test.
**Warning signs:** Tests pass but the browser still shows transparent tiles.

### Pitfall 5: SCAFFOLD_GID Now Belongs to Beach, Not Worksite
**What goes wrong:** `buildWorksiteTileProperties()` currently marks worksite localId=0 as ge_collide. After the fix, SCAFFOLD_GID=3598 comes from the beach tileset (localId=1229). Worksite tileset tiles are no longer used for scaffolding. The worksite tile property declaration becomes a no-op (marks a worksite tile as collide, but no worksite tiles appear on the map). This is harmless for correctness but means scaffolding collision won't work unless beach localId=1229 is declared.
**How to avoid:** Add scaffold collision declaration to `buildBeachTileProperties()`.

## Code Examples

### Updated GID Constants Block
```typescript
// Source: TILE-CATALOG.md ✅ confirmed entries
// Building wall: Buildings row=41, col=8 → GID 7689
const BUILDING_GID = tileGid(BUILDING_FIRSTGID, BUILDING_COLS, 41, 8);
// Palm fronds (top): Beach row=12, col=17 → GID 2770
const PALM_GID = tileGid(BEACH_FIRSTGID, BEACH_COLS, 12, 17);
// Palm trunk (bottom): Beach row=14, col=17 → GID 2834
const PALM_TRUNK_GID = tileGid(BEACH_FIRSTGID, BEACH_COLS, 14, 17);
// Scaffold X-brace: Beach row=38, col=13 → GID 3598
const SCAFFOLD_GID = tileGid(BEACH_FIRSTGID, BEACH_COLS, 38, 13);
```

### Updated buildBeachTileProperties()
```typescript
function buildBeachTileProperties() {
  const palmLocalId = PALM_GID - BEACH_FIRSTGID;           // 401
  const scaffoldLocalId = SCAFFOLD_GID - BEACH_FIRSTGID;   // 1229
  return [
    { id: palmLocalId,     properties: [{ name: "ge_collide", type: "bool", value: true }] },
    { id: scaffoldLocalId, properties: [{ name: "ge_collide", type: "bool", value: true }] },
  ];
}
```

### Updated buildBuildingTileProperties()
```typescript
function buildBuildingTileProperties() {
  const localId = BUILDING_GID - BUILDING_FIRSTGID; // 1320
  return [{ id: localId, properties: [{ name: "ge_collide", type: "bool", value: true }] }];
}
```

### placePalm Helper
```typescript
function placePalm(data: number[], x: number, y: number) {
  setTile(data, x, y,     PALM_GID);       // fronds tile
  setTile(data, x, y + 1, PALM_TRUNK_GID); // trunk tile (one row below)
}
```

### New Test Assertions to Add (after GID updates)
The existing `overworld-map.test.ts` does NOT test specific GID values for buildings or palms — it only checks:
- Dock spawn is walkable
- Ocean strip has non-zero tiles
- Ground corridor is non-zero
- Tileset names and count
- Tile property existence (tilesets[0].tiles.length > 0)

New assertions needed for Phase 3.2 verification:
```typescript
it("Above layer at Thoven HQ footprint has BUILDING_GID (7689)", () => {
  const aboveData: number[] = mapData.layers[1].data as number[];
  // Thoven HQ: x=10-17, y=14-22
  const idx = 10 + 14 * WIDTH;
  expect(aboveData[idx]).toBe(7689);
});

it("Above layer has a palm tile (GID 2770) at known palm position", () => {
  const aboveData: number[] = mapData.layers[1].data as number[];
  // Main street west palm at x=21, y=5
  const idx = 21 + 5 * WIDTH;
  expect(aboveData[idx]).toBe(2770);
});

it("Above layer has palm trunk (GID 2834) one row below palm frond", () => {
  const aboveData: number[] = mapData.layers[1].data as number[];
  // Trunk at x=21, y=6 (one below frond at y=5)
  const idx = 21 + 6 * WIDTH;
  expect(aboveData[idx]).toBe(2834);
});

it("Above layer at Chalk Lab top rows has SCAFFOLD_GID (3598)", () => {
  const aboveData: number[] = mapData.layers[1].data as number[];
  // Chalk Lab scaffold: x=18-22, y=8-9
  const idx = 18 + 8 * WIDTH;
  expect(aboveData[idx]).toBe(3598);
});
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Single tileset PNG | 5 LimeZu PNG tilesets with GID chain | Phase 3.1 | All GIDs now reference specific tileset + row + col |
| Placeholder programmatic tiles | Real LimeZu pixel art tiles | Phase 3.1 | Row 0 transparent border issue discovered |
| Tiled GUI authoring | Programmatic generate-map.ts | Phase 2 | Reproducible GID updates without Tiled |
| BUILDING/PALM/SCAFFOLD = row 0 | ✅ Correct rows from TILE-CATALOG.md | Phase 3.2 (this work) | Visible art in browser |

**Deprecated/outdated:**
- Garden tileset as palm source: TILE-CATALOG.md confirmed garden = English hedge topiary, not Miami palms. Palm source is beach tileset.
- Worksite tileset as scaffold source: scaffold lives in beach tileset (beach rows 38-39).

## Open Questions

1. **Trunk tile overlap with existing above-layer content**
   - What we know: Palm trunk at y+1 writes over whatever the Above layer already has at that position (buildings, other tiles, or 0)
   - What's unclear: Whether any current palm frond positions have y+1 inside a building footprint
   - Recommendation: During plan execution, verify each palm position list against building footprints before committing. The `setTile` function will overwrite silently.

2. **buildGardenTileProperties() and buildWorksiteTileProperties() after migration**
   - What we know: After the fix, no PALM tiles come from garden and no SCAFFOLD tiles come from worksite
   - What's unclear: Whether to keep ge_collide markers in those functions (they're no-ops) or remove them
   - Recommendation: Remove them to keep the JSON clean and avoid confusing future readers. Mark the functions as returning `[]` with a comment explaining why.

## Validation Architecture

### Test Framework
| Property | Value |
|----------|-------|
| Framework | vitest (current — detected in package.json) |
| Config file | vite.config.ts (vitest configured inline) |
| Quick run command | `npm test` |
| Full suite command | `npm test` |

### Phase Requirements → Test Map
| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| ART-06 | Building shells at Thoven HQ footprint have GID=7689 | unit | `npm test -- --reporter=verbose` | ❌ Wave 0 — add to overworld-map.test.ts |
| ART-07 | Palm frond GID=2770 at known position; trunk GID=2834 one row below | unit | `npm test` | ❌ Wave 0 — add to overworld-map.test.ts |
| ART-08 | Scaffold GID=3598 at Chalk Lab top rows (y=8-9) | unit | `npm test` | ❌ Wave 0 — add to overworld-map.test.ts |

### Sampling Rate
- **Per task commit:** `npm test`
- **Per wave merge:** `npm test`
- **Phase gate:** Full suite green before `/gsd:verify-work`

### Wave 0 Gaps
- [ ] Add ART-06/07/08 test assertions to `tests/overworld-map.test.ts` — specific GID value checks for buildings, palms, and scaffolding
- [ ] No new files needed — all assertions go into the existing test file

## Sources

### Primary (HIGH confidence)
- Direct read of `/Users/andresmartinez/andres-world/scripts/generate-map.ts` — current GID constants, tileGid() helper, buildAboveLayer(), buildCollisionLayer(), buildXxxTileProperties() functions
- Direct read of `/Users/andresmartinez/andres-world/.planning/TILE-CATALOG.md` — all confirmed (✅) GID values with tileset source, row, col, and RGB
- Direct read of `/Users/andresmartinez/andres-world/.planning/phases/03.2-map-visual-design/03.2-CONTEXT.md` — locked decisions, exact GID values
- Direct read of `/Users/andresmartinez/andres-world/tests/overworld-map.test.ts` — existing test coverage, what assertions already exist

### Secondary (MEDIUM confidence)
- Phase 3.1 SUMMARY.md — confirmed multi-tileset pattern, established TDD RED→GREEN workflow
- STATE.md accumulated decisions — tileset firstgid chain locked, TDD pattern, collision approach

### Tertiary (LOW confidence)
- None — all findings verified directly from codebase

## Metadata

**Confidence breakdown:**
- GID values: HIGH — all three confirmed ✅ in TILE-CATALOG.md by Andres's visual review
- Architecture (tileGid helper, property functions): HIGH — read directly from generate-map.ts
- Palm trunk placement logic: HIGH — decision locked in CONTEXT.md (frond at position, trunk at y+1)
- Test assertions: HIGH — existing test file read directly; new assertions follow same pattern
- LocalId arithmetic: HIGH — computed directly (GID - firstgid), no ambiguity

**Research date:** 2026-03-09
**Valid until:** Stable — no external dependencies; all findings from project source files
