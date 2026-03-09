# Interior Scene Transitions — Research Notes
**Date:** 2026-03-09
**Context:** Andres World — Phaser 3 + Grid Engine overworld → interior → overworld flow

---

## Executive Summary

The project already has a working transition system in place (Overworld.ts + InteriorStub.ts). This document captures how it works, fills in the "why" behind the design decisions, and documents the patterns, pitfalls, and correct implementation for full interior scenes that will replace the stub.

---

## Q1: Grid Engine Instance Lifecycle Across Scene Switches

**Answer: Grid Engine is a Scene Plugin — it is per-scene and does NOT persist across scene switches.**

Grid Engine is registered as a Phaser Scene Plugin (not a Global Plugin):

```js
plugins: {
  scene: [{ key: "gridEngine", plugin: GridEngine, mapping: "gridEngine" }]
}
```

Because it is a Scene Plugin, each Scene gets its own `this.gridEngine` instance tied to that scene's lifecycle. When you call `this.scene.start("Interior")`, Phaser destroys the old scene (including its Grid Engine instance) and creates a fresh one. When the interior calls `this.scene.start("Overworld")`, the Overworld scene is re-created from scratch — `create()` runs again, Grid Engine is re-initialized via `this.gridEngine.create(map, config)`, and the player is placed at the spawn position passed in `data`.

**Implication:** You cannot "pause" Grid Engine in one scene and "resume" it in another. You must reinitialize it in every scene's `create()` method. Player position must be passed explicitly as data — it is not automatically preserved.

**Alternative — sleep/wake:** Phaser's `scene.sleep()` + `scene.wake()` pattern keeps a scene alive (no update, no render, but all objects intact). This *would* preserve Grid Engine state, but at the cost of memory (the overworld tilemap stays loaded). The current project uses `scene.start()` (destroy + recreate), which is simpler and is the correct choice given the map size.

**Verdict for this project:** Recreate Grid Engine on every scene transition. Pass player position in `data`. This is exactly what the existing code does.

---

## Q2: Detecting "Player Steps on Door Tile" — Pattern for Triggering a Scene Switch

**Answer: Two valid patterns exist. This project uses the interaction (Space/E keypress) pattern, not the step-on pattern. The step-on pattern uses `positionChangeFinished()` observable.**

### Pattern A — Interaction (what this project uses)
Player walks up to the door, presses Space/E. The `update()` loop calls `this.gridEngine.getFacingPosition("player")`, looks up the facing coordinate in `interactionMap`, and dispatches the transition. No tile property check needed.

```
// In update():
const facingPos = this.gridEngine.getFacingPosition("player")
const key = `${facingPos.x},${facingPos.y}`
const interaction = this.interactionMap.get(key)
if (interaction?.type === "building") { this.scene.start(...) }
```

This is the authentic Pokemon Gen 1/2 feel: you press A to enter a building.

### Pattern B — Step-On (automatic teleport, Pokemon Gen 3+ style)
Subscribe to Grid Engine's `positionChangeFinished()` observable. On every tile the player lands on, check if that tile has a door property (via Tiled custom property or a hardcoded coordinate set).

```
// In create():
this.gridEngine.positionChangeFinished().subscribe(({ charId, enterTile }) => {
  if (charId !== "player") return
  const tile = map.getTileAt(enterTile.x, enterTile.y, true, "Triggers")
  if (tile?.properties?.door) {
    this.scene.start("Interior", { spawnKey: tile.properties.spawnKey, returnPos: enterTile })
  }
})
```

`positionChangeFinished` fires once per completed tile move (not per frame). This is the right event to use — NOT `update()` polling — because Grid Engine characters stop precisely in the center of a tile only when this event fires. Checking position in `update()` can fire multiple times mid-movement.

**Verdict for this project:** Stick with Pattern A (interaction). It matches Pokemon Gen 1/2 fidelity. Pattern B is documented here for exit doors inside interiors (where you may want auto-teleport on stepping onto the exit tile rather than requiring a keypress).

---

## Q3: Passing Player Position — Entry and Return Flow

### Entry (Overworld → Interior)

In `Overworld.ts`, when the player interacts with a building entrance:

```ts
// interactionMap entry:
this.interactionMap.set("13,22", {
  type: "building",
  key: "ThovenHQ",
  returnPos: { x: 13, y: 23 }  // tile just outside the door
})

// handleInteraction():
this.scene.start("InteriorStub", {
  returnPos: payload.returnPos,   // where to put the player on return
  buildingKey: payload.key,       // which building (for interior to know what to show)
})
```

The interior scene receives this in `create(data)` and holds it for the return trip.

### Return (Interior → Overworld)

The interior scene calls:

```ts
this.scene.start("Overworld", { returnFrom: data })
```

`data` contains `{ returnPos, buildingKey }`, which was the data passed TO the interior.

Back in `Overworld.create(data)`:

```ts
// startPosition uses returnPos if present, otherwise default spawn (dock):
startPosition: data?.returnFrom?.returnPos ?? { x: 25, y: 38 }
```

