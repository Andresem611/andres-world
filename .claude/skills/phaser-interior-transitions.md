---
name: phaser-interior-transitions
description: Use when building any interior scene (Andres's Room, Thoven HQ, Café, Engineering Lab) or wiring up overworld→interior→overworld transitions. Covers Grid Engine lifecycle, scene data flow, pitfalls, and template code.
---

# Phaser Interior Transitions Skill — Andres World

## Grid Engine Lifecycle Rule

**Grid Engine is a Scene Plugin — one instance per scene, destroyed with the scene.**

Every interior scene MUST call `this.gridEngine.create(map, config)` in its own `create()`.
Grid Engine state does NOT persist across `scene.start()` calls. Player position must be
passed explicitly via `data`.

This is already implemented correctly in `Overworld.ts`. All interior scenes must follow the same pattern.

---

## The Flow (3 stages)

### Stage 1 — Entry (Overworld → Interior)

Already implemented in `Overworld.ts`. Works via interaction (Space/E press while facing door tile).

```ts
// In create() — register building entrance in interactionMap:
this.interactionMap.set("13,22", {
  type: "building",
  key: "ThovenHQ",
  returnPos: { x: 13, y: 23 }   // ← tile just OUTSIDE the door (one south)
})

// In handleInteraction() — triggers the scene switch:
this.scene.start("ThovenHQ", {
  returnPos: payload.returnPos,
  buildingKey: payload.key,
})
```

**The `returnPos` must be the walkable tile just outside the door, not the door tile itself.**
If returnPos = the door tile, the player respawns inside the wall on return.

---

### Stage 2 — Interior Scene

Template for every interior scene class:

```ts
interface InteriorData {
  returnPos: { x: number; y: number };
  buildingKey: string;
}

export class ThovenHQScene extends Phaser.Scene {
  constructor() { super({ key: "ThovenHQ" }) }

  create(data: InteriorData): void {
    // 1. Load interior tilemap (different map from overworld)
    const map = this.make.tilemap({ key: "thoven-interior" })
    const interiors = map.addTilesetImage("interiors", "interiors")!
    const roomBuilder = map.addTilesetImage("room-builder", "room-builder")!
    const allTilesets = [interiors, roomBuilder]

    // 2. Create layers — ALL before gridEngine.create()
    map.createLayer("Floor", allTilesets, 0, 0)
    map.createLayer("Walls", allTilesets, 0, 0)
    const collisionLayer = map.createLayer("Collision", allTilesets, 0, 0)
    collisionLayer?.setVisible(false)

    // 3. Spawn player at interior entrance spawn point
    //    Use Tiled object layer for spawn coordinates (not hardcoded)
    const spawnObj = map.findObject("SpawnPoints", o => o.name === "entrance")
    const spawnTile = {
      x: Math.floor(spawnObj!.x! / 16),
      y: Math.floor(spawnObj!.y! / 16),
    }
    const playerSprite = this.add.sprite(0, 0, "player")

    // 4. Camera setup
    this.cameras.main.startFollow(playerSprite, true)
    this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels)
    this.cameras.main.setZoom(4)

    // 5. Grid Engine — MUST be after all createLayer() calls
    //    cacheTileCollisions: true is a v2.28+ optimization for static tilemaps
    this.gridEngine.create(map, {
      cacheTileCollisions: true,
      characters: [{
        id: "player",
        sprite: playerSprite,
        startPosition: spawnTile,
        facingDirection: Direction.UP,
        speed: 4,
        walkingAnimationMapping: 0,
      }]
    })

    // 6. Exit detection — step on exit tile triggers return to overworld
    //    Using positionChangeFinished (not update() polling — see pitfalls)
    const exitTile = { x: 3, y: 9 }  // or from Tiled object layer
    const exitSub = this.gridEngine.positionChangeFinished().subscribe(
      ({ charId, enterTile }: { charId: string; enterTile: { x: number; y: number } }) => {
        if (charId !== "player") return
        if (enterTile.x === exitTile.x && enterTile.y === exitTile.y) {
          exitSub.unsubscribe()
          this.cameras.main.fadeOut(200)
          this.time.delayedCall(200, () => {
            this.scene.start("Overworld", { returnFrom: data })
          })
        }
      }
    )

    // 7. Keyboard (same as Overworld)
    const { LEFT, RIGHT, UP, DOWN } = Phaser.Input.Keyboard.KeyCodes
    const cursors = this.input.keyboard!.createCursorKeys()
    this.input.keyboard!.addCapture([LEFT, RIGHT, UP, DOWN])

    // Store refs for update()
    (this as any)._cursors = cursors
    ;(this as any)._exitSub = exitSub

    // 8. Cleanup on shutdown
    this.events.on("shutdown", () => exitSub.unsubscribe())

    // 9. Camera fade in
    this.cameras.main.fadeIn(200)
  }

  update(): void {
    const cursors = (this as any)._cursors
    if (!cursors) return
    if (cursors.left.isDown) this.gridEngine.move("player", Direction.LEFT)
    else if (cursors.right.isDown) this.gridEngine.move("player", Direction.RIGHT)
    else if (cursors.up.isDown) this.gridEngine.move("player", Direction.UP)
    else if (cursors.down.isDown) this.gridEngine.move("player", Direction.DOWN)
  }
}
```

---

### Stage 3 — Return (Interior → Overworld)

Already implemented in `Overworld.ts`. When `data.returnFrom` is present, the player
spawns at `returnPos` instead of the default dock spawn:

```ts
// Overworld.create() — already handles this:
startPosition: data?.returnFrom?.returnPos ?? { x: 25, y: 38 }

// Safety net redundant setPosition:
if (data?.returnFrom?.returnPos) {
  this.gridEngine.setPosition("player", data.returnFrom.returnPos)
}
```

**No changes to Overworld.ts are needed** to support new interior scenes — just register
the new scene key in `main.ts` and set the correct `returnPos` in `interactionMap`.

---

## Registering a New Interior Scene

In `src/game/main.ts`:

```ts
import { ThovenHQScene } from "./scenes/ThovenHQ"
import { AndresRoomScene } from "./scenes/AndresRoom"

new Phaser.Game({
  scene: [BootScene, OverworldScene, ThovenHQScene, AndresRoomScene, InteriorStubScene],
  // ...
})
```

In `Overworld.ts` `create()` — add interactionMap entry:

```ts
this.interactionMap.set("9,22", {
  type: "building",
  key: "AndresRoom",
  returnPos: { x: 9, y: 23 }
})
```

In `BootScene.preload()` — preload interior assets:

```ts
this.load.tilemapTiledJSON("andres-room", "assets/maps/andres-room.json")
this.load.image("interiors", "assets/tilesets/Interiors_16x16.png")
this.load.image("room-builder", "assets/tilesets/Room_Builder_16x16.png")
```

---

## Pitfalls

### 1. Grid Engine create() order
`this.gridEngine.create()` must be called AFTER all `map.createLayer()` calls.
Grid Engine reads collision data at create time — if layers aren't ready, collision breaks.

### 2. Not unsubscribing observables
All `this.gridEngine.positionChangeFinished().subscribe(...)` calls return subscriptions.
Always store the subscription and call `.unsubscribe()` in:
```ts
this.events.on("shutdown", () => sub.unsubscribe())
```
Failure to do this causes dead subscriptions that fire on the next scene.

### 3. Detecting exit in update() instead of positionChangeFinished()
Characters are between tiles ~60% of the time. Checking coordinates in `update()` triggers
transitions mid-walk. Use `positionChangeFinished` — it fires exactly once per completed tile move.

### 4. returnPos pointing at the door tile
Door tile = wall = blocked. Player respawns inside wall. Always: returnPos = one tile south
(or in the exit direction) of the door tile. Test: after entering and exiting, player should
be standing in front of the building, not overlapping it.

### 5. Missing camera fade
Raw scene transitions are jarring. Add `this.cameras.main.fadeOut(200)` before `scene.start()`
and `this.cameras.main.fadeIn(200)` at the top of the interior scene's `create()`.

### 6. Forgetting to register scene in main.ts
`this.scene.start("ThovenHQ")` silently fails if "ThovenHQ" isn't registered in the Phaser
Game config's `scene` array. Add every interior scene to `src/game/main.ts`.

---

## Interior Tileset firstgids (Phase 4+)

```
Interiors_16x16.png  → firstgid=19681  (16 cols, 1064 rows)
Room_Builder_16x16.png → firstgid=36705 (76 cols, 113 rows)
```

Always confirm tile GIDs against .planning/TILE-CATALOG.md before using them.

---

## Exit Pattern Options

| Pattern | When to use |
|---------|-------------|
| Step-on (positionChangeFinished) | Exit doors inside interiors — automatic teleport on stepping on door tile |
| Interaction (Space/E, interactionMap) | Main building entrances from overworld (current pattern) |
| Button/NPC trigger | For rooms where "leaving" requires talking to someone or pressing a button |

Current project uses **interaction** for overworld→interior and **step-on** for interior exit.
Both are correct — keep this split for authentic Gen 1/2 feel.
