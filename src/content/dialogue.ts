import { DialogEntry } from "../types/dialog";

/**
 * DIALOGUE — all NPC, sign, and building dialogue content.
 * Keyed by NPC id (matching NPC_CONFIG entries) or content id (signs, buildings).
 * Extracted from inline arrays in npcs.ts per ADR Decision 2.
 */
export const DIALOGUE: Record<string, DialogEntry> = {
  // ─── Main Street ───────────────────────────────────────────
  "marc-andreessen": {
    lines: ["Software is eating the world."],
  },
  "john-collison": {
    lines: ["Growth solves most problems."],
  },
  "paul-graham": {
    lines: ["Write simply."],
  },

  // ─── Thoven HQ Area ────────────────────────────────────────
  "michael-seibel": {
    lines: ["Make something people want."],
  },
  "keri": {
    lines: [
      "Welcome to Thoven. We're building the operating system for music education.",
      "It's going well. Mostly.",
    ],
  },
  "brian-chesky": {
    lines: ["Don't fuck up the culture."],
  },

  // ─── Lookout Hill ──────────────────────────────────────────
  "dalton-caldwell": {
    lines: ["Just talk to your users."],
  },

  // ─── Idea Graveyard ────────────────────────────────────────
  "ben-horowitz": {
    lines: ["Nobody told you it was going to be easy. Good."],
  },

  // ─── Beach / Boardwalk ─────────────────────────────────────
  "vinod-khosla": {
    lines: ["The best entrepreneurs ignore the odds."],
  },

  // ─── Engineering Lab ───────────────────────────────────────
  "tobi-lutke": {
    lines: ["Shipping is a feature."],
  },
  "patrick-collison": {
    lines: ["Have you read the Stripe docs? All of them?"],
  },
  "dario-amodei": {
    lines: ["We're trying to be careful."],
  },

  // ─── Andres's House Area ───────────────────────────────────
  "dad": {
    lines: ["Have you eaten? Also, call me."],
  },
  "dog-1": {
    lines: ["Woof."],
  },
  "dog-2": {
    lines: ["Woof."],
  },

  // ─── Andres's Room Objects ──────────────────────────────────
  "room-bed": {
    lines: ["Not yet. Too much to build."],
  },
  "room-pc": {
    lines: ["Andres's links:"],
    link: "social",
  },
  "room-dj": {
    lines: ["He takes this seriously."],
  },
  "room-bookshelf": {
    lines: ["The Hard Thing About Hard Things.", "\"Sometimes the only way through is through.\""],
  },
  "room-jersey": {
    lines: ["Arsenal #14. North London forever."],
  },
  "room-flags": {
    lines: ["Venezuelan + Dominican. The combo that built this."],
  },
  "room-pennant": {
    lines: ["Michigan. Go Blue."],
  },
  "room-poster": {
    lines: ["Doxxin. The best dachshund who ever lived."],
  },
  "room-window": {
    lines: ["Miami skyline. Palm trees. Always warm."],
  },

  // ─── Signs ─────────────────────────────────────────────────
  "welcome-sign": {
    lines: ["Welcome to Andres World.", "Population: always building."],
  },

  // ─── Under Construction ────────────────────────────────────
  "under-construction-default": {
    lines: ["Builder still hammering away... check back soon."],
  },
};
