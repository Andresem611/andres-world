/**
 * GameContainer — top-level game component.
 * Manages movement, NPCs, interactions, dialog, scene transitions, and camera.
 */

import { useEffect, useCallback, useRef } from "react";
import { Direction } from "grid-engine";
import { OVERWORLD_MAP } from "../maps/overworld";
import { CameraViewport } from "./CameraViewport";
import { DialogBox } from "./DialogBox";
import { InteriorView } from "./InteriorView";
import { useGridEngine } from "../hooks/useGridEngine";
import { useDialog } from "../hooks/useDialog";
import { useSceneTransition } from "../hooks/useSceneTransition";
import NPC_CONFIG from "../game/config/npcs";
import { DIALOGUE } from "../content/dialogue";
import { INTERACTION_MAP } from "../maps/interactions";

const KEY_TO_DIRECTION: Record<string, Direction> = {
  ArrowLeft: Direction.LEFT,
  ArrowRight: Direction.RIGHT,
  ArrowUp: Direction.UP,
  ArrowDown: Direction.DOWN,
  a: Direction.LEFT,
  d: Direction.RIGHT,
  w: Direction.UP,
  s: Direction.DOWN,
};

const FACING_OFFSET: Record<string, { dx: number; dy: number }> = {
  [Direction.UP]: { dx: 0, dy: -1 },
  [Direction.DOWN]: { dx: 0, dy: 1 },
  [Direction.LEFT]: { dx: -1, dy: 0 },
  [Direction.RIGHT]: { dx: 1, dy: 0 },
};

export function GameContainer() {
  const { playerState, move, engine, setPosition } = useGridEngine();
  const { dialog, openDialog, advanceDialog, closeDialog } = useDialog();
  const { scene, enterInterior, exitInterior } = useSceneTransition();
  const npcPositionsRef = useRef<Map<string, { x: number; y: number }>>(new Map());
  const patrolInitRef = useRef(false);

  // Track NPC positions
  useEffect(() => {
    if (!engine.current) return;
    const map = new Map<string, { x: number; y: number }>();
    for (const npc of NPC_CONFIG) {
      try {
        const pos = engine.current.getPosition(npc.id);
        map.set(npc.id, pos);
      } catch {
        map.set(npc.id, npc.startPosition);
      }
    }
    npcPositionsRef.current = map;
  });

  // Add NPCs to GridEngine
  useEffect(() => {
    if (!engine.current) return;
    for (const npc of NPC_CONFIG) {
      try {
        engine.current.getPosition(npc.id);
      } catch {
        engine.current.addCharacter({
          id: npc.id,
          startPosition: npc.startPosition,
          speed: npc.patrol ? 2 : 0,
          facingDirection: npc.facingDirection,
          collides: npc.patrol ? false : true,
        });
      }
    }
    if (!patrolInitRef.current) {
      patrolInitRef.current = true;
      const john = NPC_CONFIG.find((n) => n.id === "john-collison");
      if (john && "patrolPath" in john) {
        startPatrol(engine.current, john.id);
      }
    }
  }, [engine]);

  // Handle return from interior — move player to return position
  useEffect(() => {
    if (scene.type === "overworld" && scene.returnPos && engine.current) {
      setPosition(scene.returnPos.x, scene.returnPos.y);
    }
  }, [scene.type, scene.returnPos]);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (dialog.isOpen) return;
      if (scene.type !== "overworld") return;

      if (e.key === " " || e.key === "e" || e.key === "E") {
        e.preventDefault();
        tryInteract();
        return;
      }

      const direction = KEY_TO_DIRECTION[e.key];
      if (direction) {
        move(direction);
        e.preventDefault();
      }
    },
    [dialog.isOpen, move, playerState, scene.type],
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  function tryInteract() {
    const facing = playerState.facing;
    const offset = FACING_OFFSET[facing] || { dx: 0, dy: -1 };
    const targetX = playerState.x + offset.dx;
    const targetY = playerState.y + offset.dy;

    // Check NPC positions first
    for (const npc of NPC_CONFIG) {
      const pos = npcPositionsRef.current.get(npc.id) || npc.startPosition;
      if (pos.x === targetX && pos.y === targetY) {
        const dialogEntry = DIALOGUE[npc.dialogId];
        if (dialogEntry) {
          if (engine.current) {
            const reverse: Record<string, Direction> = {
              [Direction.UP]: Direction.DOWN,
              [Direction.DOWN]: Direction.UP,
              [Direction.LEFT]: Direction.RIGHT,
              [Direction.RIGHT]: Direction.LEFT,
            };
            engine.current.turnTowards(npc.id, reverse[facing]);
          }
          openDialog(dialogEntry, npc.name);
        }
        return;
      }
    }

    // Check interaction map (signs, buildings, under-construction)
    const key = `${targetX},${targetY}`;
    const interaction = INTERACTION_MAP.get(key);
    if (interaction) {
      switch (interaction.type) {
        case "sign":
        case "under_construction":
          if (interaction.dialog) {
            openDialog(interaction.dialog, interaction.type === "sign" ? "Sign" : "⚠️");
          }
          break;
        case "building":
          if (interaction.interiorKey && interaction.returnPos) {
            enterInterior(interaction.interiorKey, interaction.returnPos);
          }
          break;
      }
    }
  }

  // Get NPC render data
  const npcRenderData = NPC_CONFIG.map((npc) => ({
    ...npc,
    currentPos: npcPositionsRef.current.get(npc.id) || npc.startPosition,
  }));

  // Fade overlay for transitions
  const showFade = scene.transitioning;

  if (scene.type === "interior" && scene.interiorKey) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", width: "100vw", height: "100vh", backgroundColor: "#0a0a1a", position: "relative" }}>
        <InteriorView interiorKey={scene.interiorKey} onExit={exitInterior} />
        {showFade && <div style={fadeStyle} />}
      </div>
    );
  }

  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", width: "100vw", height: "100vh", backgroundColor: "#0a0a1a", position: "relative" }}>
      <div style={{ position: "relative" }}>
        <CameraViewport
          mapData={OVERWORLD_MAP}
          cameraX={playerState.x}
          cameraY={playerState.y}
          playerState={playerState}
          npcs={npcRenderData}
        />
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
      {showFade && <div style={fadeStyle} />}
    </div>
  );
}

const fadeStyle: React.CSSProperties = {
  position: "fixed",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: "#000",
  zIndex: 200,
  transition: "opacity 0.3s",
};

/** Start back-and-forth patrol for an NPC. */
function startPatrol(engine: import("grid-engine").GridEngineHeadless, npcId: string) {
  let goingNorth = true;

  function doPatrol() {
    const dir = goingNorth ? Direction.UP : Direction.DOWN;
    engine.move(npcId, dir);
  }

  engine.movementStopped().subscribe(({ charId }) => {
    if (charId === npcId) {
      goingNorth = !goingNorth;
      setTimeout(() => doPatrol(), 200);
    }
  });

  doPatrol();

  setInterval(() => {
    if (engine.isMoving(npcId)) return;
    doPatrol();
  }, 500);
}
