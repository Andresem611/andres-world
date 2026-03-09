---
name: limezu-tileset-catalog
description: Use when writing any tile GID for the Andres World project. Enforces GID accuracy and references the confirmed tile catalog.
---

# LimeZu Tileset Catalog Skill

## The Rule

**NEVER hardcode a tile GID without a ✅ entry in .planning/TILE-CATALOG.md.**

If the tile you need isn't in the catalog, add it with ❌ and tell Andres to visually confirm before continuing. Do not guess.

---

## GID Formula

```
GID = firstgid + (row × cols) + col
```

Example: buildings row=1, col=0 → 6369 + (1 × 32 + 0) = **6401**

---

## The 5-Tileset Chain (Overworld)

| Tileset | File | firstgid | cols | Tile count |
|---------|------|----------|------|------------|
| terrains | 1_Terrains_and_Fences_16x16.png | 1 | 32 | 2368 |
| beach | 21_Beach_16x16.png | 2369 | 32 | 4000 |
| buildings | 4_Generic_Buildings_16x16.png | 6369 | 32 | 6400 |
| garden | 17_Garden_16x16.png | 12769 | 32 | 6272 |
| worksite | 8_Worksite_16x16.png | 19041 | 32 | 640 |

**Interior tilesets (Phase 4+):**
- Interiors_16x16.png → firstgid=19681 (16 cols, 1064 rows)
- Room_Builder_16x16.png → firstgid=36705 (76 cols, 113 rows)

---

## Confirmed ✅ Tile GIDs (Overworld)

### Terrains (firstgid=1)
| Purpose | GID | Row | Col | RGB |
|---------|-----|-----|-----|-----|
| GRASS | 193 | 6 | 0 | (71,151,87) |
| PATH | 294 | 9 | 5 | (199,140,89) |
| WATER | 186 | 5 | 25 | (54,154,176) |
| PLAZA | 34 | 1 | 1 | (217,226,241) |

### Beach (firstgid=2369)
| Purpose | GID | Row | Col | RGB |
|---------|-----|-----|-----|-----|
| SAND | 2433 | 2 | 0 | (230,174,85) |
| DOCK | 2672 | 9 | 15 | (126,97,81) |

---

## ❌ Unconfirmed GIDs — DO NOT USE Until ✅

These are currently used in generate-map.ts but are WRONG (transparent tiles):

| Constant | Current GID | Problem | Best guess |
|----------|------------|---------|------------|
| BUILDING_GID | 6369 (row=0) | TRANSPARENT | 6401 (row=1, col=0) — needs human confirm |
| PALM_GID | 12769 (row=0) | TRANSPARENT | 12801 (row=1, col=0) — needs human confirm |
| SCAFFOLD_GID | 19041 (row=0) | TRANSPARENT | 19081 (row=1, col=8) — needs human confirm |

**How to fix:** Open tileset-preview.html, hover tiles, add to TILE-CATALOG.md with ✅.

---

## Critical: Row 0 Rule

**Every LimeZu tileset has transparent border rows.** Row 0 (and sometimes rows 1-4)
at col=0 are all transparent (alpha=0, RGB=[0,0,0]). Content starts at row=5-6
for Terrains, row=1 for Buildings/Garden/Worksite.

Never use `tileGid(firstgid, cols, 0, 0)` as a visual tile — it will be invisible.
Using it as a collision marker (ge_collide property) still works because Grid Engine
reads tile properties independently of visual rendering.

---

## How to Update the Catalog

1. Open `http://localhost:5173/tileset-preview.html`
2. Hover a tile — read row/col/GID from the yellow tooltip
3. Verify the visual description matches the RGB
4. Add/update the entry in `.planning/TILE-CATALOG.md` with ✅ status
5. Update generate-map.ts constants to match

---

## Tileset Preview Tool

The file `public/tileset-preview.html` provides:
- All 5 tilesets rendered at 3x scale
- Yellow grid overlay
- Live row/col/GID tooltip on hover
- Formula: `GID = firstgid + row * cols + col`
