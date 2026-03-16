import Phaser from "phaser";
import { GridEngine } from "grid-engine";
import { BootScene } from "./scenes/Boot";
import { OverworldScene } from "./scenes/Overworld";
import { InteriorStubScene } from "./scenes/InteriorStub";
import { ThovenHQScene } from "./scenes/ThovenHQ";
import { AndresRoomScene } from "./scenes/AndresRoom";
import { StarbucksCafeScene } from "./scenes/StarbucksCafe";
import { EngineeringLabScene } from "./scenes/EngineeringLab";

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
  scene: [BootScene, OverworldScene, ThovenHQScene, AndresRoomScene, StarbucksCafeScene, EngineeringLabScene, InteriorStubScene],
};

export default new Phaser.Game(config);
