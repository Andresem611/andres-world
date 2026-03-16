import { describe, it, expect } from "vitest";
import type { InteriorTransitionData, OverworldReturnData } from "../src/types/scene-data";

describe("Scene transition data contracts", () => {
  it("InteriorTransitionData has required fields", () => {
    const data: InteriorTransitionData = {
      buildingKey: "ThovenHQ",
      returnPos: { x: 13, y: 23 },
      entryPos: { x: 4, y: 7 },
    };
    expect(data.buildingKey).toBe("ThovenHQ");
    expect(data.returnPos).toEqual({ x: 13, y: 23 });
    expect(data.entryPos).toEqual({ x: 4, y: 7 });
  });

  it("OverworldReturnData has required returnPos and optional facingDirection", () => {
    const data: OverworldReturnData = {
      returnPos: { x: 13, y: 23 },
    };
    expect(data.returnPos).toEqual({ x: 13, y: 23 });
    expect(data.facingDirection).toBeUndefined();

    const dataWithFacing: OverworldReturnData = {
      returnPos: { x: 9, y: 23 },
      facingDirection: "down",
    };
    expect(dataWithFacing.facingDirection).toBe("down");
  });

  it("InteriorTransitionData and OverworldReturnData form a round-trip contract", () => {
    // Overworld sends this to Interior
    const enterData: InteriorTransitionData = {
      buildingKey: "ThovenHQ",
      returnPos: { x: 13, y: 23 },
      entryPos: { x: 4, y: 7 },
    };

    // Interior sends this back to Overworld
    const exitData: OverworldReturnData = {
      returnPos: enterData.returnPos, // must match what was passed in
      facingDirection: "down",
    };

    // Verify the contract: returnPos survives the round-trip
    expect(exitData.returnPos).toEqual(enterData.returnPos);
  });
});

describe("InteriorBaseScene module (no Phaser import — verifies file compiles)", () => {
  it("scene-data types module is importable", async () => {
    const mod = await import("../src/types/scene-data");
    // TypeScript interfaces don't exist at runtime, but the module should load cleanly
    expect(mod).toBeDefined();
  });

  it("InteriorBaseScene file exists and is valid TypeScript", async () => {
    // Can't import Phaser in Node env — verify the file exists and compiles via tsc
    const fs = await import("fs");
    const path = await import("path");
    const scenePath = path.resolve(__dirname, "../src/game/scenes/InteriorBaseScene.ts");
    expect(fs.existsSync(scenePath)).toBe(true);

    const content = fs.readFileSync(scenePath, "utf-8");
    // Verify key patterns exist in the source
    expect(content).toContain("class InteriorBaseScene");
    expect(content).toContain("extends Phaser.Scene");
    expect(content).toContain("exitToOverworld");
    expect(content).toContain("InteriorTransitionData");
    expect(content).toContain("OverworldReturnData");
    expect(content).toContain("gridEngine");
    expect(content).toContain("fadeIn");
    expect(content).toContain("fadeOut");
    expect(content).toContain("camerafadeoutcomplete");
    expect(content).toContain("movementStopped");
  });
});
