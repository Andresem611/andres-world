/**
 * NpcSprite — renders an NPC at their grid position.
 * Uses the NPC's 32×32 PNG sprite (single frame, no animation).
 */

import React, { useMemo } from "react";

interface NpcSpriteProps {
  id: string;
  x: number;
  y: number;
  spriteKey: string;
  tileSize: number;
}

export const NpcSprite = React.memo(function NpcSprite({
  id,
  x,
  y,
  spriteKey,
  tileSize,
}: NpcSpriteProps) {
  const spritePath = `./assets/sprites/${spriteKey}.png`;

  const style = useMemo(
    () => ({
      position: "absolute" as const,
      left: x * tileSize,
      top: y * tileSize - (32 - tileSize), // offset up so feet align with tile (sprite is 32px, tile is 16px)
      width: 32,
      height: 32,
      backgroundImage: `url(${spritePath})`,
      backgroundSize: "32px 32px",
      imageRendering: "pixelated" as const,
      zIndex: 5,
    }),
    [x, y, tileSize, spritePath],
  );

  return <div style={style} className={`npc-sprite npc-${id}`} />;
});
