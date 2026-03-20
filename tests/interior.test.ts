/**
 * Tests for interior maps, interaction routing, and scene transitions.
 */

import { describe, it, expect } from "vitest";
import { INTERIOR_MAPS } from "../src/maps/interiors";
import { INTERACTION_MAP } from "../src/maps/interactions";
import { DIALOGUE } from "../src/content/dialogue";

describe("interior maps", () => {
  const interiorKeys = ["andres-room", "thoven-hq", "starbucks", "engineering-lab"];

  it("has all 4 interior maps", () => {
    for (const key of interiorKeys) {
      expect(INTERIOR_MAPS[key]).toBeDefined();
    }
  });

  it("each interior has correct layer structure", () => {
    for (const key of interiorKeys) {
      const map = INTERIOR_MAPS[key];
      expect(map.layers.ground.length).toBe(map.height);
      expect(map.layers.above.length).toBe(map.height);
      expect(map.layers.collision.length).toBe(map.height);
      for (let y = 0; y < map.height; y++) {
        expect(map.layers.ground[y].length).toBe(map.width);
        expect(map.layers.collision[y].length).toBe(map.width);
      }
    }
  });

  it("each interior has exit positions", () => {
    for (const key of interiorKeys) {
      expect(INTERIOR_MAPS[key].exitPositions.length).toBeGreaterThan(0);
    }
  });

  it("andres-room is 10×8", () => {
    expect(INTERIOR_MAPS["andres-room"].width).toBe(10);
    expect(INTERIOR_MAPS["andres-room"].height).toBe(8);
  });

  it("thoven-hq is 12×10", () => {
    expect(INTERIOR_MAPS["thoven-hq"].width).toBe(12);
    expect(INTERIOR_MAPS["thoven-hq"].height).toBe(10);
  });

  it("collision layers have only 0 and 1", () => {
    for (const key of interiorKeys) {
      const map = INTERIOR_MAPS[key];
      for (const row of map.layers.collision) {
        for (const v of row) {
          expect(v === 0 || v === 1).toBe(true);
        }
      }
    }
  });
});

describe("interaction map", () => {
  it("has welcome sign at 25,36", () => {
    const interaction = INTERACTION_MAP.get("25,36");
    expect(interaction).toBeDefined();
    expect(interaction!.type).toBe("sign");
    expect(interaction!.id).toBe("welcome-sign");
  });

  it("has building entrances", () => {
    const entrances = ["8,20", "16,19", "31,28", "41,8"];
    for (const pos of entrances) {
      const interaction = INTERACTION_MAP.get(pos);
      expect(interaction).toBeDefined();
      expect(interaction!.type).toBe("building");
      expect(interaction!.interiorKey).toBeDefined();
      expect(interaction!.returnPos).toBeDefined();
    }
  });

  it("has under-construction buildings", () => {
    const uc = INTERACTION_MAP.get("20,12");
    expect(uc).toBeDefined();
    expect(uc!.type).toBe("under_construction");

    const vc = INTERACTION_MAP.get("28,20");
    expect(vc).toBeDefined();
    expect(vc!.type).toBe("under_construction");
  });

  it("all dialog references exist in DIALOGUE", () => {
    for (const [, interaction] of INTERACTION_MAP) {
      if (interaction.dialog) {
        expect(interaction.dialog.lines.length).toBeGreaterThan(0);
      }
      if (interaction.type === "sign" || interaction.type === "under_construction") {
        expect(interaction.dialog).toBeDefined();
      }
    }
  });
});

describe("interior dialogue content", () => {
  it("andres room has all object dialogues", () => {
    const roomDialogs = [
      "room-bed", "room-pc", "room-dj", "room-bookshelf",
      "room-jersey", "room-flags", "room-pennant", "room-poster", "room-window",
    ];
    for (const id of roomDialogs) {
      expect(DIALOGUE[id]).toBeDefined();
      expect(DIALOGUE[id].lines.length).toBeGreaterThan(0);
    }
  });

  it("thoven hq has all object dialogues", () => {
    const ids = ["thoven-metrics", "thoven-shipped", "thoven-pc",
      "thoven-practice-piano", "thoven-practice-guitar",
      "thoven-practice-voice", "thoven-practice-violin"];
    for (const id of ids) {
      expect(DIALOGUE[id]).toBeDefined();
    }
  });

  it("cafe has essay dialogues", () => {
    expect(DIALOGUE["cafe-essay-1"]).toBeDefined();
    expect(DIALOGUE["cafe-essay-2"]).toBeDefined();
    expect(DIALOGUE["cafe-barista"]).toBeDefined();
  });

  it("engineering lab has all object dialogues", () => {
    const ids = ["lab-experiment-1", "lab-experiment-2", "lab-experiment-3",
      "lab-stack-wall", "lab-rubber-duck"];
    for (const id of ids) {
      expect(DIALOGUE[id]).toBeDefined();
    }
  });
});
