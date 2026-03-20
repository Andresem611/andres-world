/**
 * TileRenderer — renders visible tiles from MapData as positioned DOM elements.
 * Each tile is a div with CSS background-image/background-position from the tileset.
 * Only tiles within the viewport range are rendered (culling).
 */

import React, { useMemo } from "react";
import type { MapData, ViewportRect, TilesetConfig } from "../types/map";
import { getTileStyle, TILESETS } from "../maps/tilesets";

interface TileRendererProps {
  mapData: MapData;
  viewport: ViewportRect;
  tilesets?: TilesetConfig[];
}

interface RenderedTile {
  key: string;
  x: number;
  y: number;
  gid: number;
  layer: "ground" | "above";
}

export const TileRenderer = React.memo(function TileRenderer({
  mapData,
  viewport,
  tilesets,
}: TileRendererProps) {
  const activeTilesets = tilesets || TILESETS;

  const tiles = useMemo(() => {
    const result: RenderedTile[] = [];
    const { startX, startY, endX, endY } = viewport;

    for (let y = startY; y <= endY; y++) {
      for (let x = startX; x <= endX; x++) {
        const groundGid = mapData.layers.ground[y]?.[x] ?? 0;
        if (groundGid > 0) {
          result.push({ key: `g-${x}-${y}`, x, y, gid: groundGid, layer: "ground" });
        }
        const aboveGid = mapData.layers.above[y]?.[x] ?? 0;
        if (aboveGid > 0) {
          result.push({ key: `a-${x}-${y}`, x, y, gid: aboveGid, layer: "above" });
        }
      }
    }
    return result;
  }, [mapData, viewport]);

  return (
    <>
      {tiles.map((tile) => {
        const style = getTileStyle(tile.gid, activeTilesets);
        if (!style) return null;
        return (
          <div
            key={tile.key}
            style={{
              position: "absolute",
              left: tile.x * mapData.tileSize,
              top: tile.y * mapData.tileSize,
              width: style.width,
              height: style.height,
              backgroundImage: style.backgroundImage,
              backgroundPosition: style.backgroundPosition,
              backgroundSize: style.backgroundSize,
              imageRendering: "pixelated" as const,
              zIndex: tile.layer === "above" ? 2 : 1,
            }}
          />
        );
      })}
    </>
  );
});
