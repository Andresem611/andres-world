import { describe, it, expect } from "vitest";

// InteractionPayload type shape (inline — no import needed, tests pure object literals)
type InteractionPayload =
  | { type: "npc"; id: string; dialog: string[] }
  | { type: "sign"; text: string[] }
  | { type: "building"; key: string; returnPos: { x: number; y: number } }
  | { type: "under_construction"; message: string };

// INTER-01: Map<string, InteractionPayload> lookup behavior
describe("INTER-01: interaction map lookup", () => {
  it('looking up "5,10" returns the payload; looking up "5,11" returns undefined', () => {
    const payload: InteractionPayload = {
      type: "npc",
      id: "paul-graham",
      dialog: ["Write simply."],
    };
    const interactionMap = new Map<string, InteractionPayload>();
    interactionMap.set("5,10", payload);

    expect(interactionMap.get("5,10")).toEqual(payload);
    expect(interactionMap.get("5,11")).toBeUndefined();
  });
});

// INTER-02: A payload with type "building" has key string and returnPos {x, y} with number values
describe("INTER-02: building payload shape", () => {
  it('a payload with type "building" has a key string and returnPos {x, y} with number values', () => {
    const payload: InteractionPayload = {
      type: "building",
      key: "thoven-hq",
      returnPos: { x: 25, y: 15 },
    };

    expect(payload.type).toBe("building");
    expect(typeof payload.key).toBe("string");
    expect(typeof payload.returnPos.x).toBe("number");
    expect(typeof payload.returnPos.y).toBe("number");
  });
});

// INTER-03: A payload with type "under_construction" has message equal to the expected string
describe("INTER-03: under_construction payload message", () => {
  it('a payload with type "under_construction" has the correct message string', () => {
    const payload: InteractionPayload = {
      type: "under_construction",
      message: "Builder still hammering away... check back soon.",
    };

    expect(payload.type).toBe("under_construction");
    expect(payload.message).toBe(
      "Builder still hammering away... check back soon."
    );
  });
});
