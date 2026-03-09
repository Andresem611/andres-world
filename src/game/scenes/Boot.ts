import Phaser from "phaser";

export class BootScene extends Phaser.Scene {
  constructor() {
    super({ key: "Boot" });
  }

  create(): void {
    // Phase 1: blank canvas confirms scaffold is working
    // Phase 2: this scene will load the tilemap and transition to the Overworld scene
    console.log("Andres World — scaffold running");
  }
}
