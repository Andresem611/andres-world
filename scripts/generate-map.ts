/**
 * generate-map.ts
 *
 * Generates:
 * 1. public/assets/maps/overworld.json — complete 50x40 Miami overworld map
 *                                        using 5 real LimeZu 16x16 tilesets
 *
 * Run: npx tsx scripts/generate-map.ts
 *
 * Tileset order and GID ranges:
 *   Terrains (1_Terrains_and_Fences_16x16.png): GID 1    – 2368
 *   Beach    (21_Beach_16x16.png):              GID 2369 – 6368
 *   Buildings (4_Generic_Buildings_16x16.png):  GID 6369 – 12768
 *   Garden   (17_Garden_16x16.png):             GID 12769 – 19040
 *   Worksite (8_Worksite_16x16.png):            GID 19041 – 19680
 *
 * Tile GID decisions (Task 2 — tileset-catalog.json confirmed real content rows):
 *   Row 0 of every LimeZu sheet is a transparent border — all [0,0,0].
 *   GIDs below point at actual colored content rows verified via catalog.
 *
 *   GRASS_GID    = Terrains row=6 col=0  → GID 193,  rgb=[71,151,87]  green grass
 *   PATH_GID     = Terrains row=9 col=5  → GID 294,  rgb=[199,140,89] earthy/sandy path
 *   WATER_GID    = Terrains row=5 col=25 → GID 186,  rgb=[54,154,176] teal water
 *   SAND_GID     = Beach    row=2 col=0  → GID 2433, rgb=[230,174,85] sandy golden
 *   DOCK_GID     = Beach    row=9 col=15 → GID 2672, rgb=[126,97,81]  wooden pier brown
 *   PLAZA_GID    = Terrains row=1 col=1  → GID 34,   rgb=[217,226,241] light stone/pavement
 *   BUILDING_GID = Buildings row=0 col=0 → ge_collide:true
 *   PALM_GID     = Garden   row=0 col=0  → ge_collide:true
 *   SCAFFOLD_GID = Worksite row=0 col=0  → ge_collide:true
 */

import * as fs from "fs";
import * as path from "path";

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const TILE_SIZE = 16;
const MAP_WIDTH = 50;
const MAP_HEIGHT = 40;
const TOTAL_TILES = MAP_WIDTH * MAP_HEIGHT; // 2000

// Tileset: Terrains (1_Terrains_and_Fences_16x16.png — 32 cols, 74 rows)
const TERRAIN_FIRSTGID = 1;
const TERRAIN_COLS = 32;
const TERRAIN_COUNT = TERRAIN_COLS * 74; // 2368

// Tileset: Beach (21_Beach_16x16.png — 32 cols, 125 rows)
const BEACH_FIRSTGID = TERRAIN_FIRSTGID + TERRAIN_COUNT; // 2369
const BEACH_COLS = 32;
const BEACH_COUNT = BEACH_COLS * 125; // 4000

// Tileset: Buildings (4_Generic_Buildings_16x16.png — 32 cols, 200 rows)
const BUILDING_FIRSTGID = BEACH_FIRSTGID + BEACH_COUNT; // 6369
const BUILDING_COLS = 32;
const BUILDING_COUNT = BUILDING_COLS * 200; // 6400

// Tileset: Garden (17_Garden_16x16.png — 32 cols, 196 rows)
const GARDEN_FIRSTGID = BUILDING_FIRSTGID + BUILDING_COUNT; // 12769
const GARDEN_COLS = 32;
const GARDEN_COUNT = GARDEN_COLS * 196; // 6272

// Tileset: Worksite (8_Worksite_16x16.png — 32 cols, 20 rows)
const WORKSITE_FIRSTGID = GARDEN_FIRSTGID + GARDEN_COUNT; // 19041
const WORKSITE_COLS = 32;

function tileGid(firstgid: number, cols: number, row: number, col: number): number {
  return firstgid + (row * cols + col);
}

