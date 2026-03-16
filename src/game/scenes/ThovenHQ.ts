import { InteriorBaseScene } from "./InteriorBaseScene";

/**
 * ThovenHQScene — Thoven HQ interior (stub for testing scene transitions).
 * Will be expanded in S11 with real interior content.
 */
export class ThovenHQScene extends InteriorBaseScene {
  constructor() {
    super("ThovenHQ");
  }

  protected getMapKey(): string {
    return "thoven-hq";
  }

  protected onInteriorCreate(): void {
    // Stub: just show building name for now
    const centerX = this.cameras.main.centerX;
    this.add
      .text(centerX, 20, "Thoven HQ", {
        color: "#ffffff",
        fontSize: "10px",
        fontFamily: "monospace",
      })
      .setOrigin(0.5)
      .setScrollFactor(0)
      .setDepth(100);
  }
}
