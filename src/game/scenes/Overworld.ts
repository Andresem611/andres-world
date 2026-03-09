import Phaser from "phaser";
import { Direction } from "grid-engine";

export class OverworldScene extends Phaser.Scene {
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private wasd!: {
    up: Phaser.Input.Keyboard.Key;
    down: Phaser.Input.Keyboard.Key;
    left: Phaser.Input.Keyboard.Key;
    right: Phaser.Input.Keyboard.Key;
  };

  constructor() {
    super({ key: "Overworld" });
  }

  create(): void {
    // 1. Build tilemap from preloaded JSON
    const map = this.make.tilemap({ key: "overworld" });

    // addTilesetImage(tiledTilesetName, phaserImageKey)
    // First arg MUST match tilesets[0].name in overworld.json exactly: "modern-exteriors"
    const tileset = map.addTilesetImage("modern-exteriors", "modern-exteriors")!;

    // 2. Create all layers in order (bottom to top draw order)
    //    ALL createLayer() calls MUST complete before gridEngine.create() is called
    map.createLayer("Ground", tileset, 0, 0);
    map.createLayer("Above", tileset, 0, 0);
    const collisionLayer = map.createLayer("Collision", tileset, 0, 0);
    collisionLayer?.setVisible(false); // Collision layer is invisible at runtime

    // 3. Player sprite — position is managed by Grid Engine, not Phaser physics
    const playerSprite = this.add.sprite(0, 0, "player");

    // 4. Camera — follow player, clamp to map bounds, 2x zoom for pixel art clarity
    this.cameras.main.startFollow(playerSprite, true);
    this.cameras.main.setFollowOffset(
      -playerSprite.width / 2,
      -playerSprite.height / 2
    );
    this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
    this.cameras.main.setZoom(2); // 2x zoom — 32px tiles at 2x = 64px apparent size

    // 5. Keyboard — created once in create(), NOT in update().
    //    Creating key objects every frame discards the previous frame's objects
    //    and their event listeners, breaking isDown state tracking.
    //    addCapture prevents arrow keys from scrolling the browser page.
    const { LEFT, RIGHT, UP, DOWN } = Phaser.Input.Keyboard.KeyCodes;
    this.cursors = this.input.keyboard!.createCursorKeys();
    this.wasd = this.input.keyboard!.addKeys({
      up: Phaser.Input.Keyboard.KeyCodes.W,
      down: Phaser.Input.Keyboard.KeyCodes.S,
      left: Phaser.Input.Keyboard.KeyCodes.A,
      right: Phaser.Input.Keyboard.KeyCodes.D,
    }) as typeof this.wasd;
    this.input.keyboard!.addCapture([LEFT, RIGHT, UP, DOWN]);

    // 6. Grid Engine — MUST be called after all createLayer() calls
    this.gridEngine.create(map, {
      characters: [
        {
          id: "player",
          sprite: playerSprite,
          walkingAnimationMapping: 0, // Row 0 = first character in sprite sheet
          startPosition: { x: 25, y: 38 }, // South dock, facing north
          facingDirection: Direction.UP,
          speed: 4, // tiles/second — Pokemon-feel pacing
        },
      ],
    });
  }

  update(): void {
    // Priority: left > right > up > down (only one direction per frame)
    if (this.cursors.left.isDown || this.wasd.left.isDown) {
      this.gridEngine.move("player", Direction.LEFT);
    } else if (this.cursors.right.isDown || this.wasd.right.isDown) {
      this.gridEngine.move("player", Direction.RIGHT);
    } else if (this.cursors.up.isDown || this.wasd.up.isDown) {
      this.gridEngine.move("player", Direction.UP);
    } else if (this.cursors.down.isDown || this.wasd.down.isDown) {
      this.gridEngine.move("player", Direction.DOWN);
    }
  }
}
