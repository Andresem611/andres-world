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

  it("Above layer at Thoven HQ footprint has BUILDING_GID (7689)", () => {
    const aboveData: number[] = mapData.layers[1].data as number[];
    // Thoven HQ: x=10-17, y=14-22 — top-left corner tile
    const idx = 10 + 14 * WIDTH;
    expect(aboveData[idx]).toBe(7689);
  });

  it("Above layer has palm frond tile (GID 2770) at main street west palm position", () => {
    const aboveData: number[] = mapData.layers[1].data as number[];
    // Main street west palm frond at x=21, y=5
    const idx = 21 + 5 * WIDTH;
    expect(aboveData[idx]).toBe(2770);
  });

  it("Above layer has palm trunk (GID 2834) one row below the palm frond", () => {
    const aboveData: number[] = mapData.layers[1].data as number[];
    // Palm trunk at x=21, y=6 (one row below frond at y=5)
    const idx = 21 + 6 * WIDTH;
    expect(aboveData[idx]).toBe(2834);
  });

  it("Above layer at Chalk Lab top rows has SCAFFOLD_GID (3598)", () => {
    const aboveData: number[] = mapData.layers[1].data as number[];
    // Chalk Lab scaffold overlay: x=18-22, y=8-9
    const idx = 18 + 8 * WIDTH;
    expect(aboveData[idx]).toBe(3598);
  });
});

// Phase 3.3 geometry constants
const BUILDING_GID = 7689;
const PATH_GID = 294;
const TALL_GRASS_GID = 257;

describe("Phase 3.3 — geometry changes", () => {
  // 1. Andres's House east boundary shrunk — x=10, y=18 must NOT be BUILDING_GID
  it("Andres House east boundary shrunk — x=10,y=18 no longer has BUILDING_GID", () => {
    const aboveData: number[] = mapData.layers[1].data as number[];
    const idx = 10 + 18 * WIDTH;
    expect(aboveData[idx]).not.toBe(BUILDING_GID);
  });

  // 2. Andres's House east boundary cleared — x=11, y=16 (old footprint, outside new x=6-9) must NOT be BUILDING_GID
  it("Andres House east cleared — x=11,y=16 (old footprint outside new x=6-9) not BUILDING_GID", () => {
    const aboveData: number[] = mapData.layers[1].data as number[];
    const idx = 11 + 16 * WIDTH;
    expect(aboveData[idx]).not.toBe(BUILDING_GID);
  });

  // 3. Chalk Lab east boundary shrunk — x=22, y=10 must NOT be BUILDING_GID
  it("Chalk Lab east boundary shrunk — x=22,y=10 no longer has BUILDING_GID", () => {
    const aboveData: number[] = mapData.layers[1].data as number[];
    const idx = 22 + 10 * WIDTH;
    expect(aboveData[idx]).not.toBe(BUILDING_GID);
  });

  // 4. Thoven HQ expanded — x=18, y=18 must be BUILDING_GID (was outside old x=10-17)
  it("Thoven HQ expanded east — x=18,y=18 has BUILDING_GID", () => {
    const aboveData: number[] = mapData.layers[1].data as number[];
    const idx = 18 + 18 * WIDTH;
    expect(aboveData[idx]).toBe(BUILDING_GID);
  });

  // 5. Tall grass present inside Idea Graveyard field — x=3, y=27
  it("Tall grass present inside Idea Graveyard — x=3,y=27 has TALL_GRASS_GID (257)", () => {
    const aboveData: number[] = mapData.layers[1].data as number[];
    const idx = 3 + 27 * WIDTH;
    expect(aboveData[idx]).toBe(TALL_GRASS_GID);
  });

  // 6. Tall grass gap is walkable — x=10, y=27 east wall gap must be Collision=0
  it("Tall grass gap walkable — Collision layer at x=10,y=27 is 0", () => {
    const collisionData: number[] = mapData.layers[2].data as number[];
    const idx = 10 + 27 * WIDTH;
    expect(collisionData[idx]).toBe(0);
  });

  // 7. West cross-street — Ground layer at x=15, y=23 must be PATH_GID (294)
  it("West cross-street present — Ground layer at x=15,y=23 has PATH_GID (294)", () => {
    const groundData: number[] = mapData.layers[0].data as number[];
    const idx = 15 + 23 * WIDTH;
    expect(groundData[idx]).toBe(PATH_GID);
  });

  // 8. East boardwalk — Ground layer at x=37, y=10 must be PATH_GID (294)
  it("East boardwalk present — Ground layer at x=37,y=10 has PATH_GID (294)", () => {
    const groundData: number[] = mapData.layers[0].data as number[];
    const idx = 37 + 10 * WIDTH;
    expect(groundData[idx]).toBe(PATH_GID);
  });

  // 9. East boardwalk mid-point — Ground layer at x=37, y=25 must be PATH_GID (294)
  //    (boardwalk spine runs full north-south; currently grass at mid-point)
  it("East boardwalk mid-point — Ground layer at x=37,y=25 has PATH_GID (294)", () => {
    const groundData: number[] = mapData.layers[0].data as number[];
    const idx = 37 + 25 * WIDTH;
    expect(groundData[idx]).toBe(PATH_GID);
  });
});
