# Phaser 3 + Grid Engine — Pokemon Overworld Best Practices

**Date:** 2026-03-09
**Purpose:** Research for Andres World phases 4–9 (interiors, NPCs, dialogue, hidden areas, polish)
**Sources:** devshareacademy/monster-tamer source (world-scene.js), Grid Engine docs (annoraaq.github.io/grid-engine), web exploration

---

## 1. monster-tamer (devshareacademy/monster-tamer)

### How many Phaser scenes?

13 scene files confirmed in `src/scenes/`:

| File | Role |
|------|------|
| `base-scene.js` | Abstract base — shared controls, camera, update lifecycle |
| `world-scene.js` | Main overworld + interior handler (same scene, different area data) |
| `battle-scene.js` | Combat screen |
| `cutscene-scene.js` | Launched in parallel — overlaid cinematic bars, does not replace world |
| `dialog-scene.js` | Launched in parallel — persistent NPC text box overlay |
| `inventory-scene.js` | Launched on top of paused world |
| `monster-party-scene.js` | Launched on top of paused world |
| `monster-details-scene.js` | Sub-screen of monster party |
| `options-scene.js` | Settings |
| `preload-scene.js` | Asset loading |
| `title-scene.js` | Title card |
| `test-scene.js` | Dev scratch pad |
| `scene-keys.js` | Central enum of all scene keys |

**Pattern:** One `WorldScene` handles both overworld and interiors — it re-creates itself via `this.scene.start(SCENE_KEYS.WORLD_SCENE, { area, isInterior })`. It does NOT create a separate "InteriorScene" class. UI layers (dialog, cutscene) run as **parallel launched scenes** on top of the world rather than as embedded game objects.

### Tilemap structure

- Each area has its own tilemap JSON, loaded during preload with a unique key (e.g. `MAIN_1_LEVEL`, `TOWN_LEVEL`).
- Tilemap layers: background tiles, `Collision` layer (invisible collision bitmap), `Encounter` layers (tall grass zones), foreground depth layer.
- Object layers: `NPC`, `NPC_PATH`, `Sign`, `Item`, `Scene_Transitions`, `Events`, `Revive_Location`, `Player_Spawn_Location`, `Area_Metadata`.
- Tilesets: a `collision` tileset (single-tile bitmap for collision) + real visual tilesets.
- Foreground image added last via `this.add.image()` at depth above player for visual depth trick (buildings appear to be in front of player when walking behind them).
- Camera regions defined in a `Camera_Regions` object layer — used to dynamically constrain `cameras.main.setBounds()` as the player moves, so one large map can have smaller scrollable sub-zones.

### NPC movement

NPCs are defined per-object-layer in Tiled. Each NPC layer has:
- One object of type `NPC` with position, `npc_id`, and `movement_pattern` (Tiled custom property)
- Multiple `NPC_PATH` objects numbered 0..N as waypoints

In `#createNPCs(map)`:
```js
const npcPath = { 0: { x, y } };
pathObjects.forEach((obj) => { npcPath[parseInt(obj.name, 10)] = { x, y }; });
const npc = new NPC({ scene, position, direction, frame, npcPath, movementPattern, events });
```

Movement patterns supported: `IDLE`, `SET_PATH` (loop waypoints), and dynamic cutscene-driven movement (`MOVE_TO_PLAYER`, `RETRACE_PATH`).

NPCs check for collisions against the player (and vice versa) — mutual collision registration:
```js
npc.addCharacterToCheckForCollisionsWith(this.#player);
this.#npcs.forEach(npc => npc.addCharacterToCheckForCollisionsWith(this.#player));
```

### Interior scene handling

**Same `WorldScene` class handles interiors.** Transition flow:

1. Player steps on an entrance tile in Tiled's `Scene_Transitions` layer.
2. `enterEntranceCallback(entranceName, entranceId, isBuildingEntrance)` fires in the `Player` class.
3. WorldScene fades camera out over 1000ms.
4. On fade complete: persists new position to `dataManager`, calls `this.scene.start(SCENE_KEYS.WORLD_SCENE, { area: entranceName, isInterior: isBuildingEntrance })`.
5. WorldScene re-initializes with the interior's tilemap key.

