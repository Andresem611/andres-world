#!/usr/bin/env node
/**
 * enhance-map.ts — Replace flat BUILDING_GID=7689 blocks with multi-tile building facades
 * 
 * This script automates S07 T02: the Tiled visual design pass.
 * It reads overworld.json, identifies building regions by their BUILDING_GID blocks,
 * and replaces them with real multi-tile facades from the LimeZu tilesets.
 * 
 * Also adds ground texture variety (grass variants, path edges, water transitions).
 * 
 * Usage: npx tsx scripts/enhance-map.ts
 * 
 * The script:
 * 1. Reads current overworld.json
 * 2. Identifies building regions from BUILDING_GID=7689 blocks  
 * 3. Replaces each building with appropriate multi-tile facade tiles
 * 4. Adds ground texture variety
 * 5. Writes enhanced overworld.json back (preserving Collision layer exactly)
 * 6. Adds villas tileset to the tileset chain if not present
 */

import * as fs from "fs";
import * as path from "path";

// ─── Tileset GID helpers ───────────────────────────────────────────────

const TILESETS = {
  terrains: { firstgid: 1, cols: 32 },
  beach:    { firstgid: 2369, cols: 32 },
  buildings:{ firstgid: 6369, cols: 32 },
  garden:   { firstgid: 12769, cols: 32 },
  worksite: { firstgid: 19041, cols: 32 },
  villas:   { firstgid: 19681, cols: 32 },  // 6th tileset (19041 + 640)
} as const;

function gid(tileset: keyof typeof TILESETS, row: number, col: number): number {
  const ts = TILESETS[tileset];
  return ts.firstgid + (row * ts.cols) + col;
}

// Shorthand helpers
const b = (r: number, c: number) => gid("buildings", r, c);
const t = (r: number, c: number) => gid("terrains", r, c);
const be = (r: number, c: number) => gid("beach", r, c);
const v = (r: number, c: number) => gid("villas", r, c);

const BUILDING_GID = 7689;
const GRASS_GID = 193;  // terrains row=6, col=0
const PATH_GID = 294;   // terrains row=9, col=5

// ─── Building facade definitions ───────────────────────────────────────
// Each building gets a facade pattern: a 2D array of GIDs indexed [localY][localX]
// localY=0 is the top of the building footprint, localX=0 is the left edge

interface BuildingDef {
  name: string;
  minX: number; maxX: number;
  minY: number; maxY: number;
  facade: number[][]; // [row][col] of GIDs — sized to fit the building footprint
}

/**
 * Create a repeating facade pattern to fill a given width × height
 * Takes a source pattern (smaller) and tiles/stretches it to fill
 */
function fillFacade(width: number, height: number, pattern: number[][]): number[][] {
  const result: number[][] = [];
  const pH = pattern.length;
  const pW = pattern[0].length;
  
  for (let y = 0; y < height; y++) {
    const row: number[] = [];
    // Map y position to pattern row
    let patY: number;
    if (height <= pH) {
      // Building is shorter than pattern — use bottom portion
      patY = pH - height + y;
    } else {
      // Building is taller — repeat wall rows in the middle
      if (y === 0) patY = 0; // roof top
      else if (y === 1) patY = 1; // roof bottom / upper wall
      else if (y >= height - 2) patY = pH - (height - y); // ground floor
      else patY = 2 + ((y - 2) % (pH - 4)); // repeat middle wall
    }
    patY = Math.max(0, Math.min(patY, pH - 1));
    
    for (let x = 0; x < width; x++) {
      // Map x position to pattern column
      let patX: number;
      if (width <= pW) {
        patX = Math.floor((pW - width) / 2) + x; // center
      } else {
        // Stretch: left edge, repeated middle, right edge
        if (x === 0) patX = 0;
        else if (x >= width - 1) patX = pW - 1;
        else patX = 1 + ((x - 1) % (pW - 2));
      }
      patX = Math.max(0, Math.min(patX, pW - 1));
      
      row.push(pattern[patY][patX]);
    }
    result.push(row);
  }
  return result;
}

