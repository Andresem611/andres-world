/**
 * Extract map data from Tiled JSON (overworld.json) into TypeScript 2D arrays.
 * Outputs the OVERWORLD_MAP constant to src/maps/overworld.ts.
 *
 * Usage: npx tsx scripts/extract-map-data.ts
 */

import * as fs from "fs";
import * as path from "path";

const mapPath = path.join(__dirname, "../public/assets/maps/overworld.json");
const outputPath = path.join(__dirname, "../src/maps/overworld.ts");

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
}

const map: TiledMap = JSON.parse(fs.readFileSync(mapPath, "utf-8"));

function flatTo2D(data: number[], width: number, height: number): number[][] {
  const grid: number[][] = [];
  for (let y = 0; y < height; y++) {
    const row: number[] = [];
    for (let x = 0; x < width; x++) {
      row.push(data[y * width + x]);
    }
    grid.push(row);
  }
  return grid;
}

const groundLayer = map.layers.find((l) => l.name === "Ground");
const aboveLayer = map.layers.find((l) => l.name === "Above");
const collisionLayer = map.layers.find((l) => l.name === "Collision");

if (!groundLayer || !aboveLayer || !collisionLayer) {
  console.error("Missing required layers (Ground, Above, Collision)");
  process.exit(1);
}

const ground = flatTo2D(groundLayer.data, map.width, map.height);
const above = flatTo2D(aboveLayer.data, map.width, map.height);

// Normalize collision: any non-zero GID → 1 (blocked), 0 → 0 (walkable)
const collision = flatTo2D(collisionLayer.data, map.width, map.height).map(
  (row) => row.map((v) => (v > 0 ? 1 : 0)),
);

function formatGrid(grid: number[][]): string {
  return grid.map((row) => `    [${row.join(",")}]`).join(",\n");
}

const output = `/**
 * OVERWORLD_MAP — the full 50×40 overworld tile data.
 * Auto-generated from overworld.json by scripts/extract-map-data.ts.
 * Do not edit by hand — rerun the script to regenerate.
 */

import { MapData } from "../types/map";

export const OVERWORLD_MAP: MapData = {
  width: ${map.width},
  height: ${map.height},
  tileSize: ${map.tilewidth},
  layers: {
    ground: [
${formatGrid(ground)}
    ],
    above: [
${formatGrid(above)}
    ],
    collision: [
${formatGrid(collision)}
    ],
  },
};
`;

fs.writeFileSync(outputPath, output);
console.log(
  `✅ Wrote OVERWORLD_MAP (${map.width}×${map.height}) to ${outputPath}`,
);
console.log(`   Ground: ${ground.flat().filter((v) => v > 0).length} non-empty tiles`);
console.log(`   Above: ${above.flat().filter((v) => v > 0).length} non-empty tiles`);
console.log(`   Collision: ${collision.flat().filter((v) => v > 0).length} blocked tiles`);