And after Grid Engine is created, a redundant explicit setPosition call reinforces it:

```ts
if (data?.returnFrom?.returnPos) {
  this.gridEngine.setPosition("player", data.returnFrom.returnPos)
}
```

**The `returnPos` is the tile directly outside the door** (one tile south of the door tile the player was facing). This places the player just outside the building, facing away from it — exactly the Pokemon feel.

### Spawn Point Inside Interior

Each interior scene receives `spawnKey` or uses a fixed spawn coordinate. Interior maps should have a Tiled object layer with spawn point objects. In `create()`, look up the spawn object:

```ts
const spawnPoint = map.findObject("SpawnPoints", obj => obj.name === data.spawnKey)
const spawnTile = { x: Math.floor(spawnPoint.x / 16), y: Math.floor(spawnPoint.y / 16) }
this.gridEngine.create(map, {
  characters: [{ id: "player", startPosition: spawnTile, ... }]
})
```

---

## Q4: Grid Engine GitHub — Multi-Scene and Interior Examples

Sources: https://github.com/Annoraaq/grid-engine and https://annoraaq.github.io/grid-engine/

Key findings from the Grid Engine repository and documentation:

- **No dedicated multi-scene example** exists in the Grid Engine examples directory. Multi-scene patterns are left to the game author.
- `this.gridEngine.create(tilemap, config)` must be called in every scene's `create()` that uses Grid Engine. It is not optional or resumable.
- **Key events for door detection:**
  - `this.gridEngine.positionChangeFinished()` — Observable, fires after each completed tile move. Best event for step-on door detection.
  - `this.gridEngine.movementStopped()` — Observable, fires when a character stops moving. Used in this project for John Collison's patrol.
  - `this.gridEngine.getFacingPosition(charId)` — Synchronous, returns `{x, y}` of the tile the character is facing. Used in this project for interaction detection.
- `this.gridEngine.setPosition(charId, {x, y})` — Teleports a character to a tile immediately. Used for repositioning player on return from interior.
- All Grid Engine observables return RxJS Observables. Always call `.unsubscribe()` in the scene's `shutdown` event to prevent memory leaks.

---

## Q5: ariroffe/personal-website — Interior Transition Pattern

Source: https://github.com/ariroffe/personal-website (the primary reference project, 425 HN upvotes)

The ariroffe project is a Pokemon Gen 1/2 Phaser 3 + Tiled overworld personal website — the closest existing reference to Andres World. From search results and the HN discussion:

- The project uses Tiled tilemaps exported as JSON, with a custom tileset compiled via GIMP.
- It has multiple scenes structured around the Phaser scene system.
- The specific interior transition code is in the scenes/ directory of the repository (direct source access was not available via web search, but the pattern inferred from the Phaser 3 + Pokemon context is consistent with what is already implemented in this project).
- The HN post confirms the game uses building entry interactions similar to Pattern A above.

**Note:** Direct file-by-file inspection of ariroffe's scenes/ directory was not possible in this research session. The existing implementation in this codebase already reflects the correct pattern.

---

## Recommended Implementation Pattern

Full door-entry/exit flow for a real interior scene (replacing InteriorStub):

```
// === ENTRY (Overworld.ts — already implemented) ===

// 1. Register door in interactionMap with returnPos = tile just outside door
interactionMap.set("13,22", {
  type: "building",
  key: "ThovenHQ",
  returnPos: { x: 13, y: 23 }   // one tile south of door
})

// 2. On Space/E press while facing door tile:
this.scene.start("ThovenHQ", {
  returnPos: { x: 13, y: 23 },
  buildingKey: "ThovenHQ"
})


// === INTERIOR SCENE (ThovenHQ.ts) ===

class ThovenHQScene extends Phaser.Scene {
  constructor() { super({ key: "ThovenHQ" }) }

  create(data: { returnPos: {x,y}, buildingKey: string }) {
    // 1. Load interior tilemap (different map from overworld)
    const map = this.make.tilemap({ key: "thoven-interior" })
    const tileset = map.addTilesetImage("interiors", "interiors")
    map.createLayer("Floor", tileset)
    map.createLayer("Walls", tileset)
    map.createLayer("Objects", tileset)

    // 2. Spawn player at interior door spawn point
    const spawnObj = map.findObject("SpawnPoints", o => o.name === "entrance")
    const spawnTile = { x: Math.floor(spawnObj.x / 16), y: Math.floor(spawnObj.y / 16) }
    const playerSprite = this.add.sprite(0, 0, "player")

    // 3. Initialize Grid Engine — fresh instance, this scene only
    this.gridEngine.create(map, {
      characters: [{ id: "player", sprite: playerSprite, startPosition: spawnTile }]
    })

    // 4. Find exit tile — Tiled object or hardcoded coordinate
    const exitTile = { x: 3, y: 9 }   // door tile inside interior

    // 5. Subscribe to positionChangeFinished for step-on exit detection
    //    (alternative to requiring keypress to exit)
    const sub = this.gridEngine.positionChangeFinished().subscribe(({ charId, enterTile }) => {
      if (charId !== "player") return
      if (enterTile.x === exitTile.x && enterTile.y === exitTile.y) {
        sub.unsubscribe()
        this.scene.start("Overworld", { returnFrom: data })
      }
    })

    // 6. Cleanup on scene shutdown
    this.events.on("shutdown", () => sub.unsubscribe())
  }
}


// === RETURN (Overworld.ts — already implemented) ===

create(data?: { returnFrom?: { returnPos: {x,y}, buildingKey: string } }) {
  // ... build tilemap, create layers ...

  this.gridEngine.create(map, {
    characters: [{
      id: "player",
      startPosition: data?.returnFrom?.returnPos ?? { x: 25, y: 38 }
    }]
  })

  // Explicit setPosition as safety net (redundant but harmless)
  if (data?.returnFrom?.returnPos) {
    this.gridEngine.setPosition("player", data.returnFrom.returnPos)
  }
}
```

