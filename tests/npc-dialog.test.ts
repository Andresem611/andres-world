/**
 * Tests for NPC system and dialog.
 */

import { describe, it, expect } from "vitest";
import NPC_CONFIG from "../src/game/config/npcs";
import { DIALOGUE } from "../src/content/dialogue";
import { splitIntoPages } from "../src/components/DialogBox";

describe("NPC config", () => {
  it("has at least 14 NPCs", () => {
    expect(NPC_CONFIG.length).toBeGreaterThanOrEqual(14);
  });

  it("every NPC has a matching dialogue entry", () => {
    for (const npc of NPC_CONFIG) {
      expect(DIALOGUE[npc.dialogId]).toBeDefined();
      expect(DIALOGUE[npc.dialogId].lines.length).toBeGreaterThan(0);
    }
  });

  it("every NPC has a sprite key starting with npc-", () => {
    for (const npc of NPC_CONFIG) {
      expect(npc.spriteKey).toMatch(/^npc-/);
    }
  });

  it("john-collison has patrol enabled", () => {
    const john = NPC_CONFIG.find((n) => n.id === "john-collison");
    expect(john).toBeDefined();
    expect(john!.patrol).toBe(true);
  });

  it("NPCs have valid start positions within map bounds", () => {
    for (const npc of NPC_CONFIG) {
      expect(npc.startPosition.x).toBeGreaterThanOrEqual(0);
      expect(npc.startPosition.x).toBeLessThan(50);
      expect(npc.startPosition.y).toBeGreaterThanOrEqual(0);
      expect(npc.startPosition.y).toBeLessThan(40);
    }
  });
});

describe("dialogue content", () => {
  it("has entries for all key NPCs", () => {
    const keyNpcs = [
      "marc-andreessen", "john-collison", "paul-graham",
      "michael-seibel", "keri", "brian-chesky",
      "dalton-caldwell", "ben-horowitz", "vinod-khosla",
      "tobi-lutke", "patrick-collison", "dario-amodei",
      "dad", "dog-1",
    ];
    for (const id of keyNpcs) {
      expect(DIALOGUE[id]).toBeDefined();
    }
  });

  it("has no empty dialogue lines", () => {
    for (const [key, entry] of Object.entries(DIALOGUE)) {
      for (const line of entry.lines) {
        expect(line.length).withContext(`${key} has empty line`).toBeGreaterThan(0);
      }
    }
  });

  it("has sign and building dialogue entries", () => {
    expect(DIALOGUE["welcome-sign"]).toBeDefined();
    expect(DIALOGUE["under-construction-default"]).toBeDefined();
    expect(DIALOGUE["chalk-lab-construction"]).toBeDefined();
    expect(DIALOGUE["vc-office"]).toBeDefined();
  });
});

describe("splitIntoPages", () => {
  it("splits 4 lines into 2 pages of 2", () => {
    const pages = splitIntoPages(["a", "b", "c", "d"], 2);
    expect(pages).toEqual([["a", "b"], ["c", "d"]]);
  });

  it("handles single line", () => {
    const pages = splitIntoPages(["hello"]);
    expect(pages.length).toBe(1);
    expect(pages[0]).toEqual(["hello"]);
  });

  it("handles empty lines array", () => {
    const pages = splitIntoPages([]);
    expect(pages.length).toBe(1);
  });

  it("handles 3 lines with 2 per page", () => {
    const pages = splitIntoPages(["a", "b", "c"], 2);
    expect(pages).toEqual([["a", "b"], ["c"]]);
  });
});
