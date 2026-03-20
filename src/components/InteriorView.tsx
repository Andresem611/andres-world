/**
 * InteriorView — renders an interior room with tile grid, interactions, and NPCs.
 * Handles interior-specific movement, interactions, and exit detection.
 */

import { useEffect, useCallback, useRef, useState } from "react";
import { Direction, GridEngineHeadless, ArrayTilemap } from "grid-engine";
import { INTERIOR_MAPS } from "../maps/interiors";
import { INTERIOR_TILESETS } from "../maps/tilesets";
import { TileRenderer } from "./TileRenderer";
import { PlayerSprite } from "./PlayerSprite";
import { DialogBox } from "./DialogBox";
import { useDialog } from "../hooks/useDialog";
import { DIALOGUE } from "../content/dialogue";
import type { PlayerState } from "../hooks/useGridEngine";

const ZOOM = 4;
const VIEWPORT_WIDTH = 800;
const VIEWPORT_HEIGHT = 600;
const TICK_MS = 50;

interface InteriorViewProps {
  interiorKey: string;
  onExit: () => void;
}

// Interior-specific interaction maps
const INTERIOR_INTERACTIONS: Record<string, Record<string, { dialogId: string; speaker?: string }>> = {
  "andres-room": {
    "3,3": { dialogId: "room-bed", speaker: "Bed" },
    "5,2": { dialogId: "room-pc", speaker: "PC" },
    "7,3": { dialogId: "room-dj", speaker: "DJ Booth" },
    "1,3": { dialogId: "room-bookshelf", speaker: "Bookshelf" },
    "2,1": { dialogId: "room-jersey", speaker: "Wall" },
    "3,1": { dialogId: "room-flags", speaker: "Wall" },
    "5,1": { dialogId: "room-pennant", speaker: "Wall" },
    "6,1": { dialogId: "room-poster", speaker: "Wall" },
    "8,1": { dialogId: "room-window", speaker: "Window" },
  },
  "thoven-hq": {
    "5,1": { dialogId: "thoven-metrics", speaker: "Metrics Board" },
    "7,1": { dialogId: "thoven-shipped", speaker: "Shipped Board" },
    "2,1": { dialogId: "thoven-practice-piano", speaker: "Door" },
    "3,1": { dialogId: "thoven-practice-guitar", speaker: "Door" },
    "9,1": { dialogId: "thoven-practice-voice", speaker: "Door" },
    "10,1": { dialogId: "thoven-practice-violin", speaker: "Door" },
    "11,3": { dialogId: "thoven-pc", speaker: "PC" },
  },
  "starbucks": {
    "7,3": { dialogId: "cafe-barista", speaker: "Barista" },
    "2,4": { dialogId: "cafe-essay-1", speaker: "Book" },
    "5,5": { dialogId: "cafe-essay-2", speaker: "Book" },
  },
  "engineering-lab": {
    "2,2": { dialogId: "lab-experiment-1", speaker: "Monitor" },
    "4,2": { dialogId: "lab-experiment-2", speaker: "Monitor" },
    "6,2": { dialogId: "lab-experiment-3", speaker: "Monitor" },
    "8,1": { dialogId: "lab-stack-wall", speaker: "Wall" },
    "1,5": { dialogId: "lab-rubber-duck", speaker: "🦆" },
  },
};

