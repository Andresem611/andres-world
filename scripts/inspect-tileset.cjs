#!/usr/bin/env node
// scripts/inspect-tileset.cjs
// Usage: node scripts/inspect-tileset.cjs
// Output: public/assets/maps/tileset-catalog.json
// No external dependencies — uses Node.js built-in zlib and fs only.

"use strict";

const fs = require("fs");
const path = require("path");
const zlib = require("zlib");

const TILESETS = [
  { name: "terrains",  file: "1_Terrains_and_Fences_16x16.png", firstgid: 1 },
  { name: "beach",     file: "21_Beach_16x16.png",              firstgid: 2369 },
  { name: "buildings", file: "4_Generic_Buildings_16x16.png",   firstgid: 6369 },
  { name: "garden",    file: "17_Garden_16x16.png",             firstgid: 12769 },
  { name: "worksite",  file: "8_Worksite_16x16.png",            firstgid: 19041 },
];

const TILE_SIZE = 16;
const TILESET_DIR = path.join(__dirname, "../public/assets/tilesets");
const OUTPUT_PATH = path.join(__dirname, "../public/assets/maps/tileset-catalog.json");
const SAMPLE_ROWS = 10; // rows 0-9 per sheet

/** Read 4 big-endian bytes at offset and return unsigned 32-bit int. */
function readUint32BE(buf, offset) {
  return (buf[offset] * 0x1000000) + (buf[offset + 1] << 16) + (buf[offset + 2] << 8) + buf[offset + 3];
}

/** Parse PNG IHDR: returns { width, height, bitDepth, colorType }. */
function parsePngIHDR(buf) {
  // PNG signature: 8 bytes
  // Chunk: 4 (length) + 4 (type "IHDR") + 13 (data) + 4 (CRC)
  const width = readUint32BE(buf, 16);
  const height = readUint32BE(buf, 20);
  const bitDepth = buf[24];
  const colorType = buf[25];
  return { width, height, bitDepth, colorType };
}

/**
 * Extract all IDAT chunk data from a PNG buffer.
 * Returns a concatenated Buffer of compressed data.
 */
function extractIDATData(buf) {
  const chunks = [];
  let offset = 8; // skip PNG signature

  while (offset < buf.length) {
    if (offset + 8 > buf.length) break;
    const length = readUint32BE(buf, offset);
    const chunkType = buf.slice(offset + 4, offset + 8).toString("ascii");
    const dataStart = offset + 8;
    const dataEnd = dataStart + length;

    if (chunkType === "IDAT") {
      chunks.push(buf.slice(dataStart, dataEnd));
    } else if (chunkType === "IEND") {
      break;
    }

    offset = dataEnd + 4; // skip CRC
  }

  return Buffer.concat(chunks);
}

/**
 * Apply PNG filter to reconstruct scanline bytes.
 * Only handles filter types 0 (None), 1 (Sub), 2 (Up), 3 (Average), 4 (Paeth).
 * Returns array of RGB triplets for the scanline.
 */
function paethPredictor(a, b, c) {
  const p = a + b - c;
  const pa = Math.abs(p - a);
  const pb = Math.abs(p - b);
  const pc = Math.abs(p - c);
  if (pa <= pb && pa <= pc) return a;
  if (pb <= pc) return b;
  return c;
}

/**
 * Decode PNG pixel data.
 * Supports colorType 2 (RGB) and colorType 6 (RGBA).
 * Returns a flat Uint8Array of [R,G,B,R,G,B,...] pixels row by row.
 */
function decodePNG(buf) {
  const ihdr = parsePngIHDR(buf);
  const { width, height, colorType } = ihdr;

  const bytesPerPixel = colorType === 6 ? 4 : 3; // RGBA or RGB
  const bytesPerRow = width * bytesPerPixel;

  const compressedData = extractIDATData(buf);
  const decompressed = zlib.inflateSync(compressedData);

  // Each scanline: 1 filter byte + bytesPerRow data bytes
  const scanlineStride = 1 + bytesPerRow;
  const pixels = new Uint8Array(width * height * 3); // output always RGB

  let prevScanline = new Uint8Array(bytesPerRow);

  for (let y = 0; y < height; y++) {
    const scanlineOffset = y * scanlineStride;
    const filterType = decompressed[scanlineOffset];
    const rawBytes = decompressed.slice(scanlineOffset + 1, scanlineOffset + 1 + bytesPerRow);
    const recon = new Uint8Array(bytesPerRow);

    for (let i = 0; i < bytesPerRow; i++) {
      const raw = rawBytes[i];
      const a = i >= bytesPerPixel ? recon[i - bytesPerPixel] : 0; // left pixel same channel
      const b = prevScanline[i]; // above pixel same channel
      const c = i >= bytesPerPixel ? prevScanline[i - bytesPerPixel] : 0; // above-left

      switch (filterType) {
        case 0: recon[i] = raw; break; // None
        case 1: recon[i] = (raw + a) & 0xff; break; // Sub
        case 2: recon[i] = (raw + b) & 0xff; break; // Up
        case 3: recon[i] = (raw + Math.floor((a + b) / 2)) & 0xff; break; // Average
        case 4: recon[i] = (raw + paethPredictor(a, b, c)) & 0xff; break; // Paeth
        default: recon[i] = raw; break;
      }
    }

    // Extract RGB from reconstructed bytes
    for (let x = 0; x < width; x++) {
      const srcIdx = x * bytesPerPixel;
      const dstIdx = (y * width + x) * 3;
      pixels[dstIdx]     = recon[srcIdx];     // R
      pixels[dstIdx + 1] = recon[srcIdx + 1]; // G
      pixels[dstIdx + 2] = recon[srcIdx + 2]; // B
    }

    prevScanline = recon;
  }

  return { width, height, pixels };
}

