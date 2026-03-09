# Confirmed Tile Catalog
Last updated: 2026-03-09
Source: Visual pixel inspection via tileset-preview.html (Playwright canvas reads)

## How to read this

GID = firstgid + (row × cols) + col

Hover a tile at http://localhost:517X/tileset-preview.html to confirm row/col/GID.

Status legend:
- ✅ CONFIRMED — center pixel sampled, RGB verified matches expected color
- ❌ NEEDS HUMAN — best guess based on pixel data, must be visually confirmed by Andres
- 🚨 BUG — current generate-map.ts uses this GID but it is TRANSPARENT (alpha=0)

---

## CRITICAL BUG: Three tile GIDs in generate-map.ts are transparent

The current map renders invisible buildings, palms, and scaffolding because
`generate-map.ts` uses row=0, col=0 for BUILDING_GID, PALM_GID, and SCAFFOLD_GID —
but every LimeZu tileset has transparent border rows at row=0.

Collision still works (Grid Engine reads ge_collide tile properties separately
from visual rendering). This is the #1 fix for Phase 3.2.

| GID in use | Value | Actual pixel | Status |
|------------|-------|-------------|--------|
| BUILDING_GID (buildings row=0, col=0) | 6369 | rgba(0,0,0,0) | 🚨 TRANSPARENT |
| PALM_GID (garden row=0, col=0)        | 12769 | rgba(0,0,0,0) | 🚨 TRANSPARENT |
| SCAFFOLD_GID (worksite row=0, col=0)  | 19041 | rgba(0,0,0,0) | 🚨 TRANSPARENT |

---

## 1_Terrains_and_Fences_16x16.png (firstgid=1, 32 cols, 74 rows)

Transparent zone: rows 0-5 at col=0 are all transparent/sparse. Content starts row=5 (water zone), row=6 (grass).

| Purpose | Row | Col | GID | RGB | Status |
|---------|-----|-----|-----|-----|--------|
| Flat grass | 6 | 0 | 193 | (71,151,87) green | ✅ CONFIRMED |
| Grass variant | 7 | 0 | 225 | (71,151,87) green | ✅ CONFIRMED |
| Grass variant | 8 | 0 | 257 | (71,151,87) green | ✅ CONFIRMED |
| Earthy path | 9 | 5 | 294 | (199,140,89) sandy brown | ✅ CONFIRMED |
| Plaza stone | 1 | 1 | 34 | (217,226,241) light gray | ✅ CONFIRMED |
| Plaza stone alt | 1 | 15 | 48 | (217,226,241) light gray | ✅ CONFIRMED |
| Teal water | 5 | 25 | 186 | (54,154,176) teal | ✅ CONFIRMED |
| Dark water | 6 | 25 | 218 | (33,92,129) dark blue | ✅ CONFIRMED |
| Aqua transition | 8 | 20 | 277 | (60,163,178) cyan-teal | ✅ CONFIRMED |
| Brown terracotta | 13 | 10 | 426 | (168,95,70) brown | ❌ NEEDS HUMAN (type unknown) |
| Path variant | 6 | 5 | 198 | (181,117,77) earthy | ❌ NEEDS HUMAN |
| Red marker | 1 | 5 | 38 | (235,0,7) RED | ❌ NEEDS HUMAN (fence? border?) |

**Transparent rows in Terrains at col=0:** 0,1,2,3,4,10,14,15 (sparse spritesheet)

---

## 21_Beach_16x16.png (firstgid=2369, 32 cols, 125 rows)

| Purpose | Row | Col | GID | RGB | Status |
|---------|-----|-----|-----|-----|--------|
| Sandy beach | 2 | 0 | 2433 | (230,174,85) golden | ✅ CONFIRMED |
| Wooden dock/pier | 9 | 15 | 2672 | (126,97,81) wood brown | ✅ CONFIRMED |
| Beach grass | 1 | 0 | 2401 | (71,151,87) green | ✅ CONFIRMED (same as terrain grass) |
| Beach grass | 3 | 0 | 2465 | (71,151,87) green | ✅ CONFIRMED |

**Note:** beach row=0 transparent. Rows 4-5 at col=0 also transparent.

---

## 4_Generic_Buildings_16x16.png (firstgid=6369, 32 cols, 200 rows)

⚠️ Row 0 is entirely transparent — the current BUILDING_GID=6369 is invisible!

Content starts at row=1. The building sheet appears to have multiple building styles
arranged in vertical strips across columns.

