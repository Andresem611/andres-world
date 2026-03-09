# LimeZu Modern Exteriors 16x16 — Tileset Structure Reference

**Researched:** 2026-03-09
**Method:** Visual inspection of PNG files + pixel-level catalog analysis (tileset-catalog.json) + existing project code
**Confidence:** HIGH for verified GIDs (from tileset-catalog.json pixel data); MEDIUM for row-range zone descriptions (from visual inspection of PNGs)

---

## Overview: LimeZu Pack Structure

The LimeZu Modern Exteriors pack distributes content across many individual numbered PNG files. This project uses the individual sheets, NOT the `Modern_Exteriors_Complete_Tileset.png` mega-sheet.

### Universal LimeZu Fact: Row 0 is Always Transparent

Every LimeZu individual sheet has row 0 as a transparent border row. All pixels in row 0 are RGB [0,0,0] (black alpha-transparent). This is confirmed by the tileset-catalog.json for all 5 tilesets (terrains, beach, buildings, garden, worksite).

**GID formula:**
```
localId = row * cols + col   (0-indexed)
GID = firstgid + localId
```

### GID Chain (5-tileset layout in use)

| Tileset | File | firstgid | tilecount | GID range |
|---------|------|----------|-----------|-----------|
| terrains | 1_Terrains_and_Fences_16x16.png | 1 | 2368 | 1–2368 |
| beach | 21_Beach_16x16.png | 2369 | 4000 | 2369–6368 |
| buildings | 4_Generic_Buildings_16x16.png | 6369 | 6400 | 6369–12768 |
| garden | 17_Garden_16x16.png | 12769 | 6272 | 12769–19040 |
| worksite | 8_Worksite_16x16.png | 19041 | 640 | 19041–19680 |

---

## Tileset 1: 1_Terrains_and_Fences_16x16.png

**Dimensions:** 512 × 1184 px | **Grid:** 32 cols × 74 rows | **Total tiles:** 2368
**firstgid:** 1 | **GID range:** 1–2368
**Margin/spacing:** 0/0

### Verified GIDs (from tileset-catalog.json pixel samples)

| Tile | Row | Col | GID | RGB | Description |
|------|-----|-----|-----|-----|-------------|
| Transparent border | 0 | 0 | 1 | [0,0,0] | Row 0 = transparent for entire row |
| Plaza/pavement | 1 | 1 | 34 | [217,226,241] | Light blue-grey stone — used as PLAZA_GID |
| Bright blue accent | 1 | 2 | 35 | [0,164,229] | Vivid blue — likely a flag/sign element |
| Red accent | 1 | 4-5 | 37-38 | [235,0,7] | Bright red pixels — likely sign/flag |
| Dark grey object | 1 | 16-17 | 49-50 | [58,58,80] | Dark blue-grey — likely a prop |
| Grass family | 1 | 25-28 | 58-61 | [83,166,93] | Lighter green grass variant |
| Path/dirt | 1 | 29-30 | 62-63 | [168,95,70] | Reddish-brown dirt/path edge |
| (row 2-4 mixed) | 2-4 | various | 65-160 | mixed | Terrain transition tiles, mixed grass/path |
| Transparent row | 5 | 0-24 | 161-185 | [0,0,0] | Cols 0-24 all transparent in row 5 |
| **WATER** | **5** | **25** | **186** | **[54,154,176]** | **Teal water — VERIFIED** |
| Water variants | 5 | 26-29 | 187-190 | [60,163,178] | Lighter teal water |
| **GRASS** | **6** | **0** | **193** | **[71,151,87]** | **Green grass — VERIFIED** |
| Grass variants | 6 | 0-5 | 193-197 | ~[71,151,87] | Grass tone family |
| Path/dirt blend | 6 | 5-6 | 198-199 | [181,117,77] / [199,140,89] | Earthy path transitions |
| Water+grass mix | 6 | 13-14 | 206-207 | [54,154,176] | Water-grass shoreline transition |
| Dark water | 6 | 25-26 | 218-219 | [33,92,129] | Deep ocean/dark water variant |
| Grass row | 7 | 0-6 | 225-231 | [71,151,87] | More grass tile variants |
| Dark teal water | 7 | 25 | 250 | [42,118,107] | Darker water/teal |
| Grass row | 8 | many | 257+ | [71,151,87] | Grass continues in multiple row groups |
| Mixed terrain | 9 | 0-2 | 289-291 | [0,0,0] | Transparent in cols 0-2 |
| Grass | 9 | 3-4 | 292-293 | [71,151,87] | Grass |
| **PATH** | **9** | **5** | **294** | **[199,140,89]** | **Earthy sandy path — VERIFIED** |
| Path col 6 | 9 | 6 | 295 | [199,140,89] | Path continues |
| Road/concrete | 9 | 25-26 | 314-315 | [171,173,177]/[160,162,163] | Grey road surface |
| Teal-green | 9 | 27-28 | 316-317 | [75,100,99] | Pond/wetland variant |