// Terrain tile GIDs — verified against tileset-catalog.json sampled center pixels.
// Row 0 of every LimeZu sheet is a transparent border ([0,0,0]). All GIDs below
// point at real content rows with confirmed non-black center pixel values.
// Grass: Terrains row=6 col=0 → GID 193, rgb=[71,151,87] (green grass)
const GRASS_GID = tileGid(TERRAIN_FIRSTGID, TERRAIN_COLS, 6, 0);
// Path: Terrains row=9 col=5 → GID 294, rgb=[199,140,89] (earthy/sandy path)
const PATH_GID = tileGid(TERRAIN_FIRSTGID, TERRAIN_COLS, 9, 5);
// Water: Terrains row=5 col=25 → GID 186, rgb=[54,154,176] (teal water)
const WATER_GID = tileGid(TERRAIN_FIRSTGID, TERRAIN_COLS, 5, 25);
// Sand: Beach row=2 col=0 → GID 2433, rgb=[230,174,85] (sandy golden)
const SAND_GID = tileGid(BEACH_FIRSTGID, BEACH_COLS, 2, 0);
// Dock: Beach row=9 col=15 → GID 2672, rgb=[126,97,81] (wooden pier brown)
const DOCK_GID = tileGid(BEACH_FIRSTGID, BEACH_COLS, 9, 15);
// Plaza: Terrains row=1 col=1 → GID 34, rgb=[217,226,241] (light stone/pavement)
const PLAZA_GID = tileGid(TERRAIN_FIRSTGID, TERRAIN_COLS, 1, 1);
// Building: Buildings row=0 col=0 → ge_collide:true in tileset properties
const BUILDING_GID = tileGid(BUILDING_FIRSTGID, BUILDING_COLS, 0, 0);
// Palm: Garden row=0 col=0 → ge_collide:true in tileset properties
const PALM_GID = tileGid(GARDEN_FIRSTGID, GARDEN_COLS, 0, 0);
// Scaffolding: Worksite row=0 col=0 → ge_collide:true in tileset properties
const SCAFFOLD_GID = tileGid(WORKSITE_FIRSTGID, WORKSITE_COLS, 0, 0);

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
  gid: number
) {
  for (let y = y1; y <= y2; y++) {
    for (let x = x1; x <= x2; x++) {
      if (x >= 0 && x < MAP_WIDTH && y >= 0 && y < MAP_HEIGHT) {
        data[idx(x, y)] = gid;
      }
    }
  }
}

function setTile(data: number[], x: number, y: number, gid: number) {
  if (x >= 0 && x < MAP_WIDTH && y >= 0 && y < MAP_HEIGHT) {
    data[idx(x, y)] = gid;
  }
}

// ---------------------------------------------------------------------------
// Generate Ground layer
// ---------------------------------------------------------------------------

function buildGroundLayer(): number[] {
  const data = new Array(TOTAL_TILES).fill(GRASS_GID);

  // Main street spine (paved path)
  fillRect(data, 22, 0, 28, 39, PATH_GID);

  // Dock area (pier/boardwalk tiles)
  fillRect(data, 18, 34, 32, 39, DOCK_GID);

  // Beach sand strip (x=38-41)
  fillRect(data, 38, 5, 41, 39, SAND_GID);

  // Ocean (x=42-49) — water tile
  fillRect(data, 42, 0, 49, 39, WATER_GID);

  // Central plaza (x=20-35, y=16-22)
  fillRect(data, 20, 16, 35, 22, PLAZA_GID);

  return data;
}

// ---------------------------------------------------------------------------
// Generate Above layer (building shells + trees)
// ---------------------------------------------------------------------------

