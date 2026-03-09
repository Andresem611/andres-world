# Andres World

## What This Is

A personal website built as a playable Pokemon Gen 1/2 pixel-art overworld game at andresmartinez.com. Visitors control a character and walk around "Andres World" — a Miami-themed, top-down tile-based map where every building is a project, section, or piece of Andres's life. Buildings have interiors (like Pokemon PokeCenter) with NPCs, signs, and interactive objects that reveal content no static site could.

Built with Phaser 3 + Grid Engine + Tiled + Vite + TypeScript, deployed to Vercel. Executed via Ruflo swarm agents (GSD plans → Ruflo builds → GSD verifies).

## Core Value

Visitors discover who Andres is by *playing* the world — every building, NPC, and hidden area reveals something real, in a format nobody else has built.

## Requirements

### Validated

(None yet — ship to validate)

### Active

- [ ] Phaser 3 + Vite + TypeScript + Grid Engine project bootstrapped and deployed to andresmartinez.com
- [ ] Overworld map: Miami-themed, ~50×40 tiles, tile-based grid movement, collision, camera follow
- [ ] Character sprite: original founder sprite (hoodie, laptop backpack, 4-directional walk animation)
- [ ] Building interaction system: Space/E to interact, different behaviors per building type
- [ ] NPC dialogue system: Pokemon-style text box, self-aware/funny tone, fourth-wall breaking
- [ ] Andres's Room interior: full object interactions (bed, PC, DJ booth, flags, dachshund sprites, Dad NPC)
- [ ] Thoven HQ interior: metrics board, NPCs (Keri, Michael Seibel, Brian Chesky), live-ish stats
- [ ] Starbucks Café interior: essay reading system via MDX
- [ ] Engineering Lab interior: tools/experiments, stack posters, NPCs (Tobi, Patrick, Dario)
- [ ] Under-construction buildings: scaffolding visual, popup dialog on approach
- [ ] Hidden areas: Secret Beach, Music Room, Idea Graveyard, Lookout Hill, Hidden NPC
- [ ] Miami art assets: Art Deco palette, palm trees, ocean border, pastel buildings
- [ ] Polish: loading screen (Pokemon-style title card), 8-bit music, mobile D-pad overlay, SEO meta tags

### Out of Scope

- Normal navigation / traditional site nav — game IS the site, no escape hatch
- Free-roam movement — tile-based grid only (authentic Pokemon feel)
- "New Game / Continue" save system — this is a portfolio, not a game with saves
- Server-side rendering — canvas game, SEO handled via meta tags + static fallback
- Real-time multiplayer — single player only
- Mobile-first layout — desktop primary, mobile D-pad overlay as accommodation

## Context

- **Domain**: andresmartinez.com (Vercel deployment target)
- **Stack locked**: Phaser 3 + Grid Engine + Tiled + Vite + TypeScript — chosen for Pokemon-style grid movement and tilemap support
- **Execution model**: Ruflo swarm agents execute each GSD phase (`ruflo --agent swarm --task "[…]. See PLAN.md."`)
- **Art approach**: itch.io free Pokemon-compatible tilesets to prototype → Miami-specific paid assets (KR Art Deco, Tropical Shores, Modern Exteriors LimeZu) for final look
- **Primary reference**: ariroffe/personal-website (Pokemon Gen 1/2 overworld, Phaser 3 + Tiled, 425 HN upvotes)
- **NPC tone**: Self-aware and funny. Fourth-wall breaking. NPCs know they're in a portfolio site.
- **Map**: ~50×40 tiles. Ocean east edge. Player enters from south via dock. Main Street runs north. Two-layer system: overworld + interiors.
- **Ruflo**: v3.5.14, MCP configured, `.claude/` and `.claude-flow/` initialized in repo

## World Geography (Build Reference)

| Zone | Contents |
|------|----------|
| South — The Dock | Spawn point, welcome sign, path north |
| Main Street (spine) | Palm-lined, Art Deco buildings both sides |
| West — Main St | Bulletin Board + PC, Ventanita, Thoven HQ, Andres's House |
| East — Main St | Starbucks Café, Chalk Lab (under construction), Record Shop, GitHub Library |
| Central Plaza | Fountain, Marc Andreessen NPC, John Collison NPC, VC Office (locked) |
| West Side | Andres's House (northwest), Idea Graveyard (southwest, hidden) |
| East — Beach Strip | Ocean border, boardwalk, Secret Beach (hidden south), Vinod Khosla NPC |
| North — The Heights | Lookout Hill/Rooftop, Engineering Lab (northeast, hidden), Hidden NPC (tip) |

## NPC Roster (Build Reference)

| Person | Location | Dialogue |
|--------|----------|---------|
| Paul Graham | Starbucks corner table | *"Write simply."* |
| Brian Chesky | Thoven HQ — metrics board | *"Don't fuck up the culture."* |
| Tobi Lütke | Engineering Lab | *"Shipping is a feature."* |
| Dalton Caldwell | Lookout Hill rooftop | *"Just talk to your users."* |
| Ben Horowitz | Idea Graveyard gate | *"Nobody told you it was going to be easy. Good."* |
| Marc Andreessen | Central Plaza bulletin board | *"Software is eating the world."* |
| Vinod Khosla | Secret Beach boardwalk | *"The best entrepreneurs ignore the odds."* |
| Dario Amodei | Engineering Lab | *"We're trying to be careful."* |
| Michael Seibel | Thoven HQ interior | *"Make something people want."* |
| Patrick Collison | Engineering Lab | *"Have you read the Stripe docs? All of them?"* |
| John Collison | Main Street (walking) | *"Growth solves most problems."* |
| Keri | Thoven HQ — front desk | Sincere Thoven dialogue |
| Dad | Andres's Room | *"Have you eaten? Also, call me."* |
| Dachshunds (2x) | Andres's Room | *"Woof."* |

## Constraints

- **Tech Stack**: Phaser 3 + Grid Engine + Tiled + Vite + TypeScript — locked, no alternatives
- **Deployment**: Vercel, domain andresmartinez.com — no server-side compute
- **Movement**: Tile-based grid only — no free roam, no physics-based movement
- **Art**: Pixel-perfect, Gen 1/2 Pokemon aesthetic — Miami-themed throughout
- **Execution**: Ruflo swarm agents per phase — each phase needs a PLAN.md before execution
- **NPC Tone**: Self-aware, funny, fourth-wall breaking — never sincere except Keri and Hidden NPC

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Phaser 3 + Grid Engine | Industry standard, Pokemon-style grid movement built-in, Tiled native integration | — Pending |
| Ruflo for execution | 60+ specialized agents, swarm coordination — building the site IS the first experiment | — Pending |
| Miami theme (not generic Pokemon) | Nobody has built Miami Art Deco Pokemon overworld — genuinely differentiated | — Pending |
| Desktop-first with mobile D-pad | Keyboard games broken on phones; accommodate mobile without compromising desktop | — Pending |
| Game IS the site (no escape nav) | Total commitment — novelty sustained by content depth, not site structure | — Pending |
| itch.io assets → custom art path | Prototype fast with free assets, replace with Miami-specific paid tiles later | — Pending |

---
*Last updated: 2026-03-08 after initialization*