// Interior NPCs
const INTERIOR_NPCS: Record<string, { id: string; name: string; spriteKey: string; dialogId: string; x: number; y: number }[]> = {
  "andres-room": [
    { id: "dad-interior", name: "Dad", spriteKey: "npc-dad", dialogId: "dad", x: 8, y: 4 },
    { id: "dog-1-interior", name: "Dog", spriteKey: "npc-dog-1", dialogId: "dog-1", x: 2, y: 5 },
    { id: "dog-2-interior", name: "Dog", spriteKey: "npc-dog-2", dialogId: "dog-2", x: 6, y: 5 },
  ],
  "thoven-hq": [
    { id: "keri-interior", name: "Keri", spriteKey: "npc-keri", dialogId: "keri", x: 6, y: 7 },
    { id: "seibel-interior", name: "Michael Seibel", spriteKey: "npc-michael-seibel", dialogId: "michael-seibel", x: 3, y: 5 },
    { id: "chesky-interior", name: "Brian Chesky", spriteKey: "npc-brian-chesky", dialogId: "brian-chesky", x: 8, y: 3 },
  ],
  "starbucks": [
    { id: "pg-interior", name: "Paul Graham", spriteKey: "npc-paul-graham", dialogId: "paul-graham", x: 2, y: 3 },
  ],
  "engineering-lab": [
    { id: "tobi-interior", name: "Tobi Lütke", spriteKey: "npc-tobi-lutke", dialogId: "tobi-lutke", x: 3, y: 4 },
    { id: "patrick-interior", name: "Patrick Collison", spriteKey: "npc-patrick-collison", dialogId: "patrick-collison", x: 5, y: 4 },
    { id: "dario-interior", name: "Dario Amodei", spriteKey: "npc-dario-amodei", dialogId: "dario-amodei", x: 7, y: 4 },
  ],
};

const FACING_OFFSET: Record<string, { dx: number; dy: number }> = {
  [Direction.UP]: { dx: 0, dy: -1 },
  [Direction.DOWN]: { dx: 0, dy: 1 },
  [Direction.LEFT]: { dx: -1, dy: 0 },
  [Direction.RIGHT]: { dx: 1, dy: 0 },
};

