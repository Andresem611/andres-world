import { describe, it, expect } from "vitest";
import NPC_CONFIG from "../src/game/config/npcs";

// NPC-01: Every entry has a non-empty spriteKey string
describe("NPC-01: spriteKey", () => {
  it("every entry has a non-empty spriteKey string", () => {
    for (const npc of NPC_CONFIG) {
      expect(typeof npc.spriteKey).toBe("string");
      expect(npc.spriteKey.length).toBeGreaterThan(0);
    }
  });
});

// NPC-02: Every entry has a dialog array with at least one string
describe("NPC-02: dialog array", () => {
  it("every entry has a dialog array with at least one string", () => {
    for (const npc of NPC_CONFIG) {
      expect(Array.isArray(npc.dialog)).toBe(true);
      expect(npc.dialog.length).toBeGreaterThan(0);
      for (const line of npc.dialog) {
        expect(typeof line).toBe("string");
      }
    }
  });
});

// NPC-03: No dialog string equals "TODO" or contains "[placeholder]"
describe("NPC-03: no placeholder dialog", () => {
  it('no dialog string equals "TODO" or contains "[placeholder]"', () => {
    for (const npc of NPC_CONFIG) {
      for (const line of npc.dialog) {
        expect(line).not.toBe("TODO");
        expect(line).not.toContain("[placeholder]");
      }
    }
  });
});

// NPC-04: Exactly one entry has patrol === true, has patrolPath.length > 0, id is "john-collison"
describe("NPC-04: patrol NPC", () => {
  it('exactly one entry has patrol === true with patrolPath.length > 0 and id "john-collison"', () => {
    const patrolNpcs = NPC_CONFIG.filter((npc) => npc.patrol === true);
    expect(patrolNpcs).toHaveLength(1);
    const patroller = patrolNpcs[0];
    expect(patroller.id).toBe("john-collison");
    expect(Array.isArray((patroller as any).patrolPath)).toBe(true);
    expect((patroller as any).patrolPath.length).toBeGreaterThan(0);
  });
});

// NPC-05: NPC_CONFIG has exactly 14 entries
describe("NPC-05: count", () => {
  it("NPC_CONFIG has exactly 14 entries", () => {
    expect(NPC_CONFIG).toHaveLength(14);
  });
});