| Purpose | Row | Col | GID | RGB | Status |
|---------|-----|-----|-----|-----|--------|
| 🚨 Current BUILDING_GID | 0 | 0 | 6369 | (0,0,0,a=0) TRANSPARENT | 🚨 BUG |
| Building wall (dark red) | 1 | 0 | 6401 | (132,81,86) dark reddish | ❌ NEEDS HUMAN |
| Building wall (tan) | 2 | 0 | 6433 | (189,167,102) beige/tan | ❌ NEEDS HUMAN |
| Building wall (tan) | 3 | 0 | 6465 | (189,167,102) beige/tan | ❌ NEEDS HUMAN |
| Dark window/wall | 4 | 0 | 6497 | (58,58,80) dark navy | ❌ NEEDS HUMAN |
| Wall (golden) | 5 | 0 | 6529 | (180,143,84) golden brown | ❌ NEEDS HUMAN |
| Wall (tan large) | 6 | 0 | 6561 | (189,167,102) beige | ❌ NEEDS HUMAN |
| Brown terracotta wall | 12 | 0 | 6753 | (161,127,108) brown-orange | ❌ NEEDS HUMAN |
| Alt building wall | 14 | 0 | 6817 | (142,89,92) dark red-gray | ❌ NEEDS HUMAN |
| Gray building | 2 | 16 | 6449 | (157,163,183) blue-gray | ❌ NEEDS HUMAN |
| Warm tan building | 2 | 8 | 6441 | (204,200,144) light tan | ❌ NEEDS HUMAN |

**Best guess for Phase 3.2 BUILDING_GID replacement:**
→ GID=6401 (buildings row=1, col=0) rgb=(132,81,86) — dark reddish wall, needs human confirm
→ Or GID=6433 (buildings row=2, col=0) rgb=(189,167,102) — beige wall, more neutral/classic

---

## 17_Garden_16x16.png (firstgid=12769, 32 cols, 196 rows)

⚠️ Row 0 is transparent — the current PALM_GID=12769 is invisible!

Garden sheet appears to repeat every ~4 rows with different plant/foliage variants.

| Purpose | Row | Col | GID | RGB | Status |
|---------|-----|-----|-----|-----|--------|
| 🚨 Current PALM_GID | 0 | 0 | 12769 | (0,0,0,a=0) TRANSPARENT | 🚨 BUG |
| Bright green foliage | 1 | 0 | 12801 | (73,169,47) lime green | ❌ NEEDS HUMAN |
| Medium green foliage | 2 | 0 | 12833 | (45,162,51) medium green | ❌ NEEDS HUMAN |
| Dark green foliage | 3 | 0 | 12865 | (38,139,73) dark green-teal | ❌ NEEDS HUMAN |
| Foliage variant B | 5 | 0 | 12929 | (73,169,47) lime green | ❌ NEEDS HUMAN |
| Foliage variant B2 | 6 | 0 | 12961 | (45,162,51) medium green | ❌ NEEDS HUMAN |
| Foliage variant B3 | 7 | 0 | 12993 | (38,139,73) dark green | ❌ NEEDS HUMAN |

**Best guess for Phase 3.2 PALM_GID replacement:**
→ ⚠️ Rows 1-3 of garden sheet are SMALL SHRUBS/BUSHES, NOT palm trees
→ Per LimeZu community research: palm trees are in Garden rows 26-45
→ GID=13601 (garden row=26, col=0) — likely palm tree fronds — ❌ NEEDS HUMAN
→ Formula: 12769 + (26 × 32 + 0) = 13601
→ Open tileset-preview.html, scroll to garden row=26-45, hover tiles to find actual palm

---

## 8_Worksite_16x16.png (firstgid=19041, 32 cols, 20 rows)

⚠️ Row 0 is transparent — the current SCAFFOLD_GID=19041 is invisible!

| Purpose | Row | Col | GID | RGB | Status |
|---------|-----|-----|-----|-----|--------|
| 🚨 Current SCAFFOLD_GID | 0 | 0 | 19041 | (0,0,0,a=0) TRANSPARENT | 🚨 BUG |
| Pale gray/concrete | 1 | 0 | 19073 | (235,228,242) pale lavender | ❌ NEEDS HUMAN |
| 🟠 Construction orange | 1 | 8 | 19081 | (237,147,30) ORANGE | ❌ NEEDS HUMAN |
| Dark reddish | 2 | 8 | 19074+8=... | (107,80,82) dark | ❌ NEEDS HUMAN |
| 🔴 Bright red-orange | 6 | 0 | 19233 | (252,92,70) bright red-orange | ❌ NEEDS HUMAN |
| Red-orange (repeated) | 7 | 0 | 19265 | (252,92,70) bright red-orange | ❌ NEEDS HUMAN |
| Red-orange (repeated) | 8 | 0 | 19297 | (252,92,70) bright red-orange | ❌ NEEDS HUMAN |

