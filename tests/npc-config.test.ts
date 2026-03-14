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

// NPC-02: Every entry has a non-empty dialogId string (replaces old dialog array test)
describe("NPC-02: dialogId", () => {
  it("every entry has a non-empty dialogId string", () => {
    for (const npc of NPC_CONFIG) {
      expect(typeof npc.dialogId).toBe("string");
      expect(npc.dialogId.length).toBeGreaterThan(0);
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
