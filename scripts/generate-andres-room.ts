#!/usr/bin/env node
/**
 * generate-andres-room.ts — Build Andres's Room interior map
 * 
 * 10×8 tile room with:
 * - Wood floor
 * - Walls on top/left/right
 * - Exit tiles at bottom center (door)
 * - Furniture layer with bed, desk, DJ booth, bookshelf
 * - Wall decorations layer
 * - Collision on walls and furniture
 * 
 * Tilesets: Room_Builder_16x16 (firstgid=1, 76 cols)
 *           Interiors_16x16 (firstgid=8589, 16 cols)
 */

import * as fs from "fs";
import * as path from "path";

const W = 10;
const H = 8;
const TOTAL = W * H;

// ─── Tileset GID helpers ───────────────────────────────────────────────

// Room_Builder: 76 cols, firstgid=1
function rb(row: number, col: number): number { return 1 + row * 76 + col; }

// Interiors: 16 cols, firstgid=8589
function int(row: number, col: number): number { return 8589 + row * 16 + col; }

// ─── Tile constants ────────────────────────────────────────────────────

// Floor tiles — warm wood planks (Room_Builder rows 17-18, cols 11-13)
const FLOOR_WOOD = rb(17, 11);   // (182, 115, 74) warm wood
const FLOOR_WOOD2 = rb(18, 11);  // variant

// Wall tiles — light gray (Room_Builder 3D walls area, rows 68-73, cols 44-46)
const WALL_TOP = rb(68, 44);     // (230, 230, 240) light wall
const WALL_MID = rb(70, 44);     // wall middle
const WALL_BOT = rb(72, 44);     // wall bottom/baseboard

// Furniture tiles from Interiors (approximate — using filled tile positions)
// Bed (rows 16-19): bed section
const BED_HEAD = int(16, 0);     // bed headboard
const BED_MID = int(17, 0);      // bed middle
const BED_FOOT = int(18, 0);     // bed foot

// Desk/PC (rows 31-33)
const DESK_L = int(31, 0);       // desk left
const DESK_R = int(31, 1);       // desk right
const DESK_TOP = int(32, 1);     // desk top item (monitor)

// DJ booth (rows 37-38)
const DJ_L = int(37, 5);         // DJ left
const DJ_R = int(37, 6);         // DJ right

// Bookshelf (rows 45-46)
const SHELF_T = int(45, 0);      // shelf top
const SHELF_B = int(46, 0);      // shelf bottom

// Window (rows 13-14) 
const WINDOW_L = int(13, 6);     // window left
const WINDOW_R = int(13, 7);     // window right

// ─── Build layers ──────────────────────────────────────────────────────

const ground: number[] = new Array(TOTAL).fill(0);
const furniture: number[] = new Array(TOTAL).fill(0);
const walls: number[] = new Array(TOTAL).fill(0);
const exits: number[] = new Array(TOTAL).fill(0);
const collision: number[] = new Array(TOTAL).fill(0);

function idx(x: number, y: number): number { return y * W + x; }

// ─── Ground layer: wood floor everywhere ───────────────────────────────
for (let y = 0; y < H; y++) {
  for (let x = 0; x < W; x++) {
    // Alternate floor variants for visual interest
    ground[idx(x, y)] = (x + y) % 2 === 0 ? FLOOR_WOOD : FLOOR_WOOD2;
  }
}

// ─── Walls layer: top row is wall, left/right edges ────────────────────
// Top wall (y=0)
for (let x = 0; x < W; x++) {
  walls[idx(x, 0)] = WALL_TOP;
  collision[idx(x, 0)] = 1; // blocked
}
// Second row wall detail (y=1) — lower wall / baseboard
for (let x = 0; x < W; x++) {
  walls[idx(x, 1)] = WALL_BOT;
  collision[idx(x, 1)] = 1; // blocked
}
// Left wall edge
for (let y = 2; y < H; y++) {
  walls[idx(0, y)] = WALL_MID;
  collision[idx(0, y)] = 1;
}
// Right wall edge
for (let y = 2; y < H; y++) {
  walls[idx(W - 1, y)] = WALL_MID;
  collision[idx(W - 1, y)] = 1;
}

// ─── Furniture layer ───────────────────────────────────────────────────

// Bed — top-left area (x=1, y=2-4) — 2 tiles wide, 3 tall
furniture[idx(1, 2)] = BED_HEAD;
furniture[idx(2, 2)] = BED_HEAD;
furniture[idx(1, 3)] = BED_MID;
furniture[idx(2, 3)] = BED_MID;
furniture[idx(1, 4)] = BED_FOOT;
furniture[idx(2, 4)] = BED_FOOT;
collision[idx(1, 2)] = 1;
collision[idx(2, 2)] = 1;
collision[idx(1, 3)] = 1;
collision[idx(2, 3)] = 1;
collision[idx(1, 4)] = 1;
collision[idx(2, 4)] = 1;

