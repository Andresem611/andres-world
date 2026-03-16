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

  // ─── Thoven HQ Objects ──────────────────────────────────────
  "thoven-metrics": {
    lines: [
      "THOVEN METRICS",
      "Teachers: 142 | Students: 1,847 | Lessons completed: 23,419",
    ],
  },
  "thoven-shipped": {
    lines: [
      "SHIPPED BOARD",
      "Last shipped: AI practice feedback v2",
      "Current focus: Student progress dashboard",
      "Under construction: Group lessons",
    ],
  },
  "thoven-practice-piano": {
    lines: ["🎹 Piano Practice Room", "Under construction. Check back soon."],
  },
  "thoven-practice-guitar": {
    lines: ["🎸 Guitar Practice Room", "Under construction. Check back soon."],
  },
  "thoven-practice-voice": {
    lines: ["🎤 Voice Practice Room", "Under construction. Check back soon."],
  },
  "thoven-practice-violin": {
    lines: ["🎻 Violin Practice Room", "Under construction. Check back soon."],
  },
  "thoven-pc": {
    lines: ["Thoven — the operating system for music education."],
    link: "https://thoven.com",
  },

  // ─── Starbucks Café Objects ─────────────────────────────────
  "cafe-barista": {
    lines: ["One drip coffee. That'll be $7. Welcome to Miami."],
  },
  "cafe-essay-1": {
    lines: [
      "📖 Do Things That Don't Scale — Paul Graham",
      "The most common unscalable thing founders have to do at the start is recruit users manually.",
    ],
  },
  "cafe-essay-2": {
    lines: [
      "📖 How to Get Startup Ideas — Paul Graham",
      "The way to get startup ideas is not to try to think of startup ideas.",
    ],
  },

  // ─── Engineering Lab Objects ────────────────────────────────
  "lab-experiment-1": {
    lines: ["EXPERIMENT: AI Practice Feedback", "Uses Claude to analyze student recordings in real-time."],
  },
  "lab-experiment-2": {
    lines: ["EXPERIMENT: Curriculum Engine", "Generates adaptive lesson plans from teacher templates."],
  },
  "lab-experiment-3": {
    lines: ["EXPERIMENT: Progress Dashboard", "Visual learning analytics for teachers and students."],
  },
  "lab-stack-wall": {
    lines: [
      "THE STACK",
      "Anthropic · Vercel · Supabase · Stripe · n8n · Figma · Notion · Mixpanel",
    ],
  },
  "lab-rubber-duck": {
    lines: ["I just listen."],
  },

  // ─── Construction Buildings ─────────────────────────────────
  "chalk-lab-construction": {
    lines: [
      "🚧 Chalk is still being built. Follow along.",
      "@andaborunda on Twitter for updates.",
    ],
  },
  "chalk-lab-hardhat": {
    lines: ["He started this two weeks ago. Very excited about it. Check back."],
  },
  "vc-office": {
    lines: ["Sand Hill & Co. — Door's locked. Come back when you've raised a round."],
  },

  // ─── Hidden Area Signs ──────────────────────────────────────
  "secret-beach-sign": {
    lines: ["still figuring things out."],
  },
  "music-room-sign": {
    lines: ["🎵 The Music Room", "An 8-bit track hums softly..."],
  },
  "idea-graveyard-sign": {
    lines: [
      "💀 THE IDEA GRAVEYARD",
      "Here lie the ideas that didn't make it.",
      "They taught him everything the good ones know.",
    ],
  },
  "lookout-hill-sign": {
    lines: ["Miami, 2026. Let's build something."],
  },
  "hidden-mentor": {
    lines: [
      "You found me.",
      "Most people don't come this far. That says something about you.",
      "Keep building. Keep shipping. The world needs what you're making.",
    ],
  },

  // ─── Bulletin Board ─────────────────────────────────────────
  "bulletin-header": {
    lines: ["THINGS I'M FIGURING OUT RIGHT NOW"],
  },
  "bulletin-pin-1": {
    lines: ["📌 AI PM skills — How to manage products that think for themselves."],
  },
  "bulletin-pin-2": {
    lines: ["📌 LLM constraints — Token limits, hallucinations, eval frameworks."],
  },
  "bulletin-pin-3": {
    lines: ["📌 RAG + embeddings — Making AI actually know your data."],
  },
  "bulletin-pin-4": {
    lines: ["📌 Prompt engineering + evals — The craft of talking to machines."],
  },
  "bulletin-pin-5": {
    lines: ["📌 Agents — Autonomous systems that can plan, act, and recover."],
  },
  "bulletin-pin-6": {
    lines: ["📌 Design — Interfaces that feel inevitable, not designed."],
  },
  "bulletin-pin-7": {
    lines: ["📌 Game theory in AI — Mechanism design meets language models."],
  },
  "bulletin-pc": {
    lines: ["Andres's reading list — books, papers, and rabbit holes."],
  },
};
