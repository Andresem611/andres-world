/**
 * generate-map.ts
 *
 * Generates:
 * 1. public/assets/tilesets/modern-exteriors-32.png  — placeholder 16-column tileset PNG
 * 2. public/assets/maps/overworld.json               — complete 50x40 Miami overworld map
 * 3. public/assets/maps/tileset-catalog.txt          — localTileId → terrain category reference
 *
 * Run: npx tsx scripts/generate-map.ts
 *
 * Tileset layout (16 columns × N rows, 32×32 each):
 *   Row 0: path/ground tiles
 *   Row 1: building wall tiles
 *   Row 2: water/ocean tiles
 *   Row 3: palm tree tiles
 *   Row 4: scaffolding tiles
 *   Row 5: beach/sand tiles
 *   Row 6: dock/pier tiles
 *   Row 7: plaza/paved tiles
 *   Row 8: grass tiles
 *
 * LocalTileId mapping (id = row*16 + col, 0-based):
 *   GROUND_TILE      = 0    (row 0, col 0)  — walkable grass/path base
 *   PATH_TILE        = 1    (row 0, col 1)  — main street paved path
 *   BUILDING_WALL    = 16   (row 1, col 0)  — building facade/wall — BLOCKED
 *   WATER_TILE       = 32   (row 2, col 0)  — ocean water — BLOCKED
 *   PALM_TREE        = 48   (row 3, col 0)  — palm tree trunk/canopy — BLOCKED
 *   SCAFFOLDING      = 64   (row 4, col 0)  — construction scaffolding — BLOCKED
 *   SAND_TILE        = 80   (row 5, col 0)  — beach sand — walkable
 *   DOCK_TILE        = 96   (row 6, col 0)  — pier/boardwalk — walkable
 *   PLAZA_TILE       = 112  (row 7, col 0)  — plaza paving — walkable
 *   GRASS_TILE       = 128  (row 8, col 0)  — grass — walkable
 */

import * as fs from "fs";
import * as path from "path";

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const COLS = 16;
const TILE_SIZE = 32;

// LocalTileId constants (0-based)
const GROUND_TILE = 0;
const PATH_TILE = 1;
const BUILDING_WALL = 16;
const WATER_TILE = 32;
const PALM_TREE = 48;
const SCAFFOLDING = 64;
const SAND_TILE = 80;
const DOCK_TILE = 96;
const PLAZA_TILE = 112;
const GRASS_TILE = 128;

// GID = firstgid (1) + localId
const FIRST_GID = 1;
const gid = (localId: number) => FIRST_GID + localId;

// Map dimensions
const MAP_WIDTH = 50;
const MAP_HEIGHT = 40;
const TOTAL_TILES = MAP_WIDTH * MAP_HEIGHT; // 2000

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function idx(x: number, y: number): number {
  return x + y * MAP_WIDTH;
}

function fillRect(
  data: number[],
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  tileGid: number
) {
  for (let y = y1; y <= y2; y++) {
    for (let x = x1; x <= x2; x++) {
      if (x >= 0 && x < MAP_WIDTH && y >= 0 && y < MAP_HEIGHT) {
        data[idx(x, y)] = tileGid;
      }
    }
  }
}

function setTile(data: number[], x: number, y: number, tileGid: number) {
  if (x >= 0 && x < MAP_WIDTH && y >= 0 && y < MAP_HEIGHT) {
    data[idx(x, y)] = tileGid;
  }
}

// ---------------------------------------------------------------------------
// Generate Ground layer
// ---------------------------------------------------------------------------

function buildGroundLayer(): number[] {
  const data = new Array(TOTAL_TILES).fill(gid(GRASS_TILE));

  // Main street spine (paved path)
  fillRect(data, 22, 0, 28, 39, gid(PATH_TILE));

  // Dock area (pier/boardwalk tiles)
  fillRect(data, 18, 34, 32, 39, gid(DOCK_TILE));

  // Beach sand strip (x=38-41)
  fillRect(data, 38, 5, 41, 39, gid(SAND_TILE));

  // Ocean (x=42-49) — water tile
  fillRect(data, 42, 0, 49, 39, gid(WATER_TILE));

  // Central plaza (x=20-35, y=16-22)
  fillRect(data, 20, 16, 35, 22, gid(PLAZA_TILE));

  return data;
}

