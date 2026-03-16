import Phaser from "phaser";
import { Direction } from "grid-engine";
import NPC_CONFIG from "../config/npcs";
import { DIALOGUE } from "../../content/dialogue";
import { DialogBox, InteractionPayload } from "../ui/DialogBox";
import type { InteriorTransitionData, OverworldReturnData } from "../../types/scene-data";

export class OverworldScene extends Phaser.Scene {
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private wasd!: {
    up: Phaser.Input.Keyboard.Key;
    down: Phaser.Input.Keyboard.Key;
    left: Phaser.Input.Keyboard.Key;
    right: Phaser.Input.Keyboard.Key;
  };

  private spaceKey!: Phaser.Input.Keyboard.Key;
  private eKey!: Phaser.Input.Keyboard.Key;
  private dialogBox!: DialogBox;
  private dialogOpen = false;
  private interactionMap = new Map<string, InteractionPayload>();
  private npcSprites: Map<string, Phaser.GameObjects.Sprite> = new Map();
  private onDialogClose: (() => void) | null = null;

  private johnPatrolDirection: "north" | "south" = "north";
  private johnDialogOpen = false;
  private patrolSubscription: { unsubscribe: () => void } | null = null;

  constructor() {
    super({ key: "Overworld" });
  }

  create(data?: { returnFrom?: { returnPos: { x: number; y: number }; buildingKey: string } }): void {
    // 1. Build tilemap from preloaded JSON
    const map = this.make.tilemap({ key: "overworld" });

    // addTilesetImage(tiledTilesetName, phaserImageKey)
    // First arg MUST match tilesets[N].name in overworld.json exactly.
    // 5 LimeZu tilesets in GID order (matching generate-map.ts TILESET_ORDER):
    const terrains  = map.addTilesetImage("terrains",  "terrains")!;
    const beach     = map.addTilesetImage("beach",     "beach")!;
    const buildings = map.addTilesetImage("buildings", "buildings")!;
    const garden    = map.addTilesetImage("garden",    "garden")!;
    const worksite  = map.addTilesetImage("worksite",  "worksite")!;
    const villas    = map.addTilesetImage("villas",    "villas")!;
    const allTilesets = [terrains, beach, buildings, garden, worksite, villas];

    // 2. Create all layers in order (bottom to top draw order)
    //    ALL createLayer() calls MUST complete before gridEngine.create() is called
    map.createLayer("Ground",    allTilesets, 0, 0);
    map.createLayer("Above",     allTilesets, 0, 0);
    const collisionLayer = map.createLayer("Collision", allTilesets, 0, 0);
    collisionLayer?.setVisible(false); // Collision layer is invisible at runtime

    // 3. Player sprite — position is managed by Grid Engine, not Phaser physics
    const playerSprite = this.add.sprite(0, 0, "player");

    // 4. Camera — follow player, clamp to map bounds, 4x zoom for pixel art clarity
    this.cameras.main.startFollow(playerSprite, true);
    this.cameras.main.setFollowOffset(
      -playerSprite.width / 2,
      -playerSprite.height / 2
    );
    this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
    this.cameras.main.setZoom(4); // 4x zoom — 16px tiles at 4x = 64px apparent size

    // 5. Keyboard — created once in create(), NOT in update().
    //    Creating key objects every frame discards the previous frame's objects
    //    and their event listeners, breaking isDown state tracking.
    //    addCapture prevents arrow keys from scrolling the browser page.
    const { LEFT, RIGHT, UP, DOWN } = Phaser.Input.Keyboard.KeyCodes;
    this.cursors = this.input.keyboard!.createCursorKeys();
    this.wasd = this.input.keyboard!.addKeys({
      up: Phaser.Input.Keyboard.KeyCodes.W,
      down: Phaser.Input.Keyboard.KeyCodes.S,
      left: Phaser.Input.Keyboard.KeyCodes.A,
      right: Phaser.Input.Keyboard.KeyCodes.D,
    }) as typeof this.wasd;
    this.input.keyboard!.addCapture([LEFT, RIGHT, UP, DOWN]);

    // Space/E keys — used for interaction (JustDown to avoid repeat fire every frame)
    this.spaceKey = this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    this.eKey = this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.E);

