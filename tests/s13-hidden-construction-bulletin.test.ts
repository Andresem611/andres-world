import { describe, it, expect } from "vitest";
import * as fs from "fs";
import * as path from "path";
import { DIALOGUE } from "../src/content/dialogue";

describe("Construction dialogue (CONST requirements)", () => {
  it("CONST-02: hard hat NPC dialogue", () => {
    expect(DIALOGUE["chalk-lab-hardhat"]).toBeDefined();
    expect(DIALOGUE["chalk-lab-hardhat"].lines[0]).toContain("two weeks ago");
  });

  it("CONST-03: Chalk Lab construction popup with Twitter", () => {
    expect(DIALOGUE["chalk-lab-construction"]).toBeDefined();
    expect(DIALOGUE["chalk-lab-construction"].lines[0]).toContain("still being built");
    expect(DIALOGUE["chalk-lab-construction"].lines.some(l => l.includes("Twitter"))).toBe(true);
  });

  it("CONST-04: VC Office locked door dialogue", () => {
    expect(DIALOGUE["vc-office"]).toBeDefined();
    expect(DIALOGUE["vc-office"].lines[0]).toContain("Sand Hill");
  });
});

describe("Hidden area signs (HIDE requirements)", () => {
  it("HIDE-01: Secret Beach sign — 'still figuring things out.'", () => {
    expect(DIALOGUE["secret-beach-sign"]).toBeDefined();
    expect(DIALOGUE["secret-beach-sign"].lines[0]).toContain("still figuring things out");
  });

  it("HIDE-02: Music Room sign", () => {
    expect(DIALOGUE["music-room-sign"]).toBeDefined();
    expect(DIALOGUE["music-room-sign"].lines[0]).toContain("Music Room");
  });

  it("HIDE-03: Idea Graveyard sign", () => {
    expect(DIALOGUE["idea-graveyard-sign"]).toBeDefined();
    expect(DIALOGUE["idea-graveyard-sign"].lines[0]).toContain("IDEA GRAVEYARD");
  });

  it("HIDE-04: Lookout Hill sign — 'Miami, 2026'", () => {
    expect(DIALOGUE["lookout-hill-sign"]).toBeDefined();
    expect(DIALOGUE["lookout-hill-sign"].lines[0]).toContain("Miami, 2026");
  });

  it("HIDE-05: Hidden mentor — sincere dialogue", () => {
    expect(DIALOGUE["hidden-mentor"]).toBeDefined();
    expect(DIALOGUE["hidden-mentor"].lines[0]).toContain("You found me");
    expect(DIALOGUE["hidden-mentor"].lines.length).toBeGreaterThanOrEqual(3);
  });
});

describe("Bulletin Board (BULL requirements)", () => {
  it("BULL-02: Header — 'THINGS I'M FIGURING OUT RIGHT NOW'", () => {
    expect(DIALOGUE["bulletin-header"]).toBeDefined();
    expect(DIALOGUE["bulletin-header"].lines[0]).toContain("FIGURING OUT RIGHT NOW");
  });

  it("BULL-03: 7 pressable pins exist", () => {
    for (let i = 1; i <= 7; i++) {
      const key = `bulletin-pin-${i}`;
      expect(DIALOGUE[key]).toBeDefined();
      expect(DIALOGUE[key].lines[0]).toContain("📌");
    }
  });

  it("BULL-03: pins cover all 7 topics", () => {
    const allText = Array.from({ length: 7 }, (_, i) => DIALOGUE[`bulletin-pin-${i + 1}`].lines[0]).join(" ");
    expect(allText).toContain("AI PM");
    expect(allText).toContain("LLM");
    expect(allText).toContain("RAG");
    expect(allText).toContain("Prompt engineering");
    expect(allText).toContain("Agents");
    expect(allText).toContain("Design");
    expect(allText).toContain("Game theory");
  });

  it("BULL-04: PC links to reading list", () => {
    expect(DIALOGUE["bulletin-pc"]).toBeDefined();
    expect(DIALOGUE["bulletin-pc"].lines[0]).toContain("reading list");
  });
});

describe("Overworld registers S13 interactions", () => {
  const content = fs.readFileSync(
    path.resolve(__dirname, "../src/game/scenes/Overworld.ts"), "utf-8"
  );

  it("registers Chalk Lab construction", () => {
    expect(content).toContain("chalk-lab-construction");
  });

  it("registers VC Office", () => {
    expect(content).toContain("vc-office");
  });

  it("registers hard hat NPC", () => {
    expect(content).toContain("chalk-lab-hardhat");
  });

  it("registers hidden area signs", () => {
    expect(content).toContain("secret-beach-sign");
    expect(content).toContain("music-room-sign");
    expect(content).toContain("idea-graveyard-sign");
    expect(content).toContain("lookout-hill-sign");
    expect(content).toContain("hidden-mentor");
  });

  it("registers bulletin board interactions", () => {
    expect(content).toContain("bulletin-header");
    expect(content).toContain("bulletin-pin-1");
    expect(content).toContain("bulletin-pin-7");
    expect(content).toContain("bulletin-pc");
  });
});
