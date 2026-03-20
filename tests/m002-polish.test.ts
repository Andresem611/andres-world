/**
 * Final M002 polish tests — content parity, pixel rendering, music infrastructure.
 */

import { describe, it, expect } from "vitest";
import * as fs from "fs";
import * as path from "path";
import { DIALOGUE } from "../src/content/dialogue";
import NPC_CONFIG from "../src/game/config/npcs";
import { OVERWORLD_MAP } from "../src/maps/overworld";
import { INTERIOR_MAPS } from "../src/maps/interiors";
import { INTERACTION_MAP } from "../src/maps/interactions";

describe("content parity with M001", () => {
  it("has 247+ lines of dialogue content", () => {
    const dialogPath = path.join(__dirname, "../src/content/dialogue.ts");
    const lines = fs.readFileSync(dialogPath, "utf-8").split("\n").length;
    expect(lines).toBeGreaterThanOrEqual(247);
  });

  it("has 14 NPC configs", () => {
    expect(NPC_CONFIG.length).toBe(14);
  });

  it("has 50×40 overworld map", () => {
    expect(OVERWORLD_MAP.width).toBe(50);
    expect(OVERWORLD_MAP.height).toBe(40);
  });

  it("has 4 interior maps", () => {
    expect(Object.keys(INTERIOR_MAPS).length).toBe(4);
  });

  it("all NPCs have dialogue", () => {
    for (const npc of NPC_CONFIG) {
      expect(DIALOGUE[npc.dialogId]).toBeDefined();
    }
  });

  it("has all hidden area signs", () => {
    expect(INTERACTION_MAP.has("39,30")).toBe(true); // Secret Beach
    expect(INTERACTION_MAP.has("8,9")).toBe(true);   // Music Room
    expect(INTERACTION_MAP.has("8,28")).toBe(true);  // Idea Graveyard
    expect(INTERACTION_MAP.has("23,3")).toBe(true);  // Lookout Hill
    expect(INTERACTION_MAP.has("25,1")).toBe(true);  // Hidden Mentor
  });

  it("has 7 bulletin pins", () => {
    let count = 0;
    for (const [, v] of INTERACTION_MAP) {
      if (v.id.startsWith("bulletin-pin-")) count++;
    }
    expect(count).toBe(7);
  });
});

describe("pixel rendering infrastructure", () => {
  it("index.html has pixelated CSS", () => {
    const html = fs.readFileSync(path.join(__dirname, "../index.html"), "utf-8");
    // style.css reference exists
    expect(html).toContain("style.css");
  });

  it("style.css has image-rendering: pixelated", () => {
    const css = fs.readFileSync(path.join(__dirname, "../public/style.css"), "utf-8");
    expect(css).toContain("pixelated");
  });
});

describe("music infrastructure", () => {
  it("useMusic hook exists", () => {
    const hookPath = path.join(__dirname, "../src/hooks/useMusic.ts");
    expect(fs.existsSync(hookPath)).toBe(true);
  });

  it("useMusic exports play and stop", () => {
    const content = fs.readFileSync(path.join(__dirname, "../src/hooks/useMusic.ts"), "utf-8");
    expect(content).toContain("play");
    expect(content).toContain("stop");
    expect(content).toContain("HTMLAudioElement");
  });
});

describe("sprite assets", () => {
  it("player sprite exists", () => {
    expect(fs.existsSync(path.join(__dirname, "../public/assets/sprites/player.png"))).toBe(true);
  });

  it("all NPC sprites exist", () => {
    for (const npc of NPC_CONFIG) {
      const spritePath = path.join(__dirname, `../public/assets/sprites/${npc.spriteKey}.png`);
      expect(fs.existsSync(spritePath)).withContext(npc.spriteKey).toBe(true);
    }
  });

  it("tileset PNGs exist for overworld", () => {
    const tilesets = [
      "1_Terrains_and_Fences_16x16.png",
      "21_Beach_16x16.png",
      "4_Generic_Buildings_16x16.png",
    ];
    for (const t of tilesets) {
      expect(fs.existsSync(path.join(__dirname, `../public/assets/tilesets/${t}`))).toBe(true);
    }
  });

  it("interior tileset PNGs exist", () => {
    expect(fs.existsSync(path.join(__dirname, "../public/assets/tilesets/Room_Builder_16x16.png"))).toBe(true);
    expect(fs.existsSync(path.join(__dirname, "../public/assets/tilesets/Interiors_16x16.png"))).toBe(true);
  });
});