export function InteriorView({ interiorKey, onExit }: InteriorViewProps) {
  const mapData = INTERIOR_MAPS[interiorKey];
  const { dialog, openDialog, advanceDialog, closeDialog } = useDialog();
  const engineRef = useRef<GridEngineHeadless | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Player state for interior
  const playerStateRef = useRef<PlayerState>({
    x: Math.floor(mapData.width / 2),
    y: mapData.height - 2, // spawn near exit
    facing: Direction.UP,
    isMoving: false,
  });

  const [, forceUpdate] = useState(0);
  const triggerUpdate = useCallback(() => forceUpdate((v) => v + 1), []);

  // Initialize interior engine
  useEffect(() => {
    if (!mapData) return;

    const engine = new GridEngineHeadless();
    const tilemap = new ArrayTilemap({
      collision: { data: mapData.layers.collision },
    });

    const spawnX = Math.floor(mapData.width / 2);
    const spawnY = mapData.height - 2;

    engine.create(tilemap, {
      characters: [
        {
          id: "player",
          startPosition: { x: spawnX, y: spawnY },
          speed: 4,
          facingDirection: Direction.UP,
        },
      ],
    });

    // Add interior NPCs
    const npcs = INTERIOR_NPCS[interiorKey] || [];
    for (const npc of npcs) {
      engine.addCharacter({
        id: npc.id,
        startPosition: { x: npc.x, y: npc.y },
        speed: 0,
        facingDirection: Direction.DOWN,
      });
    }

    engine.positionChangeFinished().subscribe(({ charId, enterTile }) => {
      if (charId === "player") {
        playerStateRef.current = {
          ...playerStateRef.current,
          x: enterTile.x,
          y: enterTile.y,
          isMoving: false,
        };
        triggerUpdate();

        // Check for exit
        if (mapData.exitPositions.some((e) => e.x === enterTile.x && e.y === enterTile.y)) {
          onExit();
        }
      }
    });

    engine.positionChangeStarted().subscribe(({ charId }) => {
      if (charId === "player") {
        playerStateRef.current = { ...playerStateRef.current, isMoving: true };
        triggerUpdate();
      }
    });

    engine.directionChanged().subscribe(({ charId, direction }) => {
      if (charId === "player") {
        playerStateRef.current = { ...playerStateRef.current, facing: direction };
        triggerUpdate();
      }
    });

    engineRef.current = engine;
    intervalRef.current = setInterval(() => engine.update(0, TICK_MS), TICK_MS);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      engineRef.current = null;
    };
  }, [interiorKey, mapData]);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (dialog.isOpen) return;

      if (e.key === " " || e.key === "e" || e.key === "E") {
        e.preventDefault();
        tryInteract();
        return;
      }

      const keyMap: Record<string, Direction> = {
        ArrowUp: Direction.UP, ArrowDown: Direction.DOWN,
        ArrowLeft: Direction.LEFT, ArrowRight: Direction.RIGHT,
        w: Direction.UP, s: Direction.DOWN, a: Direction.LEFT, d: Direction.RIGHT,
      };
      const dir = keyMap[e.key];
      if (dir) {
        engineRef.current?.move("player", dir);
        e.preventDefault();
      }
    },
    [dialog.isOpen],
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  function tryInteract() {
    const ps = playerStateRef.current;
    const offset = FACING_OFFSET[ps.facing] || { dx: 0, dy: -1 };
    const tx = ps.x + offset.dx;
    const ty = ps.y + offset.dy;

    // Check interior NPCs
    const npcs = INTERIOR_NPCS[interiorKey] || [];
    for (const npc of npcs) {
      if (npc.x === tx && npc.y === ty) {
        const entry = DIALOGUE[npc.dialogId];
        if (entry) openDialog(entry, npc.name);
        return;
      }
    }

    // Check interior object interactions
    const interactions = INTERIOR_INTERACTIONS[interiorKey] || {};
    const key = `${tx},${ty}`;
    const interaction = interactions[key];
    if (interaction) {
      const entry = DIALOGUE[interaction.dialogId];
      if (entry) openDialog(entry, interaction.speaker);
    }
  }

  if (!mapData) return <div>Interior not found: {interiorKey}</div>;

  const ps = playerStateRef.current;
  const npcs = INTERIOR_NPCS[interiorKey] || [];

  // Camera centered on room (rooms are small enough to fit in viewport)
  const camX = mapData.width / 2;
  const camY = mapData.height / 2;
  const offsetX = -(camX * mapData.tileSize * ZOOM) + VIEWPORT_WIDTH / 2;
  const offsetY = -(camY * mapData.tileSize * ZOOM) + VIEWPORT_HEIGHT / 2;

  const fullViewport = {
    startX: 0, startY: 0,
    endX: mapData.width - 1, endY: mapData.height - 1,
  };

  return (
    <div style={{ position: "relative" }}>
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
            transform: `translate(${offsetX}px, ${offsetY}px) scale(${ZOOM})`,
            transformOrigin: "0 0",
            willChange: "transform",
            imageRendering: "pixelated" as const,
          }}
        >
          <TileRenderer mapData={mapData} viewport={fullViewport} tilesets={INTERIOR_TILESETS} />
          {npcs.map((npc) => (
            <div
              key={npc.id}
              style={{
                position: "absolute",
                left: npc.x * mapData.tileSize,
                top: npc.y * mapData.tileSize - 16,
                width: 32,
                height: 32,
                backgroundImage: `url(./assets/sprites/${npc.spriteKey}.png)`,
                backgroundSize: "32px 32px",
                imageRendering: "pixelated" as const,
                zIndex: 5,
              }}
            />
          ))}
          <PlayerSprite
            x={ps.x}
            y={ps.y}
            facing={ps.facing}
            isMoving={ps.isMoving}
            tileSize={mapData.tileSize}
          />
        </div>
      </div>
      {dialog.isOpen && dialog.entry && (
        <DialogBox
          lines={dialog.entry.lines}
          currentPage={dialog.currentPage}
          speaker={dialog.speaker || undefined}
          onAdvance={advanceDialog}
          onClose={closeDialog}
        />
      )}
    </div>
  );
}
