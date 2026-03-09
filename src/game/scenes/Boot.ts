import Phaser from "phaser";

// Character sprite: custom placeholder sprite sheet generated for Phase 2
// Layout: 96x128px, 3 frames wide x 4 rows tall
// Row 0: Down, Row 1: Left, Row 2: Right, Row 3: Up
// (PIPOYA-compatible convention — walkingAnimationMapping: 0 row offsets apply)

export class BootScene extends Phaser.Scene {
  constructor() {
    super({ key: "Boot" });
  }

  preload(): void {
    // Tileset image — key must match tilesets[0].name in overworld.json AND addTilesetImage() first arg
    this.load.image("modern-exteriors", "assets/tilesets/modern-exteriors-32.png");
    // Tiled JSON map
    this.load.tilemapTiledJSON("overworld", "assets/maps/overworld.json");
    // Character placeholder sprite sheet (32x32 per frame, 4-directional)
    this.load.spritesheet("player", "assets/sprites/character-placeholder.png", {
      frameWidth: 32,
      frameHeight: 32,
    });
  }

  create(): void {
    // All assets loaded — hand off to overworld
    this.scene.start("Overworld");
  }
}