    // 6. Spawn NPC sprites — position is managed by Grid Engine
    for (const npc of NPC_CONFIG) {
      const sprite = this.add.sprite(0, 0, npc.spriteKey);
      this.npcSprites.set(npc.id, sprite);
    }

    // 7. Grid Engine — MUST be called after all createLayer() calls
    //    Includes player + all NPC characters
    this.gridEngine.create(map, {
      characters: [
        {
          id: "player",
          sprite: playerSprite,
          walkingAnimationMapping: 0, // Row 0 = first character in sprite sheet
          startPosition: data?.returnFrom?.returnPos ?? { x: 25, y: 38 }, // South dock, facing north
          facingDirection: Direction.UP,
          speed: 4, // tiles/second — Pokemon-feel pacing
        },
        ...NPC_CONFIG.map(npc => ({
          id: npc.id,
          sprite: this.npcSprites.get(npc.id)!,
          startPosition: { x: npc.startPosition.x, y: npc.startPosition.y },
          facingDirection: npc.facingDirection ?? Direction.DOWN,
          collides: false, // All NPCs non-blocking — player walks through them
          // walkingAnimationMapping omitted for static NPCs (no walk animation frames)
        })),
      ],
    });

    // 8. Handle return from interior — reposition player and fade in
    const returnData = data?.returnFrom as OverworldReturnData | undefined;
    if (returnData?.returnPos) {
      this.gridEngine.setPosition("player", returnData.returnPos);
      if (returnData.facingDirection) {
        const dirMap: Record<string, Direction> = {
          up: Direction.UP, down: Direction.DOWN,
          left: Direction.LEFT, right: Direction.RIGHT,
        };
        const dir = dirMap[returnData.facingDirection];
        if (dir) this.gridEngine.turnTowards("player", dir);
      }
      // Fade in from black (matching interior's fade out)
      this.cameras.main.fadeIn(300, 0, 0, 0);
    }

    // 9. Create DialogBox (camera-fixed, depth 100, hidden by default)
    this.dialogBox = new DialogBox(this);

    // 10. Build interactionMap — registered by tile coordinate "x,y"
    //     Register NPCs at their start positions
    for (const npc of NPC_CONFIG) {
      this.interactionMap.set(`${npc.startPosition.x},${npc.startPosition.y}`, {
        type: "npc",
        id: npc.id,
        dialog: DIALOGUE[npc.dialogId]?.lines ?? ["..."],
      });
    }
    // Register building entrances (player faces INTO building wall tile)
    this.interactionMap.set("13,22", { type: "building", key: "ThovenHQ", returnPos: { x: 13, y: 23 } });
    this.interactionMap.set("9,22", { type: "building", key: "AndresRoom", returnPos: { x: 9, y: 23 } });
    // Register under-construction buildings
    this.interactionMap.set("20,13", { type: "under_construction", message: DIALOGUE["under-construction-default"]?.lines[0] ?? "Under construction." });
    this.interactionMap.set("30,20", { type: "under_construction", message: DIALOGUE["under-construction-default"]?.lines[0] ?? "Under construction." });
    // Register welcome sign near dock
    this.interactionMap.set("25,36", { type: "sign", text: DIALOGUE["welcome-sign"]?.lines ?? ["Welcome to Andres World."] });

    // 11. Scene shutdown cleanup — prevents memory leaks from open dialog
    this.events.on("shutdown", () => {
      // Unsubscribe patrol observable to prevent memory leak
      this.patrolSubscription?.unsubscribe();
      // Explicitly close dialog if scene shuts down mid-conversation
      this.dialogBox?.close();
    });