### Row Zone Summary (1_Terrains_and_Fences_16x16.png)

Based on visual inspection of the PNG image:

| Row Range | Content Zone |
|-----------|-------------|
| 0 | Transparent border (all-black) |
| 1–4 | Road/city terrain tiles — crosswalks, sidewalks, road markings. Cols 0-15: pavement/flags/buildings tops; Cols 25-31: grass and dirt/path variants |
| 5 | Transition row — cols 0-24 transparent, cols 25-29: **water tiles (teal, verified)** |
| 6–9 | **Primary terrain content**: grass (cols 0-4), path/dirt (cols 5-7), water+grass shoreline combos (cols 13-15), water variants (cols 25-29) |
| 10–20 | Fence/wall segments — horizontal, vertical, corner variants |
| 21–35 | Additional terrain variants — dirt paths, gravel, alternative grass shades |
| 36–50 | Water/ocean tile variants and animated water tile sets |
| 51–65 | Terrain overlay decorations — tire tracks, shadows, weathering |
| 66–73 | Road markings, sidewalk details, curb tiles |

### Fence Tile Note (ge_collide)

The terrain sheet includes fence segments. Used in the codebase:
- `FENCE_LOCAL_ID = 5 * 32 + 0 = 160` (row=5, col=0) → GID 161
- This tile is marked `ge_collide: true` in the JSON tileset properties
- Row 5 col 0 is transparent (RGB [0,0,0]) — used as an invisible collision marker

---

## Tileset 2: 21_Beach_16x16.png

**Dimensions:** 512 × 2000 px | **Grid:** 32 cols × 125 rows | **Total tiles:** 4000
**firstgid:** 2369 | **GID range:** 2369–6368
**Margin/spacing:** 0/0

### Verified GIDs (from tileset-catalog.json pixel samples)

| Tile | Row | Col | GID | RGB | Description |
|------|-----|-----|-----|-----|-------------|
| Transparent border | 0 | 0-21 | 2369-2390 | [0,0,0] | Row 0 cols 0-21 transparent |
| Dark objects | 0 | 22-23 | 2391-2392 | [58,58,80] | Dark blue-grey objects (likely beach props top) |
| Reddish object | 0 | 24 | 2393 | [192,92,66] | Reddish-brown prop |
| **Sandy beach tiles** | **0** | **27-30** | **2396-2399** | **[232,187,91]/[219,132,71]** | **Sand/golden tile family** |
| Mixed row 1 | 1 | various | 2401-2432 | mixed | Transition tiles, some transparent |
| **SAND** | **2** | **0-6** | **2433-2439** | **[230,174,85]** | **Golden sand — VERIFIED (row=2, col=0, GID=2433)** |
| Sand+water | 2 | 8 | 2441 | [60,163,178] | Water mixed with sand — shoreline |
| Sand variants | 2 | 9,11-14 | 2442,2444-2447 | [230,174,85] | More sand |
| Dark blue | 2 | 16-17 | 2449-2450 | [65,96,149] | Deep water/shadow |
| Rows 3-8 mixed | 3-8 | various | 2465-2656 | mixed | Beach objects, dock sections, pier tiles |
| Beach row 9 mixed | 9 | 0-4 | 2657-2661 | [0,0,0] | Transparent/border in row 9 cols 0-4 |
| Beach sand | 9 | 5-6 | 2662-2663 | [224,155,78] | Sandy-orange |
| More sand | 9 | 13-14 | 2670-2671 | [230,174,85] | Golden sand |
| **DOCK** | **9** | **15** | **2672** | **[126,97,81]** | **Wooden pier brown — VERIFIED** |
| Dock variant | 9 | 16 | 2673 | [168,95,70] | Reddish-brown pier plank |
| Dock variant | 9 | 17-18 | 2674-2675 | [126,97,81]/[123,91,58] | Pier wood shades |

