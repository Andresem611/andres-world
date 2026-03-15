import { describe, it, expect } from "vitest";
import * as fs from "fs";
import * as path from "path";

const SPRITES_DIR = path.resolve(__dirname, "../public/assets/sprites");

// Minimum byte size to distinguish real pixel art from colored-box placeholders.
// Current placeholders are ~103-107 bytes. Real 32x32 pixel art should be >500 bytes.
const MIN_REAL_SPRITE_BYTES = 500;

// All NPC sprite IDs that should exist as PNG files
const NPC_IDS = [
  "paul-graham",
  "marc-andreessen",
  "brian-chesky",
  "tobi-lutke",
  "dalton-caldwell",
  "ben-horowitz",
  "vinod-khosla",
  "dario-amodei",
  "michael-seibel",
  "patrick-collison",
  "john-collison",
  "keri",
  "dad",
  "dog-1",
  "dog-2",
];

describe("CHAR-04: Player spritesheet format", () => {
  const playerPath = path.join(SPRITES_DIR, "player.png");
  const placeholderPath = path.join(SPRITES_DIR, "character-placeholder.png");

  it("player.png or character-placeholder.png exists", () => {
    const exists = fs.existsSync(playerPath) || fs.existsSync(placeholderPath);
    expect(exists).toBe(true);
  });

  it("player spritesheet is a valid PNG", () => {
    const filePath = fs.existsSync(playerPath) ? playerPath : placeholderPath;
    const buf = fs.readFileSync(filePath);
    // PNG magic bytes: 137 80 78 71 13 10 26 10
    expect(buf[0]).toBe(0x89);
    expect(buf[1]).toBe(0x50); // P
    expect(buf[2]).toBe(0x4e); // N
    expect(buf[3]).toBe(0x47); // G
  });

  it("player spritesheet width is divisible by 32 (frame width)", () => {
    const filePath = fs.existsSync(playerPath) ? playerPath : placeholderPath;
    const buf = fs.readFileSync(filePath);
    // PNG IHDR chunk: width at bytes 16-19 (big-endian)
    const width = buf.readUInt32BE(16);
    expect(width % 32).toBe(0);
  });

  it("player spritesheet height is divisible by 32 (frame height)", () => {
    const filePath = fs.existsSync(playerPath) ? playerPath : placeholderPath;
    const buf = fs.readFileSync(filePath);
    // PNG IHDR chunk: height at bytes 20-23 (big-endian)
    const height = buf.readUInt32BE(20);
    expect(height % 32).toBe(0);
  });

  it("player spritesheet has 4 rows (4 directions)", () => {
    const filePath = fs.existsSync(playerPath) ? playerPath : placeholderPath;
    const buf = fs.readFileSync(filePath);
    const height = buf.readUInt32BE(20);
    const rows = height / 32;
    expect(rows).toBe(4);
  });
});

describe("CHAR-05: NPC sprite files", () => {
  it("all 15 NPC sprite PNGs exist", () => {
    for (const id of NPC_IDS) {
      const filePath = path.join(SPRITES_DIR, `npc-${id}.png`);
      expect(fs.existsSync(filePath), `missing: npc-${id}.png`).toBe(true);
    }
  });

  it("all NPC sprite PNGs are valid PNG files", () => {
    for (const id of NPC_IDS) {
      const filePath = path.join(SPRITES_DIR, `npc-${id}.png`);
      if (!fs.existsSync(filePath)) continue;
      const buf = fs.readFileSync(filePath);
      expect(buf[0], `npc-${id}.png not PNG`).toBe(0x89);
      expect(buf[1], `npc-${id}.png not PNG`).toBe(0x50);
    }
  });

  it("all NPC sprites are 32x32", () => {
    for (const id of NPC_IDS) {
      const filePath = path.join(SPRITES_DIR, `npc-${id}.png`);
      if (!fs.existsSync(filePath)) continue;
      const buf = fs.readFileSync(filePath);
      const width = buf.readUInt32BE(16);
      const height = buf.readUInt32BE(20);
      expect(width, `npc-${id}.png width`).toBe(32);
      expect(height, `npc-${id}.png height`).toBe(32);
    }
  });

  // Gate: real pixel art sprites replace colored-box placeholders
  // Current: 4 AI-generated (paul-graham, marc-andreessen, michael-seibel, keri)
  // Target: ≥5 once remaining NPCs are generated (budget top-up needed)
  it("at least 4 NPC sprites are real pixel art (>500 bytes)", () => {
    let realCount = 0;
    for (const id of NPC_IDS) {
      const filePath = path.join(SPRITES_DIR, `npc-${id}.png`);
      if (!fs.existsSync(filePath)) continue;
      const stats = fs.statSync(filePath);
      if (stats.size > MIN_REAL_SPRITE_BYTES) {
        realCount++;
      }
    }
    expect(realCount).toBeGreaterThanOrEqual(4);
  });
});