// PC Desk — top-right area (x=7-8, y=2) — 2 tiles wide
furniture[idx(7, 2)] = DESK_L;
furniture[idx(8, 2)] = DESK_R;
furniture[idx(7, 1)] = DESK_TOP;  // monitor on wall behind desk
collision[idx(7, 2)] = 1;
collision[idx(8, 2)] = 1;

// DJ Booth — mid-right (x=7-8, y=4)
furniture[idx(7, 4)] = DJ_L;
furniture[idx(8, 4)] = DJ_R;
collision[idx(7, 4)] = 1;
collision[idx(8, 4)] = 1;

// Bookshelf — left wall mid (x=1, y=6)
furniture[idx(1, 6)] = SHELF_T;
furniture[idx(1, 5)] = SHELF_B;
collision[idx(1, 6)] = 1;
collision[idx(1, 5)] = 1;

// ─── Wall decorations ─────────────────────────────────────────────────

// Window — center top wall (x=4-5, y=0) — overlaps wall
walls[idx(4, 0)] = WINDOW_L;
walls[idx(5, 0)] = WINDOW_R;

// Jersey (#14) — right of window (x=7, y=0)
// Using a colored interiors tile as placeholder
walls[idx(7, 0)] = int(1, 9);  // decoration tile

// Flags — left of window (x=2-3, y=0)  
walls[idx(2, 0)] = int(1, 0);  // flag placeholder left
walls[idx(3, 0)] = int(1, 1);  // flag placeholder right

// Michigan pennant — above desk (x=8, y=0)
walls[idx(8, 0)] = int(1, 6);  // pennant placeholder

// Dachshund poster — left wall (x=1, y=0)
walls[idx(1, 0)] = int(1, 3);  // poster placeholder

// ─── Exit tiles — bottom center door (x=4-5, y=7) ─────────────────────
exits[idx(4, 7)] = 1;  // any non-zero = exit
exits[idx(5, 7)] = 1;
// No collision on exit tiles — player walks onto them to trigger exit

// ─── Build map JSON ────────────────────────────────────────────────────

const mapData = {
  compressionlevel: -1,
  height: H,
  infinite: false,
  layers: [
    {
      data: ground,
      height: H,
      id: 1,
      name: "ground",
      opacity: 1,
      type: "tilelayer",
      visible: true,
      width: W,
      x: 0,
      y: 0,
    },
    {
      data: walls,
      height: H,
      id: 2,
      name: "walls",
      opacity: 1,
      type: "tilelayer",
      visible: true,
      width: W,
      x: 0,
      y: 0,
    },
    {
      data: furniture,
      height: H,
      id: 3,
      name: "furniture",
      opacity: 1,
      type: "tilelayer",
      visible: true,
      width: W,
      x: 0,
      y: 0,
    },
    {
      data: exits,
      height: H,
      id: 4,
      name: "exits",
      opacity: 1,
      type: "tilelayer",
      visible: false,
      width: W,
      x: 0,
      y: 0,
    },
    {
      data: collision,
      height: H,
      id: 5,
      name: "collision",
      opacity: 1,
      type: "tilelayer",
      visible: false,
      width: W,
      x: 0,
      y: 0,
    },
  ],
  nextlayerid: 6,
  nextobjectid: 1,
  orientation: "orthogonal",
  renderorder: "right-down",
  tiledversion: "1.11.0",
  tileheight: 16,
  tilesets: [
    {
      columns: 76,
      firstgid: 1,
      image: "../../assets/tilesets/Room_Builder_16x16.png",
      imageheight: 1808,
      imagewidth: 1216,
      margin: 0,
      name: "Room_Builder_16x16",
      spacing: 0,
      tilecount: 8588,
      tileheight: 16,
      tilewidth: 16,
    },
    {
      columns: 16,
      firstgid: 8589,
      image: "../../assets/tilesets/Interiors_16x16.png",
      imageheight: 17024,
      imagewidth: 256,
      margin: 0,
      name: "Interiors_16x16",
      spacing: 0,
      tilecount: 17024,
      tileheight: 16,
      tilewidth: 16,
    },
  ],
  tilewidth: 16,
  type: "map",
  version: "1.10",
  width: W,
};

const outPath = path.join(__dirname, "..", "public", "assets", "maps", "andres-room.json");
fs.writeFileSync(outPath, JSON.stringify(mapData, null, 2));
console.log(`Wrote ${outPath}`);
console.log(`Map: ${W}x${H}, ${mapData.layers.length} layers, ${mapData.tilesets.length} tilesets`);
console.log(`Exit tiles: ${exits.filter(e => e !== 0).length}`);
console.log(`Collision tiles: ${collision.filter(c => c !== 0).length}`);
console.log(`Furniture tiles: ${furniture.filter(f => f !== 0).length}`);