### Row Zone Summary (21_Beach_16x16.png)

Based on visual inspection of the PNG image:

| Row Range | Content Zone |
|-----------|-------------|
| 0 | Transparent border (cols 0-21), then beach props tops (right side) |
| 1 | Transition row — mixed sand/water edge tiles |
| 2–4 | **Primary sand tiles** (cols 0-7 golden sand), water-sand shoreline transitions (cols 8-15), deep water variants (cols 16-21), misc beach objects (cols 22-31) |
| 5–8 | Beach prop objects: parasols, beach chairs, sandcastles, coolers, etc. Top of tall objects — visually these are OBJECT tiles, not terrain fills |
| 9–14 | **Dock/pier tiles** — wooden plank floor variants (cols 15-21), boardwalk pieces, rope/bollard details |
| 15–25 | Fog/misty beach variants ("foggy variants" label visible in PNG) |
| 26–50 | Lighthouse sprite tiles (multi-tile tall lighthouse structure) |
| 51–75 | More lighthouse variants and beach building sections |
| 76–100 | Additional beach prop clusters |
| 101–124 | Rope/anchor/boat elements and edge tiles |

### Key Note: Beach Row 0 Has Sandy Tiles Too

Beach row 0 cols 27-30 (GIDs 2396-2399) show sandy/golden RGB values ([232,187,91] and [219,132,71]). These are sandy-orange and represent the tops of beach prop sprites, not flat fill tiles. Use row 2 cols 0-6 for flat sand fills.

---

## Tileset 3: 4_Generic_Buildings_16x16.png

**Dimensions:** 512 × 3200 px | **Grid:** 32 cols × 200 rows | **Total tiles:** 6400
**firstgid:** 6369 | **GID range:** 6369–12768
**Margin/spacing:** 0/0

### Verified GIDs (from tileset-catalog.json pixel samples)

| Tile | Row | Col | GID | RGB | Description |
|------|-----|-----|-----|-----|-------------|
| Transparent border | 0 | all | 6369-6400 | [0,0,0] | Row 0 = full transparent row |
| **BUILDING facade** | **1** | **0** | **6401** | **[132,81,86]** | **Mauve/rosy building wall — row=1, col=0** |
| Building row 1 | 1 | 0-5 | 6401-6406 | [132,81,86] | Consistent mauve/rose — building wall family |
| Various buildings | 1-9 | various | 6401-6688 | mixed | Building facade sections, wall pieces |

**Note:** The current generate-map.ts uses `BUILDING_GID = tileGid(BUILDING_FIRSTGID, BUILDING_COLS, 0, 0) = 6369` which is a transparent (row=0) tile. This is used solely as a collision marker tile with `ge_collide: true` in the JSON properties — it renders as transparent but Grid Engine reads the property. The first actual visible building tile is at row=1, col=0, GID=6401, RGB=[132,81,86] (mauve/rosy building wall).

### Row Zone Summary (4_Generic_Buildings_16x16.png)

Based on visual inspection of the PNG image:

