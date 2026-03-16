import { Direction } from "grid-engine";
import { InteriorBaseScene } from "./InteriorBaseScene";
import { DIALOGUE } from "../../content/dialogue";
import { DialogBox, InteractionPayload } from "../ui/DialogBox";

/**
 * AndresRoomScene — Andres's bedroom interior.
 *
 * Layout (10×8):
 *   Row 0-1: Walls (with window x=4-5, jersey x=7, flags x=2-3, pennant x=8, poster x=1)
 *   Row 2-4: Bed (x=1-2), PC desk (x=7-8)
 *   Row 4: DJ booth (x=7-8)
 *   Row 5-6: Bookshelf (x=1)
 *   Row 7: Exit door (x=4-5)
 *
 * NPCs: Dad (wandering), Dog-1, Dog-2
 * Interactable objects: bed, PC, DJ booth, bookshelf, jersey, flags, pennant, poster, window
 */
export class AndresRoomScene extends InteriorBaseScene {
  private dialogBox!: DialogBox;
  private dialogOpen = false;
  private interactionMap = new Map<string, InteractionPayload>();
  private spaceKey!: Phaser.Input.Keyboard.Key;
  private eKey!: Phaser.Input.Keyboard.Key;
  private npcSprites: Map<string, Phaser.GameObjects.Sprite> = new Map();

  constructor() {
    super("AndresRoom");
  }

  protected getMapKey(): string {
    return "andres-room";
  }

  protected onInteriorCreate(): void {
    // 1. Dialog box
    this.dialogBox = new DialogBox(this);

    // 2. Interaction keys
    this.spaceKey = this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    this.eKey = this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.E);

    // 3. Register furniture interactions (player faces INTO the object tile)
    // Bed — x=1-2, y=2-4. Player approaches from y=5 facing up, or x=3 facing left
    this.interactionMap.set("1,4", { type: "sign", text: DIALOGUE["room-bed"]?.lines ?? ["..."] });
    this.interactionMap.set("2,4", { type: "sign", text: DIALOGUE["room-bed"]?.lines ?? ["..."] });
    this.interactionMap.set("1,2", { type: "sign", text: DIALOGUE["room-bed"]?.lines ?? ["..."] });
    this.interactionMap.set("2,2", { type: "sign", text: DIALOGUE["room-bed"]?.lines ?? ["..."] });

    // PC Desk — x=7-8, y=2. Player faces up from y=3
    this.interactionMap.set("7,2", { type: "sign", text: DIALOGUE["room-pc"]?.lines ?? ["..."] });
    this.interactionMap.set("8,2", { type: "sign", text: DIALOGUE["room-pc"]?.lines ?? ["..."] });

    // DJ Booth — x=7-8, y=4. Player faces up from y=5
    this.interactionMap.set("7,4", { type: "sign", text: DIALOGUE["room-dj"]?.lines ?? ["..."] });
    this.interactionMap.set("8,4", { type: "sign", text: DIALOGUE["room-dj"]?.lines ?? ["..."] });

    // Bookshelf — x=1, y=5-6. Player faces left from x=2
    this.interactionMap.set("1,5", { type: "sign", text: DIALOGUE["room-bookshelf"]?.lines ?? ["..."] });
    this.interactionMap.set("1,6", { type: "sign", text: DIALOGUE["room-bookshelf"]?.lines ?? ["..."] });

    // Wall decorations — y=0 wall row. Player at y=2 faces up to see y=1 (wall base) then y=0
    // These are registered on the wall tile positions the player faces
    this.interactionMap.set("4,1", { type: "sign", text: DIALOGUE["room-window"]?.lines ?? ["..."] }); // window
    this.interactionMap.set("5,1", { type: "sign", text: DIALOGUE["room-window"]?.lines ?? ["..."] });
    this.interactionMap.set("7,1", { type: "sign", text: DIALOGUE["room-jersey"]?.lines ?? ["..."] }); // jersey
    this.interactionMap.set("2,1", { type: "sign", text: DIALOGUE["room-flags"]?.lines ?? ["..."] });  // flags
    this.interactionMap.set("3,1", { type: "sign", text: DIALOGUE["room-flags"]?.lines ?? ["..."] });
    this.interactionMap.set("8,1", { type: "sign", text: DIALOGUE["room-pennant"]?.lines ?? ["..."] }); // pennant

    // 4. NPCs — Dad and two dachshunds
    this.spawnNpc("dad", 5, 4, DIALOGUE["dad"]?.lines ?? ["..."]);
    this.spawnNpc("dog-1", 4, 5, DIALOGUE["dog-1"]?.lines ?? ["..."]);
    this.spawnNpc("dog-2", 6, 5, DIALOGUE["dog-2"]?.lines ?? ["..."]);
  }

  private spawnNpc(id: string, x: number, y: number, dialogLines: string[]): void {
    const sprite = this.add.sprite(0, 0, `npc-${id}`);
    sprite.setDepth(5);
    this.npcSprites.set(id, sprite);

    // Add to Grid Engine
    this.gridEngine.addCharacter({
      id,
      sprite,
      startPosition: { x, y },
      facingDirection: Direction.DOWN,
      collides: false,
    });

    // Register interaction
    this.interactionMap.set(`${x},${y}`, {
      type: "npc",
      id,
      dialog: dialogLines,
    });
  }

  update(): void {
    // Dialog mode — only Space/E to advance
    if (this.dialogOpen) {
      const spaceJustDown = Phaser.Input.Keyboard.JustDown(this.spaceKey);
      const eJustDown = Phaser.Input.Keyboard.JustDown(this.eKey);
      if (spaceJustDown || eJustDown) {
        const closed = this.dialogBox.advance();
        if (closed) {
          this.dialogOpen = false;
        }
      }
      return; // block movement
    }

    // Interaction check
    const spaceJustDown = Phaser.Input.Keyboard.JustDown(this.spaceKey);
    const eJustDown = Phaser.Input.Keyboard.JustDown(this.eKey);
    if (spaceJustDown || eJustDown) {
      const facingPos = this.gridEngine.getFacingPosition("player");
      const key = `${facingPos.x},${facingPos.y}`;
      const interaction = this.interactionMap.get(key);
      if (interaction) {
        this.handleInteraction(interaction);
        return;
      }
    }

    // Normal movement — delegate to base class
    super.update();
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
        this.dialogBox.show(payload.dialog);
        this.dialogOpen = true;
        break;
      }
      case "sign":
        this.dialogBox.show(payload.text);
        this.dialogOpen = true;
        break;
    }
  }
}
