#!/usr/bin/env node
/**
 * generate-starbucks.ts — Starbucks Café interior
 * 10×8 café with counter, tables with books, Paul Graham NPC, Barista NPC
 */
import * as fs from "fs";
import * as path from "path";

const W = 10, H = 8, TOTAL = W * H;
function rb(r: number, c: number) { return 1 + r * 76 + c; }
function int(r: number, c: number) { return 8589 + r * 16 + c; }

const FLOOR = rb(12, 11), FLOOR2 = rb(11, 11);
const WALL_TOP = rb(68, 44), WALL_MID = rb(70, 44), WALL_BOT = rb(72, 44);
const COUNTER_L = int(31, 0), COUNTER_R = int(31, 1);
const TABLE = int(40, 5), CHAIR = int(40, 1);
const BOOK = int(45, 6); // book on table placeholder

const ground = new Array(TOTAL).fill(0);
const furniture = new Array(TOTAL).fill(0);
const walls = new Array(TOTAL).fill(0);
const exits = new Array(TOTAL).fill(0);
const collision = new Array(TOTAL).fill(0);
const idx = (x: number, y: number) => y * W + x;

// Floor
for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) ground[idx(x, y)] = (x + y) % 2 === 0 ? FLOOR : FLOOR2;

// Walls
for (let x = 0; x < W; x++) { walls[idx(x, 0)] = WALL_TOP; collision[idx(x, 0)] = 1; walls[idx(x, 1)] = WALL_BOT; collision[idx(x, 1)] = 1; }
for (let y = 2; y < H; y++) { walls[idx(0, y)] = WALL_MID; collision[idx(0, y)] = 1; walls[idx(W-1, y)] = WALL_MID; collision[idx(W-1, y)] = 1; }

// Counter (x=1-3, y=2) — barista behind it
furniture[idx(1,2)] = COUNTER_L; furniture[idx(2,2)] = COUNTER_R; furniture[idx(3,2)] = COUNTER_L;
collision[idx(1,2)] = 1; collision[idx(2,2)] = 1; collision[idx(3,2)] = 1;

// Table 1 with book (x=3, y=5) — essay 1
furniture[idx(3,5)] = TABLE; collision[idx(3,5)] = 1;
furniture[idx(3,4)] = BOOK; collision[idx(3,4)] = 1;

// Table 2 with book (x=6, y=5) — essay 2
furniture[idx(6,5)] = TABLE; collision[idx(6,5)] = 1;
furniture[idx(6,4)] = BOOK; collision[idx(6,4)] = 1;

// Paul Graham's corner table (x=7-8, y=2)
furniture[idx(7,2)] = TABLE; collision[idx(7,2)] = 1;
furniture[idx(8,2)] = CHAIR; collision[idx(8,2)] = 1;

// Exit
exits[idx(4, 7)] = 1; exits[idx(5, 7)] = 1;

const mapData = {
  compressionlevel: -1, height: H, infinite: false,
  layers: [
    { data: ground, height: H, id: 1, name: "ground", opacity: 1, type: "tilelayer", visible: true, width: W, x: 0, y: 0 },
    { data: walls, height: H, id: 2, name: "walls", opacity: 1, type: "tilelayer", visible: true, width: W, x: 0, y: 0 },
    { data: furniture, height: H, id: 3, name: "furniture", opacity: 1, type: "tilelayer", visible: true, width: W, x: 0, y: 0 },
    { data: exits, height: H, id: 4, name: "exits", opacity: 1, type: "tilelayer", visible: false, width: W, x: 0, y: 0 },
    { data: collision, height: H, id: 5, name: "collision", opacity: 1, type: "tilelayer", visible: false, width: W, x: 0, y: 0 },
  ],
  nextlayerid: 6, nextobjectid: 1, orientation: "orthogonal", renderorder: "right-down",
  tiledversion: "1.11.0", tileheight: 16,
  tilesets: [
    { columns: 76, firstgid: 1, image: "../../assets/tilesets/Room_Builder_16x16.png", imageheight: 1808, imagewidth: 1216, margin: 0, name: "Room_Builder_16x16", spacing: 0, tilecount: 8588, tileheight: 16, tilewidth: 16 },
    { columns: 16, firstgid: 8589, image: "../../assets/tilesets/Interiors_16x16.png", imageheight: 17024, imagewidth: 256, margin: 0, name: "Interiors_16x16", spacing: 0, tilecount: 17024, tileheight: 16, tilewidth: 16 },
  ],
  tilewidth: 16, type: "map", version: "1.10", width: W,
};

const outPath = path.join(__dirname, "..", "public", "assets", "maps", "starbucks.json");
fs.writeFileSync(outPath, JSON.stringify(mapData, null, 2));
console.log(`Wrote ${outPath} (${W}x${H})`);