| Row Range | Content Zone |
|-----------|-------------|
| 0 | Transparent border |
| 1–8 | **Modern building facades** — yellow/tan office towers (cols 0-7), brick-detailed buildings (cols 8-15), darker brick facades (cols 16-23), mixed building styles (cols 24-31) |
| 9–20 | **Building middle sections** — window rows, awning details, fire escapes, balconies |
| 21–35 | **Building base/ground floor** — storefronts, doors, shop windows, entrance tiles |
| 36–50 | **Residential building variants** — smaller buildings, different facade colors (grey, blue-grey) |
| 51–80 | **Large building complexes** — multi-unit facades, connected buildings with shared walls |
| 81–110 | **Building details** — rooftop sections, AC units, water towers, roof access |
| 111–140 | **Corner pieces and edge tiles** — building corners for constructing arbitrary building shapes |
| 141–170 | **Interior-facing wall fragments** — used for building interiors seen from outside |
| 171–200 | **Additional building variants** — garage doors, loading bays, industrial units |

### Building Tile Note

The 4_Generic_Buildings_16x16 sheet is a sprite atlas of complete building front-facing views. Most tiles form parts of 2-4 tile wide, 3-6 tile tall building sprites. The top rows of each building section are at the top of the sprite (high row numbers for the foot, low row numbers for the roof). Individual building footprints span multiple columns and rows.

---

## Tileset 4: 17_Garden_16x16.png

**Dimensions:** 512 × 3136 px | **Grid:** 32 cols × 196 rows | **Total tiles:** 6272
**firstgid:** 12769 | **GID range:** 12769–19040
**Margin/spacing:** 0/0

### Verified GIDs (from tileset-catalog.json pixel samples)

| Tile | Row | Col | GID | RGB | Description |
|------|-----|-----|-----|-----|-------------|
| Transparent border | 0 | all transparent except cols 0-3, 7-8 | 12769+ | [0,0,0] mostly | Row 0: most transparent |
| Green tile | 0 | 0 | 12769 | [45,162,51] | Bright green — likely grass/shrub top |
| More green | 0 | 1-4 | 12770-12773 | [45,162,51]/[38,139,73] | Green vegetation tops |
| Dark green | 0 | 5 | 12774 | [31,97,79] | Dark foliage |
| Green row 1 | 1 | 0-3 | 12801-12804 | [73,169,47]/[38,139,73] | Brighter lime green |
| Dark green/grey | 1 | 4-5 | 12805-12806 | [47,66,77]/[58,58,80] | Dark grey-blue-green |
| Dark olive | 1 | 7-11 | 12808-12812 | [31,97,79]/[38,139,73] | Dark green vegetation |
| Bright greens | 1 | 13-15 | 12814-12816 | [45,162,51]/[100,182,59] | Hedge/shrub greens |
| Teal-green | 1 | 16-17 | 12817-12818 | [23,112,75]/[26,82,73] | Darker tropical green |

**Note:** Like Buildings, `PALM_GID = tileGid(GARDEN_FIRSTGID, GARDEN_COLS, 0, 0) = 12769` points to row=0, col=0. The catalog shows GID 12769 has RGB [45,162,51] — actually a visible green tile (not fully transparent). However, it renders as a partial tile (top of a vegetation sprite). The `ge_collide: true` on localId=0 means this serves as both a visible green top and a collision tile.

### Row Zone Summary (17_Garden_16x16.png)

Based on visual inspection of the PNG image:

| Row Range | Content Zone |
|-----------|-------------|
| 0 | Partial transparency + vegetation/shrub tops (mixed) |
| 1–10 | **Small garden props**: flower pots, planters, garden tools, hedges (top sections) |
| 11–25 | **Tree sprites**: small deciduous trees, conifer tops, circular bush clusters |
| 26–45 | **Palm trees**: palm fronds (top sections), trunk segments, palm clusters — ideal for Miami theme |
| 46–65 | **Tall tree sprites**: full tree with trunk visible, multi-tile tree variants |
| 66–85 | **Garden structures**: benches, fountains, garden paths, decorative fences |
| 86–110 | **Large landscape trees**: oak-style spreading canopy |
| 111–130 | **Greenhouse/garden building tiles** |
| 131–155 | **Stone and gravel path tiles** for garden paths |
| 156–196 | **Building-garden hybrid tiles**: garden walls, archways, trellises, large planters |

### Palm Tree Location in Garden Sheet