    // 12. Start John Collison's patrol after all setup is complete
    this.initJohnPatrol();
  }

  update(): void {
    const spaceJustDown = Phaser.Input.Keyboard.JustDown(this.spaceKey);
    const eJustDown = Phaser.Input.Keyboard.JustDown(this.eKey);

    // Dialog mode — only Space/E allowed (no movement)
    if (this.dialogOpen) {
      if (spaceJustDown || eJustDown) {
        const closed = this.dialogBox.advance();
        if (closed) {
          this.dialogOpen = false;
          this.onDialogClose?.();
          this.onDialogClose = null;
        }
      }
      return; // block all movement
    }

    // Interaction check — player presses Space/E while NOT in dialog
    if (spaceJustDown || eJustDown) {
      const facingPos = this.gridEngine.getFacingPosition("player");
      const key = `${facingPos.x},${facingPos.y}`;
      const interaction = this.interactionMap.get(key);
      if (interaction) {
        this.handleInteraction(interaction);
        return;
      }
    }

    // Normal movement (unchanged from original)
    // Priority: left > right > up > down (only one direction per frame)
    if (this.cursors.left.isDown || this.wasd.left.isDown) {
      this.gridEngine.move("player", Direction.LEFT);
    } else if (this.cursors.right.isDown || this.wasd.right.isDown) {
      this.gridEngine.move("player", Direction.RIGHT);
    } else if (this.cursors.up.isDown || this.wasd.up.isDown) {
      this.gridEngine.move("player", Direction.UP);
    } else if (this.cursors.down.isDown || this.wasd.down.isDown) {
      this.gridEngine.move("player", Direction.DOWN);
    }
  }

  private initJohnPatrol(): void {
    const northPath = Array(10).fill(Direction.UP);
    const southPath = Array(10).fill(Direction.DOWN);

    // Start John walking north
    this.gridEngine.addQueueMovements("john-collison", northPath);

    // When movement queue empties, re-queue reverse direction
    this.patrolSubscription = this.gridEngine.movementStopped().subscribe(({ charId }: { charId: string }) => {
      if (charId !== "john-collison" || this.johnDialogOpen) return;
      this.johnPatrolDirection = this.johnPatrolDirection === "north" ? "south" : "north";
      const path = this.johnPatrolDirection === "north" ? northPath : southPath;
      this.gridEngine.addQueueMovements("john-collison", path);
    });
  }

  private handleInteraction(payload: InteractionPayload): void {
    switch (payload.type) {
      case "npc": {
        // Turn NPC to face player
        const playerFacing = this.gridEngine.getFacingDirection("player");
        const opposite: Record<string, Direction> = {
          [Direction.UP]: Direction.DOWN,
          [Direction.DOWN]: Direction.UP,
          [Direction.LEFT]: Direction.RIGHT,
          [Direction.RIGHT]: Direction.LEFT,
        };
        this.gridEngine.turnTowards(payload.id, opposite[playerFacing] ?? Direction.DOWN);

        // Pause John's patrol if he's the one being talked to
        if (payload.id === "john-collison") {
          this.gridEngine.stopMovement("john-collison");
          this.johnDialogOpen = true;
          // Resume patrol after dialog closes
          this.onDialogClose = () => {
            this.johnDialogOpen = false;
            const resumePath = this.johnPatrolDirection === "north"
              ? Array(10).fill(Direction.UP)
              : Array(10).fill(Direction.DOWN);
            this.gridEngine.addQueueMovements("john-collison", resumePath);
          };
        }

        this.dialogBox.show(payload.dialog);
        this.dialogOpen = true;
        break;
      }
      case "sign":
        this.dialogBox.show(payload.text);
        this.dialogOpen = true;
        break;
      case "building": {
        // Camera fade out, then transition to interior scene
        const transitionData: InteriorTransitionData = {
          buildingKey: payload.key,
          returnPos: payload.returnPos,
          entryPos: payload.entryPos ?? { x: 3, y: 6 }, // default entry near bottom-center
        };
        this.cameras.main.fadeOut(300, 0, 0, 0);
        this.cameras.main.once("camerafadeoutcomplete", () => {
          // Try named scene first (e.g. "ThovenHQ"), fall back to InteriorStub
          if (this.scene.get(payload.key)) {
            this.scene.start(payload.key, transitionData);
          } else {
            this.scene.start("InteriorStub", {
              returnPos: payload.returnPos,
              buildingKey: payload.key,
            });
          }
        });
        break;
      }
      case "under_construction":
        this.dialogBox.show([payload.message]);
        this.dialogOpen = true;
        break;
    }
  }
}