// ---------------------------------------------------------------------------
// Generate Above layer (building shells + trees)
// ---------------------------------------------------------------------------

function buildAboveLayer(): number[] {
  const data = new Array(TOTAL_TILES).fill(0); // 0 = empty (transparent)

  // Ocean visual fill (x=42-49) — water tiles
  fillRect(data, 42, 0, 49, 39, gid(WATER_TILE));

  // -------------------------------------------------------------------------
  // Buildings (facade tiles)
  // -------------------------------------------------------------------------

  // Thoven HQ: x=10-17, y=14-22 (largest building, west of main street)
  fillRect(data, 10, 14, 17, 22, gid(BUILDING_WALL));

  // Starbucks Café: x=29-34, y=24-28 (east of main street, south)
  fillRect(data, 29, 24, 34, 28, gid(BUILDING_WALL));

  // Chalk Lab: x=18-22, y=8-13 (under construction — scaffolding overlay)
  fillRect(data, 18, 8, 22, 13, gid(BUILDING_WALL));
  // Scaffolding overlay on Chalk Lab (top rows)
  fillRect(data, 18, 8, 22, 9, gid(SCAFFOLDING));

  // Andres's House: x=6-12, y=16-22 (northwest behind Thoven)
  fillRect(data, 6, 16, 12, 22, gid(BUILDING_WALL));

  // Engineering Lab: x=38-44, y=2-8 (northeast, hidden)
  fillRect(data, 38, 2, 44, 8, gid(BUILDING_WALL));

  // GitHub Library: x=38-44, y=12-18 (east side, beach-facing)
  fillRect(data, 38, 12, 44, 18, gid(BUILDING_WALL));

  // Record Shop: x=29-33, y=10-14 (east of main street, north)
  fillRect(data, 29, 10, 33, 14, gid(BUILDING_WALL));

  // Ventanita: x=23-27, y=26-29 (main street, south)
  fillRect(data, 23, 26, 27, 29, gid(BUILDING_WALL));

  // VC Office: x=28-33, y=16-20 (central plaza east — under construction)
  fillRect(data, 28, 16, 33, 20, gid(BUILDING_WALL));
  // Scaffolding overlay on VC Office
  fillRect(data, 28, 16, 33, 17, gid(SCAFFOLDING));

  // Music Room: x=3-8, y=10-14 (behind Andres house, basement entrance)
  fillRect(data, 3, 10, 8, 14, gid(BUILDING_WALL));

  // Idea Graveyard: x=2-10, y=24-32 (southwest, overgrown)
  fillRect(data, 2, 24, 10, 32, gid(BUILDING_WALL));

  // Lookout Hill: x=20-30, y=0-6 (heights, top-center)
  fillRect(data, 20, 0, 30, 6, gid(BUILDING_WALL));

  // Bulletin Board: x=23-25, y=30-31 (main street, near south)
  fillRect(data, 23, 30, 25, 31, gid(BUILDING_WALL));

  // -------------------------------------------------------------------------
  // Palm trees (sparse — zone-appropriate positions)
  // -------------------------------------------------------------------------

  // Main street edges (x=21 west side, x=29 east side, sparse y=5-35)
  for (let y = 5; y <= 35; y += 4) {
    setTile(data, 21, y, gid(PALM_TREE));
    setTile(data, 29, y, gid(PALM_TREE));
  }

  // Plaza border (x=20-35, y=15 sparse)
  for (let x = 20; x <= 35; x += 5) {
    setTile(data, x, 15, gid(PALM_TREE));
  }

  // West side scattered (x=5-18, y=5-30 sparse, avoid building footprints)
  const westPalmPositions = [
    [5, 5], [13, 5], [5, 12], [14, 12], [5, 25], [14, 25], [5, 33], [15, 33],
    [18, 5], [18, 12], [18, 25], [18, 33],
  ];
  for (const [x, y] of westPalmPositions) {
    setTile(data, x, y, gid(PALM_TREE));
  }

  // Beach strip border (x=37-38, y=5-32 sparse)
  for (let y = 5; y <= 32; y += 4) {
    setTile(data, 37, y, gid(PALM_TREE));
    setTile(data, 38, y, gid(PALM_TREE));
  }

  return data;
}