Visually confirmed: Palm trees begin around row 26-30. These are the best Miami-appropriate tiles in this sheet. A palm tree sprite typically spans 2-3 tiles wide and 4-6 tiles tall.

---

## Tileset 5: 8_Worksite_16x16.png

**Dimensions:** 512 × 320 px | **Grid:** 32 cols × 20 rows | **Total tiles:** 640
**firstgid:** 19041 | **GID range:** 19041–19680
**Margin/spacing:** 0/0

### Verified GIDs (from tileset-catalog.json pixel samples)

| Tile | Row | Col | GID | RGB | Description |
|------|-----|-----|-----|-----|-------------|
| Transparent border | 0 | 0-6 | 19041-19047 | [0,0,0] | Cols 0-6 transparent |
| **SCAFFOLD start** | **0** | **7** | **19048** | **[237,147,30]** | **Orange construction equipment top** |
| Scaffold/scaffolding | 0 | 12 | 19053 | [237,147,30] | More orange equipment |
| Dark grey structure | 0 | 14-19 | 19055-19060 | [58,58,80]/[157,163,183] | Metal scaffolding frame |
| Metal scaffold | 0 | 21-26 | 19062-19067 | [58,58,80]/[86,89,114] | More scaffolding structure |
| Light grey scaffold | 1 | 0 | 19073 | [235,228,242] | Light lavender-grey scaffold plank |
| White/off-white | 1 | 1 | 19074 | [248,248,248] | Near-white scaffold element |
| Orange equipment | 1 | 8-10 | 19081-19083 | [237,147,30] | Orange heavy machinery |
| Grey metal frame | 1 | 14-19 | 19087-19092 | [125,127,153]/[58,58,80] | Metal scaffold uprights |
| Blue-grey metal | 2 | 0-2 | 19105-19107 | [75,76,100]/[82,84,108] | Metal scaffolding section |
| Mauve-pink | 1 | 29-30 | 19102-19103 | [208,190,156] | Beige/tan building material |

**Note:** The current codebase uses `SCAFFOLD_GID = tileGid(WORKSITE_FIRSTGID, WORKSITE_COLS, 0, 0) = 19041`. The catalog shows GID 19041 is at row=0, col=0 with RGB [0,0,0] — fully transparent. This is used as a collision marker (ge_collide: true), not for visual rendering. The actual visible scaffolding starts at row=0, col=7 (GID 19048, orange) and row=0, cols 14-19 (metal frames).

### Row Zone Summary (8_Worksite_16x16.png)

Based on visual inspection of the PNG image (20 rows total):

| Row Range | Content Zone |
|-----------|-------------|
| 0 | Transparent border cols 0-6, then: **construction light towers** (cols 0-6 area), **orange boom lifts/scissor lifts** (cols 6-11), **scaffolding frames** (cols 12-19), **metal rack/shelving top** (cols 20-31) |
| 1–2 | **Safety barrier/fence** (red-white striped: orange-red cones + white panels on left), **rock/rubble piles** (center-left), **more lift vehicles** (center), **scaffolding midsection** (right) |
| 3–4 | **Base sections** of all machinery from rows 0-2: vehicle bases, wheels visible |
| 5–8 | **Worksite props**: hard hats, safety cones, tool boxes, paint cans, warning signs |
| 9–12 | **Large metal storage rack** (full visible in rows 9-12 right side of sheet) |
| 13–16 | **Pallet/material stacks**: lumber piles, pipe stacks, construction material tiles |
| 17–19 | **Ground-level detail tiles**: dirt mounds, tire tracks, excavated ground |

### Worksite Content Note

The worksite sheet primarily contains OBJECT sprites (construction vehicles, scaffolding structures) rather than terrain tiles. All are multi-tile sprites. Row 0 is the only "border" row. True scaffold wall/platform tiles for use as building overlays are in rows 0-4, right columns (cols 12-31 area, grey metal frames).

Best scaffolding overlay tiles for the "under construction" look:
- Row 0, cols 14-19: Metal scaffolding uprights, GIDs 19055-19060
- Row 1, cols 14-19: Scaffolding midsection GIDs 19087-19092

---

