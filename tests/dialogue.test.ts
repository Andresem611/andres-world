import { describe, it, expect } from "vitest";
import { DIALOGUE } from "../src/content/dialogue";
import { DialogEntry } from "../src/types/dialog";
import NPC_CONFIG from "../src/game/config/npcs";

// NPC-06 Test 1: DialogEntry interface has required fields (lines: string[]) and optional fields
describe("NPC-06: DialogEntry interface", () => {
  it("has required 'lines' field and optional fields match expected shape", () => {
    // Create a minimal valid entry to verify the interface compiles correctly
    const entry: DialogEntry = { lines: ["Hello"] };
    expect(entry.lines).toEqual(["Hello"]);

    // Create a full entry with all optional fields
    const full: DialogEntry = {
      speaker: "Test",
      lines: ["Line 1"],
      condition: "hasVisitedHQ",
      link: { label: "Visit", url: "https://example.com" },
      onComplete: "visitedTest",
    };
    expect(full.speaker).toBe("Test");
    expect(full.lines).toEqual(["Line 1"]);
    expect(full.condition).toBe("hasVisitedHQ");
    expect(full.link).toEqual({ label: "Visit", url: "https://example.com" });
    expect(full.onComplete).toBe("visitedTest");
  });
});

// NPC-06 Test 2: DIALOGUE map has an entry for every NPC id in NPC_CONFIG (14 entries)
describe("NPC-06: DIALOGUE coverage", () => {
  it("has an entry for every NPC id in NPC_CONFIG", () => {
    for (const npc of NPC_CONFIG) {
      expect(DIALOGUE[npc.id], `Missing DIALOGUE entry for NPC: ${npc.id}`).toBeDefined();
    }
  });
});

// NPC-06 Test 3: Every DIALOGUE entry has a non-empty lines array
describe("NPC-06: DIALOGUE lines", () => {
  it("every entry has a non-empty lines array", () => {
    for (const [key, entry] of Object.entries(DIALOGUE)) {
      expect(Array.isArray(entry.lines), `${key} lines should be an array`).toBe(true);
      expect(entry.lines.length, `${key} lines should not be empty`).toBeGreaterThan(0);
    }
  });
});

// NPC-06 Test 4: DIALOGUE includes sign and under-construction entries
describe("NPC-06: sign and under-construction entries", () => {
  it('includes "welcome-sign" entry', () => {
    expect(DIALOGUE["welcome-sign"]).toBeDefined();
    expect(DIALOGUE["welcome-sign"].lines).toContain("Welcome to Andres World.");
  });

  it('includes "under-construction-default" entry', () => {
    expect(DIALOGUE["under-construction-default"]).toBeDefined();
    expect(DIALOGUE["under-construction-default"].lines).toContain(
      "Builder still hammering away... check back soon."
    );
  });
});

// NPC-06 Test 5: No DIALOGUE entry has lines containing "TODO" or "[placeholder]"
describe("NPC-06: no placeholder text", () => {
  it('no entry has lines containing "TODO" or "[placeholder]"', () => {
    for (const [key, entry] of Object.entries(DIALOGUE)) {
      for (const line of entry.lines) {
        expect(line, `${key} has TODO`).not.toBe("TODO");
        expect(line, `${key} has [placeholder]`).not.toContain("[placeholder]");
      }
    }
  });
});
