import Phaser from "phaser";

export class InteriorStubScene extends Phaser.Scene {
  constructor() {
    super({ key: "InteriorStub" });
  }

  create(data: { returnPos: { x: number; y: number }; buildingKey: string }): void {
    // Dark background
    this.cameras.main.setBackgroundColor("#1a1a2e");

    // Building name title
    this.add
      .text(400, 280, `[${data?.buildingKey ?? "Building"}]`, {
        color: "#ffffff",
        fontSize: "24px",
        fontFamily: "monospace",
      })
      .setOrigin(0.5);

    // Coming soon message
    this.add
      .text(400, 320, "Coming in a future phase...", {
        color: "#aaaaaa",
        fontSize: "14px",
        fontFamily: "monospace",
      })
      .setOrigin(0.5);

    // Return instruction
    this.add
      .text(400, 360, "Press SPACE or E to return", {
        color: "#888888",
        fontSize: "12px",
        fontFamily: "monospace",
      })
      .setOrigin(0.5);

    // Return to overworld on SPACE
    this.input.keyboard!.once("keydown-SPACE", () => {
      this.scene.start("Overworld", { returnFrom: data });
    });

    // Return to overworld on E
    this.input.keyboard!.once("keydown-E", () => {
      this.scene.start("Overworld", { returnFrom: data });
    });
  }
}
