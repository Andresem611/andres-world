/**
 * CameraViewport — wraps TileRenderer + PlayerSprite + NPC sprites.
 * Uses CSS transform to position camera and zoom 4x.
 */

import React, { useMemo } from "react";
import type { MapData } from "../types/map";
import { getVisibleTileRange } from "../maps/tilesets";
import { TileRenderer } from "./TileRenderer";
import { PlayerSprite } from "./PlayerSprite";
import { NpcSprite } from "./NpcSprite";
import type { PlayerState } from "../hooks/useGridEngine";

const ZOOM = 4;
const VIEWPORT_WIDTH = 800;
const VIEWPORT_HEIGHT = 600;

interface NpcRenderData {
  id: string;
  spriteKey: string;
  currentPos: { x: number; y: number };
}

interface CameraViewportProps {
  mapData: MapData;
  cameraX: number;
  cameraY: number;
  playerState?: PlayerState;
  npcs?: NpcRenderData[];
}

export const CameraViewport = React.memo(function CameraViewport({
  mapData,
  cameraX,
  cameraY,
  playerState,
  npcs,
}: CameraViewportProps) {
  const viewport = useMemo(
    () =>
      getVisibleTileRange(
        cameraX,
        cameraY,
        VIEWPORT_WIDTH,
        VIEWPORT_HEIGHT,
        mapData.tileSize,
        ZOOM,
        mapData.width,
        mapData.height,
      ),
    [cameraX, cameraY, mapData],
  );

  // Camera offset: center on the given tile position
  const offsetX = -(cameraX * mapData.tileSize * ZOOM) + VIEWPORT_WIDTH / 2;
  const offsetY = -(cameraY * mapData.tileSize * ZOOM) + VIEWPORT_HEIGHT / 2;

  // Clamp to map edges
  const minOffsetX = -(mapData.width * mapData.tileSize * ZOOM - VIEWPORT_WIDTH);
  const minOffsetY = -(mapData.height * mapData.tileSize * ZOOM - VIEWPORT_HEIGHT);

  const clampedX = Math.min(0, Math.max(minOffsetX, offsetX));
  const clampedY = Math.min(0, Math.max(minOffsetY, offsetY));

  // Filter NPCs to only those in or near the viewport
  const visibleNpcs = useMemo(() => {
    if (!npcs) return [];
    return npcs.filter(
      (npc) =>
        npc.currentPos.x >= viewport.startX - 2 &&
        npc.currentPos.x <= viewport.endX + 2 &&
        npc.currentPos.y >= viewport.startY - 2 &&
        npc.currentPos.y <= viewport.endY + 2,
    );
  }, [npcs, viewport]);

  return (
    <div
      className="camera-viewport"
      style={{
        width: VIEWPORT_WIDTH,
        height: VIEWPORT_HEIGHT,
        overflow: "hidden",
        position: "relative",
        backgroundColor: "#1a1a2e",
      }}
    >
      <div
        className="camera-world"
        style={{
          position: "absolute",
          width: mapData.width * mapData.tileSize,
          height: mapData.height * mapData.tileSize,
          transform: `translate(${clampedX}px, ${clampedY}px) scale(${ZOOM})`,
          transformOrigin: "0 0",
          willChange: "transform",
          imageRendering: "pixelated" as const,
        }}
      >
        <TileRenderer mapData={mapData} viewport={viewport} />
        {visibleNpcs.map((npc) => (
          <NpcSprite
            key={npc.id}
            id={npc.id}
            x={npc.currentPos.x}
            y={npc.currentPos.y}
            spriteKey={npc.spriteKey}
            tileSize={mapData.tileSize}
          />
        ))}
        {playerState && (
          <PlayerSprite
            x={playerState.x}
            y={playerState.y}
            facing={playerState.facing}
            isMoving={playerState.isMoving}
            tileSize={mapData.tileSize}
          />
        )}
      </div>
    </div>
  );
});

export { ZOOM, VIEWPORT_WIDTH, VIEWPORT_HEIGHT };
