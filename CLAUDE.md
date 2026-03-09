# CLAUDE.md — Andres World

## What We're Building

**andresmartinez.com** — A Pokemon Gen 1/2 pixel art overworld personal website. Miami-themed. Visitors walk around a tile-based map and explore buildings that represent Andres's projects, life, and interests.

Full design: `docs/plans/2026-03-08-andres-world-personal-site-design.md` — read this before doing anything.

---

## Stack

| Layer | Tool |
|-------|------|
| Game engine | Phaser 3 + Grid Engine plugin |
| Map editor | Tiled (exports JSON) |
| Frontend | Vite + TypeScript |
| Dev orchestration | Ruflo (swarm execution) |
| Planning | GSD (phases, roadmap, verification) |
| Deploy | Vercel → andresmartinez.com |

---

## Hybrid Workflow — GSD + Ruflo

**GSD** = architect. Plans phases, writes PLAN.md, tracks progress, verifies completion.
**Ruflo** = construction crew. Executes PLAN.md with parallel agent swarms.

```
/gsd:plan-phase [N]   →   PLAN.md created
ruflo swarm executes  →   code written
/gsd:verify-work      →   phase validated
repeat
```

Never execute a phase without a GSD plan approved first.

---

## Non-Negotiables

**NEVER:**
- Add a "skip to normal site" nav — the game IS the site
- Make NPC dialogue sincere — must be self-aware and funny, fourth-wall breaking
- Use free-roam movement — tile-based grid only (authentic Pokemon feel)
- Start building before the phase PLAN.md is approved
- Use generic Pokemon visuals — must feel like Miami (Art Deco, palm trees, pastel, ocean)

**ALWAYS:**
- Two map layers: overworld + interiors (like Pokemon PokeCenter)
- Buildings under construction = scaffolding + cranes sprites, not blank tiles
- Commit atomically after each working feature
- Deploy early and often to andresmartinez.com via Vercel
- Pixel-perfect rendering (no anti-aliasing on sprites)

---

## Key Design Decisions (Don't Relitigate)

- **Art style:** Pixel-perfect retro, Gen 1/2 Pokemon feel, Miami-themed
- **Character:** Original founder sprite — laptop backpack, hoodie, coffee cup
- **Movement:** Tile-based grid (WASD + arrow keys), mobile D-pad overlay
- **NPC tone:** Self-aware and funny. e.g. *"Another founder with a personal site. At least yours is interactive."*
- **Map theme:** Miami Art Deco — palm trees, pastel buildings, ocean to the east, boardwalk
- **Spawn point:** Dock at the south — player arrives by boat
- **Loading screen:** Pokemon-style title card "ANDRES WORLD" + loading bar. No "New Game / Continue."

---

## Building Interactions

| Building | Click behavior |
|----------|---------------|
| Thoven HQ | Full page transition → interior |
| Chalk Lab | Popup: "Still building..." (no interior yet) |
| Starbucks Café | Full page transition → interior |
| Engineering Lab | Full page transition → interior |
| Andres's Room | Full page transition → interior |
| GitHub Library | Redirect to GitHub |
| Ventanita | NPC interaction only |
| Record Shop | Interior with 8-bit music |
| VC Office | Locked until round closes |
| Hidden areas | Accessible through tall palm trees |

---

## NPC Roster

| NPC | Location | Dialogue |
|-----|----------|---------|
| Paul Graham | Starbucks corner table | *"Write simply."* |
| Brian Chesky | Thoven HQ — metrics board | *"Don't fuck up the culture."* |
| Tobi Lütke | Engineering Lab | *"Shipping is a feature."* |
| Dalton Caldwell | Lookout Hill | *"Just talk to your users."* |
| Ben Horowitz | Idea Graveyard | *"Nobody told you it was going to be easy. Good."* |
| Marc Andreessen | Main Street bulletin board | *"Software is eating the world."* |
| Vinod Khosla | Secret Beach boardwalk | *"The best entrepreneurs ignore the odds."* |
| Dario Amodei | Engineering Lab | *"We're trying to be careful."* |
| Michael Seibel | Thoven HQ waiting area | *"Make something people want."* |
| Patrick Collison | Engineering Lab | *"Have you read the Stripe docs? All of them?"* |
| John Collison | Main Street (walking) | *"Growth solves most problems."* |
| Keri | Thoven HQ front desk | Sincere Thoven dialogue |
| Dad | Andres's Room | *"Have you eaten? Also, call me."* |
| Dogs (2x dachshunds) | Andres's Room | *"Woof."* |

---

## Phase Overview

| Phase | Goal | Status |
|-------|------|--------|
| 0 | Phaser 3 + Vite + TS + Grid Engine scaffold → Vercel | Not started |
| 1 | Overworld map — tilemap, character, movement, collision | Not started |
| 2 | Andres's Room — first interior, NPC system, interactive objects | Not started |
| 3 | Thoven HQ interior — metrics board, NPCs | Not started |
| 4 | Starbucks Café — MDX essays, newspaper interaction | Not started |
| 5 | Engineering Lab — workbench, stack wall, learning corner | Not started |
| 6 | Miami art assets — replace placeholders | Not started |
| 7 | Remaining locations + hidden areas | Not started |
| 8 | Polish — title screen, 8-bit music, mobile D-pad, launch | Not started |

---

## Key References

| What | Where |
|------|-------|
| Full design doc | `docs/plans/2026-03-08-andres-world-personal-site-design.md` |
| Primary code reference | github.com/ariroffe/personal-website |
| Pokemon clone tutorial | github.com/devshareacademy/monster-tamer |
| Grid Engine plugin | github.com/Annoraaq/grid-engine |
| NPC dialogue plugin | rexrainbow.github.io/phaser3-rex-notes/docs/site/ui-dialog |
| Tilemap tutorials | Michael Hadley Phaser 3 Tilemap Series |
| Art Deco exteriors | kokororeflections.itch.io/kr-art-deco-exteriors-tileset-for-rpgs |
| Tropical shores tileset | seliel-the-shaper.itch.io/tropical-shores |
| Modern exteriors | limezu.itch.io/modernexteriors |
| Ruflo | github.com/ruvnet/ruflo |

---

## About Andres

- Founder/CEO of Thoven (music education marketplace)
- From Venezuela, grew up in Dominican Republic, went to University of Michigan
- Based in Miami
- Arsenal fan (#14 Thierry Henry)
- DJs (not a musician — DJ booth in room, not guitar)
- Two mini dachshunds (double dapple) — one named Doxxin
- Grande cold brew, black. Every time.
