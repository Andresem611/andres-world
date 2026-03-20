/**
 * Tile map type definitions for the React DOM renderer.
 * Replaces Tiled JSON with TypeScript 2D arrays.
 */

/** A single tile ID. 0 = empty/transparent. Positive = global tile ID from a tileset. */
export type TileId = number;

/** A 2D grid of tile IDs: rows[y][x]. */
export type TileLayer = TileId[][];

/** Complete map data with named layers. */
export interface MapData {
  width: number;
  height: number;
  tileSize: number; // pixel size of each tile (16 for LimeZu)
  layers: {
    ground: TileLayer;
    above: TileLayer;
    collision: TileLayer; // 0 = walkable, 1 = blocked
  };
}

/** Configuration for a single tileset sprite sheet. */
export interface TilesetConfig {
  /** Display name (e.g. "terrains") */
  name: string;
  /** Path to the PNG sprite sheet relative to public/ */
  imagePath: string;
  /** Pixel size of each tile in the sheet */
  tileSize: number;
  /** Number of columns in the sprite sheet */
  columns: number;
  /** Total number of tiles in the sheet */
  tileCount: number;
  /** First global ID for this tileset (1-based, Tiled convention) */
  firstGid: number;
}

/** CSS style for rendering a single tile from a sprite sheet. */
export interface TileStyle {
  backgroundImage: string;
  backgroundPosition: string;
  backgroundSize: string;
  width: number;
  height: number;
}

/** Rectangle defining the visible tile range. */
export interface ViewportRect {
  startX: number;
  startY: number;
  endX: number;
  endY: number;
}