// ---------------------------------------------------------------------------
// Generate Collision layer
// ---------------------------------------------------------------------------

function buildCollisionLayer(): number[] {
  const data = new Array(TOTAL_TILES).fill(0); // 0 = walkable by default

  const BLOCK = gid(BUILDING_WALL); // use building wall GID as collision marker

  // -------------------------------------------------------------------------
  // Buildings (all footprints blocked)
  // -------------------------------------------------------------------------
  fillRect(data, 10, 14, 17, 22, BLOCK); // Thoven HQ
  fillRect(data, 29, 24, 34, 28, BLOCK); // Starbucks
  fillRect(data, 18, 8, 22, 13, BLOCK);  // Chalk Lab
  fillRect(data, 6, 16, 12, 22, BLOCK);  // Andres's House
  fillRect(data, 38, 2, 44, 8, BLOCK);   // Engineering Lab
  fillRect(data, 38, 12, 44, 18, BLOCK); // GitHub Library
  fillRect(data, 29, 10, 33, 14, BLOCK); // Record Shop
  fillRect(data, 23, 26, 27, 29, BLOCK); // Ventanita
  fillRect(data, 28, 16, 33, 20, BLOCK); // VC Office
  fillRect(data, 3, 10, 8, 14, BLOCK);   // Music Room
  fillRect(data, 2, 24, 10, 32, BLOCK);  // Idea Graveyard
  fillRect(data, 20, 0, 30, 6, BLOCK);   // Lookout Hill
  fillRect(data, 23, 30, 25, 31, BLOCK); // Bulletin Board

  // Ocean east edge (x=42-49, all y)
  fillRect(data, 42, 0, 49, 39, BLOCK);

  // Palm tree positions (match Above layer placement)
  for (let y = 5; y <= 35; y += 4) {
    setTile(data, 21, y, BLOCK);
    setTile(data, 29, y, BLOCK);
  }
  for (let x = 20; x <= 35; x += 5) {
    setTile(data, x, 15, BLOCK);
  }
  const westPalmPositions = [
    [5, 5], [13, 5], [5, 12], [14, 12], [5, 25], [14, 25], [5, 33], [15, 33],
    [18, 5], [18, 12], [18, 25], [18, 33],
  ];
  for (const [x, y] of westPalmPositions) {
    setTile(data, x, y, BLOCK);
  }
  for (let y = 5; y <= 32; y += 4) {
    setTile(data, 37, y, BLOCK);
    setTile(data, 38, y, BLOCK);
  }

  // -------------------------------------------------------------------------
  // Dock spawn zone (x=24-26, y=37-39) — EXPLICITLY WALKABLE
  // -------------------------------------------------------------------------
  for (let y = 37; y <= 39; y++) {
    for (let x = 24; x <= 26; x++) {
      setTile(data, x, y, 0); // walkable
    }
  }

  return data;
}

// ---------------------------------------------------------------------------
// Build ge_collide tile properties for tileset
// ---------------------------------------------------------------------------

function buildTileProperties() {
  // Blocking local tile IDs
  const blockingIds = [
    BUILDING_WALL,
    WATER_TILE,
    PALM_TREE,
    SCAFFOLDING,
  ];

  return blockingIds.map((id) => ({
    id,
    properties: [
      {
        name: "ge_collide",
        type: "bool",
        value: true,
      },
    ],
  }));
}

// ---------------------------------------------------------------------------
// Generate tileset-catalog.txt
// ---------------------------------------------------------------------------

