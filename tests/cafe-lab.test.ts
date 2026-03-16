import { describe, it, expect } from "vitest";
import * as fs from "fs";
import * as path from "path";
import { DIALOGUE } from "../src/content/dialogue";

describe("Starbucks Café map", () => {
  const mapData = JSON.parse(fs.readFileSync(path.resolve(__dirname, "../public/assets/maps/starbucks.json"), "utf-8"));

  it("map is 10×8 with required layers", () => {
    expect(mapData.width).toBe(10);
    expect(mapData.height).toBe(8);
    const names = mapData.layers.map((l: { name: string }) => l.name);
    expect(names).toContain("ground");
    expect(names).toContain("exits");
    expect(names).toContain("collision");
  });

  it("has exit tiles", () => {
    const exits = mapData.layers.find((l: { name: string }) => l.name === "exits");
    expect(exits.data.filter((g: number) => g !== 0).length).toBeGreaterThan(0);
  });
});

describe("Engineering Lab map", () => {
  const mapData = JSON.parse(fs.readFileSync(path.resolve(__dirname, "../public/assets/maps/engineering-lab.json"), "utf-8"));

  it("map is 10×8 with required layers", () => {
    expect(mapData.width).toBe(10);
    expect(mapData.height).toBe(8);
    const names = mapData.layers.map((l: { name: string }) => l.name);
    expect(names).toContain("ground");
    expect(names).toContain("exits");
    expect(names).toContain("collision");
  });
});

describe("Café dialogue (CAFE requirements)", () => {
  it("CAFE-02: Paul Graham says 'Write simply.'", () => {
    expect(DIALOGUE["paul-graham"]?.lines[0]).toContain("Write simply");
  });

  it("CAFE-03: Barista NPC exists", () => {
    expect(DIALOGUE["cafe-barista"]).toBeDefined();
  });

  it("CAFE-04/05: At least 2 essays exist", () => {
    expect(DIALOGUE["cafe-essay-1"]).toBeDefined();
    expect(DIALOGUE["cafe-essay-2"]).toBeDefined();
    expect(DIALOGUE["cafe-essay-1"].lines.length).toBeGreaterThan(1);
    expect(DIALOGUE["cafe-essay-2"].lines.length).toBeGreaterThan(1);
  });
});

describe("Lab dialogue (LAB requirements)", () => {
  it("LAB-02: experiments have dialogue", () => {
    expect(DIALOGUE["lab-experiment-1"]).toBeDefined();
    expect(DIALOGUE["lab-experiment-2"]).toBeDefined();
    expect(DIALOGUE["lab-experiment-3"]).toBeDefined();
  });

  it("LAB-03: stack wall lists tools", () => {
    expect(DIALOGUE["lab-stack-wall"]).toBeDefined();
    const text = DIALOGUE["lab-stack-wall"].lines.join(" ");
    expect(text).toContain("Anthropic");
    expect(text).toContain("Vercel");
    expect(text).toContain("Supabase");
    expect(text).toContain("Stripe");
  });

  it("LAB-04: Tobi says 'Shipping is a feature.'", () => {
    expect(DIALOGUE["tobi-lutke"]?.lines[0]).toContain("Shipping");
  });

  it("LAB-05: Patrick says 'Stripe docs'", () => {
    expect(DIALOGUE["patrick-collison"]?.lines[0]).toContain("Stripe docs");
  });

  it("LAB-06: Dario says 'trying to be careful'", () => {
    expect(DIALOGUE["dario-amodei"]?.lines[0]).toContain("careful");
  });

  it("LAB-07: Rubber duck says 'I just listen.'", () => {
    expect(DIALOGUE["lab-rubber-duck"]).toBeDefined();
    expect(DIALOGUE["lab-rubber-duck"].lines[0]).toBe("I just listen.");
  });
});

describe("Scene implementations", () => {
  it("StarbucksCafe scene exists and extends InteriorBaseScene", () => {
    const content = fs.readFileSync(path.resolve(__dirname, "../src/game/scenes/StarbucksCafe.ts"), "utf-8");
    expect(content).toContain("extends InteriorBaseScene");
    expect(content).toContain("paul-graham");
    expect(content).toContain("cafe-barista");
  });

  it("EngineeringLab scene exists and extends InteriorBaseScene", () => {
    const content = fs.readFileSync(path.resolve(__dirname, "../src/game/scenes/EngineeringLab.ts"), "utf-8");
    expect(content).toContain("extends InteriorBaseScene");
    expect(content).toContain("tobi-lutke");
    expect(content).toContain("patrick-collison");
    expect(content).toContain("dario-amodei");
    expect(content).toContain("lab-rubber-duck");
  });

  it("Overworld registers Starbucks and Engineering Lab entrances", () => {
    const content = fs.readFileSync(path.resolve(__dirname, "../src/game/scenes/Overworld.ts"), "utf-8");
    expect(content).toContain("StarbucksCafe");
    expect(content).toContain("EngineeringLab");
  });

  it("main.ts includes both new scenes", () => {
    const content = fs.readFileSync(path.resolve(__dirname, "../src/game/main.ts"), "utf-8");
    expect(content).toContain("StarbucksCafeScene");
    expect(content).toContain("EngineeringLabScene");
  });
});
