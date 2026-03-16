import { describe, it, expect } from "vitest";
import * as fs from "fs";
import * as path from "path";

describe("Loading Screen (LOAD requirements)", () => {
  const bootContent = fs.readFileSync(path.resolve(__dirname, "../src/game/scenes/Boot.ts"), "utf-8");
  const titleContent = fs.readFileSync(path.resolve(__dirname, "../src/game/scenes/TitleScreen.ts"), "utf-8");
  const mainContent = fs.readFileSync(path.resolve(__dirname, "../src/game/main.ts"), "utf-8");

  // LOAD-01: Title card
  it("LOAD-01: TitleScreen scene shows 'ANDRES WORLD'", () => {
    expect(titleContent).toContain("ANDRES WORLD");
    expect(titleContent).toContain("TitleScreen");
  });

  it("LOAD-01: TitleScreen shows player character sprite", () => {
    expect(titleContent).toContain('"player"');
    expect(titleContent).toContain("setScale");
  });

  // LOAD-02: Progress bar
  it("LOAD-02: Boot scene has loading progress bar", () => {
    expect(bootContent).toContain("progress");
    expect(bootContent).toContain("Loading...");
    expect(bootContent).toContain("barFill");
  });

  // LOAD-03: Press any key
  it("LOAD-03: TitleScreen accepts any key press to start", () => {
    expect(titleContent).toContain("PRESS ANY KEY");
    expect(titleContent).toContain("keydown");
    expect(titleContent).toContain("pointerdown");
  });

  it("LOAD-03: TitleScreen transitions to Overworld", () => {
    expect(titleContent).toContain('this.scene.start("Overworld")');
  });

  // Boot → TitleScreen → Overworld flow
  it("Boot transitions to TitleScreen", () => {
    expect(bootContent).toContain('this.scene.start("TitleScreen")');
  });

  it("main.ts registers BootScene then TitleScreenScene before OverworldScene", () => {
    expect(mainContent).toContain("TitleScreenScene");
    const bootIdx = mainContent.indexOf("BootScene");
    const titleIdx = mainContent.indexOf("TitleScreenScene");
    const overworldIdx = mainContent.indexOf("OverworldScene");
    expect(bootIdx).toBeLessThan(titleIdx);
    expect(titleIdx).toBeLessThan(overworldIdx);
  });

  // Boot loads interior maps too
  it("Boot preloads all interior maps", () => {
    expect(bootContent).toContain('"andres-room"');
    expect(bootContent).toContain('"thoven-hq"');
    expect(bootContent).toContain('"starbucks"');
    expect(bootContent).toContain('"engineering-lab"');
  });

  it("Boot preloads interior tilesets", () => {
    expect(bootContent).toContain("Room_Builder_16x16");
    expect(bootContent).toContain("Interiors_16x16");
  });

  // Title screen has fade transition
  it("TitleScreen has fade-out camera transition", () => {
    expect(titleContent).toContain("fadeOut");
    expect(titleContent).toContain("camerafadeoutcomplete");
  });

  // Input delay to prevent accidental skip
  it("TitleScreen delays input acceptance", () => {
    expect(titleContent).toContain("delayedCall");
  });
});
