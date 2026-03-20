/**
 * Tests for tile renderer, map data, and tileset CSS mapping.
 */

import { describe, it, expect } from "vitest";
import { OVERWORLD_MAP } from "../src/maps/overworld";
import { getTileStyle, findTileset, getVisibleTileRange, TILESETS } from "../src/maps/tilesets";

describe("OVERWORLD_MAP structure", () => {
  it("has correct dimensions (50×40)", () => {
    expect(OVERWORLD_MAP.width).toBe(50);
    expect(OVERWORLD_MAP.height).toBe(40);
    expect(OVERWORLD_MAP.tileSize).toBe(16);
  });

  it("ground layer is 40 rows × 50 columns", () => {
    expect(OVERWORLD_MAP.layers.ground.length).toBe(40);
    OVERWORLD_MAP.layers.ground.forEach((row, y) => {
      expect(row.length).withContext(`row ${y}`).toBe(50);
    });
  });

  it("above layer is 40 rows × 50 columns", () => {
    expect(OVERWORLD_MAP.layers.above.length).toBe(40);
    OVERWORLD_MAP.layers.above.forEach((row) => {
      expect(row.length).toBe(50);
    });
  });

  it("collision layer is 40 rows × 50 columns with only 0 and 1 values", () => {
    expect(OVERWORLD_MAP.layers.collision.length).toBe(40);
    OVERWORLD_MAP.layers.collision.forEach((row) => {
      expect(row.length).toBe(50);
      row.forEach((v) => {
        expect(v === 0 || v === 1).toBe(true);
      });
    });
  });

  it("spawn point (x=25, y=38) is walkable", () => {
    expect(OVERWORLD_MAP.layers.collision[38][25]).toBe(0);
  });

  it("ocean strip (x>=42) is blocked", () => {
    // Check a sample of ocean tiles
    for (let x = 42; x < 50; x++) {
      expect(OVERWORLD_MAP.layers.collision[20][x]).toBe(1);
    }
  });

  it("has non-zero above tiles at building locations", () => {
    // Thoven HQ area (x=12-21, y=14-18)
    const thovenAbove = OVERWORLD_MAP.layers.above[15][15];
    expect(thovenAbove).toBeGreaterThan(0);
  });
});

describe("getTileStyle", () => {
  it("returns null for GID 0 (empty tile)", () => {
    expect(getTileStyle(0)).toBeNull();
  });

  it("returns correct style for terrains tileset (GID 1)", () => {
    const style = getTileStyle(1);
    expect(style).not.toBeNull();
    expect(style!.backgroundPosition).toBe("-0px -0px");
    expect(style!.width).toBe(16);
    expect(style!.height).toBe(16);
    expect(style!.backgroundImage).toContain("Terrains");
  });

  it("returns correct style for terrains tileset row 2 col 5 (GID 70)", () => {
    // GID 70 = firstGid(1) + localId(69); localId 69 = row 2 col 5 (32 cols)
    const style = getTileStyle(70);
    expect(style).not.toBeNull();
    expect(style!.backgroundPosition).toBe(`-${5 * 16}px -${2 * 16}px`);
  });

  it("returns correct tileset for beach GID (2369)", () => {
    const style = getTileStyle(2369);
    expect(style).not.toBeNull();
    expect(style!.backgroundImage).toContain("Beach");
    expect(style!.backgroundPosition).toBe("-0px -0px");
  });

  it("returns correct tileset for buildings GID (6369)", () => {
    const style = getTileStyle(6369);
    expect(style).not.toBeNull();
    expect(style!.backgroundImage).toContain("Buildings");
    expect(style!.backgroundPosition).toBe("-0px -0px");
  });
});

describe("findTileset", () => {
  it("returns null for GID 0", () => {
    expect(findTileset(0)).toBeNull();
  });

  it("finds terrains for GID 1", () => {
    expect(findTileset(1)?.name).toBe("terrains");
  });

  it("finds beach for GID 2369", () => {
    expect(findTileset(2369)?.name).toBe("beach");
  });

  it("finds buildings for GID 6369", () => {
    expect(findTileset(6369)?.name).toBe("buildings");
  });

  it("finds villas for GID 19681", () => {
    expect(findTileset(19681)?.name).toBe("villas");
  });
});

describe("getVisibleTileRange", () => {
  it("returns bounded range for center of map", () => {
    const range = getVisibleTileRange(25, 20, 800, 600, 16, 4, 50, 40);
    expect(range.startX).toBeGreaterThanOrEqual(0);
    expect(range.startY).toBeGreaterThanOrEqual(0);
    expect(range.endX).toBeLessThan(50);
    expect(range.endY).toBeLessThan(40);
  });

  it("clamps to map bounds at top-left corner", () => {
    const range = getVisibleTileRange(0, 0, 800, 600, 16, 4, 50, 40);
    expect(range.startX).toBe(0);
    expect(range.startY).toBe(0);
  });

  it("clamps to map bounds at bottom-right corner", () => {
    const range = getVisibleTileRange(49, 39, 800, 600, 16, 4, 50, 40);
    expect(range.endX).toBe(49);
    expect(range.endY).toBe(39);
  });

  it("visible range covers fewer tiles than total map", () => {
    const range = getVisibleTileRange(25, 20, 800, 600, 16, 4, 50, 40);
    const visibleTiles = (range.endX - range.startX + 1) * (range.endY - range.startY + 1);
    expect(visibleTiles).toBeLessThan(50 * 40);
    expect(visibleTiles).toBeGreaterThan(0);
  });
});

describe("TILESETS config", () => {
  it("has 6 tilesets in correct GID order", () => {
    expect(TILESETS.length).toBe(6);
    expect(TILESETS[0].name).toBe("terrains");
    expect(TILESETS[0].firstGid).toBe(1);
    expect(TILESETS[5].name).toBe("villas");
    expect(TILESETS[5].firstGid).toBe(19681);
  });

  it("all tilesets have 16px tile size and 32 columns", () => {
    TILESETS.forEach((t) => {
      expect(t.tileSize).toBe(16);
      expect(t.columns).toBe(32);
    });
  });
});
