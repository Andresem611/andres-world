import { describe, it, expect } from "vitest";
import * as fs from "fs";
import * as path from "path";
import { DIALOGUE } from "../src/content/dialogue";

describe("Thoven HQ map", () => {
  const mapPath = path.resolve(__dirname, "../public/assets/maps/thoven-hq.json");
  const mapData = JSON.parse(fs.readFileSync(mapPath, "utf-8"));

  it("map is 12×10 tiles", () => {
    expect(mapData.width).toBe(12);
    expect(mapData.height).toBe(10);
  });

  it("has required layers", () => {
    const names = mapData.layers.map((l: { name: string }) => l.name);
    expect(names).toContain("ground");
    expect(names).toContain("exits");
    expect(names).toContain("collision");
    expect(names).toContain("furniture");
    expect(names).toContain("walls");
  });

  it("has exit tiles at bottom center", () => {
    const exits = mapData.layers.find((l: { name: string }) => l.name === "exits");
    const w = mapData.width;
    expect(exits.data[9 * w + 5]).toBeGreaterThan(0);
    expect(exits.data[9 * w + 6]).toBeGreaterThan(0);
  });

  it("has collision on walls and furniture", () => {
    const collision = mapData.layers.find((l: { name: string }) => l.name === "collision");
    const blocked = collision.data.filter((g: number) => g !== 0).length;
    expect(blocked).toBeGreaterThan(30);
  });
});

describe("Thoven HQ dialogue (THOV requirements)", () => {
  // THOV-02: Keri
  it("THOV-02: Keri has Thoven description dialogue", () => {
    expect(DIALOGUE["keri"]).toBeDefined();
    expect(DIALOGUE["keri"].lines.some(l => l.includes("Thoven"))).toBe(true);
  });

  // THOV-03: Metrics board
  it("THOV-03: metrics board shows counts", () => {
    expect(DIALOGUE["thoven-metrics"]).toBeDefined();
    expect(DIALOGUE["thoven-metrics"].lines.some(l => l.includes("Teachers"))).toBe(true);
  });

  // THOV-04: Shipped board
  it("THOV-04: shipped board has last shipped and current focus", () => {
    expect(DIALOGUE["thoven-shipped"]).toBeDefined();
    expect(DIALOGUE["thoven-shipped"].lines.some(l => l.includes("Last shipped"))).toBe(true);
    expect(DIALOGUE["thoven-shipped"].lines.some(l => l.includes("Current focus"))).toBe(true);
  });

  // THOV-05: Practice rooms
  it("THOV-05: practice room dialogues exist for Piano, Guitar, Voice, Violin", () => {
    expect(DIALOGUE["thoven-practice-piano"]).toBeDefined();
    expect(DIALOGUE["thoven-practice-guitar"]).toBeDefined();
    expect(DIALOGUE["thoven-practice-voice"]).toBeDefined();
    expect(DIALOGUE["thoven-practice-violin"]).toBeDefined();
  });

  // THOV-06: Michael Seibel
  it("THOV-06: Michael Seibel says 'Make something people want.'", () => {
    expect(DIALOGUE["michael-seibel"]).toBeDefined();
    expect(DIALOGUE["michael-seibel"].lines[0]).toContain("Make something people want");
  });

  // THOV-07: Brian Chesky
  it("THOV-07: Brian Chesky says 'Don't fuck up the culture.'", () => {
    expect(DIALOGUE["brian-chesky"]).toBeDefined();
    expect(DIALOGUE["brian-chesky"].lines[0]).toContain("culture");
  });

  // THOV-08: PC links to Thoven
  it("THOV-08: PC dialogue mentions Thoven", () => {
    expect(DIALOGUE["thoven-pc"]).toBeDefined();
    expect(DIALOGUE["thoven-pc"].lines[0]).toContain("Thoven");
  });
});

describe("ThovenHQ scene implementation", () => {
  const content = fs.readFileSync(
    path.resolve(__dirname, "../src/game/scenes/ThovenHQ.ts"), "utf-8"
  );

  it("extends InteriorBaseScene", () => {
    expect(content).toContain("extends InteriorBaseScene");
  });

  it("spawns Keri, Michael Seibel, and Brian Chesky NPCs", () => {
    expect(content).toContain('"keri"');
    expect(content).toContain('"michael-seibel"');
    expect(content).toContain('"brian-chesky"');
  });

  it("registers metrics board and shipped board interactions", () => {
    expect(content).toContain("thoven-metrics");
    expect(content).toContain("thoven-shipped");
  });

  it("registers practice room door interactions", () => {
    expect(content).toContain("thoven-practice-piano");
    expect(content).toContain("thoven-practice-guitar");
    expect(content).toContain("thoven-practice-voice");
    expect(content).toContain("thoven-practice-violin");
  });
});