/** Sample the center pixel of a tile at (col, row) from decoded pixel data. */
function sampleTileCenter(pixels, imgWidth, col, row) {
  const centerX = col * TILE_SIZE + 8;
  const centerY = row * TILE_SIZE + 8;
  const idx = (centerY * imgWidth + centerX) * 3;
  return [pixels[idx], pixels[idx + 1], pixels[idx + 2]];
}

/** Process a single tileset PNG and return catalog entry. */
function processTileset(spec) {
  const filePath = path.join(TILESET_DIR, spec.file);

  let buf;
  try {
    buf = fs.readFileSync(filePath);
  } catch (err) {
    console.error(`  ERROR reading ${spec.file}: ${err.message}`);
    return {
      name: spec.name,
      file: spec.file,
      firstgid: spec.firstgid,
      error: err.message,
    };
  }

  let decoded;
  try {
    decoded = decodePNG(buf);
  } catch (err) {
    console.error(`  ERROR decoding ${spec.file}: ${err.message}`);
    // Fallback: still report IHDR dimensions
    const ihdr = parsePngIHDR(buf);
    return {
      name: spec.name,
      file: spec.file,
      firstgid: spec.firstgid,
      width: ihdr.width,
      height: ihdr.height,
      error: `Decode failed: ${err.message}`,
    };
  }

  const { width, height, pixels } = decoded;
  const cols = Math.floor(width / TILE_SIZE);
  const rows = Math.floor(height / TILE_SIZE);
  const tilecount = cols * rows;

  const rowCount = Math.min(SAMPLE_ROWS, rows);
  const sample_rows = [];

  for (let r = 0; r < rowCount; r++) {
    const tiles = [];
    for (let c = 0; c < cols; c++) {
      const localId = r * cols + c;
      const gid = spec.firstgid + localId;
      const rgb = sampleTileCenter(pixels, width, c, r);
      tiles.push({ col: c, localId, gid, rgb });
    }
    sample_rows.push({ row: r, tiles });
  }

  return {
    name: spec.name,
    file: spec.file,
    firstgid: spec.firstgid,
    width,
    height,
    cols,
    rows,
    tilecount,
    sample_rows,
  };
}

// Main execution
console.log("=== Tileset Inspector ===");
console.log(`Reading PNGs from: ${TILESET_DIR}`);
console.log(`Sampling first ${SAMPLE_ROWS} rows per tileset\n`);

const results = [];

for (const spec of TILESETS) {
  console.log(`Processing ${spec.name} (${spec.file})...`);
  const entry = processTileset(spec);
  results.push(entry);

  if (!entry.error && entry.sample_rows && entry.sample_rows.length >= 2) {
    const row0col0 = entry.sample_rows[0].tiles[0];
    const row1col0 = entry.sample_rows[1].tiles[0];
    console.log(`  Dimensions: ${entry.width}x${entry.height} — ${entry.cols}x${entry.rows} tiles (${entry.tilecount} total)`);
    console.log(`  Tile (row=0, col=0) GID=${row0col0.gid}: RGB(${row0col0.rgb.join(", ")})`);
    console.log(`  Tile (row=1, col=0) GID=${row1col0.gid}: RGB(${row1col0.rgb.join(", ")})`);
  } else if (entry.error) {
    console.log(`  FAILED: ${entry.error}`);
  }
}

const catalog = {
  generatedAt: new Date().toISOString(),
  tileSize: TILE_SIZE,
  sampledRows: SAMPLE_ROWS,
  tilesets: results,
};

fs.mkdirSync(path.dirname(OUTPUT_PATH), { recursive: true });
fs.writeFileSync(OUTPUT_PATH, JSON.stringify(catalog, null, 2));

console.log(`\nCatalog written to: ${OUTPUT_PATH}`);
console.log(`Total tilesets: ${results.length}`);
console.log(`Tilesets with errors: ${results.filter(r => r.error).length}`);
