#!/usr/bin/env node
/**
 * generate-engineering-lab.ts — Engineering Lab interior
 * 10×8 lab with workbenches, stack wall, rubber duck, Tobi/Patrick/Dario NPCs
 */
import * as fs from "fs";
import * as path from "path";

const W = 10, H = 8, TOTAL = W * H;
function rb(r: number, c: number) { return 1 + r * 76 + c; }
function int(r: number, c: number) { return 8589 + r * 16 + c; }

const FLOOR = rb(21, 15), FLOOR2 = rb(22, 11); // darker industrial floor
const WALL_TOP = rb(75, 44), WALL_MID = rb(76, 44), WALL_BOT = rb(77, 44);
const MONITOR = int(31, 4);
const DESK_L = int(31, 0), DESK_R = int(31, 1);
const POSTER = int(13, 11);
const DUCK = int(48, 3); // rubber duck placeholder

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

// Workbench zone (x=1-3, y=3-4) — 3 monitors/experiments
furniture[idx(1,3)] = MONITOR; furniture[idx(2,3)] = MONITOR; furniture[idx(3,3)] = MONITOR;
furniture[idx(1,4)] = DESK_L;  furniture[idx(2,4)] = DESK_R;  furniture[idx(3,4)] = DESK_L;
collision[idx(1,3)] = 1; collision[idx(2,3)] = 1; collision[idx(3,3)] = 1;
collision[idx(1,4)] = 1; collision[idx(2,4)] = 1; collision[idx(3,4)] = 1;

// Stack wall posters (x=1-8, y=0)
for (let x = 1; x <= 8; x++) walls[idx(x, 0)] = POSTER;

// Rubber duck on desk (x=8, y=5)
furniture[idx(8,5)] = DUCK;
collision[idx(8,5)] = 1;

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

const outPath = path.join(__dirname, "..", "public", "assets", "maps", "engineering-lab.json");
fs.writeFileSync(outPath, JSON.stringify(mapData, null, 2));
console.log(`Wrote ${outPath} (${W}x${H})`);
