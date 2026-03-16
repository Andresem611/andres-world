import { Direction } from "grid-engine";
import { InteriorBaseScene } from "./InteriorBaseScene";
import { DIALOGUE } from "../../content/dialogue";
import { DialogBox, InteractionPayload } from "../ui/DialogBox";

/**
 * EngineeringLabScene — Engineering Lab interior.
 *
 * Layout (10×8):
 *   Workbench zone (x=1-3, y=3-4) — 3 experiment monitors
 *   Stack wall posters (x=1-8, y=0)
 *   Rubber duck easter egg (x=8, y=5)
 *   NPCs: Tobi Lütke, Patrick Collison, Dario Amodei
 */
export class EngineeringLabScene extends InteriorBaseScene {
  private dialogBox!: DialogBox;
  private dialogOpen = false;
  private interactionMap = new Map<string, InteractionPayload>();
  private spaceKey!: Phaser.Input.Keyboard.Key;
  private eKey!: Phaser.Input.Keyboard.Key;

  constructor() {
    super("EngineeringLab");
  }

  protected getMapKey(): string {
    return "engineering-lab";
  }

  protected onInteriorCreate(): void {
    this.dialogBox = new DialogBox(this);
    this.spaceKey = this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    this.eKey = this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.E);

    // Workbench experiments (x=1-3, y=3) — each monitor is a different experiment
    this.interactionMap.set("1,3", { type: "sign", text: DIALOGUE["lab-experiment-1"]?.lines ?? ["..."] });
    this.interactionMap.set("2,3", { type: "sign", text: DIALOGUE["lab-experiment-2"]?.lines ?? ["..."] });
    this.interactionMap.set("3,3", { type: "sign", text: DIALOGUE["lab-experiment-3"]?.lines ?? ["..."] });
    this.interactionMap.set("1,4", { type: "sign", text: DIALOGUE["lab-experiment-1"]?.lines ?? ["..."] });
    this.interactionMap.set("2,4", { type: "sign", text: DIALOGUE["lab-experiment-2"]?.lines ?? ["..."] });
    this.interactionMap.set("3,4", { type: "sign", text: DIALOGUE["lab-experiment-3"]?.lines ?? ["..."] });

    // Stack wall posters (y=1 — wall base, player faces from y=2)
    this.interactionMap.set("1,1", { type: "sign", text: DIALOGUE["lab-stack-wall"]?.lines ?? ["..."] });
    this.interactionMap.set("2,1", { type: "sign", text: DIALOGUE["lab-stack-wall"]?.lines ?? ["..."] });
    this.interactionMap.set("3,1", { type: "sign", text: DIALOGUE["lab-stack-wall"]?.lines ?? ["..."] });
    this.interactionMap.set("4,1", { type: "sign", text: DIALOGUE["lab-stack-wall"]?.lines ?? ["..."] });
    this.interactionMap.set("5,1", { type: "sign", text: DIALOGUE["lab-stack-wall"]?.lines ?? ["..."] });
    this.interactionMap.set("6,1", { type: "sign", text: DIALOGUE["lab-stack-wall"]?.lines ?? ["..."] });
    this.interactionMap.set("7,1", { type: "sign", text: DIALOGUE["lab-stack-wall"]?.lines ?? ["..."] });
    this.interactionMap.set("8,1", { type: "sign", text: DIALOGUE["lab-stack-wall"]?.lines ?? ["..."] });

    // Rubber duck (x=8, y=5) — easter egg
    this.interactionMap.set("8,5", { type: "sign", text: DIALOGUE["lab-rubber-duck"]?.lines ?? ["..."] });

    // NPCs
    this.spawnNpc("tobi-lutke", 5, 4, DIALOGUE["tobi-lutke"]?.lines ?? ["..."]);
    this.spawnNpc("patrick-collison", 6, 3, DIALOGUE["patrick-collison"]?.lines ?? ["..."]);
    this.spawnNpc("dario-amodei", 7, 5, DIALOGUE["dario-amodei"]?.lines ?? ["..."]);
  }

  private spawnNpc(id: string, x: number, y: number, dialogLines: string[]): void {
    const sprite = this.add.sprite(0, 0, `npc-${id}`);
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
