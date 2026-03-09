# CLAUDE.md — Andres World

This file provides guidance to Claude Code when working in this repo.

---

## What's Here

Pokemon Gen 1/2 pixel art overworld personal website → andresmartinez.com

| File | Purpose |
|------|---------|
| `docs/plans/2026-03-08-andres-world-personal-site-design.md` | Full design — read this first, every session |
| `.planning/` | GSD phases, ROADMAP.md, PROJECT.md |
| `src/` | Phaser 3 game source |
| `public/assets/` | Tilesets, sprites, maps (Tiled exports) |

Full design (buildings, NPCs, map, art assets, references): @docs/plans/2026-03-08-andres-world-personal-site-design.md

---

## Who's Involved

- **Andres** — founder, all product/design decisions
- **GSD** — planning layer (phases, roadmap, verification). Never skip.
- **Ruflo** — execution layer (parallel swarms). Runs after GSD plan is approved.

---

## How We Work — GSD + Ruflo Hybrid

GSD is the architect. Ruflo is the construction crew.

```
/gsd:plan-phase [N]                          ← write PLAN.md first
ruflo --agent swarm --task "[…] See PLAN.md" ← execute with parallel agents
/gsd:verify-work                             ← validate phase done
repeat
```

**GSD commands used here:**
- `/gsd:new-project` — initialize PROJECT.md + ROADMAP.md
- `/gsd:plan-phase [N]` — detailed PLAN.md before any code
- `/gsd:verify-work` — validate phase against goal
- `/gsd:progress` — check current status

**Ruflo commands used here:**
- `ruflo --agent swarm --task "[description]. See .planning/phases/phase-[N]/PLAN.md."` — execute a phase
- `ruflo status` — check if running
- `ruflo --list` — see available agents

**Ruflo is already installed (v3.5.14):**
- `.claude/` — agents, commands, helpers, skills
- `.claude-flow/` — runtime config, sessions, metrics
- MCP server: `npx -y ruflo@latest mcp start` (activates on session restart)
- No persistent daemon needed — Ruflo activates only when a swarm is invoked

**Rule:** No Ruflo execution without an approved GSD PLAN.md.

---

## Non-Negotiables

**NEVER:** Skip to normal nav / sincere NPC dialogue / free-roam movement / execute before plan approved / generic visuals

**ALWAYS:** Tile-based grid movement / two map layers (overworld + interiors) / scaffolding on unbuilt buildings / atomic commits / deploy early to andresmartinez.com / pixel-perfect rendering

NPC tone: self-aware and funny. Fourth-wall breaking. e.g. *"Another founder with a personal site. At least yours is interactive."*

---

## Stack

Phaser 3 + Grid Engine + Tiled + Vite + TypeScript → Vercel (andresmartinez.com)