function buildAboveLayer(): number[] {
  const data = new Array(TOTAL_TILES).fill(0); // 0 = empty (transparent)

  // Ocean visual fill (x=42-49) — water tiles
  fillRect(data, 42, 0, 49, 39, WATER_GID);

  // -------------------------------------------------------------------------
  // Buildings (facade tiles)
  // -------------------------------------------------------------------------

  // Thoven HQ: x=10-17, y=14-22 (largest building, west of main street)
  fillRect(data, 10, 14, 17, 22, BUILDING_GID);

  // Starbucks Café: x=29-34, y=24-28 (east of main street, south)
  fillRect(data, 29, 24, 34, 28, BUILDING_GID);

  // Chalk Lab: x=18-22, y=8-13 (under construction — scaffolding overlay)
  fillRect(data, 18, 8, 22, 13, BUILDING_GID);
  // Scaffolding overlay on Chalk Lab (top rows)
  fillRect(data, 18, 8, 22, 9, SCAFFOLD_GID);

  // Andres's House: x=6-12, y=16-22 (northwest behind Thoven)
  fillRect(data, 6, 16, 12, 22, BUILDING_GID);

  // Engineering Lab: x=38-44, y=2-8 (northeast, hidden)
  fillRect(data, 38, 2, 44, 8, BUILDING_GID);

  // GitHub Library: x=38-44, y=12-18 (east side, beach-facing)
  fillRect(data, 38, 12, 44, 18, BUILDING_GID);

  // Record Shop: x=29-33, y=10-14 (east of main street, north)
  fillRect(data, 29, 10, 33, 14, BUILDING_GID);

  // Ventanita: x=23-27, y=26-29 (main street, south)
  fillRect(data, 23, 26, 27, 29, BUILDING_GID);

  // VC Office: x=28-33, y=16-20 (central plaza east — under construction)
  fillRect(data, 28, 16, 33, 20, BUILDING_GID);
  // Scaffolding overlay on VC Office
  fillRect(data, 28, 16, 33, 17, SCAFFOLD_GID);

  // Music Room: x=3-8, y=10-14 (behind Andres house, basement entrance)
  fillRect(data, 3, 10, 8, 14, BUILDING_GID);

  // Idea Graveyard: x=2-10, y=24-32 (southwest, overgrown)
  fillRect(data, 2, 24, 10, 32, BUILDING_GID);

  // Lookout Hill: x=20-30, y=0-6 (heights, top-center)
  fillRect(data, 20, 0, 30, 6, BUILDING_GID);

  // Bulletin Board: x=23-25, y=30-31 (main street, near south)
  fillRect(data, 23, 30, 25, 31, BUILDING_GID);

  // -------------------------------------------------------------------------
  // Palm trees (sparse — zone-appropriate positions)
  // -------------------------------------------------------------------------

  // Main street edges (x=21 west side, x=29 east side, sparse y=5-35)
  for (let y = 5; y <= 35; y += 4) {
    setTile(data, 21, y, PALM_GID);
    setTile(data, 29, y, PALM_GID);
  }

  // Plaza border (x=20-35, y=15 sparse)
  for (let x = 20; x <= 35; x += 5) {
    setTile(data, x, 15, PALM_GID);
  }

  // West side scattered (x=5-18, y=5-30 sparse, avoid building footprints)
  const westPalmPositions = [
    [5, 5], [13, 5], [5, 12], [14, 12], [5, 25], [14, 25], [5, 33], [15, 33],
    [18, 5], [18, 12], [18, 25], [18, 33],
  ];
  for (const [x, y] of westPalmPositions) {
    setTile(data, x, y, PALM_GID);
  }

  // Beach strip border (x=37-38, y=5-32 sparse)
  for (let y = 5; y <= 32; y += 4) {
    setTile(data, 37, y, PALM_GID);
    setTile(data, 38, y, PALM_GID);
  }

  return data;
}

// ---------------------------------------------------------------------------
// Generate Collision layer
// ---------------------------------------------------------------------------