const CATALOG = `# Tileset Catalog — modern-exteriors-32.png
# Placeholder tileset for prototype. Replace with LimeZu Modern Exteriors in Phase 9.
#
# PNG layout: 16 columns × 9 rows (512px × 288px), 32×32 tiles per cell
# LocalTileId = row * 16 + column (0-based)
#
# Category         | LocalTileId | GID (firstgid=1) | Walkable | Notes
# ------------------|-------------|------------------|----------|------
# Ground/grass      |     0       |       1          |   YES    | Base terrain fill
# Path/paved        |     1       |       2          |   YES    | Main street, walkways
# Building wall     |    16       |      17          |    NO    | ge_collide:true — facades
# Water/ocean       |    32       |      33          |    NO    | ge_collide:true — east boundary
# Palm tree         |    48       |      49          |    NO    | ge_collide:true — decorative blocking
# Scaffolding       |    64       |      65          |    NO    | ge_collide:true — under construction
# Beach sand        |    80       |      81          |   YES    | x=38-41 strip
# Dock/pier         |    96       |      97          |   YES    | South dock area
# Plaza paved       |   112       |     113          |   YES    | Central plaza area
# Grass (alt)       |   128       |     129          |   YES    | West side / heights
#
# Zone → GID mapping used in overworld.json:
#   Ground layer default:  GID 129 (GRASS)
#   Main street spine:     GID   2 (PATH)
#   Dock area:             GID  97 (DOCK)
#   Beach strip x=38-41:  GID  81 (SAND)
#   Ocean x=42-49:        GID  33 (WATER)
#   Central plaza:        GID 113 (PLAZA)
#   Building facades:     GID  17 (BUILDING_WALL)
#   Palm trees:           GID  49 (PALM_TREE)
#   Scaffolding overlay:  GID  65 (SCAFFOLDING)
#
# To replace with real LimeZu assets (Phase 9):
#   1. Download Modern Exteriors 32x32 spritesheet from itch.io
#   2. Count actual PNG columns (imageWidth/32)
#   3. Update localTileId values in this catalog
#   4. Run scripts/generate-map.ts with updated constants
#   5. Commit updated overworld.json + tileset-catalog.txt
`;

// ---------------------------------------------------------------------------
// Assemble Tiled JSON
// ---------------------------------------------------------------------------

function buildMapJson() {
  const groundData = buildGroundLayer();
  const aboveData = buildAboveLayer();
  const collisionData = buildCollisionLayer();

  // Placeholder tileset dimensions: 16 cols × 9 rows = 144 tiles
  const TILESET_COLUMNS = 16;
  const TILESET_ROWS = 9;
  const TILESET_WIDTH = TILESET_COLUMNS * TILE_SIZE;   // 512
  const TILESET_HEIGHT = TILESET_ROWS * TILE_SIZE;     // 288
  const TILESET_TILECOUNT = TILESET_COLUMNS * TILESET_ROWS; // 144

  return {
    version: "1.6",
    tiledversion: "1.11.0",
    type: "map",
    orientation: "orthogonal",
    renderorder: "right-down",
    width: MAP_WIDTH,
    height: MAP_HEIGHT,
    tilewidth: TILE_SIZE,
    tileheight: TILE_SIZE,
    infinite: false,
    nextlayerid: 4,
    nextobjectid: 1,
    tilesets: [
      {
        firstgid: FIRST_GID,
        name: "modern-exteriors",
        image: "../../assets/tilesets/modern-exteriors-32.png",
        imagewidth: TILESET_WIDTH,
        imageheight: TILESET_HEIGHT,
        tilewidth: TILE_SIZE,
        tileheight: TILE_SIZE,
        tilecount: TILESET_TILECOUNT,
        columns: TILESET_COLUMNS,
        margin: 0,
        spacing: 0,
        tiles: buildTileProperties(),
      },
    ],
    layers: [
      {
        id: 1,
        name: "Ground",
        type: "tilelayer",
        visible: true,
        opacity: 1,
        x: 0,
        y: 0,
        width: MAP_WIDTH,
        height: MAP_HEIGHT,
        data: groundData,
      },
      {
        id: 2,
        name: "Above",
        type: "tilelayer",
        visible: true,
        opacity: 1,
        x: 0,
        y: 0,
        width: MAP_WIDTH,
        height: MAP_HEIGHT,
        data: aboveData,
      },
      {
        id: 3,
        name: "Collision",
        type: "tilelayer",
        visible: false,
        opacity: 1,
        x: 0,
        y: 0,
        width: MAP_WIDTH,
        height: MAP_HEIGHT,
        data: collisionData,
      },
    ],
  };
}

// ---------------------------------------------------------------------------
// Generate placeholder tileset PNG (16 cols × 9 rows, distinct colors per row)
// ---------------------------------------------------------------------------

