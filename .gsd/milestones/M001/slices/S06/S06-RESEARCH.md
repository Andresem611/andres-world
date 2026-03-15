# Phase 3.3: Map Layout Design - Research

**Researched:** 2026-03-10
**Domain:** Programmatic tilemap geometry — generate-map.ts surgery
**Confidence:** HIGH

---

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions

**Building footprints — overlaps to fix**
- Andres's House: Shrink east boundary from x=12 to x=9. New footprint: x=6-9, y=16-22. Clears the overlap with Thoven HQ at x=10-12.
- Chalk Lab: Shrink east boundary from x=22 to x=21. New footprint: x=18-21, y=8-13. Clears the edge collision with the main street path at x=22.

**Building footprints — resizing for proportion**
- Thoven HQ: Make bigger — currently 8×9 tiles (x=10-17, y=14-22). Target ~10-12 tiles wide. Exact bounds: Claude's discretion on how far east it can extend before crowding the main street or Chalk Lab. Must remain the largest building.
- Ventanita: Shrink to 2-3 tiles wide (currently 5 wide: x=23-27). Walk-up coffee window, not a full building. Stays on main street west side, south section.
- Record Shop: Shrink to ~3-4 tiles wide (currently 5 wide: x=29-33). Small music store.
- Bulletin Board: Shrink to 1-2 tiles wide (currently 3 wide: x=23-25). A noticeboard, not a building.
- All other building footprints (Engineering Lab, GitHub Library, Starbucks, VC Office, Music Room, Idea Graveyard, Lookout Hill): keep current sizes unless a conflict arises.

