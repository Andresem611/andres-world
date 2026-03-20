/**
 * Tileset configurations for all LimeZu sprite sheets.
 * Maps global tile IDs (GIDs) to CSS background-position values.
 */

import { TilesetConfig, TileStyle } from "../types/map";

// ─── Overworld Tilesets ────────────────────────────────

export const TILESETS: TilesetConfig[] = [
  {
    name: "terrains",
    imagePath: "./assets/tilesets/1_Terrains_and_Fences_16x16.png",
    tileSize: 16,
    columns: 32,
    tileCount: 2368,
    firstGid: 1,
  },
  {
    name: "beach",
    imagePath: "./assets/tilesets/21_Beach_16x16.png",
    tileSize: 16,
    columns: 32,
    tileCount: 4000,
    firstGid: 2369,
  },
  {
    name: "buildings",
    imagePath: "./assets/tilesets/4_Generic_Buildings_16x16.png",
    tileSize: 16,
    columns: 32,
    tileCount: 6400,
    firstGid: 6369,
  },
  {
    name: "garden",
    imagePath: "./assets/tilesets/17_Garden_16x16.png",
    tileSize: 16,
    columns: 32,
    tileCount: 6272,
    firstGid: 12769,
  },
  {
    name: "worksite",
    imagePath: "./assets/tilesets/8_Worksite_16x16.png",
    tileSize: 16,
    columns: 32,
    tileCount: 640,
    firstGid: 19041,
  },
  {
    name: "villas",
    imagePath: "./assets/tilesets/7_Villas_16x16.png",
    tileSize: 16,
    columns: 32,
    tileCount: 1824,
    firstGid: 19681,
  },
];

// ─── Interior Tilesets ─────────────────────────────────

export const INTERIOR_TILESETS: TilesetConfig[] = [
  {
    name: "Room_Builder_16x16",
    imagePath: "./assets/tilesets/Room_Builder_16x16.png",
    tileSize: 16,
    columns: 76,
    tileCount: 8588,
    firstGid: 1,
  },
  {
    name: "Interiors_16x16",
    imagePath: "./assets/tilesets/Interiors_16x16.png",
    tileSize: 16,
    columns: 16,
    tileCount: 10000, // approximate
    firstGid: 8589,
  },
];

/**
 * Find which tileset a global tile ID belongs to.
 * Returns null for GID 0 (empty tile).
 */
export function findTileset(gid: number, tilesets: TilesetConfig[] = TILESETS): TilesetConfig | null {
  if (gid <= 0) return null;
  for (let i = tilesets.length - 1; i >= 0; i--) {
    if (gid >= tilesets[i].firstGid) return tilesets[i];
  }
  return null;
}

/**
 * Convert a global tile ID to CSS style for rendering.
 * Returns null for empty tiles (GID 0).
 */
export function getTileStyle(gid: number, tilesets: TilesetConfig[] = TILESETS): TileStyle | null {
  const tileset = findTileset(gid, tilesets);
  if (!tileset) return null;

  const localId = gid - tileset.firstGid;
  const col = localId % tileset.columns;
  const row = Math.floor(localId / tileset.columns);
  const px = col * tileset.tileSize;
  const py = row * tileset.tileSize;

  return {
    backgroundImage: `url(${tileset.imagePath})`,
    backgroundPosition: `-${px}px -${py}px`,
    backgroundSize: `${tileset.columns * tileset.tileSize}px auto`,
    width: tileset.tileSize,
    height: tileset.tileSize,
  };
}

/**
 * Compute the visible tile range given camera center and viewport size.
 * Includes a buffer of extra tiles around the edges.
 */
export function getVisibleTileRange(
  cameraCenterX: number,
  cameraCenterY: number,
  viewportWidth: number,
  viewportHeight: number,
  tileSize: number,
  zoom: number,
  mapWidth: number,
  mapHeight: number,
  buffer: number = 2,
): { startX: number; startY: number; endX: number; endY: number } {
  const tilesVisibleX = Math.ceil(viewportWidth / (tileSize * zoom)) + 1;
  const tilesVisibleY = Math.ceil(viewportHeight / (tileSize * zoom)) + 1;

  const halfX = Math.ceil(tilesVisibleX / 2);
  const halfY = Math.ceil(tilesVisibleY / 2);

  return {
    startX: Math.max(0, Math.floor(cameraCenterX) - halfX - buffer),
    startY: Math.max(0, Math.floor(cameraCenterY) - halfY - buffer),
    endX: Math.min(mapWidth - 1, Math.floor(cameraCenterX) + halfX + buffer),
    endY: Math.min(mapHeight - 1, Math.floor(cameraCenterY) + halfY + buffer),
  };
}