// ─── Building facade patterns ──────────────────────────────────────────
// Based on visual inspection of 4_Generic_Buildings_16x16.png

// Yellow/tan modern building (cols 0-5, rows 1-12) — for Thoven HQ
// This is the large polished building at the top of the spritesheet
const THOVEN_PATTERN: number[][] = [
  // Row 0: Roof top (flat gray roof edge)
  [b(1,0), b(1,1), b(1,2), b(1,3), b(1,4), b(1,5)],
  // Row 1: Roof / upper facade  
  [b(2,0), b(2,1), b(2,2), b(2,3), b(2,4), b(2,5)],
  // Row 2: Upper windows
  [b(3,0), b(3,1), b(3,2), b(3,3), b(3,4), b(3,5)],
  // Row 3: Wall
  [b(4,0), b(4,1), b(4,2), b(4,3), b(4,4), b(4,5)],
  // Row 4: Lower windows
  [b(5,0), b(5,1), b(5,2), b(5,3), b(5,4), b(5,5)],
  // Row 5: Wall
  [b(6,0), b(6,1), b(6,2), b(6,3), b(6,4), b(6,5)],
  // Row 6: Ground floor windows
  [b(7,0), b(7,1), b(7,2), b(7,3), b(7,4), b(7,5)],
  // Row 7: Base / entrance
  [b(8,0), b(8,1), b(8,2), b(8,3), b(8,4), b(8,5)],
];

// Brick/brown building variant (rows 14-23, cols 13-18) — for commercial buildings
const COMMERCIAL_PATTERN: number[][] = [
  [b(14,13), b(14,14), b(14,15), b(14,16), b(14,17), b(14,18)],
  [b(15,13), b(15,14), b(15,15), b(15,16), b(15,17), b(15,18)],
  [b(16,13), b(16,14), b(16,15), b(16,16), b(16,17), b(16,18)],
  [b(17,13), b(17,14), b(17,15), b(17,16), b(17,17), b(17,18)],
  [b(18,13), b(18,14), b(18,15), b(18,16), b(18,17), b(18,18)],
];

// Gray/industrial building (rows 82-90, cols 0-5) — for Engineering Lab
const INDUSTRIAL_PATTERN: number[][] = [
  [b(82,0), b(82,1), b(82,2), b(82,3), b(82,4), b(82,5)],
  [b(83,0), b(83,1), b(83,2), b(83,3), b(83,4), b(83,5)],
  [b(84,0), b(84,1), b(84,2), b(84,3), b(84,4), b(84,5)],
  [b(85,0), b(85,1), b(85,2), b(85,3), b(85,4), b(85,5)], 
  [b(86,0), b(86,1), b(86,2), b(86,3), b(86,4), b(86,5)],
  [b(87,0), b(87,1), b(87,2), b(87,3), b(87,4), b(87,5)],
  [b(88,0), b(88,1), b(88,2), b(88,3), b(88,4), b(88,5)],
];

// Darker brick (rows 14-23, cols 26-31) — for second commercial variant 
const COMMERCIAL2_PATTERN: number[][] = [
  [b(14,26), b(14,27), b(14,28), b(14,29), b(14,30), b(14,31)],
  [b(15,26), b(15,27), b(15,28), b(15,29), b(15,30), b(15,31)],
  [b(16,26), b(16,27), b(16,28), b(16,29), b(16,30), b(16,31)],
  [b(17,26), b(17,27), b(17,28), b(17,29), b(17,30), b(17,31)],
  [b(18,26), b(18,27), b(18,28), b(18,29), b(18,30), b(18,31)],
];

// Gray modern (rows 82-90, cols 23-28) — for another commercial style
const MODERN_GRAY_PATTERN: number[][] = [
  [b(82,25), b(82,26), b(82,27), b(82,28), b(82,29), b(82,30)],
  [b(83,25), b(83,26), b(83,27), b(83,28), b(83,29), b(83,30)],
  [b(84,25), b(84,26), b(84,27), b(84,28), b(84,29), b(84,30)],
  [b(85,25), b(85,26), b(85,27), b(85,28), b(85,29), b(85,30)],
  [b(86,25), b(86,26), b(86,27), b(86,28), b(86,29), b(86,30)],
];

