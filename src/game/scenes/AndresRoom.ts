import { InteriorBaseScene } from "./InteriorBaseScene";

/**
 * AndresRoomScene — Andres's Room interior (stub for testing scene transitions).
 * Will be expanded in S10 with real interior content.
 */
export class AndresRoomScene extends InteriorBaseScene {
  constructor() {
    super("AndresRoom");
  }

  protected getMapKey(): string {
    return "andres-room";
  }

  protected onInteriorCreate(): void {
    const centerX = this.cameras.main.centerX;
    this.add
      .text(centerX, 20, "Andres's Room", {
        color: "#ffffff",
        fontSize: "10px",
        fontFamily: "monospace",
      })
      .setOrigin(0.5)
      .setScrollFactor(0)
      .setDepth(100);
  }
}
