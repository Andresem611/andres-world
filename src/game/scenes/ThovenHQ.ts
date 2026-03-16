import { Direction } from "grid-engine";
import { InteriorBaseScene } from "./InteriorBaseScene";
import { DIALOGUE } from "../../content/dialogue";
import { DialogBox, InteractionPayload } from "../ui/DialogBox";

/**
 * ThovenHQScene — Thoven HQ interior.
 *
 * Layout (12×10):
 *   Row 0-1: Walls (metrics board x=5-6, shipped board x=3-4, practice doors x=8-10)
 *   Row 2-3: PC corner (x=1), open floor
 *   Row 5-6: Waiting area chairs (x=8-9), shelves (x=1)
 *   Row 7: Front desk (x=4-6)
 *   Row 9: Exit door (x=5-6)
 *
 * NPCs: Keri (front desk), Michael Seibel (waiting area), Brian Chesky (metrics board)
 */
export class ThovenHQScene extends InteriorBaseScene {
  private dialogBox!: DialogBox;
  private dialogOpen = false;
  private interactionMap = new Map<string, InteractionPayload>();
  private spaceKey!: Phaser.Input.Keyboard.Key;
  private eKey!: Phaser.Input.Keyboard.Key;
  private npcSprites: Map<string, Phaser.GameObjects.Sprite> = new Map();

  constructor() {
    super("ThovenHQ");
  }

  protected getMapKey(): string {
    return "thoven-hq";
  }

  protected onInteriorCreate(): void {
    // 1. Dialog box
    this.dialogBox = new DialogBox(this);

    // 2. Interaction keys
    this.spaceKey = this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    this.eKey = this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.E);

    // 3. Wall interactions (player faces wall-base at y=1 from y=2)
    // Metrics board (x=5-6, y=0)
    this.interactionMap.set("5,1", { type: "sign", text: DIALOGUE["thoven-metrics"]?.lines ?? ["..."] });
    this.interactionMap.set("6,1", { type: "sign", text: DIALOGUE["thoven-metrics"]?.lines ?? ["..."] });

    // Shipped/corkboard (x=3-4, y=0)
    this.interactionMap.set("3,1", { type: "sign", text: DIALOGUE["thoven-shipped"]?.lines ?? ["..."] });
    this.interactionMap.set("4,1", { type: "sign", text: DIALOGUE["thoven-shipped"]?.lines ?? ["..."] });

    // Practice room doors (x=8-10, y=0)
    this.interactionMap.set("8,1", { type: "sign", text: DIALOGUE["thoven-practice-piano"]?.lines ?? ["..."] });
    this.interactionMap.set("9,1", { type: "sign", text: DIALOGUE["thoven-practice-guitar"]?.lines ?? ["..."] });
    this.interactionMap.set("10,1", { type: "sign", text: DIALOGUE["thoven-practice-voice"]?.lines ?? ["..."] });
    // Violin door on right wall (x=11, y=3)
    this.interactionMap.set("10,3", { type: "sign", text: DIALOGUE["thoven-practice-violin"]?.lines ?? ["..."] });

    // 4. Furniture interactions
    // Front desk (x=4-6, y=7) — player faces from y=8
    this.interactionMap.set("4,7", { type: "sign", text: ["Welcome to Thoven HQ. How can we help?"] });
    this.interactionMap.set("5,7", { type: "sign", text: ["Welcome to Thoven HQ. How can we help?"] });
    this.interactionMap.set("6,7", { type: "sign", text: ["Welcome to Thoven HQ. How can we help?"] });

    // PC in corner (x=1, y=2-3) — player faces from x=2
    this.interactionMap.set("1,2", { type: "sign", text: DIALOGUE["thoven-pc"]?.lines ?? ["..."] });
    this.interactionMap.set("1,3", { type: "sign", text: DIALOGUE["thoven-pc"]?.lines ?? ["..."] });

    // 5. NPCs
    // Keri — behind front desk (x=5, y=6)
    this.spawnNpc("keri", 5, 6, DIALOGUE["keri"]?.lines ?? ["..."]);

    // Michael Seibel — waiting area (x=7, y=5)
    this.spawnNpc("michael-seibel", 7, 5, DIALOGUE["michael-seibel"]?.lines ?? ["..."]);

    // Brian Chesky — near metrics board (x=6, y=3)
    this.spawnNpc("brian-chesky", 6, 3, DIALOGUE["brian-chesky"]?.lines ?? ["..."]);
  }

  private spawnNpc(id: string, x: number, y: number, dialogLines: string[]): void {
    const sprite = this.add.sprite(0, 0, `npc-${id}`);
    sprite.setDepth(5);
    this.npcSprites.set(id, sprite);

    this.gridEngine.addCharacter({
      id,
      sprite,
      startPosition: { x, y },
      facingDirection: Direction.DOWN,
      collides: false,
    });

    this.interactionMap.set(`${x},${y}`, {
      type: "npc",
      id,
      dialog: dialogLines,
    });
  }

  update(): void {
    if (this.dialogOpen) {
      const spaceJustDown = Phaser.Input.Keyboard.JustDown(this.spaceKey);
      const eJustDown = Phaser.Input.Keyboard.JustDown(this.eKey);
      if (spaceJustDown || eJustDown) {
        const closed = this.dialogBox.advance();
        if (closed) {
          this.dialogOpen = false;
        }
      }
      return;
    }

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

    super.update();
  }

  private handleInteraction(payload: InteractionPayload): void {
    switch (payload.type) {
      case "npc": {
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
