/**
 * PlayerSprite — renders the player character at grid position with walk animation.
 * Uses CSS sprite-sheet animation from player.png (96×128, 3 frames × 4 rows).
 * Row order (PIPOYA): 0=Down, 1=Left, 2=Right, 3=Up.
 */

import React, { useMemo } from "react";
import { Direction } from "grid-engine";

const SPRITE_SHEET = "./assets/sprites/player.png";
const FRAME_WIDTH = 32;
const FRAME_HEIGHT = 32;
const FRAMES_PER_ROW = 3;
const ANIM_SPEED = 150; // ms per frame

interface PlayerSpriteProps {
  x: number;
  y: number;
  facing: Direction;
  isMoving: boolean;
  tileSize: number;
}

const DIRECTION_ROW: Record<string, number> = {
  [Direction.DOWN]: 0,
  [Direction.LEFT]: 1,
  [Direction.RIGHT]: 2,
  [Direction.UP]: 3,
};

export const PlayerSprite = React.memo(function PlayerSprite({
  x,
  y,
  facing,
  isMoving,
  tileSize,
}: PlayerSpriteProps) {
  const row = DIRECTION_ROW[facing] ?? 0;
  // Idle = middle frame (frame 1), walking = animate through frames 0-1-2
  const idleFrame = 1;

  const style = useMemo(
    () => ({
      position: "absolute" as const,
      // Center sprite on tile — sprite is 32px but rendered at tile scale
      left: x * tileSize,
      top: y * tileSize - (FRAME_HEIGHT - tileSize), // offset up so feet align with tile
      width: FRAME_WIDTH,
      height: FRAME_HEIGHT,
      backgroundImage: `url(${SPRITE_SHEET})`,
      backgroundPosition: isMoving
        ? undefined // will be handled by animation
        : `-${idleFrame * FRAME_WIDTH}px -${row * FRAME_HEIGHT}px`,
      backgroundSize: `${FRAME_WIDTH * FRAMES_PER_ROW}px ${FRAME_HEIGHT * 4}px`,
      imageRendering: "pixelated" as const,
      zIndex: 10,
      // Walk animation uses CSS steps
      ...(isMoving
        ? {
            animation: `walk-${facing} ${ANIM_SPEED * FRAMES_PER_ROW}ms steps(${FRAMES_PER_ROW}) infinite`,
          }
        : {}),
    }),
    [x, y, facing, isMoving, tileSize],
  );

  return (
    <>
      {/* Inject keyframe animations if not already present */}
      <style>{`
        @keyframes walk-down {
          from { background-position: 0px -${0 * FRAME_HEIGHT}px; }
          to { background-position: -${FRAME_WIDTH * FRAMES_PER_ROW}px -${0 * FRAME_HEIGHT}px; }
        }
        @keyframes walk-left {
          from { background-position: 0px -${1 * FRAME_HEIGHT}px; }
          to { background-position: -${FRAME_WIDTH * FRAMES_PER_ROW}px -${1 * FRAME_HEIGHT}px; }
        }
        @keyframes walk-right {
          from { background-position: 0px -${2 * FRAME_HEIGHT}px; }
          to { background-position: -${FRAME_WIDTH * FRAMES_PER_ROW}px -${2 * FRAME_HEIGHT}px; }
        }
        @keyframes walk-up {
          from { background-position: 0px -${3 * FRAME_HEIGHT}px; }
          to { background-position: -${FRAME_WIDTH * FRAMES_PER_ROW}px -${3 * FRAME_HEIGHT}px; }
        }
      `}</style>
      <div style={style} className="player-sprite" />
    </>
  );
});