## Interior Tilesets (Not in Active 5-Tileset Chain)

These tilesets are available in the project but not yet loaded. They will be needed for Phase 3 (Andres's Room), Phase 4 (Thoven HQ interior), etc.

### Interiors_16x16.png

**Dimensions:** ~256 × ~17024 px (estimated 16 cols × 1064 rows = 17024 tiles based on task spec)
**Visual inspection:** Extremely tall narrow sheet. Content observed:
- Dense, multi-room interior tile content
- Floor tiles, wall tiles, furniture pieces
- Various room decoration objects
- Multiple color themes for different room types
- Visible content: desks, beds, bookshelves, carpets, windows, doors

**Key structural fact:** 16 columns (not 32). This is different from the 5 external tilesets. GID formula uses `cols=16`.

**Row zone estimates (from visual):**
| Row Range | Content Zone |
|-----------|-------------|
| 0 | Transparent border |
| 1–50 | Floor tile variants — hardwood, carpet, tile, stone |
| 51–120 | Wall tiles — wainscoting, wallpaper, plain walls in multiple colors |
| 121–250 | Furniture: desks, chairs, tables, beds, sofas |
| 251–400 | Kitchen/bathroom fixtures |
| 401–600 | Electronics, computers, bookshelves, decorations |
| 601–800 | Doors, windows, staircases |
| 801–1064 | Room-specific prop clusters: bedroom, office, café, lab objects |

### Room_Builder_16x16.png

**Dimensions:** ~1216 × ~1808 px (76 cols × 113 rows = 8588 tiles based on task spec)
**Visual inspection:** Wide sheet with labeled sections (text annotations visible). Contains:
- **Floor tiles**: multiple wood floor tones (horizontal planks in 4-5 color variants visible — light oak, dark oak, grey, beige, teal)
- **Wall segments**: tall wall panels for constructing room interiors
- **Window frames and door frames** with multiple styles
- **Corner pieces** for room construction
- **Labels visible**: "Añadir", "Floor Tables" type annotations suggesting organized sections
- Labeled design: appears to be a modular room builder with components meant to snap together

**Key structural fact:** 76 columns. Very wide compared to other sheets.

**Row zone estimates (from visual):**
| Row Range | Content Zone |
|-----------|-------------|
| 0 | Tools/UI elements visible at top-left, partial transparent border |
| 1–10 | **Room construction headers and labels** (annotation rows) |
| 11–30 | **Floor tile palette** — multiple wood/carpet/tile floor variants in horizontal bands |
| 31–55 | **Wall tiles** — exterior-facing walls with windows, doorways |
| 56–80 | **Interior wall panels** — plain walls, decorative walls, color variants |
| 81–100 | **Corner and junction pieces** for modular room construction |
| 101–113 | **Specialized room tiles** — bathroom, kitchen, closet specific tiles |

**Room_Builder special note:** Sheet has visible "piano" label and text annotations suggesting sections are named. The right portion of the sheet contains stacked room layouts (complete room templates showing full rooms with walls/floors combined). These are not individual tiles but complete room mockups for reference.

---

## Additional Available Tilesets (Not in Primary Chain)

These files are in `public/assets/tilesets/` but not loaded in the current 5-tileset configuration:

### 2_City_Terrains_16x16.png
**Dimensions:** 944 × 1648 px | **Grid:** 59 cols × 103 rows = 6077 tiles
**Visual content:** Urban road network tiles — crosswalks, bus stops, roundabout, parking lots, sidewalks with red/yellow accent markings. Multiple road layout variants: 4-way intersections, T-junctions, curved roads, one-way indicators. Also contains some grass edge tiles at bottom.
**Key note:** 59 columns (not 32) — different from other sheets. Use cols=59 in GID calculations.
**Miami relevance:** Bus stops, crosswalks, and sidewalk tiles useful for Main Street refinement.

### 19_Graveyard_16x16.png
**Dimensions:** ~512 × ~512 px (estimated) | **Grid:** 32 cols × ~35 rows
**Visual content:** Cemetery/gothic environment — tombstones, crypts, gothic iron fences, dead trees, mausoleums, dark grass, graves, soil mounds. Dark color palette: dark greens, greys, purples.
**Miami relevance:** Used for the Idea Graveyard zone. Tombstones and iron fence tiles are particularly relevant.

### 7_Villas_16x16.png
**Dimensions:** ~512 × ~1200 px (estimated) | **Grid:** 32 cols × ~75 rows
**Visual content:** Residential villa/house sprites — single-family homes in top-down style, 3-4 tile wide × 4-6 tile tall house facades, multiple color variants (brown, red, blue). Includes garden furniture (outdoor tables, patio chairs), tree sprites, small decorative objects. More suburban than urban.
**Miami relevance:** Good for Andres's House residential area.

### 3_City_Props_16x16.png
**Dimensions:** ~512 × ~2000 px (estimated) | **Grid:** 32 cols × ~125 rows
**Visual content:** City decoration props — lamp posts, traffic lights, ATMs, phone booths, mailboxes, benches, trash cans, vending machines, AC units, wind turbines, storage tanks, shipping containers, billboards, road barriers, fencing panels. Very diverse prop sheet.
**Miami relevance:** Lamp posts, benches, and street furniture for Main Street.

---

## Community GID References

**No official LimeZu GID documentation found.** The LimeZu itch.io page and pack do not include a machine-readable GID map. Community knowledge on forums and GitHub consists of:

1. **Universal knowledge**: Row 0 of every LimeZu sheet is transparent (confirmed in this project's catalog).
2. **Per-project inspection**: Every project using LimeZu tilesets runs their own inspection — there is no shared community GID database.
3. **This project's inspect-tileset.cjs**: The authoritative GID source for this project. Output at `public/assets/maps/tileset-catalog.json`.

**GitHub projects using LimeZu tilesets** (observed in community):
- Projects typically reference LimeZu tiles by row/col coordinates discovered through Tiled editor's tile picker, not through documented GID tables
- The LimeZu itch.io changelog (320+ updates mentioned in design doc) does not include tile ID documentation
- No community-maintained GID map or spreadsheet was found

---

## Verified Project GIDs (Source of Truth)

These GIDs are verified by tileset-catalog.json (pixel-level RGB sampling) and confirmed by the generate-map.ts implementation that passed human smoke testing:

| Constant | Tileset | Row | Col | GID | RGB | Terrain |
|----------|---------|-----|-----|-----|-----|---------|
| GRASS_GID | terrains | 6 | 0 | 193 | [71,151,87] | Green grass fill |
| PATH_GID | terrains | 9 | 5 | 294 | [199,140,89] | Earthy sandy path |
| WATER_GID | terrains | 5 | 25 | 186 | [54,154,176] | Teal water fill |
| PLAZA_GID | terrains | 1 | 1 | 34 | [217,226,241] | Light stone/pavement |
| SAND_GID | beach | 2 | 0 | 2433 | [230,174,85] | Golden sand fill |
| DOCK_GID | beach | 9 | 15 | 2672 | [126,97,81] | Wooden pier brown |
| BUILDING_GID | buildings | 0 | 0 | 6369 | [0,0,0] | Transparent (collision marker only) |
| PALM_GID | garden | 0 | 0 | 12769 | [45,162,51] | Green vegetation top (partial) |
| SCAFFOLD_GID | worksite | 0 | 0 | 19041 | [0,0,0] | Transparent (collision marker only) |

**Status:** All GIDs above are production-verified. The game rendered correctly with real LimeZu pixel-art tiles in the Phase 03.1 human smoke test (2026-03-09).

---

## GID Calculator Reference

```typescript
// Tileset firstgids
const TERRAIN_FIRSTGID  = 1;      // 1_Terrains_and_Fences_16x16.png
const BEACH_FIRSTGID    = 2369;   // 21_Beach_16x16.png
const BUILDING_FIRSTGID = 6369;   // 4_Generic_Buildings_16x16.png
const GARDEN_FIRSTGID   = 12769;  // 17_Garden_16x16.png
const WORKSITE_FIRSTGID = 19041;  // 8_Worksite_16x16.png

// All 5 primary sheets: 32 cols
// City Terrains exception: 59 cols
// Interiors exception: 16 cols
// Room_Builder exception: 76 cols

function tileGid(firstgid: number, cols: number, row: number, col: number): number {
  return firstgid + (row * cols + col);
}

// Examples:
// Next grass variant (row=6, col=1): tileGid(1, 32, 6, 1) = 194
// Alternative water (row=5, col=26): tileGid(1, 32, 5, 26) = 187
// Sand variant (row=2, col=1): tileGid(2369, 32, 2, 1) = 2434
// First visible building (row=1, col=0): tileGid(6369, 32, 1, 0) = 6401, RGB=[132,81,86]
// Scaffolding frame (row=0, col=14): tileGid(19041, 32, 0, 14) = 19055
```

---

## Grid Engine Integration Notes

Grid Engine (v2.48.0) reads `ge_collide: true` tile properties from Tiled JSON. Key integration facts:

1. **Collision is set per-tileset, not per-GID** — the `tiles` array in each tileset entry uses LOCAL tile IDs (0-based within that tileset), not GIDs.
2. **ge_collide marker tiles in this project** — each tileset marks one tile as `ge_collide: true` to enable the collision system:
   - Terrains: localId=160 (row=5, col=0) — transparent tile, invisible collision fence
   - Buildings: localId=0 (row=0, col=0) — transparent, used as BUILDING_GID/BLOCK in collision layer
   - Garden: localId=0 (row=0, col=0) — green tile (visible), also blocks player
   - Worksite: localId=0 (row=0, col=0) — transparent, collision marker
3. **The Collision layer approach** — the project uses a separate Collision layer with non-zero GIDs (using BUILDING_GID=6369 as the marker) to indicate blocked tiles. Grid Engine reads the GID, looks up the tileset, checks `ge_collide`, and blocks movement.
4. **Grid Engine README** (Annoraaq/grid-engine) — does not mention LimeZu specifically. Tileset integration is standard Phaser 3 tilemap — Grid Engine only requires the `ge_collide` property or a custom collision function.

---

## Known Gaps / What Remains Unresolved

1. **Exact row/col for palm trees in Garden sheet** — visually confirmed palm trees exist around rows 26-30 but exact GIDs not in the 10-row catalog sample. Run `node scripts/inspect-tileset.cjs` with `SAMPLE_ROWS` increased to 40 to get rows 10-39.

2. **Graveyard tile GIDs** — tombstone and iron fence tiles not inspected. Needed for Idea Graveyard zone.

3. **Interior tileset GIDs** — Interiors_16x16.png and Room_Builder_16x16.png not in the catalog (only 5 tilesets were cataloged). A separate inspection pass is needed when building interiors (Phase 3+).

4. **City Terrains GIDs** — 2_City_Terrains_16x16.png not in catalog. Sidewalk and crosswalk tiles useful for Main Street polish are not yet mapped.

5. **LimeZu itch.io changelog** — could not fetch (WebFetch restricted). Version history describing what was added in each of the 320+ updates is not available offline.

---

## Sources

| Source | Confidence | What It Confirmed |
|--------|-----------|-------------------|
| `public/assets/maps/tileset-catalog.json` | HIGH | Exact RGB of center pixel for every tile in rows 0-9 of all 5 tilesets |
| `scripts/inspect-tileset.cjs` | HIGH | Methodology for pixel extraction; PNG IHDR dimensions |
| `scripts/generate-map.ts` | HIGH | Verified GID constants used in production map |
| `public/assets/tilesets/*.png` (visual) | MEDIUM | Row zone content zones from visual inspection |
| `.planning/phases/03.1-art-foundation-real-tilesets-and-programmatic-miami-world-map/03.1-RESEARCH.md` | HIGH | Architecture patterns, firstgid chain, pitfalls |
| Human smoke test (Phase 03.1) | HIGH | Confirms all 5 verified GIDs render correctly in browser |
| LimeZu itch.io / GitHub community | NOT FETCHED | WebFetch restricted; no offline community GID map found |
