import { Direction } from "grid-engine";
import { InteriorBaseScene } from "./InteriorBaseScene";
import { DIALOGUE } from "../../content/dialogue";
import { DialogBox, InteractionPayload } from "../ui/DialogBox";

/**
 * StarbucksCafeScene — Starbucks Café interior.
 *
 * Layout (10×8):
 *   Counter (x=1-3, y=2), Tables with books (x=3,y=4-5 and x=6,y=4-5)
 *   Paul Graham's corner table (x=7-8, y=2)
 *   NPCs: Paul Graham, Barista
 */
export class StarbucksCafeScene extends InteriorBaseScene {
  private dialogBox!: DialogBox;
  private dialogOpen = false;
  private interactionMap = new Map<string, InteractionPayload>();
  private spaceKey!: Phaser.Input.Keyboard.Key;
  private eKey!: Phaser.Input.Keyboard.Key;

  constructor() {
    super("StarbucksCafe");
  }

  protected getMapKey(): string {
    return "starbucks";
  }

  protected onInteriorCreate(): void {
    this.dialogBox = new DialogBox(this);
    this.spaceKey = this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    this.eKey = this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.E);

    // Counter interactions
    this.interactionMap.set("1,2", { type: "sign", text: ["The menu is just coffee. This is a developer café."] });
    this.interactionMap.set("2,2", { type: "sign", text: ["The menu is just coffee. This is a developer café."] });
    this.interactionMap.set("3,2", { type: "sign", text: ["The menu is just coffee. This is a developer café."] });

    // Book 1 — essay on table (x=3, y=4)
    this.interactionMap.set("3,4", { type: "sign", text: DIALOGUE["cafe-essay-1"]?.lines ?? ["..."] });
    this.interactionMap.set("3,5", { type: "sign", text: DIALOGUE["cafe-essay-1"]?.lines ?? ["..."] });

    // Book 2 — essay on table (x=6, y=4)
    this.interactionMap.set("6,4", { type: "sign", text: DIALOGUE["cafe-essay-2"]?.lines ?? ["..."] });
    this.interactionMap.set("6,5", { type: "sign", text: DIALOGUE["cafe-essay-2"]?.lines ?? ["..."] });

    // NPCs
    // Paul Graham — corner table (x=8, y=3)
    this.spawnNpc("paul-graham", 8, 3, DIALOGUE["paul-graham"]?.lines ?? ["..."]);

    // Barista — behind counter (x=2, y=1 is wall, so x=2, y=3 standing in front)
    this.spawnNpc("cafe-barista", 2, 3, DIALOGUE["cafe-barista"]?.lines ?? ["..."]);
  }

  private spawnNpc(id: string, x: number, y: number, dialogLines: string[]): void {
    const spriteKey = id === "cafe-barista" ? "npc-keri" : `npc-${id}`; // reuse keri sprite for barista
    const sprite = this.add.sprite(0, 0, spriteKey);
    sprite.setDepth(5);
    this.gridEngine.addCharacter({ id, sprite, startPosition: { x, y }, facingDirection: Direction.DOWN, collides: false });
    this.interactionMap.set(`${x},${y}`, { type: "npc", id, dialog: dialogLines });
  }

  update(): void {
    if (this.dialogOpen) {
      if (Phaser.Input.Keyboard.JustDown(this.spaceKey) || Phaser.Input.Keyboard.JustDown(this.eKey)) {
        if (this.dialogBox.advance()) this.dialogOpen = false;
      }
      return;
    }
    if (Phaser.Input.Keyboard.JustDown(this.spaceKey) || Phaser.Input.Keyboard.JustDown(this.eKey)) {
      const fp = this.gridEngine.getFacingPosition("player");
      const interaction = this.interactionMap.get(`${fp.x},${fp.y}`);
      if (interaction) { this.handleInteraction(interaction); return; }
    }
    super.update();
  }

  private handleInteraction(payload: InteractionPayload): void {
    if (payload.type === "npc") {
      const pf = this.gridEngine.getFacingDirection("player");
      const opp: Record<string, Direction> = { [Direction.UP]: Direction.DOWN, [Direction.DOWN]: Direction.UP, [Direction.LEFT]: Direction.RIGHT, [Direction.RIGHT]: Direction.LEFT };
      this.gridEngine.turnTowards(payload.id, opp[pf] ?? Direction.DOWN);
      this.dialogBox.show(payload.dialog);
    } else if (payload.type === "sign") {
      this.dialogBox.show(payload.text);
    }
    this.dialogOpen = true;
  }
}
