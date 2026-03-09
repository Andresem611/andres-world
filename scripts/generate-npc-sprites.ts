/**
 * generate-npc-sprites.ts
 *
 * Generates 15 NPC placeholder PNG sprites (32x32px each) in public/assets/sprites/.
 * Each sprite is a solid color square with a 2px dark border for visual identification.
 *
 * Run: npx tsx scripts/generate-npc-sprites.ts
 */

import * as fs from "fs";
import * as path from "path";
import { deflateSync } from "zlib";

const ROOT = path.resolve(__dirname, "..");
const SPRITE_SIZE = 32;

// Color definitions per NPC (RGB)
const NPC_COLORS: Record<string, [number, number, number]> = {
  "npc-paul-graham":      [0x87, 0xCE, 0xEB], // light blue
  "npc-marc-andreessen":  [0xFF, 0xA5, 0x00], // orange
  "npc-brian-chesky":     [0x93, 0x70, 0xDB], // purple
  "npc-michael-seibel":   [0xFF, 0x44, 0x44], // red
  "npc-john-collison":    [0xFF, 0xD7, 0x00], // yellow (patrol NPC — easy to spot)
  "npc-keri":             [0x20, 0xB2, 0xAA], // teal
  "npc-tobi-lutke":       [0x22, 0x8B, 0x22], // green
  "npc-dalton-caldwell":  [0x00, 0x00, 0x8B], // dark blue
  "npc-ben-horowitz":     [0x69, 0x69, 0x69], // dark grey
  "npc-vinod-khosla":     [0xFF, 0x7F, 0x50], // coral
  "npc-dario-amodei":     [0xC0, 0xC0, 0xC0], // silver
  "npc-patrick-collison": [0x6B, 0x8E, 0x23], // olive
  "npc-dad":              [0x8B, 0x45, 0x13], // brown
  "npc-dog-1":            [0xD3, 0xD3, 0xD3], // light grey
  "npc-dog-2":            [0xF5, 0xF5, 0xF5], // white/cream
};

function crc32(buf: Buffer): number {
  const table = (() => {
    const t = new Uint32Array(256);
    for (let n = 0; n < 256; n++) {
      let c = n;
      for (let k = 0; k < 8; k++) {
        c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
      }
      t[n] = c;
    }
    return t;
  })();
  let crc = 0xffffffff;
  for (let i = 0; i < buf.length; i++) {
    crc = table[(crc ^ buf[i]) & 0xff] ^ (crc >>> 8);
  }
  return (crc ^ 0xffffffff) >>> 0;
}

function chunk(type: string, data: Buffer): Buffer {
  const typeBuf = Buffer.from(type, "ascii");
  const lenBuf = Buffer.allocUnsafe(4);
  lenBuf.writeUInt32BE(data.length, 0);
  const crcInput = Buffer.concat([typeBuf, data]);
  const crcBuf = Buffer.allocUnsafe(4);
  crcBuf.writeUInt32BE(crc32(crcInput), 0);
  return Buffer.concat([lenBuf, typeBuf, data, crcBuf]);
}

function generateSpritePng(r: number, g: number, b: number): Buffer {
  const W = SPRITE_SIZE;
  const H = SPRITE_SIZE;
  const BORDER = 2;

  // Build raw RGB rows with filter bytes
  const rawRows = Buffer.alloc(H * (1 + W * 3));

  for (let y = 0; y < H; y++) {
    rawRows[y * (1 + W * 3)] = 0; // filter type None
    for (let x = 0; x < W; x++) {
      const dst = y * (1 + W * 3) + 1 + x * 3;
      const onBorder = x < BORDER || x >= W - BORDER || y < BORDER || y >= H - BORDER;
      if (onBorder) {
        rawRows[dst]     = 0x20;
        rawRows[dst + 1] = 0x20;
        rawRows[dst + 2] = 0x20;
      } else {
        rawRows[dst]     = r;
        rawRows[dst + 1] = g;
        rawRows[dst + 2] = b;
      }
    }
  }

  const compressed = deflateSync(rawRows, { level: 6 });

  // IHDR: width, height, bit depth (8), color type (2=RGB), compression, filter, interlace
  const ihdr = Buffer.allocUnsafe(13);
  ihdr.writeUInt32BE(W, 0);
  ihdr.writeUInt32BE(H, 4);
  ihdr[8]  = 8; // bit depth
  ihdr[9]  = 2; // color type: RGB
  ihdr[10] = 0;
  ihdr[11] = 0;
  ihdr[12] = 0;

  const pngSig = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
  return Buffer.concat([
    pngSig,
    chunk("IHDR", ihdr),
    chunk("IDAT", compressed),
    chunk("IEND", Buffer.alloc(0)),
  ]);
}

function main() {
  const spritesDir = path.join(ROOT, "public/assets/sprites");
  fs.mkdirSync(spritesDir, { recursive: true });

  for (const [id, [r, g, b]] of Object.entries(NPC_COLORS)) {
    const pngPath = path.join(spritesDir, `${id}.png`);
    const pngData = generateSpritePng(r, g, b);
    fs.writeFileSync(pngPath, pngData);
    console.log(`Written: ${pngPath} (${pngData.length} bytes)`);
  }

  console.log(`\nDone. Generated ${Object.keys(NPC_COLORS).length} NPC sprites.`);
}

main();