**Missing zones — all in scope for 3.3**
- Tall grass zones: 4 locations (Idea Graveyard, Secret Beach, Music Room, Hidden NPC). Collision-blocked with narrow 1-2 tile walkable gaps only.
- Secret Beach: South end east side, accessed through palm cluster gap. SAND_GID ground. Surrounded by palms except for narrow gap.
- East boardwalk: Narrow vertical path x=37 or x=38, north-south, connecting Engineering Lab area to Secret Beach. PATH_GID or DOCK_GID (Claude's discretion, visual confirm if new GID).
- Welcome Sign + dock entry: Walkable zone and sign tile footprint at approximately x=24-26, y=36. Interaction text handled by Phase 3's system.
- Hidden NPC zone (north tip): Behind Lookout Hill, narrow gap in top grass row. Exact coordinates: Claude's discretion.

**Path network**
- Main street spine: x=22-28, y=0-39 — no change.
- West cross-street: Horizontal path at approximately y=15-16 from main street (x=22) west to Thoven HQ / Andres's House area (~x=9).
- East cross-street: Horizontal path at same y from main street (x=28) east through sand strip to boardwalk (~x=37).
- East boardwalk: Vertical path ~x=37, from north edge down to Secret Beach gap. PATH_GID or DOCK_GID tile.
- Idea Graveyard: No formal path — accessed organically via tall grass gap.

**Hidden area access — tall grass gates**
| Hidden Area | Location | Gap placement |
|-------------|----------|---------------|
| Idea Graveyard | Southwest, x=2-10, y=24-32 | Gap on east boundary, ~y=27-28 |
| Secret Beach | South beach, east side | Gap in palm cluster at north edge of Secret Beach |
| Music Room | Behind Andres's House, x=3-8, y=10-14 | Gap on south boundary, ~x=5-6 |
| Hidden NPC | North tip, behind Lookout Hill | Gap through top grass row |

**Tall grass GID**
- Claude picks best candidate from LimeZu Terrains tileset (darker/denser grass variant, likely rows 7-8)
- Visually confirmed via tileset-preview.html hover before hardcoding — mandatory ✅ workflow
- Single TALL_GRASS_GID constant added to generate-map.ts alongside existing GIDs

**TDD Pattern**
- Update overworld-map.test.ts assertions to reflect new building boundaries and new GIDs BEFORE changing generate-map.ts

**Established Patterns**
- TILE-CATALOG.md is the source of truth — any new GID requires a ✅ entry before touching generate-map.ts
- Three-pass architecture: Ground + Above + Collision layers
- `setTile(data, x, y, 0)` carves walkable gaps in otherwise-blocked regions
- generate-map.ts is OVERWORLD ONLY (ADR locked)

### Claude's Discretion
- Exact Thoven HQ expanded footprint (east boundary — no crowding of main street)
- Exact tile coordinates for west and east cross-streets (y position)
- Exact boardwalk tile GID (PATH_GID reuse or new dock-style tile)
- Hidden NPC zone exact coordinates (north tip, behind Lookout Hill)
- Tall grass candidate GID and tileset row (subject to visual confirm by Andres)
- Whether gaps in tall grass are 1 or 2 tiles wide

### Deferred Ideas (OUT OF SCOPE)
None — discussion stayed within phase scope.
</user_constraints>

---

## Summary

Phase 3.3 is a geometry-only surgery pass on `generate-map.ts`. No new tilesets, no Phaser scene changes, no interaction wiring. The output is a regenerated `overworld.json` where every building footprint is correct, all missing map zones exist (tall grass, boardwalk, secret beach, dock welcome zone, hidden NPC zone), and the full path network is wired.

The critical constraint is that building coordinates locked here become the permanent contract for Phase 4+ interior entrance/exit tile detection. Andres's House at x=6-9, Thoven HQ expanded, Chalk Lab at x=18-21 — these exact tile boundaries will be referenced in `InteriorBaseScene` transition logic. Getting them wrong now means auditing interior scenes later.

The work pattern is already established and proven: write TDD assertions first (RED), update `generate-map.ts` `fillRect()` calls (GREEN), run `npx tsx scripts/generate-map.ts`, run `vitest`, verify via the browser. One new GID (TALL_GRASS_GID) requires the `tileset-preview.html` hover-confirm workflow before hardcoding.

**Primary recommendation:** Work in tight TDD cycles per zone. Update test assertions first, then the corresponding `fillRect()` block. The three-function architecture (buildGroundLayer / buildAboveLayer / buildCollisionLayer) means each change is made in up to three places — missing a collision layer update is the most common bug.

---

## Standard Stack

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| TypeScript + tsx | Project-pinned | generate-map.ts execution | Already in use, no change |
| vitest | Project-pinned | Test runner for overworld-map.test.ts | Already in use, all tests green |
| Node fs | stdlib | Write overworld.json | No new dependency |

No new library dependencies. This is a pure geometry data pass.

**Run commands (unchanged):**
```bash
npx tsx scripts/generate-map.ts    # regenerate overworld.json
npx vitest run                      # validate assertions
```

---

## Architecture Patterns

### The Three-Pass Pattern (existing, must follow)

Every building or zone change requires updates in three places:

```
buildGroundLayer()    — base terrain tile beneath the zone (GRASS_GID, SAND_GID, PATH_GID, etc.)
buildAboveLayer()     — visual tile on top (BUILDING_GID, TALL_GRASS_GID, etc.)
buildCollisionLayer() — blocking/walkable mask (BLOCK constant or 0 for walkable gap)
```

Missing any one of three produces silent bugs: a building with no collision, a walkable zone that shows grass but has no ground tile, or an invisible building (Above layer) sitting on wrong terrain.

### Tall Grass Pattern (new in 3.3)

Tall grass is a blocked field with carved gaps. The three layers work like this:

```typescript
// Ground layer — grass terrain under tall grass zone
fillRect(data, x1, y1, x2, y2, GRASS_GID);

// Above layer — tall grass tile (visually denser/darker)
fillRect(data, x1, y1, x2, y2, TALL_GRASS_GID);

// Collision layer — block entire zone
fillRect(data, x1, y1, x2, y2, BLOCK);

// Then carve the gap (1-2 tiles wide):
setTile(data, gapX, gapY, 0);      // walkable
setTile(data, gapX, gapY+1, 0);   // if 2-tile gap
```

This pattern is already proven for the dock spawn zone (`setTile(data, x, y, 0)` after `fillRect` block).

### Cross-Street Pattern (new in 3.3)

Cross-streets are horizontal PATH_GID strips in the ground layer only — no Above layer tile, no collision. They connect the main street spine to the western district and eastern boardwalk:

```typescript
// Ground layer only — path tiles, no Above, no Collision
fillRect(data, 9, crossY, 22, crossY+1, PATH_GID);  // west cross-street
fillRect(data, 28, crossY, 37, crossY+1, PATH_GID); // east cross-street
```

### Boardwalk Pattern

The east boardwalk is a vertical PATH_GID (or DOCK_GID) strip in the ground layer at x=37, running north-south. Palm clusters at the beach strip (x=37-38) must leave this column clear at boardwalk positions. Palms already placed at x=37 in the loop `for (let y = 5; y <= 32; y += 4)` — this loop will need adjustment to avoid blocking the boardwalk path.

### NPC Coordinate Dependency

Three NPCs currently placed adjacent to buildings that are being resized:

| NPC | Current position | Building moving | Impact |
|-----|-----------------|-----------------|--------|
| michael-seibel | x=14, y=24 | Thoven HQ expands east | Michael at x=14 may end up inside Thoven HQ if it expands to x=14+ |
| keri | x=12, y=24 | Andres's House shrinks to x=9 | Currently inside Andres's House footprint — needs update |
| brian-chesky | x=11, y=24 | Andres's House shrinks to x=9 | x=11 is now outside both buildings — fine, but verify |
| dad | x=9, y=18 | Andres's House shrinks to x=9 | x=9 is the new east boundary — at the wall edge |
| dog-1 | x=7, y=20 | Andres's House shrinks to x=9 | Inside new footprint — fine |

NPC coordinates live in `src/game/config/npcs.ts`. Any NPC whose `startPosition` is inside a modified building footprint (or where the building footprint now covers them) must be updated in npcs.ts alongside the generate-map.ts changes.

### Anti-Patterns to Avoid

- **Changing generate-map.ts before updating tests.** TDD protocol is mandatory: test assertions first (they fail), then code changes (they pass). Phase 3.1 and 3.2 both followed this successfully.
- **Using a GID before it's in TILE-CATALOG.md with ✅ status.** TALL_GRASS_GID must go through the tileset-preview.html hover workflow before the constant is defined.
- **Placing tall grass Over NPC positions.** Tall grass is collision-blocked. An NPC whose `startPosition` is inside a tall grass zone is unreachable. Ben Horowitz is at x=6, y=34 — Idea Graveyard is at x=2-10, y=24-32, so he's south of the graveyard zone. Safe.
- **Forgetting the collision layer for new terrain.** Ocean (x=42-49) is blocked in the collision layer. The east boardwalk must not re-block ocean tiles that are already blocked.
- **Thoven HQ crowding main street.** The main street spine is x=22-28. Thoven HQ must stop before x=21 to leave a walkable tile at x=21-22 (the west palm + main street edge). A reasonable expanded Thoven HQ is x=10-19, y=14-22 (10 tiles wide).

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Tall grass visual | Custom tileset | LimeZu Terrains rows 7-8 (denser grass variants already present) | GIDs 225 and 257 both confirmed as green grass variants; row 7 (GID=225) or row 8 (GID=257) are candidates |
| Boardwalk tile | New asset | DOCK_GID=2672 reuse, or PATH_GID=294 | Both already confirmed ✅ in TILE-CATALOG.md |
| Collision gap carving | Complex logic | `setTile(data, x, y, 0)` after `fillRect` | Already proven pattern in dock spawn zone |
| Map validation | Manual inspection | Existing `main()` validation block in generate-map.ts | Add new zone checks to the existing validation output |

---

## Common Pitfalls

### Pitfall 1: Palm loop blocks boardwalk
**What goes wrong:** The current loop `for (let y = 5; y <= 32; y += 4) { placePalm(data, 37, y); placePalm(data, 38, y); }` places palms at x=37. If the east boardwalk runs at x=37, palms block every 4th tile of the boardwalk in the collision layer.
**Why it happens:** The palm loop was written before the boardwalk was planned.
**How to avoid:** Move boardwalk to x=36 (west of sand strip), or shift the palm loop to x=38-39 only for the boardwalk range, or use x=37 for boardwalk and skip palm placement in the boardwalk y-range.
**Warning signs:** Player can't walk north-south on boardwalk — hits palm collision every 4 tiles.

### Pitfall 2: Cross-street y-position conflicts with building footprints
**What goes wrong:** A cross-street at y=15-16 would overlap with Lookout Hill (x=20-30, y=0-6) — safe. But it also must not cut through Thoven HQ (x=10-17, y=14-22) or Andres's House (x=6-9, y=16-22).
**Why it happens:** The cross-street is a horizontal path strip — it must pass between buildings, not through them.
**How to avoid:** Route the west cross-street at y=23 (south of all northwest buildings, north of Idea Graveyard at y=24). Or at y=13 (between Lookout Hill at y=0-6 and Thoven HQ at y=14-22). The path is only drawn in the ground layer — buildings on the Above layer still render on top. The collision layer for buildings already blocks those tiles, so the path under a building is visually covered but the collision is the building's. Verify player can walk through the gap.
**Warning signs:** Player is blocked in mid-path by building collision.

### Pitfall 3: NPC inside modified building footprint
**What goes wrong:** After Andres's House shrinks from x=6-12 to x=6-9, NPCs placed at x=10-12 (formerly inside Andres's House, now open space) may need position adjustments. After Thoven HQ expands east, NPCs immediately south of the new footprint may need to move.
**Why it happens:** npcs.ts coordinates were set relative to old building boundaries.
**How to avoid:** Cross-check every NPC `startPosition` against new footprint bounds before finalizing.
**Warning signs:** NPC is stuck inside a building wall and unreachable by the player.

