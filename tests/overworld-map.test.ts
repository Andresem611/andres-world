import { describe, it, expect } from "vitest";
import mapData from "../public/assets/maps/overworld.json";

const WIDTH = 50;
const HEIGHT = 40;
const TOTAL_TILES = WIDTH * HEIGHT; // 2000

describe("overworld.json — map structure", () => {
  it("has correct map dimensions", () => {
    expect(mapData.width).toBe(50);
    expect(mapData.height).toBe(40);
    expect(mapData.tilewidth).toBe(16);
    expect(mapData.tileheight).toBe(16);
  });

  it("has exactly 3 layers named Ground, Above, Collision in that order", () => {
    expect(mapData.layers).toHaveLength(3);
    expect(mapData.layers[0].name).toBe("Ground");
    expect(mapData.layers[1].name).toBe("Above");
    expect(mapData.layers[2].name).toBe("Collision");
  });

  it("each layer data array has length 2000 (50*40)", () => {
    for (const layer of mapData.layers) {
      expect(layer.data.length).toBe(TOTAL_TILES);
    }
  });

  it("Ground layer has no GID=0 in main street walkable corridor (x=22-28, y=5-35)", () => {
    const groundData: number[] = mapData.layers[0].data as number[];
    for (let y = 5; y <= 35; y++) {
      for (let x = 22; x <= 28; x++) {
        const idx = x + y * WIDTH;
        expect(
          groundData[idx],
          `Ground tile at x=${x} y=${y} (idx=${idx}) must not be GID 0`
        ).not.toBe(0);
      }
    }
  });

  it("Above layer at ocean strip (x=42-49, all y) has non-zero water tile GIDs", () => {
    const aboveData: number[] = mapData.layers[1].data as number[];
    // Water tiles should be non-zero (filled with actual water tile GIDs)
    for (let y = 0; y < HEIGHT; y++) {
      for (let x = 42; x <= 49; x++) {
        const idx = x + y * WIDTH;
        expect(
          aboveData[idx],
          `Above tile at ocean x=${x} y=${y} should be a water tile (non-zero)`
        ).toBeGreaterThan(0);
      }
    }
  });

  it("has blocking tile definitions in tilesets[0].tiles (ge_collide properties)", () => {
    expect(mapData.tilesets[0].tiles.length).toBeGreaterThan(0);
  });

  it("dock spawn zone (x=24-26, y=37-39) is walkable — Collision layer has GID=0", () => {
    const collisionData: number[] = mapData.layers[2].data as number[];
    for (let y = 37; y <= 39; y++) {
      for (let x = 24; x <= 26; x++) {
        const idx = x + y * WIDTH;
        expect(
          collisionData[idx],
          `Collision tile at dock spawn x=${x} y=${y} must be 0 (walkable)`
        ).toBe(0);
      }
    }
  });

  it("has exactly 5 tilesets: terrains, beach, buildings, garden, worksite", () => {
    expect(mapData.tilesets).toHaveLength(5);
    expect(mapData.tilesets[0].name).toBe("terrains");
    expect(mapData.tilesets[1].name).toBe("beach");
    expect(mapData.tilesets[2].name).toBe("buildings");
    expect(mapData.tilesets[3].name).toBe("garden");
    expect(mapData.tilesets[4].name).toBe("worksite");
  });
});
