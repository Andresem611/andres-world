/**
 * Extract all interior maps from Tiled JSON to TypeScript MapData format.
 * Usage: npx tsx scripts/extract-interiors.ts
 */

import * as fs from "fs";
import * as path from "path";

interface TiledLayer {
  name: string;
  data: number[];
  width: number;
  height: number;
}

interface TiledMap {
  width: number;
  height: number;
  tilewidth: number;
  layers: TiledLayer[];
  tilesets: { name: string; firstgid: number; columns: number; tilecount: number; image?: string }[];
}

const interiors = [
  { key: "andres-room", file: "andres-room.json" },
  { key: "thoven-hq", file: "thoven-hq.json" },
  { key: "starbucks", file: "starbucks.json" },
  { key: "engineering-lab", file: "engineering-lab.json" },
];

function flatTo2D(data: number[], width: number, height: number): number[][] {
  const grid: number[][] = [];
  for (let y = 0; y < height; y++) {
    grid.push(data.slice(y * width, (y + 1) * width));
  }
  return grid;
}

function formatGrid(grid: number[][]): string {
  return grid.map((row) => `      [${row.join(",")}]`).join(",\n");
}

const entries: string[] = [];

for (const interior of interiors) {
  const mapPath = path.join(__dirname, "../public/assets/maps", interior.file);
  const map: TiledMap = JSON.parse(fs.readFileSync(mapPath, "utf-8"));

  const ground = map.layers.find((l) => l.name === "ground");
  const walls = map.layers.find((l) => l.name === "walls");
  const furniture = map.layers.find((l) => l.name === "furniture");
  const exits = map.layers.find((l) => l.name === "exits");
  const collision = map.layers.find((l) => l.name === "collision");

  if (!ground || !collision) {
    console.error(`Missing required layers in ${interior.file}`);
    continue;
  }

  const groundData = flatTo2D(ground.data, map.width, map.height);
  // Merge walls + furniture into "above" layer (both render on top of ground)
  const aboveData: number[][] = [];
  for (let y = 0; y < map.height; y++) {
    const row: number[] = [];
    for (let x = 0; x < map.width; x++) {
      const wallGid = walls ? walls.data[y * map.width + x] : 0;
      const furnGid = furniture ? furniture.data[y * map.width + x] : 0;
      // Prefer furniture over walls (furniture is more specific)
      row.push(furnGid || wallGid || 0);
    }
    aboveData.push(row);
  }
  const collisionData = flatTo2D(collision.data, map.width, map.height).map(
    (row) => row.map((v) => (v > 0 ? 1 : 0)),
  );

  // Extract exit positions
  const exitPositions: { x: number; y: number }[] = [];
  if (exits) {
    for (let y = 0; y < map.height; y++) {
      for (let x = 0; x < map.width; x++) {
        if (exits.data[y * map.width + x] > 0) {
          exitPositions.push({ x, y });
        }
      }
    }
  }

  const constName = interior.key.replace(/-/g, "_").toUpperCase() + "_MAP";
  entries.push(`export const ${constName}: InteriorMapData = {
  key: "${interior.key}",
  width: ${map.width},
  height: ${map.height},
  tileSize: ${map.tilewidth},
  layers: {
    ground: [
${formatGrid(groundData)}
    ],
    above: [
${formatGrid(aboveData)}
    ],
    collision: [
${formatGrid(collisionData)}
    ],
  },
  exitPositions: [${exitPositions.map((p) => `{ x: ${p.x}, y: ${p.y} }`).join(", ")}],
  tilesets: ${JSON.stringify(map.tilesets.map((t) => ({ name: t.name, firstgid: t.firstgid, columns: t.columns, tilecount: t.tilecount })))},
};`);

  console.log(`✅ ${interior.key}: ${map.width}×${map.height}, ${exitPositions.length} exits`);
}

const output = `/**
 * Interior map data — auto-generated from Tiled JSON by scripts/extract-interiors.ts.
 * Do not edit by hand.
 */

import { MapData } from "../types/map";

export interface InteriorMapData extends MapData {
  key: string;
  exitPositions: { x: number; y: number }[];
  tilesets: { name: string; firstgid: number; columns: number; tilecount: number }[];
}

${entries.join("\n\n")}

export const INTERIOR_MAPS: Record<string, InteriorMapData> = {
${interiors.map((i) => `  "${i.key}": ${i.key.replace(/-/g, "_").toUpperCase()}_MAP,`).join("\n")}
};
`;

const outputPath = path.join(__dirname, "../src/maps/interiors.ts");
fs.writeFileSync(outputPath, output);
console.log(`\n✅ Wrote ${interiors.length} interior maps to ${outputPath}`);