### Pitfall 4: Tall grass GID is transparent
**What goes wrong:** LimeZu Terrains row 0 is transparent. If TALL_GRASS_GID is assigned to row 0 without visual confirmation, the tall grass zone is invisible — but still collision-blocked, creating an invisible wall. This is the exact bug that happened with BUILDING_GID, PALM_GID, and SCAFFOLD_GID in Phase 3.1.
**Why it happens:** Row/col selection without tileset-preview.html verification.
**How to avoid:** Mandatory ✅ workflow — Claude proposes row/col candidate (rows 7-8 of Terrains for darker grass), Andres hovers tileset-preview.html to confirm, adds ✅ to TILE-CATALOG.md before TALL_GRASS_GID constant is written.
**Warning signs:** Tall grass zone is walkable (no visual feedback) but blocked (player can't enter at all).

### Pitfall 5: Collision layer double-blocks ocean
**What goes wrong:** Adding east boardwalk collision (or building it over the ocean columns) creates redundant blocked tiles or accidentally unblocks ocean.
**Why it happens:** Ocean (x=42-49) is already blocked in buildCollisionLayer(). Boardwalk at x=37 is fine. Any boardwalk extending into x=38-41 (sand strip) may interact with the beach palms collision.
**How to avoid:** Boardwalk at x=37 only. The sand strip (x=38-41) already has SAND_GID ground and occasional palm collision. Don't extend boardwalk PATH_GID into the ocean.

### Pitfall 6: Secret Beach has no ground tile
**What goes wrong:** Secret Beach is in the southeast area, south of the main beach. If the SAND_GID ground strip only runs to y=39, and Secret Beach is placed further south than the current map, it has no ground tile.
**Why it happens:** The map is 50×40 (y=0-39). The beach strip currently runs `fillRect(data, 38, 5, 41, 39, SAND_GID)`. Secret Beach is within y=39.
**How to avoid:** Secret Beach is a small zone (hammock area) carved into the south end of the existing sand strip with a palm cluster border. No new tiles needed for ground — SAND_GID already covers x=38-41, y=5-39. Place palms as the enclosure, carve a gap.

---

## Code Examples

Verified patterns from existing codebase:

### Existing fillRect + collision block pattern (from buildCollisionLayer)
```typescript
// Source: scripts/generate-map.ts — current buildCollisionLayer()
fillRect(data, 10, 14, 17, 22, BLOCK); // Thoven HQ (current — will change)
fillRect(data, 6, 16, 12, 22, BLOCK);  // Andres's House (current — will change)
```

### Gap carving pattern (from buildCollisionLayer)
```typescript
// Source: scripts/generate-map.ts — dock spawn zone
for (let y = 37; y <= 39; y++) {
  for (let x = 24; x <= 26; x++) {
    setTile(data, x, y, 0); // walkable
  }
}
```

Tall grass gap will use the same setTile(data, x, y, 0) pattern, more surgical.

### tileGid helper (for TALL_GRASS_GID derivation)
```typescript
// Source: scripts/generate-map.ts — tileGid helper
function tileGid(firstgid: number, cols: number, row: number, col: number): number {
  return firstgid + (row * cols + col);
}

// Example: Terrains row=7, col=0 → darker grass variant (GID 225)
const TALL_GRASS_GID = tileGid(TERRAIN_FIRSTGID, TERRAIN_COLS, 7, 0); // candidate — needs ✅
```

### Three-layer update for a building resize (pattern to follow)
```typescript
// In buildAboveLayer() — visual tile
fillRect(data, 6, 16, 9, 22, BUILDING_GID);  // Andres's House new footprint

// In buildCollisionLayer() — collision
fillRect(data, 6, 16, 9, 22, BLOCK);          // Andres's House new footprint

// buildGroundLayer() stays as GRASS_GID base — no change needed for house footprint
```

### NPC coordinate update (in npcs.ts — not generate-map.ts)
```typescript
// Source: src/game/config/npcs.ts — Dad NPC (currently at house boundary)
{
  id: "dad",
  startPosition: { x: 9, y: 18 }, // x=9 is new east wall of Andres's House — may need adjustment
}
```

---

## Coordinate Reference Map

Current building coordinates (from generate-map.ts) with Phase 3.3 changes:

| Building | Current footprint | Phase 3.3 footprint | Change |
|----------|-------------------|---------------------|--------|
| Andres's House | x=6-12, y=16-22 | x=6-9, y=16-22 | Shrink east boundary |
| Chalk Lab | x=18-22, y=8-13 | x=18-21, y=8-13 | Shrink east boundary |
| Thoven HQ | x=10-17, y=14-22 | x=10-19 (est.), y=14-22 | Expand east (Claude's discretion) |
| Ventanita | x=23-27, y=26-29 | x=23-25, y=26-29 (est.) | Shrink to 3 wide |
| Record Shop | x=29-33, y=10-14 | x=29-32, y=10-14 (est.) | Shrink to 4 wide |
| Bulletin Board | x=23-25, y=30-31 | x=23-24, y=30-31 (est.) | Shrink to 2 wide |
| Starbucks Cafe | x=29-34, y=24-28 | unchanged | — |
| Engineering Lab | x=38-44, y=2-8 | unchanged | — |
| GitHub Library | x=38-44, y=12-18 | unchanged | — |
| VC Office | x=28-33, y=16-20 | unchanged | — |
| Music Room | x=3-8, y=10-14 | unchanged | — |
| Idea Graveyard | x=2-10, y=24-32 | unchanged | — |
| Lookout Hill | x=20-30, y=0-6 | unchanged | — |

**Thoven HQ expansion reasoning:** Main street west edge is x=22. Chalk Lab is at x=18-21. Thoven HQ should stop at x=21 (same as Chalk Lab east boundary) or at x=19 to leave 2-tile buffer. Recommended: x=10-19, y=14-22 (10 tiles wide — satisfies "largest building" at 10×9=90 tiles vs Starbucks 6×5=30 tiles).

---

## GID Status for Phase 3.3

| Constant | GID | Status | Source |
|----------|-----|--------|--------|
| GRASS_GID | 193 | ✅ CONFIRMED | TILE-CATALOG.md |
| PATH_GID | 294 | ✅ CONFIRMED | TILE-CATALOG.md |
| WATER_GID | 186 | ✅ CONFIRMED | TILE-CATALOG.md |
| SAND_GID | 2433 | ✅ CONFIRMED | TILE-CATALOG.md |
| DOCK_GID | 2672 | ✅ CONFIRMED | TILE-CATALOG.md |
| PLAZA_GID | 34 | ✅ CONFIRMED | TILE-CATALOG.md |
| BUILDING_GID | 7689 | ✅ CONFIRMED | TILE-CATALOG.md |
| PALM_GID | 2770 | ✅ CONFIRMED | TILE-CATALOG.md |
| PALM_TRUNK_GID | 2834 | ✅ CONFIRMED | TILE-CATALOG.md |
| SCAFFOLD_GID | 3598 | ✅ CONFIRMED | TILE-CATALOG.md |
| TALL_GRASS_GID | TBD | ❌ NEEDS HUMAN | Terrains row 7 col 0 → GID 225 (candidate) |

**Boardwalk GID:** No new GID needed. Use PATH_GID=294 (earthy path) for the vertical boardwalk path — it reads as a walkable strip visually different from GRASS_GID. DOCK_GID=2672 is also valid if Claude wants more pier-like feel, but it requires no new catalog entry either way.

---

## Validation Architecture

### Test Framework
| Property | Value |
|----------|-------|
| Framework | vitest (project-pinned) |
| Config file | vite.config.ts (includes vitest config) |
| Quick run command | `npx vitest run tests/overworld-map.test.ts` |
| Full suite command | `npx vitest run` |

### Phase Requirements → Test Map

Phase 3.3 does not have locked requirement IDs from REQUIREMENTS.md (the geometry work underpins future WORLD-06 and HIDE-01 through HIDE-05, but those are verified in later phases). The relevant test file is `tests/overworld-map.test.ts`.

| Behavior | Test Type | Automated Command | File Exists? |
|----------|-----------|-------------------|-------------|
| Andres's House footprint x=6-9 (not x=6-12) | unit | `npx vitest run tests/overworld-map.test.ts` | ✅ (needs new assertion) |
| Chalk Lab footprint x=18-21 (not x=18-22) | unit | `npx vitest run tests/overworld-map.test.ts` | ✅ (needs new assertion) |
| Thoven HQ expanded footprint at x=10-19 | unit | `npx vitest run tests/overworld-map.test.ts` | ✅ (needs updated assertion — currently checks x=10) |
| Tall grass present at Idea Graveyard border | unit | `npx vitest run tests/overworld-map.test.ts` | ✅ (needs new assertion) |
| Tall grass gap is walkable (collision=0) | unit | `npx vitest run tests/overworld-map.test.ts` | ✅ (needs new assertion) |
| West cross-street has PATH_GID at x=15, crossY | unit | `npx vitest run tests/overworld-map.test.ts` | ✅ (needs new assertion) |
| East boardwalk has path tile at x=37, y=10 | unit | `npx vitest run tests/overworld-map.test.ts` | ✅ (needs new assertion) |
| Dock welcome zone walkable at x=24-26, y=36 | unit | `npx vitest run tests/overworld-map.test.ts` | ✅ (needs new assertion) |

### Sampling Rate
- **Per task commit:** `npx vitest run tests/overworld-map.test.ts`
- **Per wave merge:** `npx vitest run`
- **Phase gate:** Full suite green before `/gsd:verify-work`

### Wave 0 Gaps
All test assertions for Phase 3.3 changes are NEW assertions that must be added to `tests/overworld-map.test.ts` before the corresponding `generate-map.ts` changes are made. The file exists and the framework is installed — no infrastructure gaps.

The following assertions are missing and must be added in Wave 0 of Phase 3.3:
- [ ] `tests/overworld-map.test.ts` — Andres's House new east boundary (x=9, not x=12)
- [ ] `tests/overworld-map.test.ts` — Chalk Lab new east boundary (x=21, not x=22)
- [ ] `tests/overworld-map.test.ts` — Thoven HQ expanded footprint center tile
- [ ] `tests/overworld-map.test.ts` — Tall grass tile present at Idea Graveyard east wall
- [ ] `tests/overworld-map.test.ts` — Tall grass gap walkable (collision=0 at gap tile)
- [ ] `tests/overworld-map.test.ts` — West cross-street PATH_GID at a representative tile
- [ ] `tests/overworld-map.test.ts` — East boardwalk path tile at representative coordinate

---

## Open Questions

1. **TALL_GRASS_GID confirmation**
   - What we know: Terrains tileset rows 7-8 (GIDs 225-288) are confirmed green grass variants (same RGB as row 6). There may not be a visually distinct "tall grass" tile in Terrains.
   - What's unclear: Whether LimeZu Terrains has a darker/denser tall grass, or whether a different tileset (Garden?) has a suitable candidate.
   - Recommendation: Propose GID 225 (Terrains row=7, col=0) as the candidate. It's confirmed non-transparent. If it looks too similar to regular grass in the visual confirm, escalate to Garden tileset row=1 (GID 12801 — lime green foliage) which is visually distinct but a different aesthetic. The mandatory ✅ workflow gates this before it touches generate-map.ts.

2. **West cross-street y-position**
   - What we know: y=15-16 is suggested in CONTEXT.md. At y=15, Thoven HQ is at y=14-22 and Andres's House is at y=16-22. A path at y=15 passes between Lookout Hill (y=0-6) and Thoven HQ (y=14-22) — one tile of clearance south of Lookout Hill. At y=23 it is south of all northwest buildings.
   - What's unclear: Whether y=15 is too tight (1-tile gap between Lookout Hill y=6 and cross-street y=15 is actually 8 tiles — fine) or whether y=23 better matches the "turn left" design intent.
   - Recommendation: y=23 for both cross-streets. It's south of Thoven HQ and Andres's House (both end at y=22), so the cross-street naturally connects to a clear westward path to the open space between buildings, and links to the central plaza area.

3. **NPC positions after footprint changes**
   - What we know: Keri (x=12, y=24) and Brian Chesky (x=11, y=24) are south of Andres's House. After the house shrinks to x=6-9, x=11-12 becomes open space — NPCs are now correctly outside both buildings.
   - What's unclear: Dad at x=9, y=18 — x=9 is the new east wall of Andres's House. This puts Dad inside the building footprint (x=6-9 includes x=9). Dad should be at x=10, y=18 (just outside the new east wall) or remain inside if intended for interior Phase 4.
   - Recommendation: Flag Dad's position as needing review in the npcs.ts update task. Dad is an interior NPC (Andres's Room, Phase 4) — placing him at x=9 on the overworld is borderline. Move to x=10, y=18 to place him just outside the east wall.

---

## Sources

### Primary (HIGH confidence)
- Direct code read: `/Users/andresmartinez/andres-world/scripts/generate-map.ts` — all GID constants, fillRect calls, three-layer pattern
- Direct code read: `/Users/andresmartinez/andres-world/tests/overworld-map.test.ts` — existing test assertions
- Direct code read: `/Users/andresmartinez/andres-world/src/game/config/npcs.ts` — NPC positions relative to buildings
- Direct read: `.planning/TILE-CATALOG.md` — confirmed GID status for all 10 existing constants
- Direct read: `.planning/ARCHITECTURE-DECISIONS.md` — ADR locked decisions
- Direct read: `.planning/phases/03.3-map-layout-design/03.3-CONTEXT.md` — phase decisions

### Secondary (MEDIUM confidence)
- `TILE-CATALOG.md` tall grass note: Terrains rows 7-8 are grass variants (GIDs 225, 257) — confirmed non-transparent, unconfirmed visual distinction from row 6

### Tertiary (LOW confidence)
- Tall grass candidate GID 225 (Terrains row=7, col=0) — requires tileset-preview.html visual confirm before use

---

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — no new dependencies, all tools in place
- Architecture: HIGH — three-pass pattern proven across Phase 3.1 and 3.2
- Building coordinates: HIGH for locked decisions, MEDIUM for Claude's-discretion items
- GID for tall grass: LOW until ✅ visual confirm
- NPC impact analysis: HIGH — all positions read directly from npcs.ts

**Research date:** 2026-03-10
**Valid until:** Stable — 60 days (no external dependencies, pure geometry work)