function generatePlaceholderPng(): Buffer {
  const TILESET_COLUMNS = 16;
  const TILESET_ROWS = 9;
  const IMG_WIDTH = TILESET_COLUMNS * TILE_SIZE;
  const IMG_HEIGHT = TILESET_ROWS * TILE_SIZE;

  // Row color palette (RGBA) — each row gets a distinct color representing terrain type
  const rowColors: [number, number, number, number][] = [
    [120, 180, 80, 255],   // Row 0: ground/grass — green
    [160, 140, 100, 255],  // Row 1: building wall — tan/brown
    [60, 120, 200, 255],   // Row 2: water — blue
    [60, 160, 60, 255],    // Row 3: palm tree — dark green
    [180, 140, 60, 255],   // Row 4: scaffolding — yellow-brown
    [220, 200, 150, 255],  // Row 5: sand — sandy beige
    [140, 100, 60, 255],   // Row 6: dock — wooden brown
    [180, 170, 160, 255],  // Row 7: plaza — grey
    [100, 160, 70, 255],   // Row 8: grass alt — lighter green
  ];

  // PNG format: 8-byte signature + IHDR + IDAT + IEND chunks
  // Build raw RGBA pixel data
  const pixels = Buffer.alloc(IMG_WIDTH * IMG_HEIGHT * 4);

  for (let row = 0; row < TILESET_ROWS; row++) {
    const [r, g, b, a] = rowColors[row];
    for (let tileY = 0; tileY < TILE_SIZE; tileY++) {
      for (let col = 0; col < TILESET_COLUMNS; col++) {
        for (let tileX = 0; tileX < TILE_SIZE; tileX++) {
          const pixelX = col * TILE_SIZE + tileX;
          const pixelY = row * TILE_SIZE + tileY;
          const pixelIdx = (pixelY * IMG_WIDTH + pixelX) * 4;

          // Draw border to distinguish tiles (1px dark border)
          const onBorder = tileX === 0 || tileX === TILE_SIZE - 1 || tileY === 0 || tileY === TILE_SIZE - 1;
          if (onBorder) {
            pixels[pixelIdx] = 0;
            pixels[pixelIdx + 1] = 0;
            pixels[pixelIdx + 2] = 0;
            pixels[pixelIdx + 3] = 255;
          } else {
            pixels[pixelIdx] = r;
            pixels[pixelIdx + 1] = g;
            pixels[pixelIdx + 2] = b;
            pixels[pixelIdx + 3] = a;
          }
        }
      }
    }
  }

  // Build PNG manually (no external deps)
  // deflateSync produces zlib-wrapped deflate (RFC 1950) required by PNG IDAT.
  // deflateRawSync (raw RFC 1951) lacks the CMF+FLG header + Adler-32 trailer
  // that WebGL's PNG decoder requires — it rejects the image with INVALID_VALUE.
  const { deflateSync } = require("zlib");

  function crc32(buf: Buffer): number {
    const table = (() => {
      const t = new Uint32Array(256);
      for (let n = 0; n < 256; n++) {
        let c = n;
        for (let k = 0; k < 8; k++) {
          c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
        }
        t[n] = c;
      }
      return t;
    })();
    let crc = 0xffffffff;
    for (let i = 0; i < buf.length; i++) {
      crc = table[(crc ^ buf[i]) & 0xff] ^ (crc >>> 8);
    }
    return (crc ^ 0xffffffff) >>> 0;
  }

  function chunk(type: string, data: Buffer): Buffer {
    const typeBuf = Buffer.from(type, "ascii");
    const lenBuf = Buffer.allocUnsafe(4);
    lenBuf.writeUInt32BE(data.length, 0);
    const crcInput = Buffer.concat([typeBuf, data]);
    const crcBuf = Buffer.allocUnsafe(4);
    crcBuf.writeUInt32BE(crc32(crcInput), 0);
    return Buffer.concat([lenBuf, typeBuf, data, crcBuf]);
  }

  // IHDR
  const ihdr = Buffer.allocUnsafe(13);
  ihdr.writeUInt32BE(IMG_WIDTH, 0);
  ihdr.writeUInt32BE(IMG_HEIGHT, 4);
  ihdr[8] = 8;  // bit depth
  ihdr[9] = 2;  // color type: RGB (we'll convert from RGBA)
  ihdr[10] = 0; ihdr[11] = 0; ihdr[12] = 0;

  // IDAT: filter byte (0) + RGB rows
  const rawRows = Buffer.alloc(IMG_HEIGHT * (1 + IMG_WIDTH * 3));
  for (let y = 0; y < IMG_HEIGHT; y++) {
    rawRows[y * (1 + IMG_WIDTH * 3)] = 0; // filter type None
    for (let x = 0; x < IMG_WIDTH; x++) {
      const src = (y * IMG_WIDTH + x) * 4;
      const dst = y * (1 + IMG_WIDTH * 3) + 1 + x * 3;
      rawRows[dst] = pixels[src];
      rawRows[dst + 1] = pixels[src + 1];
      rawRows[dst + 2] = pixels[src + 2];
    }
  }

  const compressed = deflateSync(rawRows, { level: 6 });

  // Patch IHDR to RGB (already set above, color type 2 = RGB)
  const pngSig = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
  return Buffer.concat([
    pngSig,
    chunk("IHDR", ihdr),
    chunk("IDAT", compressed),
    chunk("IEND", Buffer.alloc(0)),
  ]);
}