// Villas tileset — for Andres's House (rows 0-13, cols 0-7)
// First villa is a brown-roofed house spanning ~8 cols × 13 rows
const VILLA_PATTERN: number[][] = [
  [v(0,0), v(0,1), v(0,2), v(0,3)],
  [v(1,0), v(1,1), v(1,2), v(1,3)],
  [v(2,0), v(2,1), v(2,2), v(2,3)],
  [v(3,0), v(3,1), v(3,2), v(3,3)],
  [v(4,0), v(4,1), v(4,2), v(4,3)],
  [v(5,0), v(5,1), v(5,2), v(5,3)],
  [v(6,0), v(6,1), v(6,2), v(6,3)],
];

// Second villa color variant (cols 8-15) — darker brown
const VILLA2_PATTERN: number[][] = [
  [v(0,8), v(0,9), v(0,10), v(0,11)],
  [v(1,8), v(1,9), v(1,10), v(1,11)],
  [v(2,8), v(2,9), v(2,10), v(2,11)],
  [v(3,8), v(3,9), v(3,10), v(3,11)],
  [v(4,8), v(4,9), v(4,10), v(4,11)],
  [v(5,8), v(5,9), v(5,10), v(5,11)],
  [v(6,8), v(6,9), v(6,10), v(6,11)],
];

// ─── Main ──────────────────────────────────────────────────────────────

const mapPath = path.join(__dirname, "..", "public", "assets", "maps", "overworld.json");
const mapData = JSON.parse(fs.readFileSync(mapPath, "utf-8"));

const W = mapData.width;   // 50
const H = mapData.height;  // 40

const groundLayer = mapData.layers.find((l: any) => l.name === "Ground");
const aboveLayer = mapData.layers.find((l: any) => l.name === "Above");
const collisionLayer = mapData.layers.find((l: any) => l.name === "Collision");

if (!groundLayer || !aboveLayer || !collisionLayer) {
  console.error("FATAL: Missing required layers");
  process.exit(1);
}

// Deep-copy layer data so we can modify it
const aboveData: number[] = [...aboveLayer.data];
const groundData: number[] = [...groundLayer.data];

function setAbove(x: number, y: number, gidVal: number): void {
  if (x >= 0 && x < W && y >= 0 && y < H) {
    aboveData[y * W + x] = gidVal;
  }
}

function getAbove(x: number, y: number): number {
  if (x >= 0 && x < W && y >= 0 && y < H) {
    return aboveData[y * W + x];
  }
  return 0;
}

function setGround(x: number, y: number, gidVal: number): void {
  if (x >= 0 && x < W && y >= 0 && y < H) {
    groundData[y * W + x] = gidVal;
  }
}

function getGround(x: number, y: number): number {
  if (x >= 0 && x < W && y >= 0 && y < H) {
    return groundData[y * W + x];
  }
  return 0;
}

// ─── Step 1: Identify building regions ─────────────────────────────────

interface Region {
  minX: number; maxX: number;
  minY: number; maxY: number;
  width: number; height: number;
  tiles: number;
}

const visited = new Set<string>();
const regions: Region[] = [];

function floodFill(sx: number, sy: number): { x: number; y: number }[] {
  const result: { x: number; y: number }[] = [];
  const stack: [number, number][] = [[sx, sy]];
  while (stack.length > 0) {
    const [x, y] = stack.pop()!;
    const key = `${x},${y}`;
    if (visited.has(key)) continue;
    if (x < 0 || x >= W || y < 0 || y >= H) continue;
    if (aboveData[y * W + x] !== BUILDING_GID) continue;
    visited.add(key);
    result.push({ x, y });
    stack.push([x - 1, y], [x + 1, y], [x, y - 1], [x, y + 1]);
  }
  return result;
}

