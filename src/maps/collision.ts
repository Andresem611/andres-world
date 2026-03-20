/**
 * Collision map for GridEngineHeadless ArrayTilemap.
 * Converts OVERWORLD_MAP.layers.collision to the format GE expects.
 */

import { ArrayTilemap } from "grid-engine";
import { OVERWORLD_MAP } from "./overworld";

/**
 * Create an ArrayTilemap from the overworld collision data.
 * GridEngineHeadless uses this for pathfinding and collision detection.
 * 0 = walkable, 1 = blocked (matching ArrayTilemap convention).
 */
export function createOverworldTilemap(): ArrayTilemap {
  return new ArrayTilemap({
    collision: {
      data: OVERWORLD_MAP.layers.collision,
    },
  });
}

/**
 * Check if a tile is walkable in the overworld.
 */
export function isWalkable(x: number, y: number): boolean {
  if (x < 0 || y < 0 || x >= OVERWORLD_MAP.width || y >= OVERWORLD_MAP.height) {
    return false;
  }
  return OVERWORLD_MAP.layers.collision[y][x] === 0;
}
