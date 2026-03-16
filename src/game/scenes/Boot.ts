import Phaser from "phaser";

/**
 * BootScene — Asset loading with progress bar, then transitions to TitleScreen.
 * Loads all tilesets, maps, sprites in preload().
 */
export class BootScene extends Phaser.Scene {
  constructor() {
    super({ key: "Boot" });
  }

  preload(): void {
    // ─── Progress bar ──────────────────────────────────────────
    const { width, height } = this.cameras.main;
    const barW = 200, barH = 16;
    const barX = (width - barW) / 2;
    const barY = height / 2 + 40;

    // Background bar
    const barBg = this.add.rectangle(barX + barW / 2, barY + barH / 2, barW, barH, 0x222222);
    barBg.setStrokeStyle(2, 0xffffff);

    // Fill bar
    const barFill = this.add.rectangle(barX + 2, barY + 2, 0, barH - 4, 0x4ade80);
    barFill.setOrigin(0, 0);

    // Loading text
    const loadingText = this.add.text(width / 2, barY - 16, "Loading...", {
      fontSize: "10px",
      fontFamily: "monospace",
      color: "#ffffff",
    }).setOrigin(0.5);

    this.load.on("progress", (value: number) => {
      barFill.width = (barW - 4) * value;
      loadingText.setText(`Loading... ${Math.round(value * 100)}%`);
    });

    this.load.on("complete", () => {
      loadingText.setText("Ready!");
    });

    // ─── Tileset images ────────────────────────────────────────
    this.load.image("terrains",  "assets/tilesets/1_Terrains_and_Fences_16x16.png");
    this.load.image("beach",     "assets/tilesets/21_Beach_16x16.png");
    this.load.image("buildings", "assets/tilesets/4_Generic_Buildings_16x16.png");
    this.load.image("garden",    "assets/tilesets/17_Garden_16x16.png");
    this.load.image("worksite",  "assets/tilesets/8_Worksite_16x16.png");
    this.load.image("villas",    "assets/tilesets/7_Villas_16x16.png");

    // ─── Interior tilesets ─────────────────────────────────────
    this.load.image("Room_Builder_16x16", "assets/tilesets/Room_Builder_16x16.png");
    this.load.image("Interiors_16x16",    "assets/tilesets/Interiors_16x16.png");

    // ─── Tiled JSON maps ───────────────────────────────────────
    this.load.tilemapTiledJSON("overworld", "assets/maps/overworld.json");
    this.load.tilemapTiledJSON("andres-room", "assets/maps/andres-room.json");
    this.load.tilemapTiledJSON("thoven-hq", "assets/maps/thoven-hq.json");
    this.load.tilemapTiledJSON("starbucks", "assets/maps/starbucks.json");
    this.load.tilemapTiledJSON("engineering-lab", "assets/maps/engineering-lab.json");

    // ─── Player sprite ─────────────────────────────────────────
    this.load.spritesheet("player", "assets/sprites/player.png", {
      frameWidth: 32,
      frameHeight: 32,
    });

    // ─── NPC sprites ───────────────────────────────────────────
    const npcIds = [
      "paul-graham", "marc-andreessen", "brian-chesky", "tobi-lutke",
      "dalton-caldwell", "ben-horowitz", "vinod-khosla", "dario-amodei",
      "michael-seibel", "patrick-collison", "john-collison", "keri",
      "dad", "dog-1", "dog-2"
    ];
    for (const id of npcIds) {
      this.load.image(`npc-${id}`, `assets/sprites/npc-${id}.png`);
    }

    // ─── Audio ─────────────────────────────────────────────────
    // 8-bit background music — loaded if the file exists, gracefully skipped if not
    this.load.audio("bgm-overworld", "assets/audio/overworld.mp3");
    this.load.audio("bgm-music-room", "assets/audio/music-room.mp3");

    // Don't fail on missing audio — it's optional until real tracks are added
    this.load.on("loaderror", (file: Phaser.Loader.File) => {
      if (file.key.startsWith("bgm-")) {
        console.warn(`[Boot] Optional audio not found: ${file.key} — music will be silent.`);
      }
    });
  }

  create(): void {
    this.scene.start("TitleScreen");
  }
}
