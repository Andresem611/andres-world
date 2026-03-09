import Phaser from "phaser";

// Character sprite: custom placeholder sprite sheet generated for Phase 2
// Layout: 96x128px, 3 frames wide x 4 rows tall
// Row 0: Down, Row 1: Left, Row 2: Right, Row 3: Up
// (PIPOYA-compatible convention — walkingAnimationMapping: 0 row offsets apply)
//
// Tilesets: 5 LimeZu PNG files (16x16 tiles, Modern Exteriors pack)
// Keys match tilesets[N].name in overworld.json AND addTilesetImage() first arg:
//   terrains  → 1_Terrains_and_Fences_16x16.png  (GIDs 1–2368)
//   beach     → 21_Beach_16x16.png                (GIDs 2369–6368)
//   buildings → 4_Generic_Buildings_16x16.png      (GIDs 6369–12768)
//   garden    → 17_Garden_16x16.png                (GIDs 12769–19040)
//   worksite  → 8_Worksite_16x16.png               (GIDs 19041+)

export class BootScene extends Phaser.Scene {
  constructor() {
    super({ key: "Boot" });
  }

  preload(): void {
    // Tileset images — keys must match tilesets[N].name in overworld.json AND addTilesetImage() first arg
    this.load.image("terrains",  "assets/tilesets/1_Terrains_and_Fences_16x16.png");
    this.load.image("beach",     "assets/tilesets/21_Beach_16x16.png");
    this.load.image("buildings", "assets/tilesets/4_Generic_Buildings_16x16.png");
    this.load.image("garden",    "assets/tilesets/17_Garden_16x16.png");
    this.load.image("worksite",  "assets/tilesets/8_Worksite_16x16.png");
    // Tiled JSON map
    this.load.tilemapTiledJSON("overworld", "assets/maps/overworld.json");
    // Character placeholder sprite sheet (32x32 per frame, 4-directional)
    this.load.spritesheet("player", "assets/sprites/character-placeholder.png", {
      frameWidth: 32,
      frameHeight: 32,
    });

    // NPC placeholder sprites (single 32x32 frame — not a spritesheet)
    const npcIds = [
      "paul-graham", "marc-andreessen", "brian-chesky", "tobi-lutke",
      "dalton-caldwell", "ben-horowitz", "vinod-khosla", "dario-amodei",
      "michael-seibel", "patrick-collison", "john-collison", "keri",
      "dad", "dog-1", "dog-2"
    ];
    for (const id of npcIds) {
      this.load.image(`npc-${id}`, `assets/sprites/npc-${id}.png`);
    }
  }

  create(): void {
    // All assets loaded — hand off to overworld
    this.scene.start("Overworld");
  }
}
