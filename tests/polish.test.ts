import { describe, it, expect } from "vitest";
import * as fs from "fs";
import * as path from "path";

const html = fs.readFileSync(path.resolve(__dirname, "../index.html"), "utf-8");
const bootContent = fs.readFileSync(path.resolve(__dirname, "../src/game/scenes/Boot.ts"), "utf-8");
const overworldContent = fs.readFileSync(path.resolve(__dirname, "../src/game/scenes/Overworld.ts"), "utf-8");

describe("Music infrastructure (POLI-01, POLI-02)", () => {
  it("POLI-01: Boot loads overworld background music", () => {
    expect(bootContent).toContain("bgm-overworld");
    expect(bootContent).toContain("overworld.mp3");
  });

  it("POLI-02: Boot loads music room track", () => {
    expect(bootContent).toContain("bgm-music-room");
    expect(bootContent).toContain("music-room.mp3");
  });

  it("POLI-01: Overworld plays background music on loop", () => {
    expect(overworldContent).toContain("bgm-overworld");
    expect(overworldContent).toContain("loop: true");
  });

  it("Boot gracefully handles missing audio files", () => {
    expect(bootContent).toContain("loaderror");
    expect(bootContent).toContain("Optional audio not found");
  });
});

describe("Open Graph meta tags (POLI-04)", () => {
  it("POLI-04: has og:title", () => {
    expect(html).toContain('property="og:title"');
    expect(html).toContain('content="Andres World"');
  });

  it("POLI-04: has og:description", () => {
    expect(html).toContain('property="og:description"');
  });

  it("POLI-04: has og:image", () => {
    expect(html).toContain('property="og:image"');
    expect(html).toContain("og-image.png");
  });

  it("POLI-04: has og:url", () => {
    expect(html).toContain('property="og:url"');
    expect(html).toContain("andresmartinez.com");
  });

  it("has Twitter Card tags", () => {
    expect(html).toContain('name="twitter:card"');
    expect(html).toContain("summary_large_image");
  });
});

describe("SEO static content (POLI-05)", () => {
  it("POLI-05: has noscript fallback with descriptive content", () => {
    expect(html).toContain("<noscript>");
    expect(html).toContain("Andres World");
    expect(html).toContain("Thoven HQ");
    expect(html).toContain("Engineering Lab");
  });

  it("has descriptive page title", () => {
    expect(html).toContain("<title>Andres World");
  });

  it("has meta description", () => {
    expect(html).toContain('name="description"');
    expect(html).toContain("pixel-art portfolio");
  });
});

describe("Mobile gate preserved", () => {
  it("mobile gate still exists with links", () => {
    expect(html).toContain("mobile-gate");
    expect(html).toContain("twitter.com");
    expect(html).toContain("linkedin.com");
    expect(html).toContain("github.com");
  });
});
