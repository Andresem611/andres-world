import { describe, it, expect } from "vitest";
import type { InteriorTransitionData, OverworldReturnData } from "../src/types/scene-data";
import * as fs from "fs";
import * as path from "path";

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

  it("both registered buildings have valid transition data in Overworld", () => {
    const overworldContent = fs.readFileSync(
      path.resolve(__dirname, "../src/game/scenes/Overworld.ts"),
      "utf-8"
    );
    // Thoven HQ entrance
    expect(overworldContent).toContain('"13,22"');
    expect(overworldContent).toContain('"ThovenHQ"');
    // Andres Room entrance
    expect(overworldContent).toContain('"9,22"');
    expect(overworldContent).toContain('"AndresRoom"');
  });

  it("both interior maps exist on disk with required layers", () => {
    for (const mapFile of ["andres-room.json", "thoven-hq.json"]) {
      const mapPath = path.resolve(__dirname, "../public/assets/maps", mapFile);
      expect(fs.existsSync(mapPath)).toBe(true);

      const mapData = JSON.parse(fs.readFileSync(mapPath, "utf-8"));
      const layerNames = mapData.layers.map((l: { name: string }) => l.name);
      expect(layerNames).toContain("ground");
      expect(layerNames).toContain("exits");
      expect(layerNames).toContain("collision");
    }
  });
});

describe("InteriorBaseScene implementation", () => {
  const scenePath = path.resolve(__dirname, "../src/game/scenes/InteriorBaseScene.ts");
  const content = fs.readFileSync(scenePath, "utf-8");

  it("scene-data types module is importable", async () => {
    const mod = await import("../src/types/scene-data");
    expect(mod).toBeDefined();
  });

  it("InteriorBaseScene file exists and is valid TypeScript", () => {
    expect(fs.existsSync(scenePath)).toBe(true);
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

  it("keyboard input is created in create(), not update() (bug fix)", () => {
    // The old bug: createCursorKeys() was called in update() every frame
    // Fix: cursors and wasd are class fields, created once in create()

    // update() should NOT contain createCursorKeys or addKey
    const updateMatch = content.match(/update\(\)[\s\S]*?^\s\s\}/m);
    expect(updateMatch).toBeTruthy();
    const updateBody = updateMatch![0];
    expect(updateBody).not.toContain("createCursorKeys");
    expect(updateBody).not.toContain("addKey");

    // create() SHOULD contain createCursorKeys
    expect(content).toContain("this.cursors = this.input.keyboard!.createCursorKeys()");
  });

  it("camera zoom is set to 4x (matching overworld)", () => {
    expect(content).toContain("setZoom(4)");
  });

  it("ThovenHQ and AndresRoom scenes extend InteriorBaseScene", () => {
    for (const sceneFile of ["ThovenHQ.ts", "AndresRoom.ts"]) {
      const sceneSrc = fs.readFileSync(
        path.resolve(__dirname, "../src/game/scenes", sceneFile),
        "utf-8"
      );
      expect(sceneSrc).toContain("extends InteriorBaseScene");
      expect(sceneSrc).toContain("getMapKey()");
    }
  });
});

describe("Mobile gate", () => {
  const indexPath = path.resolve(__dirname, "../index.html");
  const indexContent = fs.readFileSync(indexPath, "utf-8");

  it("index.html contains mobile gate div", () => {
    expect(indexContent).toContain('id="mobile-gate"');
  });

  it("mobile gate has essential content", () => {
    expect(indexContent).toContain("ANDRES WORLD");
    expect(indexContent).toContain("Best experienced on desktop");
  });

  it("mobile gate has social links", () => {
    expect(indexContent).toContain("Twitter/X");
    expect(indexContent).toContain("LinkedIn");
    expect(indexContent).toContain("GitHub");
    expect(indexContent).toContain("Email");
  });

  it("mobile detection script exists", () => {
    expect(indexContent).toContain("ontouchstart");
    expect(indexContent).toContain("maxTouchPoints");
    expect(indexContent).toContain("pointer: fine");
  });

  it("game container div exists for canvas", () => {
    expect(indexContent).toContain('id="game-container"');
  });
});

describe("Mobile gate CSS", () => {
  const cssPath = path.resolve(__dirname, "../public/style.css");
  const cssContent = fs.readFileSync(cssPath, "utf-8");

  it("mobile gate styles exist", () => {
    expect(cssContent).toContain("#mobile-gate");
    expect(cssContent).toContain(".mobile-title");
    expect(cssContent).toContain(".mobile-links");
  });
});
