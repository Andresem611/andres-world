#!/usr/bin/env node
/**
 * generate-thoven-hq.ts — Build Thoven HQ interior map
 * 
 * 12×10 tile office with:
 * - Front desk area (Keri NPC)
 * - Metrics board on center wall
 * - Shipped/corkboard on wall
 * - Practice room doors (back wall) — Piano, Guitar, Voice, Violin
 * - PC in corner
 * - Waiting area (Michael Seibel NPC)
 * - Brian Chesky NPC near metrics board
 * 
 * Tilesets: Room_Builder_16x16 (firstgid=1, 76 cols)
 *           Interiors_16x16 (firstgid=8589, 16 cols)
 */

import * as fs from "fs";
import * as path from "path";

const W = 12;
const H = 10;
const TOTAL = W * H;

// Room_Builder: 76 cols, firstgid=1
function rb(row: number, col: number): number { return 1 + row * 76 + col; }
// Interiors: 16 cols, firstgid=8589
function int(row: number, col: number): number { return 8589 + row * 16 + col; }

// Floor — office tile (lighter than bedroom wood)
const FLOOR_TILE = rb(12, 11);
const FLOOR_TILE2 = rb(11, 11);

// Walls
const WALL_TOP = rb(68, 44);
const WALL_MID = rb(70, 44);
const WALL_BOT = rb(72, 44);

// Furniture
const DESK_L = int(31, 0);
const DESK_R = int(31, 1);
const DESK_TOP = int(32, 1);
const CHAIR = int(40, 1);
const SHELF_T = int(45, 0);
const SHELF_B = int(46, 0);
const MONITOR = int(31, 4);
const BOARD_L = int(13, 11);  // board/poster placeholder
const BOARD_R = int(13, 12);
const DOOR = int(16, 6);      // door placeholder

const ground: number[] = new Array(TOTAL).fill(0);
const furniture: number[] = new Array(TOTAL).fill(0);
const walls: number[] = new Array(TOTAL).fill(0);
const exits: number[] = new Array(TOTAL).fill(0);
const collision: number[] = new Array(TOTAL).fill(0);

function idx(x: number, y: number): number { return y * W + x; }

// Ground: office floor
for (let y = 0; y < H; y++) {
  for (let x = 0; x < W; x++) {
    ground[idx(x, y)] = (x + y) % 2 === 0 ? FLOOR_TILE : FLOOR_TILE2;
  }
}

// Walls: top 2 rows, left/right edges
for (let x = 0; x < W; x++) {
  walls[idx(x, 0)] = WALL_TOP;
  collision[idx(x, 0)] = 1;
  walls[idx(x, 1)] = WALL_BOT;
  collision[idx(x, 1)] = 1;
}
for (let y = 2; y < H; y++) {
  walls[idx(0, y)] = WALL_MID;
  collision[idx(0, y)] = 1;
  walls[idx(W - 1, y)] = WALL_MID;
  collision[idx(W - 1, y)] = 1;
}

// ─── Front desk area (x=4-6, y=7) ─────────────────────────────────────
furniture[idx(4, 7)] = DESK_L;
furniture[idx(5, 7)] = DESK_R;
furniture[idx(6, 7)] = DESK_L;
collision[idx(4, 7)] = 1;
collision[idx(5, 7)] = 1;
collision[idx(6, 7)] = 1;

// ─── Metrics board on center wall (x=5-6, y=0) ────────────────────────
walls[idx(5, 0)] = BOARD_L;
walls[idx(6, 0)] = BOARD_R;

// ─── Shipped/corkboard on wall (x=3-4, y=0) ───────────────────────────
walls[idx(3, 0)] = BOARD_L;
walls[idx(4, 0)] = BOARD_R;

// ─── Practice room doors (back wall, x=8-10, y=1) ─────────────────────
// Four doors on the back right wall
walls[idx(8, 0)] = DOOR;   // Piano
walls[idx(9, 0)] = DOOR;   // Guitar
walls[idx(10, 0)] = DOOR;  // Voice
// Violin on right wall
walls[idx(W - 1, 3)] = DOOR;

// ─── PC in corner (x=1, y=2) ──────────────────────────────────────────
furniture[idx(1, 2)] = MONITOR;
furniture[idx(1, 3)] = DESK_L;
collision[idx(1, 2)] = 1;
collision[idx(1, 3)] = 1;

// ─── Waiting area chairs (x=8-9, y=5-6) ───────────────────────────────
furniture[idx(8, 5)] = CHAIR;
furniture[idx(9, 5)] = CHAIR;
furniture[idx(8, 6)] = CHAIR;
furniture[idx(9, 6)] = CHAIR;
collision[idx(8, 5)] = 1;
collision[idx(9, 5)] = 1;
collision[idx(8, 6)] = 1;
collision[idx(9, 6)] = 1;

// ─── Shelves along left wall (x=1, y=5-6) ─────────────────────────────
furniture[idx(1, 5)] = SHELF_T;
furniture[idx(1, 6)] = SHELF_B;
collision[idx(1, 5)] = 1;
collision[idx(1, 6)] = 1;

// ─── Exit tiles — bottom center door (x=5-6, y=9) ─────────────────────
exits[idx(5, 9)] = 1;
exits[idx(6, 9)] = 1;

// ─── Build map JSON ────────────────────────────────────────────────────
const mapData = {
  compressionlevel: -1,
  height: H,
  infinite: false,
  layers: [
    { data: ground, height: H, id: 1, name: "ground", opacity: 1, type: "tilelayer", visible: true, width: W, x: 0, y: 0 },
    { data: walls, height: H, id: 2, name: "walls", opacity: 1, type: "tilelayer", visible: true, width: W, x: 0, y: 0 },
    { data: furniture, height: H, id: 3, name: "furniture", opacity: 1, type: "tilelayer", visible: true, width: W, x: 0, y: 0 },
    { data: exits, height: H, id: 4, name: "exits", opacity: 1, type: "tilelayer", visible: false, width: W, x: 0, y: 0 },
    { data: collision, height: H, id: 5, name: "collision", opacity: 1, type: "tilelayer", visible: false, width: W, x: 0, y: 0 },
  ],
  nextlayerid: 6,
  nextobjectid: 1,
  orientation: "orthogonal",
  renderorder: "right-down",
  tiledversion: "1.11.0",
  tileheight: 16,
  tilesets: [
    { columns: 76, firstgid: 1, image: "../../assets/tilesets/Room_Builder_16x16.png", imageheight: 1808, imagewidth: 1216, margin: 0, name: "Room_Builder_16x16", spacing: 0, tilecount: 8588, tileheight: 16, tilewidth: 16 },
    { columns: 16, firstgid: 8589, image: "../../assets/tilesets/Interiors_16x16.png", imageheight: 17024, imagewidth: 256, margin: 0, name: "Interiors_16x16", spacing: 0, tilecount: 17024, tileheight: 16, tilewidth: 16 },
  ],
  tilewidth: 16,
  type: "map",
  version: "1.10",
  width: W,
};

const outPath = path.join(__dirname, "..", "public", "assets", "maps", "thoven-hq.json");
fs.writeFileSync(outPath, JSON.stringify(mapData, null, 2));
console.log(`Wrote ${outPath} (${W}x${H}, exits=${exits.filter(e=>e).length}, collision=${collision.filter(c=>c).length}, furniture=${furniture.filter(f=>f).length})`);
