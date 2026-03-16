import { describe, it, expect } from "vitest";
import * as fs from "fs";
import * as path from "path";
import { DIALOGUE } from "../src/content/dialogue";

describe("Andres's Room map", () => {
  const mapPath = path.resolve(__dirname, "../public/assets/maps/andres-room.json");
  const mapData = JSON.parse(fs.readFileSync(mapPath, "utf-8"));

  it("map is 10×8 tiles", () => {
    expect(mapData.width).toBe(10);
    expect(mapData.height).toBe(8);
  });

  it("has required layers: ground, walls, furniture, exits, collision", () => {
    const layerNames = mapData.layers.map((l: { name: string }) => l.name);
    expect(layerNames).toContain("ground");
    expect(layerNames).toContain("exits");
    expect(layerNames).toContain("collision");
    expect(layerNames).toContain("furniture");
    expect(layerNames).toContain("walls");
  });

  it("has both Room_Builder and Interiors tilesets", () => {
    const tilesetNames = mapData.tilesets.map((t: { name: string }) => t.name);
    expect(tilesetNames).toContain("Room_Builder_16x16");
    expect(tilesetNames).toContain("Interiors_16x16");
  });

  it("has exit tiles at bottom center (x=4-5, y=7)", () => {
    const exits = mapData.layers.find((l: { name: string }) => l.name === "exits");
    const w = mapData.width;
    expect(exits.data[7 * w + 4]).toBeGreaterThan(0); // x=4, y=7
    expect(exits.data[7 * w + 5]).toBeGreaterThan(0); // x=5, y=7
  });

  it("has collision on walls and furniture", () => {
    const collision = mapData.layers.find((l: { name: string }) => l.name === "collision");
    const nonZero = collision.data.filter((g: number) => g !== 0).length;
    expect(nonZero).toBeGreaterThan(20); // walls + furniture should block many tiles
  });

  it("has furniture tiles placed", () => {
    const furniture = mapData.layers.find((l: { name: string }) => l.name === "furniture");
    const nonZero = furniture.data.filter((g: number) => g !== 0).length;
    expect(nonZero).toBeGreaterThan(8); // bed + desk + dj + bookshelf
  });
});

describe("Andres's Room dialogue (ROOM requirements)", () => {
  // ROOM-03: Bed interaction
  it("ROOM-03: bed dialogue says 'Not yet. Too much to build.'", () => {
    expect(DIALOGUE["room-bed"]).toBeDefined();
    expect(DIALOGUE["room-bed"].lines[0]).toContain("Not yet");
  });

  // ROOM-04: PC desk with links
  it("ROOM-04: PC desk dialogue mentions links", () => {
    expect(DIALOGUE["room-pc"]).toBeDefined();
    expect(DIALOGUE["room-pc"].lines[0]).toContain("links");
  });

  // ROOM-05: DJ booth
  it("ROOM-05: DJ booth dialogue says 'He takes this seriously.'", () => {
    expect(DIALOGUE["room-dj"]).toBeDefined();
    expect(DIALOGUE["room-dj"].lines[0]).toContain("takes this seriously");
  });

  // ROOM-06: Bookshelf
  it("ROOM-06: bookshelf mentions The Hard Thing About Hard Things", () => {
    expect(DIALOGUE["room-bookshelf"]).toBeDefined();
    expect(DIALOGUE["room-bookshelf"].lines[0]).toContain("Hard Thing");
  });

  // ROOM-12: Dad NPC
  it("ROOM-12: Dad dialogue says 'Have you eaten?'", () => {
    expect(DIALOGUE["dad"]).toBeDefined();
    expect(DIALOGUE["dad"].lines[0]).toContain("Have you eaten");
  });

  // ROOM-13: Dachshund NPCs
  it("ROOM-13: both dogs say 'Woof.'", () => {
    expect(DIALOGUE["dog-1"]).toBeDefined();
    expect(DIALOGUE["dog-1"].lines[0]).toBe("Woof.");
    expect(DIALOGUE["dog-2"]).toBeDefined();
    expect(DIALOGUE["dog-2"].lines[0]).toBe("Woof.");
  });

  // Wall decorations dialogue
  it("wall decorations have dialogue entries", () => {
    expect(DIALOGUE["room-jersey"]).toBeDefined();
    expect(DIALOGUE["room-flags"]).toBeDefined();
    expect(DIALOGUE["room-pennant"]).toBeDefined();
    expect(DIALOGUE["room-poster"]).toBeDefined();
    expect(DIALOGUE["room-window"]).toBeDefined();
  });
});

describe("AndresRoom scene implementation", () => {
  const scenePath = path.resolve(__dirname, "../src/game/scenes/AndresRoom.ts");
  const content = fs.readFileSync(scenePath, "utf-8");

  it("extends InteriorBaseScene", () => {
    expect(content).toContain("extends InteriorBaseScene");
  });

  it("registers furniture interactions", () => {
    expect(content).toContain("room-bed");
    expect(content).toContain("room-pc");
    expect(content).toContain("room-dj");
    expect(content).toContain("room-bookshelf");
  });

  it("spawns Dad and two dachshund NPCs", () => {
    expect(content).toContain('"dad"');
    expect(content).toContain('"dog-1"');
    expect(content).toContain('"dog-2"');
  });

  it("has interaction handling for NPCs and signs", () => {
    expect(content).toContain("handleInteraction");
    expect(content).toContain("interactionMap");
    expect(content).toContain("DialogBox");
  });

  it("registers wall decoration interactions", () => {
    expect(content).toContain("room-jersey");
    expect(content).toContain("room-flags");
    expect(content).toContain("room-pennant");
    expect(content).toContain("room-window");
  });
});