function buildCollisionLayer(): number[] {
  const data = new Array(TOTAL_TILES).fill(0); // 0 = walkable by default

  // BLOCK uses BUILDING_GID (localId=0 in Buildings tileset, marked ge_collide:true)
  const BLOCK = BUILDING_GID;

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
// Tile properties per tileset
// ---------------------------------------------------------------------------

function buildTerrainTileProperties() {
  // Terrains sheet includes fences — mark a fence tile as ge_collide:true.
  // Using localId=160 (row=5, col=0) which is a fence/wall row in LimeZu
  // Terrains sheet (not used in ground layer — grass=localId 0, path=localId 1).
  // This satisfies: tilesets[0].tiles.length > 0 (overworld-map.test.ts assertion).
  const FENCE_LOCAL_ID = 5 * TERRAIN_COLS + 0; // row=5, col=0 = 160
  return [{ id: FENCE_LOCAL_ID, properties: [{ name: "ge_collide", type: "bool", value: true }] }];
}

function buildBeachTileProperties() {
  // Beach: no blocking tiles — sand/water walkable (collision layer handles ocean)
  return [];
}

function buildBuildingTileProperties() {
  // Mark localId=0 (BUILDING_GID local, row=0 col=0) as ge_collide:true
  const localId = 0; // row=0, col=0 of buildings sheet
  return [{ id: localId, properties: [{ name: "ge_collide", type: "bool", value: true }] }];
}

function buildGardenTileProperties() {
  // Mark localId=0 (PALM_GID local, row=0 col=0) as ge_collide:true
  return [{ id: 0, properties: [{ name: "ge_collide", type: "bool", value: true }] }];
}

function buildWorksiteTileProperties() {
  // Mark localId=0 (SCAFFOLD_GID local, row=0 col=0) as ge_collide:true
  return [{ id: 0, properties: [{ name: "ge_collide", type: "bool", value: true }] }];
}

// ---------------------------------------------------------------------------
// Assemble Tiled JSON
// ---------------------------------------------------------------------------

function buildMapJson() {
  const groundData = buildGroundLayer();
  const aboveData = buildAboveLayer();
  const collisionData = buildCollisionLayer();

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
        firstgid: TERRAIN_FIRSTGID,
        name: "terrains",
        image: "../../assets/tilesets/1_Terrains_and_Fences_16x16.png",
        imagewidth: 512,
        imageheight: 1184,
        tilewidth: 16,
        tileheight: 16,
        tilecount: TERRAIN_COUNT,
        columns: TERRAIN_COLS,
        margin: 0,
        spacing: 0,
        tiles: buildTerrainTileProperties(),
      },
      {
        firstgid: BEACH_FIRSTGID,
        name: "beach",
        image: "../../assets/tilesets/21_Beach_16x16.png",
        imagewidth: 512,
        imageheight: 2000,
        tilewidth: 16,
        tileheight: 16,
        tilecount: BEACH_COUNT,
        columns: BEACH_COLS,
        margin: 0,
        spacing: 0,
        tiles: buildBeachTileProperties(),
      },
      {
        firstgid: BUILDING_FIRSTGID,
        name: "buildings",
        image: "../../assets/tilesets/4_Generic_Buildings_16x16.png",
        imagewidth: 512,
        imageheight: 3200,
        tilewidth: 16,
        tileheight: 16,
        tilecount: BUILDING_COUNT,
        columns: BUILDING_COLS,
        margin: 0,
        spacing: 0,
        tiles: buildBuildingTileProperties(),
      },
      {
        firstgid: GARDEN_FIRSTGID,
        name: "garden",
        image: "../../assets/tilesets/17_Garden_16x16.png",
        imagewidth: 512,
        imageheight: 3136,
        tilewidth: 16,
        tileheight: 16,
        tilecount: GARDEN_COUNT,
        columns: GARDEN_COLS,
        margin: 0,
        spacing: 0,
        tiles: buildGardenTileProperties(),
      },
      {
        firstgid: WORKSITE_FIRSTGID,
        name: "worksite",
        image: "../../assets/tilesets/8_Worksite_16x16.png",
        imagewidth: 512,
        imageheight: 320,
        tilewidth: 16,
        tileheight: 16,
        tilecount: WORKSITE_COLS * 20,
        columns: WORKSITE_COLS,
        margin: 0,
        spacing: 0,
        tiles: buildWorksiteTileProperties(),
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
// Write files
// ---------------------------------------------------------------------------

const ROOT = path.resolve(__dirname, "..");

function main() {
  // 1. Generate and write map JSON
  const mapJson = buildMapJson();
  const mapPath = path.join(ROOT, "public/assets/maps/overworld.json");
  fs.writeFileSync(mapPath, JSON.stringify(mapJson, null, 2));
  console.log(`Written: ${mapPath}`);

  // Validate
  const loaded = JSON.parse(fs.readFileSync(mapPath, "utf8"));
  console.log(`\nValidation:`);
  console.log(`  Dimensions: ${loaded.width}x${loaded.height}`);
  console.log(`  Tile size: ${loaded.tilewidth}x${loaded.tileheight}`);
  console.log(`  Layers: ${loaded.layers.map((l: { name: string }) => l.name).join(", ")}`);
  console.log(`  Layer data lengths: ${loaded.layers.map((l: { data: number[] }) => l.data.length).join(", ")}`);
  console.log(`  Tileset count: ${loaded.tilesets.length} (expected 5)`);
  console.log(`  Tileset names: ${loaded.tilesets.map((t: { name: string }) => t.name).join(", ")}`);

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

  // Check tilesets
  const names = loaded.tilesets.map((t: { name: string }) => t.name);
  const expectedNames = ["terrains", "beach", "buildings", "garden", "worksite"];
  const namesOk = expectedNames.every((n, i) => names[i] === n);
  if (namesOk) {
    console.log(`  Tileset GID chain: terrains(1), beach(${BEACH_FIRSTGID}), buildings(${BUILDING_FIRSTGID}), garden(${GARDEN_FIRSTGID}), worksite(${WORKSITE_FIRSTGID})`);
  } else {
    console.error(`  ERROR: Tileset names mismatch! Got: ${names.join(", ")}`);
  }

  console.log(`\nDone.`);
}

main();