// ---------------------------------------------------------------------------
// Write files
// ---------------------------------------------------------------------------

const ROOT = path.resolve(__dirname, "..");

function main() {
  // 1. Generate and write map JSON
  const mapJson = buildMapJson();
  const mapPath = path.join(ROOT, "public/assets/maps/overworld.json");
  fs.writeFileSync(mapPath, JSON.stringify(mapJson, null, 2));
  console.log(`Written: ${mapPath}`);

  // 2. Generate placeholder tileset PNG
  const pngPath = path.join(ROOT, "public/assets/tilesets/modern-exteriors-32.png");
  const pngData = generatePlaceholderPng();
  fs.writeFileSync(pngPath, pngData);
  console.log(`Written: ${pngPath} (${pngData.length} bytes)`);

  // 3. Write tileset catalog
  const catalogPath = path.join(ROOT, "public/assets/maps/tileset-catalog.txt");
  fs.writeFileSync(catalogPath, CATALOG);
  console.log(`Written: ${catalogPath}`);

  // Validate
  const loaded = JSON.parse(fs.readFileSync(mapPath, "utf8"));
  console.log(`\nValidation:`);
  console.log(`  Dimensions: ${loaded.width}x${loaded.height}`);
  console.log(`  Layers: ${loaded.layers.map((l: { name: string }) => l.name).join(", ")}`);
  console.log(`  Layer data lengths: ${loaded.layers.map((l: { data: number[] }) => l.data.length).join(", ")}`);
  console.log(`  Tileset name: ${loaded.tilesets[0].name}`);
  console.log(`  ge_collide tile count: ${loaded.tilesets[0].tiles.length}`);

  // Check dock spawn walkable
  const collisionData: number[] = loaded.layers[2].data;
  let dockOk = true;
  for (let y = 37; y <= 39; y++) {
    for (let x = 24; x <= 26; x++) {
      if (collisionData[x + y * 50] !== 0) {
        dockOk = false;
        console.error(`  ERROR: dock spawn x=${x} y=${y} is blocked!`);
      }
    }
  }
  if (dockOk) console.log(`  Dock spawn zone: walkable (OK)`);

  // Check ocean blocked
  let oceanOk = true;
  for (let y = 0; y < 40; y++) {
    for (let x = 42; x <= 49; x++) {
      if (collisionData[x + y * 50] === 0) {
        oceanOk = false;
        console.error(`  ERROR: ocean tile x=${x} y=${y} is NOT blocked!`);
        break;
      }
    }
    if (!oceanOk) break;
  }
  if (oceanOk) console.log(`  Ocean strip x=42-49: fully blocked (OK)`);

  // Check no GID=0 in main street walkable corridor
  const groundData: number[] = loaded.layers[0].data;
  let streetOk = true;
  for (let y = 5; y <= 35; y++) {
    for (let x = 22; x <= 28; x++) {
      if (groundData[x + y * 50] === 0) {
        streetOk = false;
        console.error(`  ERROR: Ground GID=0 at x=${x} y=${y}!`);
        break;
      }
    }
    if (!streetOk) break;
  }
  if (streetOk) console.log(`  Main street ground tiles: all non-zero (OK)`);

  console.log(`\nDone.`);
}

main();
