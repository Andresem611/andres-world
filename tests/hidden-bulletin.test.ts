/**
 * Tests for hidden areas, bulletin board, and construction buildings.
 */

import { describe, it, expect } from "vitest";
import { INTERACTION_MAP } from "../src/maps/interactions";
import { DIALOGUE } from "../src/content/dialogue";
import NPC_CONFIG from "../src/game/config/npcs";

describe("hidden area signs", () => {
  it("Secret Beach sign exists", () => {
    const sign = INTERACTION_MAP.get("39,30");
    expect(sign).toBeDefined();
    expect(sign!.id).toBe("secret-beach-sign");
  });

  it("Music Room sign exists", () => {
    const sign = INTERACTION_MAP.get("8,9");
    expect(sign).toBeDefined();
    expect(sign!.id).toBe("music-room-sign");
  });

  it("Idea Graveyard sign exists", () => {
    const sign = INTERACTION_MAP.get("8,28");
    expect(sign).toBeDefined();
    expect(sign!.id).toBe("idea-graveyard-sign");
  });

  it("Lookout Hill sign exists", () => {
    const sign = INTERACTION_MAP.get("23,3");
    expect(sign).toBeDefined();
    expect(sign!.id).toBe("lookout-hill-sign");
  });

  it("Hidden mentor exists at north tip", () => {
    const sign = INTERACTION_MAP.get("25,1");
    expect(sign).toBeDefined();
    expect(sign!.id).toBe("hidden-mentor");
    expect(sign!.dialog!.lines.length).toBeGreaterThanOrEqual(3);
  });

  it("Hidden NPCs at correct positions", () => {
    // Vinod Khosla at Secret Beach
    const vinod = NPC_CONFIG.find((n) => n.id === "vinod-khosla");
    expect(vinod).toBeDefined();
    // Ben Horowitz at Idea Graveyard
    const ben = NPC_CONFIG.find((n) => n.id === "ben-horowitz");
    expect(ben).toBeDefined();
    // Dalton Caldwell at Lookout Hill
    const dalton = NPC_CONFIG.find((n) => n.id === "dalton-caldwell");
    expect(dalton).toBeDefined();
  });
});

describe("bulletin board", () => {
  it("has header sign", () => {
    const header = INTERACTION_MAP.get("24,33");
    expect(header).toBeDefined();
    expect(header!.dialog!.lines[0]).toContain("FIGURING OUT");
  });

  it("has all 7 pins", () => {
    for (let i = 1; i <= 7; i++) {
      expect(DIALOGUE[`bulletin-pin-${i}`]).toBeDefined();
      expect(DIALOGUE[`bulletin-pin-${i}`].lines[0]).toContain("📌");
    }
  });

  it("has 7 pin interactions in the map", () => {
    const pinIds = Array.from(INTERACTION_MAP.values())
      .filter((i) => i.id.startsWith("bulletin-pin-"))
      .map((i) => i.id);
    expect(pinIds.length).toBe(7);
  });

  it("has PC link interaction", () => {
    const pc = INTERACTION_MAP.get("26,33");
    expect(pc).toBeDefined();
    expect(pc!.id).toBe("bulletin-pc");
  });
});

describe("construction buildings", () => {
  it("Chalk Lab shows construction dialog", () => {
    const chalk = INTERACTION_MAP.get("20,12");
    expect(chalk).toBeDefined();
    expect(chalk!.type).toBe("under_construction");
    expect(chalk!.dialog!.lines[0]).toContain("Chalk");
  });

  it("Chalk Lab hardhat NPC sign exists", () => {
    const hardhat = INTERACTION_MAP.get("19,13");
    expect(hardhat).toBeDefined();
    expect(hardhat!.dialog!.lines[0]).toContain("started this");
  });

  it("VC Office is locked", () => {
    const vc = INTERACTION_MAP.get("28,20");
    expect(vc).toBeDefined();
    expect(vc!.type).toBe("under_construction");
    expect(vc!.dialog!.lines[0]).toContain("Sand Hill");
  });
});