for (let y = 0; y < H; y++) {
  for (let x = 0; x < W; x++) {
    if (aboveData[y * W + x] === BUILDING_GID && !visited.has(`${x},${y}`)) {
      const tiles = floodFill(x, y);
      const xs = tiles.map(t => t.x);
      const ys = tiles.map(t => t.y);
      regions.push({
        minX: Math.min(...xs), maxX: Math.max(...xs),
        minY: Math.min(...ys), maxY: Math.max(...ys),
        width: Math.max(...xs) - Math.min(...xs) + 1,
        height: Math.max(...ys) - Math.min(...ys) + 1,
        tiles: tiles.length,
      });
    }
  }
}

regions.sort((a, b) => b.tiles - a.tiles);

console.log(`Found ${regions.length} building regions:`);
for (const r of regions) {
  console.log(`  x=${r.minX}-${r.maxX} y=${r.minY}-${r.maxY} (${r.width}x${r.height}) tiles=${r.tiles}`);
}

// ─── Step 2: Assign facades to buildings ───────────────────────────────

function applyFacade(region: Region, pattern: number[][]): void {
  const facade = fillFacade(region.width, region.height, pattern);
  for (let dy = 0; dy < region.height; dy++) {
    for (let dx = 0; dx < region.width; dx++) {
      const x = region.minX + dx;
      const y = region.minY + dy;
      // Only replace tiles that are currently BUILDING_GID
      if (getAbove(x, y) === BUILDING_GID) {
        setAbove(x, y, facade[dy][dx]);
      }
    }
  }
}

// Match regions to known buildings and assign facade patterns
for (const region of regions) {
  // Thoven HQ — x=12-21, y=10-22 (10x13)
  if (region.minX === 12 && region.maxX === 21 && region.minY === 10) {
    console.log("→ Thoven HQ: yellow/tan modern building");
    applyFacade(region, THOVEN_PATTERN);
  }
  // Lookout/Heights area — x=20-30, y=0-6 (11x7)
  else if (region.minX === 20 && region.minY === 0) {
    console.log("→ Heights/Lookout area: modern gray");
    applyFacade(region, MODERN_GRAY_PATTERN);
  }
  // Engineering Lab — x=38-44, y=2-8 (7x7) 
  else if (region.minX === 38 && region.minY <= 8 && region.maxY <= 8) {
    console.log("→ Engineering Lab: industrial gray");
    applyFacade(region, INDUSTRIAL_PATTERN);
  }
  // Record Shop / East building — x=38-44, y=12-18 (7x7)
  else if (region.minX === 38 && region.minY >= 12 && region.minY <= 13) {
    console.log("→ East building (Record Shop): commercial brick");
    applyFacade(region, COMMERCIAL_PATTERN);
  }
  // Ventanita area — x=3-8, y=10-14 (6x5)
  else if (region.minX <= 8 && region.maxX <= 8 && region.minY === 10 && region.maxY === 14) {
    console.log("→ Ventanita area: commercial variant 2");
    applyFacade(region, COMMERCIAL2_PATTERN);
  }
  // Andres's House — x=6-9, y=16-22 (4x7)
  else if (region.minX === 6 && region.maxX === 9 && region.minY === 16) {
    console.log("→ Andres's House: villa (residential)");
    applyFacade(region, VILLA_PATTERN);
  }
  // Starbucks — x=29-34, y=24-28 (6x5)
  else if (region.minX === 29 && region.minY === 24) {
    console.log("→ Starbucks: commercial pattern");
    applyFacade(region, COMMERCIAL_PATTERN);
  }
  // GitHub Library — x=29-32, y=10-14 (4x5) 
  else if (region.minX === 29 && region.minY === 10) {
    console.log("→ GitHub Library: dark commercial");
    applyFacade(region, COMMERCIAL2_PATTERN);
  }
  // VC Office — x=28-33, y=18-20 (6x3)
  else if (region.minX === 28 && region.minY === 18) {
    console.log("→ VC Office: modern gray");
    applyFacade(region, MODERN_GRAY_PATTERN);
  }
  // Bulletin Board area — x=23-25, y=26-31 (3x6) 
  else if (region.minX === 23 && region.minY === 26) {
    console.log("→ Bulletin Board area: commercial");
    applyFacade(region, COMMERCIAL_PATTERN);
  }
  // Small feature at x=21 y=15-16
  else if (region.width <= 2 && region.height <= 2) {
    console.log(`→ Small feature at x=${region.minX}: commercial accent`);
    applyFacade(region, COMMERCIAL_PATTERN);
  }
  else {
    console.log(`→ Unmatched region x=${region.minX}-${region.maxX} y=${region.minY}-${region.maxY}: using default commercial`);
    applyFacade(region, COMMERCIAL_PATTERN);
  }
}

