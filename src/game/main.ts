import Phaser from "phaser";
import { GridEngine } from "grid-engine";
import { BootScene } from "./scenes/Boot";

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  pixelArt: true,
  backgroundColor: "#1a1a2e",
  plugins: {
    scene: [
      {
        key: "GridEngine",
        plugin: GridEngine,
        mapping: "gridEngine",
      },
    ],
  },
  scene: [BootScene],
};

export default new Phaser.Game(config);
