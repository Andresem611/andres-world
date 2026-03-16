import Phaser from "phaser";
import { GridEngine, Direction } from "grid-engine";
import type { InteriorTransitionData, OverworldReturnData } from "../../types/scene-data";

/**
 * InteriorBaseScene — base class for all building interiors.
 *
 * Handles: tilemap loading, Grid Engine init, player spawn at entryPos,
 * exit-tile detection, camera fade transitions, return to Overworld.
 *
 * Subclass and override `getMapKey()` to point at your Tiled JSON.
 * Override `onInteriorCreate()` for interior-specific setup (NPCs, objects).
 */
export class InteriorBaseScene extends Phaser.Scene {
  public gridEngine!: GridEngine;
  protected transitionData!: InteriorTransitionData;
  private playerSprite!: Phaser.GameObjects.Sprite;
  private exitPositions: Array<{ x: number; y: number }> = [];
  private isExiting = false;

  // Keyboard — created once in create(), NOT in update()
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private wasd!: {
    up: Phaser.Input.Keyboard.Key;
    down: Phaser.Input.Keyboard.Key;
    left: Phaser.Input.Keyboard.Key;
    right: Phaser.Input.Keyboard.Key;
  };

  constructor(sceneKey: string) {
    super({ key: sceneKey });
  }

  /** Override in subclass to return the tileset key→image mappings needed */
  protected getTilesetMappings(): Array<{ tilesetName: string; imageKey: string }> {
    // Default: Room_Builder for interior floors + Interiors for furniture
    return [
      { tilesetName: "Room_Builder_16x16", imageKey: "room-builder" },
      { tilesetName: "Interiors_16x16", imageKey: "interiors" },
    ];
  }

  /** Override in subclass for interior-specific setup after base create */
  protected onInteriorCreate(): void {
    // no-op by default
  }

  /** Map key used for this.load.tilemapTiledJSON and this.make.tilemap */
  protected getMapKey(): string {
    return this.transitionData.buildingKey.toLowerCase().replace(/\s+/g, "-");
  }

  init(data: InteriorTransitionData): void {
    this.transitionData = data;
    this.isExiting = false;
    this.exitPositions = [];
  }

  preload(): void {
    const mapKey = this.getMapKey();
    // Only load if not already cached
    if (!this.cache.tilemap.has(mapKey)) {
      this.load.tilemapTiledJSON(mapKey, `assets/maps/${mapKey}.json`);
    }
    // Load interior tilesets if not cached
    if (!this.textures.exists("room-builder")) {
      this.load.image("room-builder", "assets/tilesets/Room_Builder_16x16.png");
    }
    if (!this.textures.exists("interiors")) {
      this.load.image("interiors", "assets/tilesets/Interiors_16x16.png");
    }
  }

  create(): void {
    // 1. Camera starts black, will fade in
    this.cameras.main.setBackgroundColor("#1a1a2e");

    // 2. Build tilemap
    const mapKey = this.getMapKey();
    const map = this.make.tilemap({ key: mapKey });

    // 3. Add tilesets
    const tilesets: Phaser.Tilemaps.Tileset[] = [];
    for (const { tilesetName, imageKey } of this.getTilesetMappings()) {
      const ts = map.addTilesetImage(tilesetName, imageKey);
      if (ts) tilesets.push(ts);
    }

    // 4. Create layers — every layer in the Tiled map gets rendered
    //    Collect exit positions from the "exits" layer (or object layer)
    for (const layerData of map.layers) {
      const layer = map.createLayer(layerData.name, tilesets);
      if (!layer) continue;

      // If this is the collision layer, set collisions
      if (layerData.name.toLowerCase().includes("collision")) {
        layer.setCollisionByExclusion([-1, 0]);
      }

      // Collect exit tile positions from "exits" layer
      if (layerData.name.toLowerCase() === "exits") {
        layer.setVisible(false); // exits layer is invisible
        layerData.data.forEach((row, y) => {
          row.forEach((tile, x) => {
            if (tile.index > 0) {
              this.exitPositions.push({ x, y });
            }
          });
        });
      }
    }

    // Also check for object layers named "exits" (Tiled object layer alternative)
    for (const objectLayer of map.objects ?? []) {
      if (objectLayer.name.toLowerCase() === "exits") {
        for (const obj of objectLayer.objects) {
          const tileX = Math.floor((obj.x ?? 0) / map.tileWidth);
          const tileY = Math.floor((obj.y ?? 0) / map.tileHeight);
          this.exitPositions.push({ x: tileX, y: tileY });
        }
      }
    }

    // 5. Player sprite
    this.playerSprite = this.add.sprite(0, 0, "player");
    this.playerSprite.setDepth(5);

    // 6. Grid Engine init
    const entryPos = this.transitionData.entryPos ?? { x: 1, y: 1 };
    this.gridEngine.create(map, {
      characters: [
        {
          id: "player",
          sprite: this.playerSprite,
          startPosition: entryPos,
          walkingAnimationMapping: 0,
        },
      ],
    });

    // 7. Camera follow + bounds + zoom (match overworld 4x)
    this.cameras.main.startFollow(this.playerSprite, true);
    this.cameras.main.setBounds(
      0, 0,
      map.widthInPixels,
      map.heightInPixels,
    );
    this.cameras.main.setZoom(4); // 4x zoom — matches overworld pixel art scale

    // 8. Exit detection — when player finishes moving, check if on exit tile
    this.gridEngine.movementStopped().subscribe(({ charId }: { charId: string }) => {
      if (charId !== "player" || this.isExiting) return;
      const pos = this.gridEngine.getPosition("player");
      const onExit = this.exitPositions.some(e => e.x === pos.x && e.y === pos.y);
      if (onExit) {
        this.exitToOverworld();
      }
    });

    // 9. Fade in
    this.cameras.main.fadeIn(300, 0, 0, 0);

    // 10. Keyboard input — created once here, used in update()
    //     Same pattern as Overworld.ts: createCursorKeys() and addKeys() in create()
    const { LEFT, RIGHT, UP, DOWN } = Phaser.Input.Keyboard.KeyCodes;
    this.cursors = this.input.keyboard!.createCursorKeys();
    this.wasd = this.input.keyboard!.addKeys({
      up: Phaser.Input.Keyboard.KeyCodes.W,
      down: Phaser.Input.Keyboard.KeyCodes.S,
      left: Phaser.Input.Keyboard.KeyCodes.A,
      right: Phaser.Input.Keyboard.KeyCodes.D,
    }) as typeof this.wasd;
    this.input.keyboard!.addCapture([LEFT, RIGHT, UP, DOWN]);

    // 11. Subclass hook
    this.onInteriorCreate();
  }

  update(): void {
    if (this.isExiting) return;

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

  /** Fade out and return to Overworld */
  protected exitToOverworld(): void {
    if (this.isExiting) return;
    this.isExiting = true;

    const returnData: OverworldReturnData = {
      returnPos: this.transitionData.returnPos,
      facingDirection: "down",
    };

    this.cameras.main.fadeOut(300, 0, 0, 0);
    this.cameras.main.once("camerafadeoutcomplete", () => {
      this.scene.start("Overworld", { returnFrom: returnData });
    });
  }
}