// ─── Step 3: Ground texture variety ────────────────────────────────────

// Add grass variants to break up monotonous flat grass
const GRASS_VARIANTS = [
  t(6, 0),  // Standard grass (193)
  t(6, 1),  // Grass variant 1
  t(7, 0),  // Grass variant 2 (225)
  t(7, 1),  // Grass variant 3
];

// Seeded random for reproducible results
let seed = 42;
function seededRandom(): number {
  seed = (seed * 16807) % 2147483647;
  return (seed - 1) / 2147483646;
}

for (let y = 0; y < H; y++) {
  for (let x = 0; x < W; x++) {
    const gVal = getGround(x, y);
    // Replace flat grass with random grass variants
    if (gVal === GRASS_GID) {
      const r = seededRandom();
      if (r < 0.15) {
        // 15% chance of variant
        const variant = GRASS_VARIANTS[Math.floor(seededRandom() * GRASS_VARIANTS.length)];
        setGround(x, y, variant);
      }
    }
  }
}

// Add path edge transitions where path meets grass
// Use terrains row=9 area for path variants
const PATH_VARIANT_1 = t(9, 5);  // Standard path (294)
const PATH_VARIANT_2 = t(9, 6);  // Path variant

for (let y = 0; y < H; y++) {
  for (let x = 0; x < W; x++) {
    const gVal = getGround(x, y);
    if (gVal === PATH_GID) {
      // 10% chance of path variant
      if (seededRandom() < 0.1) {
        setGround(x, y, PATH_VARIANT_2);
      }
    }
  }
}

// ─── Step 4: Write back ────────────────────────────────────────────────

// Check how many BUILDING_GID remain
const remainingBuilding = aboveData.filter(g => g === BUILDING_GID).length;
console.log(`\nBUILDING_GID remaining after enhancement: ${remainingBuilding}`);

if (remainingBuilding > 0) {
  console.warn("WARNING: Some BUILDING_GID blocks were not replaced!");
  // Find remaining positions
  for (let i = 0; i < aboveData.length; i++) {
    if (aboveData[i] === BUILDING_GID) {
      const x = i % W;
      const y = Math.floor(i / W);
      console.warn(`  Remaining at x=${x}, y=${y}`);
    }
  }
}

// Update layer data
aboveLayer.data = aboveData;
groundLayer.data = groundData;

// Add villas tileset if not already present
const hasVillas = mapData.tilesets.some((ts: any) => ts.name === "villas");
if (!hasVillas) {
  console.log("\nAdding villas tileset to tileset chain...");
  mapData.tilesets.push({
    columns: 32,
    firstgid: TILESETS.villas.firstgid,
    image: "../../assets/tilesets/7_Villas_16x16.png",
    imageheight: 912,
    imagewidth: 512,
    margin: 0,
    name: "villas",
    spacing: 0,
    tilecount: 1824,
    tileheight: 16,
    tilewidth: 16,
  });
}

// Write the enhanced map
fs.writeFileSync(mapPath, JSON.stringify(mapData, null, 2));
console.log(`\nEnhanced overworld.json written to ${mapPath}`);
console.log("Done!");