**Best guess for Phase 3.2 SCAFFOLD_GID replacement:**
→ GID=19081 (worksite row=1, col=8) rgb=(237,147,30) — construction orange — classic scaffold color
→ Or GID=19233 (worksite row=6, col=0) rgb=(252,92,70) — bright red-orange construction material

Note: worksite row=1, col=8 GID = 19041 + (1×32) + 8 = 19041 + 32 + 8 = 19081

---

## Interior Tilesets (NOT YET CATALOGED — Phase 4 pre-work)

These files exist in public/assets/tilesets/ but are not yet loaded by Phaser:
- **Interiors_16x16.png** — 16 cols × 1064 rows (17024 tiles)
- **Room_Builder_16x16.png** — 76 cols × 113 rows (8588 tiles)

These will need their own firstgid assignments when Phase 4 (Andres's Room) is planned.
The interior scene will need its own tileset chain starting after worksite (19041+640=19681+).

---

## Visual Findings from Human Review (2026-03-09)

Andres reviewed the tileset-preview.html and shared screenshots. Key findings:

### Garden tileset — NOT useful for Miami overworld
The garden tileset contains formal topiary hedges, ornate stone pergolas/columns, and potted
plants. This is a formal English garden aesthetic — no palm trees. Do not use garden tileset
for the Miami overworld palm trees.

### Beach tileset — HAS the palm tree
A full multi-tile palm tree sprite is visible in the beach tileset (green, ~3×4 tiles).
This is the Miami-appropriate palm tree. GID needs hover confirmation.
The beach tileset also has: sand/grass transitions, dock wooden planks, beach bar structure,
beach umbrellas, tropical ground plants. Very Miami-relevant.

### Steel scaffold/truss structures
Visible in both beach and terrains tilesets as steel X-frame tower structures. These work
for under-construction buildings (Chalk Lab, VC Office).

### Terrains — ground tiles are good
Grass, path, water transitions are confirmed strong. Round deciduous trees (not palms) also
present — these can be used as generic foliage in non-beach areas.

---

## NEEDS HUMAN VERIFICATION (Priority Order)

Open http://localhost:5173/tileset-preview.html and hover tiles to confirm GIDs.
Replace ❌ with ✅ and update the RGB values.

### Phase 3.2 blockers (must confirm before map visual design):
- [ ] **PALM GID** — In the BEACH tileset, hover the palm tree sprite (visible in middle-right area of beach sheet, ~row 5-6). Get the top-left tile GID. Note all tile GIDs for trunk and fronds if it's multi-tile.
- [ ] **SCAFFOLD GID** — In the BEACH or TERRAINS tileset, hover one of the steel X-frame tower tiles. Get its GID.
- [ ] **BUILDING wall GID** — In the BUILDINGS tileset, hover row=1 to find the cleanest solid wall tile.
- [ ] **DOCK GID confirmation** — The existing DOCK_GID=2672 was pixel-sampled. Visual confirm it looks like wooden planks (not just brown pixels).

### Phase 4 blockers (interior tilesets):
- [ ] Catalog Interiors_16x16.png first 30 rows (room floors, walls, furniture)
- [ ] Catalog Room_Builder_16x16.png first 30 rows (floor tiles, wall edges)

---

## Tileset GID Chain (current)

| Tileset | File | firstgid | Tiles | Last GID |
|---------|------|----------|-------|----------|
| terrains | 1_Terrains_and_Fences_16x16.png | 1 | 2368 | 2368 |
| beach | 21_Beach_16x16.png | 2369 | 4000 | 6368 |
| buildings | 4_Generic_Buildings_16x16.png | 6369 | 6400 | 12768 |
| garden | 17_Garden_16x16.png | 12769 | 6272 | 19040 |
| worksite | 8_Worksite_16x16.png | 19041 | 640 | 19680 |
| (future interior) | Interiors_16x16.png | 19681 | 17024 | 36704 |
| (future interior) | Room_Builder_16x16.png | 36705 | 8588 | 45292 |
