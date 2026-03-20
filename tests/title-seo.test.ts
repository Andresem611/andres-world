/**
 * Tests for title screen, mobile gate, and SEO (M002).
 */

import { describe, it, expect } from "vitest";
import * as fs from "fs";
import * as path from "path";

const indexHtml = fs.readFileSync(path.join(__dirname, "../index.html"), "utf-8");

describe("title screen", () => {
  it("TitleScreen component exists", () => {
    const titleScreenPath = path.join(__dirname, "../src/components/TitleScreen.tsx");
    expect(fs.existsSync(titleScreenPath)).toBe(true);
  });

  it("TitleScreen contains ANDRES WORLD text", () => {
    const content = fs.readFileSync(path.join(__dirname, "../src/components/TitleScreen.tsx"), "utf-8");
    expect(content).toContain("ANDRES WORLD");
  });

  it("TitleScreen has press any key text", () => {
    const content = fs.readFileSync(path.join(__dirname, "../src/components/TitleScreen.tsx"), "utf-8");
    expect(content).toContain("PRESS ANY KEY");
  });

  it("App starts with TitleScreen before GameContainer", () => {
    const content = fs.readFileSync(path.join(__dirname, "../src/App.tsx"), "utf-8");
    expect(content).toContain("TitleScreen");
    expect(content).toContain("GameContainer");
    expect(content).toContain("started");
  });
});

describe("mobile gate", () => {
  it("index.html has mobile-gate div", () => {
    expect(indexHtml).toContain('id="mobile-gate"');
  });

  it("mobile gate has social links", () => {
    expect(indexHtml).toContain("Twitter/X");
    expect(indexHtml).toContain("LinkedIn");
    expect(indexHtml).toContain("GitHub");
    expect(indexHtml).toContain("Email");
  });

  it("mobile gate detection script exists", () => {
    expect(indexHtml).toContain("ontouchstart");
    expect(indexHtml).toContain("innerWidth < 768");
  });
});

describe("SEO / Open Graph", () => {
  it("has og:title", () => {
    expect(indexHtml).toContain('property="og:title"');
  });

  it("has og:description", () => {
    expect(indexHtml).toContain('property="og:description"');
  });

  it("has og:image", () => {
    expect(indexHtml).toContain('property="og:image"');
  });

  it("has twitter:card", () => {
    expect(indexHtml).toContain('name="twitter:card"');
  });

  it("has noscript fallback", () => {
    expect(indexHtml).toContain("<noscript>");
    expect(indexHtml).toContain("Thoven HQ");
  });

  it("has meta description", () => {
    expect(indexHtml).toContain('name="description"');
  });
});
