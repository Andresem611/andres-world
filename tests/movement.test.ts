/**
 * Tests for GridEngineHeadless integration and collision map.
 */

import { describe, it, expect } from "vitest";
import { GridEngineHeadless, ArrayTilemap, Direction } from "grid-engine";
import { OVERWORLD_MAP } from "../src/maps/overworld";
import { isWalkable } from "../src/maps/collision";

describe("collision map", () => {
  it("spawn point (25, 38) is walkable", () => {
    expect(isWalkable(25, 38)).toBe(true);
  });

  it("ocean tile (45, 20) is blocked", () => {
    expect(isWalkable(45, 20)).toBe(false);
  });

  it("building interior (15, 15) is blocked", () => {
    expect(isWalkable(15, 15)).toBe(false);
  });

  it("out of bounds returns false", () => {
    expect(isWalkable(-1, 0)).toBe(false);
    expect(isWalkable(0, -1)).toBe(false);
    expect(isWalkable(50, 0)).toBe(false);
    expect(isWalkable(0, 40)).toBe(false);
  });

  it("east boardwalk x=37 is walkable", () => {
    expect(isWalkable(37, 25)).toBe(true);
  });
});

describe("GridEngineHeadless integration", () => {
  it("creates engine with ArrayTilemap from collision data", () => {
    const engine = new GridEngineHeadless();
    const tilemap = new ArrayTilemap({
      collision: {
        data: OVERWORLD_MAP.layers.collision,
      },
    });

    engine.create(tilemap, {
      characters: [
        {
          id: "player",
          startPosition: { x: 25, y: 38 },
          speed: 4,
        },
      ],
    });

    const pos = engine.getPosition("player");
    expect(pos.x).toBe(25);
    expect(pos.y).toBe(38);
  });

  it("player can move to an adjacent walkable tile", () => {
    const engine = new GridEngineHeadless();
    const tilemap = new ArrayTilemap({
      collision: {
        data: OVERWORLD_MAP.layers.collision,
      },
    });

    engine.create(tilemap, {
      characters: [
        {
          id: "player",
          startPosition: { x: 25, y: 38 },
          speed: 4,
        },
      ],
    });

    // Move up (y decreases)
    engine.move("player", Direction.UP);
    // Tick until movement completes
    for (let i = 0; i < 20; i++) {
      engine.update(0, 50);
    }

    const pos = engine.getPosition("player");
    // Should have moved up at least one tile
    expect(pos.y).toBeLessThan(38);
  });

  it("player cannot move into a blocked tile", () => {
    const engine = new GridEngineHeadless();
    // Create a small test map where right is blocked
    const tilemap = new ArrayTilemap({
      collision: {
        data: [
          [0, 1, 0],
          [0, 0, 0],
          [0, 0, 0],
        ],
      },
    });

    engine.create(tilemap, {
      characters: [
        {
          id: "player",
          startPosition: { x: 0, y: 0 },
          speed: 4,
        },
      ],
    });

    // Try to move right into blocked tile
    engine.move("player", Direction.RIGHT);
    for (let i = 0; i < 20; i++) {
      engine.update(0, 50);
    }

    const pos = engine.getPosition("player");
    expect(pos.x).toBe(0); // Should not have moved
    expect(pos.y).toBe(0);
  });

  it("facing direction updates on move attempt", () => {
    const engine = new GridEngineHeadless();
    const tilemap = new ArrayTilemap({
      collision: {
        data: [[0, 0], [0, 0]],
      },
    });

    engine.create(tilemap, {
      characters: [
        {
          id: "player",
          startPosition: { x: 0, y: 0 },
          speed: 4,
          facingDirection: Direction.DOWN,
        },
      ],
    });

    engine.move("player", Direction.RIGHT);
    expect(engine.getFacingDirection("player")).toBe(Direction.RIGHT);
  });
});