---

## Common Pitfalls

1. **Calling `this.gridEngine.create()` before all `map.createLayer()` calls are complete.**
   Grid Engine reads the tilemap's collision and tile data during `create()`. If layers aren't built yet, collision detection will be wrong or broken. Always create all layers first, then call `this.gridEngine.create()`.

2. **Forgetting to unsubscribe Grid Engine observables.**
   `positionChangeFinished()`, `movementStopped()`, etc. return RxJS Observables. If you subscribe in `create()` and don't unsubscribe in the `shutdown` event, the subscription survives scene destruction and fires on the next scene (or causes null reference errors). Always: `this.events.on("shutdown", () => sub.unsubscribe())`.

3. **Using `update()` loop polling to detect tile position instead of `positionChangeFinished()`.**
   Characters are between tiles most of the time. Checking position in `update()` will fire the transition mid-walk, mid-tile. `positionChangeFinished` fires exactly once when the character has fully settled on the new tile.

4. **Using `scene.start()` when you intended to preserve overworld state.**
   `scene.start()` destroys and recreates. If the player has walked deep into the map and you want to return them to exactly where they were (not to a door spawn), use `scene.sleep()` + `scene.wake()` instead. The tradeoff is that the sleeping scene stays in memory. For this project's map size (~50x40 tiles), either approach is fine — the current `scene.start()` approach is simpler.

5. **`returnPos` pointing at the door tile instead of one tile outside it.**
   If `returnPos = { x: 13, y: 22 }` (the door tile itself), the player respawns inside the building wall. Always set `returnPos` to the tile one step in the direction the player came from — i.e., the walkable tile in front of the entrance.

6. **Hardcoded spawn coordinates instead of Tiled object layers.**
   For simple interiors, hardcoding is fine. For multiple entrances to the same interior (e.g., a side door), use a Tiled "SpawnPoints" object layer with named objects and look them up by name in `create()`. This scales cleanly as interiors grow.

7. **Not fading the camera during transition.**
   Raw scene switches are jarring. Add a camera fade-out before `scene.start()` and fade-in at the start of the new scene's `create()` for the Pokemon feel. Use `this.cameras.main.fadeOut(300)` + listen for `FADE_OUT_COMPLETE` event before calling `scene.start()`.

8. **Grid Engine initialized with wrong tileset GIDs.**
   When switching to an interior scene with a different tileset, the GID-to-tile mapping is specific to that map. Always use the tileset names exactly as they appear in the interior map's JSON, not the overworld's tileset names.

---

## Relevant Source Files in This Project

- `/Users/andresmartinez/andres-world/src/game/scenes/Overworld.ts` — entry side, interaction detection, returnPos pattern (lines 31, 96-97, 112-114, 129-130, 242-245)
- `/Users/andresmartinez/andres-world/src/game/scenes/InteriorStub.ts` — stub interior, return flow (lines 8, 40-47)
- `/Users/andresmartinez/andres-world/src/game/main.ts` — scene registration order

---

## References

- [Grid Engine GitHub](https://github.com/Annoraaq/grid-engine)
- [Grid Engine Documentation](https://annoraaq.github.io/grid-engine/)
- [ariroffe/personal-website (primary reference)](https://github.com/ariroffe/personal-website)
- [Phaser 3 ScenePlugin API — sleep/wake/start](https://photonstorm.github.io/phaser3-docs/Phaser.Scenes.ScenePlugin.html)
- [Phaser 3 — Passing Data To A Scene](https://phaser.io/examples/v3/view/scenes/passing-data-to-a-scene)
- [Rex Rainbow Notes — Scene Manager](https://rexrainbow.github.io/phaser3-rex-notes/docs/site/scenemanager/)
- [PokemonClone — door object pattern](https://github.com/boxerbomb/PokemonClone)
- [Phaser 3 Scene Lifecycle — DeepWiki](https://deepwiki.com/phaserjs/phaser/3.1-scene-lifecycle)