Interior detection:
```js
const dataToPass = { area: entranceName, isInterior: isBuildingEntrance };
this.scene.start(SCENE_KEYS.WORLD_SCENE, dataToPass);
```

Camera bounds are set conditionally: `if (!this.#sceneData.isInterior) { this.cameras.main.setBounds(0, 0, 2560, 5184); }` — interiors use default (unconstrained, or tilemap-sized) bounds.

Player spawn on entry: the destination tilemap is parsed to find the entrance object whose `connects_to` matches the originating area and `entrance_id` matches — giving the exact pixel to spawn at.

---

## 2. Grid Engine v2.x — Relevant Features

**Source:** annoraaq.github.io/grid-engine docs (v2.41.0 live on docs site; v2.48+ confirmed installed in this project)

### Multi-map / scene transition handling

Grid Engine itself does not manage scene transitions — that is Phaser's job. The correct pattern (confirmed by monster-tamer) is:

- Call `this.scene.start()` to restart/swap scene with new area data.
- Grid Engine is re-initialized in the new scene's `create()` with the new tilemap.
- No Grid Engine state persists across scene restarts — player position is saved to an external store (dataManager / localStorage).

### NPC pathfinding

Key APIs:
- `gridEngine.moveTo(charId, targetPosition, options)` — moves a character to a tile position on the shortest path.
- `gridEngine.follow(charId, targetCharId, options)` — continuously follows another character.
- `gridEngine.findShortestPath(from, to, options)` — returns path without moving.
- `gridEngine.moveRandomly(charId)` — random wandering movement.

**Algorithm recommendation for this project (4-directional grid movement):**
Use **Jump Point Search (JPS)** — fastest in benchmarks for 4-directional movement on open maps (outperforms BFS, Bidirectional, A*). Set via `PathfindingOptions.algorithm = Algorithm.JPS`.

**Caching:** Since v2.28.0, `cacheTileCollisions: true` in config enables tile collision caching. Strongly recommended for a mostly static tilemap — dramatic speedup for NPC `moveTo` and `follow` calls. Invalidate locally with `gridEngine.rebuildTileCollisionCache(area)` if tiles change.

**ignoreLayers:** Set `ignoreLayers: true` in pathfinding options to avoid scanning all char layers — halves the effective map size for pathfinding when NPCs don't need to cross char layers.

### Character layers (multi-layer depth)

Character layers (`ge_charLayer` Tiled property) solve the overworld depth problem:
- Assign tilemap layers a `ge_charLayer` property in Tiled.
- Characters assigned to a char layer only collide with other characters and tiles on that same layer.
- Depth/z-index is derived from the char layer's position in the layer stack.

For this project:
- A single `ground` char layer is sufficient for the overworld.
- Interiors (same WorldScene, new tilemap) can define their own char layers if needed (e.g., upper floors).

### Layer transitions (for stairs/bridges)

`gridEngine.setTransition(tilePos, fromLayer, toLayer)` — when a character enters `tilePos` on `fromLayer`, they are automatically moved to `toLayer`. Used for bridges and stairs. Relevant if Andres's House has a second floor or if the Music Room has a basement stair.

### Collision layers

`ge_alwaysTop` layer property is deprecated in v2 — use char layers instead for above-player rendering. Collision is tile-property based (`ge_collide: true` on tile or layer).

### `positionChangeStarted` and `positionChangeFinished` observables

Grid Engine exposes RxJS-style observables:
- `gridEngine.positionChangeStarted()` — fires when a character begins moving to a new tile. Use this to check encounter zones, trigger entrance checks.
- `gridEngine.positionChangeFinished()` — fires when movement completes. Use this for dialogue trigger zones, interaction checks.

These replace manual overlap checks (monster-tamer manually checks overlaps in `update()`; the GE observable approach is cleaner for TypeScript).

---

## 3. Web Search: Interior/Exterior Transition Patterns

