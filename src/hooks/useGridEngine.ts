/**
 * useGridEngine — React hook wrapping GridEngineHeadless.
 * Manages movement state, position updates, and game loop tick.
 */

import { useEffect, useRef, useState, useCallback } from "react";
import { GridEngineHeadless, Direction } from "grid-engine";
import { createOverworldTilemap } from "../maps/collision";

const SPAWN_X = 25;
const SPAWN_Y = 38;
const TICK_MS = 50; // 20 FPS for grid engine update
const PLAYER_SPEED = 4;

export interface PlayerState {
  x: number;
  y: number;
  facing: Direction;
  isMoving: boolean;
}

export function useGridEngine() {
  const engineRef = useRef<GridEngineHeadless | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const [playerState, setPlayerState] = useState<PlayerState>({
    x: SPAWN_X,
    y: SPAWN_Y,
    facing: Direction.UP,
    isMoving: false,
  });

  // Initialize engine
  useEffect(() => {
    const engine = new GridEngineHeadless();
    const tilemap = createOverworldTilemap();

    engine.create(tilemap, {
      characters: [
        {
          id: "player",
          startPosition: { x: SPAWN_X, y: SPAWN_Y },
          speed: PLAYER_SPEED,
          facingDirection: Direction.UP,
        },
      ],
    });

    // Subscribe to position changes
    engine.positionChangeStarted().subscribe(({ charId }) => {
      if (charId === "player") {
        setPlayerState((prev) => ({ ...prev, isMoving: true }));
      }
    });

    engine.positionChangeFinished().subscribe(({ charId, enterTile }) => {
      if (charId === "player") {
        setPlayerState((prev) => ({
          ...prev,
          x: enterTile.x,
          y: enterTile.y,
          isMoving: false,
        }));
      }
    });

    engine.directionChanged().subscribe(({ charId, direction }) => {
      if (charId === "player") {
        setPlayerState((prev) => ({ ...prev, facing: direction }));
      }
    });

    engineRef.current = engine;

    // Game loop tick
    intervalRef.current = setInterval(() => {
      engine.update(0, TICK_MS);
    }, TICK_MS);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      engineRef.current = null;
    };
  }, []);

  const move = useCallback((direction: Direction) => {
    engineRef.current?.move("player", direction);
  }, []);

  const getPosition = useCallback(() => {
    if (!engineRef.current) return { x: SPAWN_X, y: SPAWN_Y };
    return engineRef.current.getPosition("player");
  }, []);

  const getFacingDirection = useCallback(() => {
    if (!engineRef.current) return Direction.UP;
    return engineRef.current.getFacingDirection("player");
  }, []);

  const setPosition = useCallback((x: number, y: number) => {
    if (engineRef.current) {
      engineRef.current.setPosition("player", { x, y });
      setPlayerState((prev) => ({ ...prev, x, y }));
    }
  }, []);

  return {
    playerState,
    move,
    setPosition,
    getPosition,
    getFacingDirection,
    engine: engineRef,
  };
}

export { Direction };