Based on research across the Grid Engine docs, monster-tamer source, and related Pokemon Phaser repos:

**Dominant pattern for overworld ↔ interior:** Restart the same scene with different area data. This is preferred over separate scene classes because:
- All NPC, collision, entrance, sign, and camera logic is shared.
- Player state persists via a data manager (not in Phaser scene state).
- Tiled handles the entrance/exit warp data declaratively.

**Alternative pattern (used in some smaller repos):** Two separate scene classes (`OverworldScene`, `InteriorScene`) that share a base class. Only justified if interior mechanics are fundamentally different (e.g., no random encounters, different camera behavior). For this project, not recommended — adds complexity without benefit.

**ariroffe/personal-website** (the direct reference in CLAUDE.md): Also uses Phaser 3 + Grid Engine. Not publicly inspectable (private), but HN comments confirm it uses a single world scene with tilemap swap for interiors — same approach as monster-tamer.

---

## 4. Grid Engine Examples Directory

From the docs sidebar and URL exploration, relevant examples at `annoraaq.github.io/grid-engine/examples/`:

| Example | Relevance |
|---------|-----------|
| `char-layers-bridge` | Layer transitions via `setTransition()` — for stairs, basement entries |
| `char-layers-flying-chars` | Multi-layer depth — useful if adding rooftop terrace (Lookout Hill) |
| `follow-movement` | `gridEngine.follow()` — for NPCs that chase/follow player in cutscenes |
| `random-movement` | `gridEngine.moveRandomly()` — idle wandering NPCs (dogs in Andres's Room) |
| `pathfinding` | `gridEngine.moveTo()` with JPS — NPC patrol to destination |
| `queue-movement` | Queuing multiple moves — for scripted NPC cutscene paths |

Examples are embedded in the live docs site at `annoraaq.github.io/grid-engine/examples/[name]/index.html`.

---

## 5. Top 5 Actionable Patterns for Phases 4–9

### Pattern 1: Single WorldScene with area data for all maps

Do not create `InteriorScene`, `ThoveHQScene`, `AndreasRoomScene` as separate classes. Instead:

```typescript
// Transition to any interior
this.cameras.main.fadeOut(800, 0, 0, 0, (_cam, progress) => {
  if (progress === 1) {
    this.scene.start('WorldScene', { area: 'andres_room', isInterior: true });
  }
});
```

Each interior area gets its own Tiled JSON map file (e.g., `andres_room.json`, `thoven_hq.json`). The `WorldScene.create()` reads `area` from scene data, loads the matching tilemap, and sets up NPCs, signs, and collision from that map's object layers.

**Why:** Avoids code duplication across 8+ interiors. All interior NPCs, signs, and dialogue use the same infrastructure already built in phases 2–3.

### Pattern 2: Tiled object layers for all interactive content

Define NPCs, signs, items, entrances, and event zones entirely in Tiled — not hardcoded in TypeScript. The scene reads from object layers at runtime:

```
Object layers (Tiled)
├── NPC_Keri         → type: NPC, properties: npc_id=1, movement_pattern=IDLE
├── NPC_DadWander    → type: NPC, properties: npc_id=2, movement_pattern=SET_PATH
│   ├── path_0 (object) → name: "0"
│   └── path_1 (object) → name: "1"
├── Signs            → type: Sign, properties: sign_id=5
├── Scene_Transitions → connects_to=overworld, entrance_id=thoven_front_door
└── Events           → id=101 (triggers cutscene on overlap)
```

**Why:** Content changes (new NPC dialogue, new patrol path, new sign text) become Tiled edits + JSON re-export, not TypeScript changes. Supports the "low friction to update" requirement from CLAUDE.md.

### Pattern 3: Dialog + Cutscene as parallel launched scenes

Dialog UI and cutscene bars are launched once in `WorldScene.create()` and persist as parallel scenes:

```typescript
// In WorldScene.create()
this.scene.launch('CutsceneScene');
this.scene.launch('DialogScene');
this.dialogUi = this.scene.get('DialogScene') as DialogScene;
```

`DialogScene` exposes `showDialogModal(messages: string[])` and `hideDialogModal()`. It renders on top of WorldScene without pausing it, allowing NPC movement to continue during dialogue.

**Why:** Prevents the "pause world during dialogue" flicker. NPCs keep walking (Dad pacing, dogs wandering) while text is displayed. Fourth-wall dialogue (NPCs aware they're on a portfolio site) benefits from the world being alive during conversation.

### Pattern 4: JPS pathfinding + tile collision caching for NPC movement

For any NPC that uses `gridEngine.moveTo()` (cutscene movement, NPCs walking to player, guards patrolling):

```typescript
// GridEngine config
gridEngine.create(tilemap, {
  characters: [...],
  cacheTileCollisions: true,       // cache static tile collisions
});

// NPC moveTo call
gridEngine.moveTo('dad_npc', { x: 5, y: 8 }, {
  algorithm: Algorithm.JPS,        // fastest for 4-directional
  ignoreLayers: true,              // single char layer — skip multi-layer search
  noPathFoundStrategy: NoPathFoundStrategy.STOP,
  pathBlockedStrategy: PathBlockedStrategy.WAIT,
});
```

**Why:** The overworld is 50x40 = 2000 tiles. With 10+ NPCs calling `moveTo`, uncached BFS on every call adds up. JPS + caching keeps pathfinding under 1ms on a 50x40 map per the GE benchmarks.

### Pattern 5: Camera regions for large overworld, unconstrained for interiors

The overworld (50x40 at 16px tiles, 4x zoom = 3200x2560 apparent pixels) needs camera bound constraints to prevent showing empty space. Interiors (typically 20x15 tiles max) can be centered with no scrolling.

```typescript
// WorldScene.create()
if (!sceneData.isInterior) {
  // Camera scrolls within the world bounds
  const mapW = map.widthInPixels * ZOOM;
  const mapH = map.heightInPixels * ZOOM;
  this.cameras.main.setBounds(0, 0, mapW, mapH);
  // Optional: camera region zones from Tiled (dynamic sub-bounds)
  this.cameraRegions = TiledUtils.createCameraRegions(map);
} else {
  // Interior: center the room, no scroll needed for small maps
  this.cameras.main.centerOn(
    map.widthInPixels * ZOOM / 2,
    map.heightInPixels * ZOOM / 2
  );
}
this.cameras.main.startFollow(player.sprite);
```

For Tiled-defined camera sub-zones (e.g., the beach strip having different scroll bounds than main street), use object layers with named rectangles and dynamically update `setBounds()` when the player moves between zones — exactly as monster-tamer does with `CameraUtils.updateMainCameraBounds()`.

**Why:** Prevents the 4x zoom from showing black borders at map edges. Interiors centered automatically without needing to set exact bounds per room.

---

## Appendix: Key API Surface (Grid Engine v2.x)

```typescript
// Initialize
gridEngine.create(tilemap, { characters, cacheTileCollisions: true });

// Movement
gridEngine.moveTo(charId, { x, y }, { algorithm, ignoreLayers });
gridEngine.follow(charId, targetId, { distance });
gridEngine.moveRandomly(charId, delay, radius);
gridEngine.stopMovement(charId);

// Observables
gridEngine.positionChangeFinished().subscribe(({ charId, enterTile }) => { ... });
gridEngine.positionChangeStarted().subscribe(({ charId, exitTile }) => { ... });

// Layer transitions (stairs/bridges)
gridEngine.setTransition({ x, y }, 'ground', 'upper_floor');

// Cache
gridEngine.rebuildTileCollisionCache(area);

// Query
gridEngine.getPosition(charId);        // tile position
gridEngine.getFacingDirection(charId); // DIRECTION enum
gridEngine.isMoving(charId);
```

---

## Notes on GitHub Rate Limiting

The Grid Engine CHANGELOG.md (raw GitHub) returned 404 (branch is `master`, not `main`). The GitHub web interface rate-limited during the session. Changelog features were inferred from the live docs site version numbers (v2.28.0 for caching, v2.41.0 on docs, v2.48+ installed locally) and API reference pages.
