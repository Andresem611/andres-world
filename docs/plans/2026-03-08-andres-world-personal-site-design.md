# Andres World — Personal Website Design

**Date**: 2026-03-08
**Status**: Brainstorming / Design Phase
**Domain**: andresmartinez.com

---

## Concept

A personal website built as a pixel-art Pokemon overworld game. Visitors control a character and walk around "Andres World" — a top-down tile-based map where every building is a different project, section, or piece of Andres's life. Buildings have interiors (like Pokemon PokeCenter) with NPCs, signs, and interactive objects.

**Inspiration**: Pokemon Gen 1/2 overworld aesthetic + Silicon Valley intro establishing shot energy.

**Audience**: Personal expression + other founders.

---

## The World Map (Overworld — Full Geography)

### Map Dimensions
~50 tiles wide x 40 tiles tall. Miami-themed throughout. Ocean on the east edge (natural border). Player enters from the south via dock.

### Entry — The Dock (South)
Player arrives by boat. Sprite steps off a small Miami dock. Sign: *"Welcome to Andres World. Population: always building."* Path leads north up Main Street.

### Main Street (Center Spine — North/South)
Palm-lined Brickell Ave equivalent. Art Deco pastel buildings on either side. Everything connects here.

**Left side (west) going north:**
- Bulletin Board + PC + Dalton bench — first thing you hit
- Ventanita (Cuban coffee walk-up window) — NPCs hanging around, Paul Graham: *"Write simply."*
- Thoven HQ — largest building on the map
- Andres's House — behind Thoven HQ, slightly hidden

**Right side (east) going north:**
- Starbucks Café — early on, draws people in
- Chalk Lab — under construction, next to Thoven HQ
- Record Shop — small music store, 8-bit track plays inside
- GitHub Library — further north, beach-facing

**Central Plaza (mid-map):**
- Fountain or palm cluster in center
- Marc Andreessen at noticeboard: *"Software is eating the world."*
- John Collison walking laps: *"Growth solves most problems."*
- VC Office — *"Sand Hill & Co."* Front door locked until round closes

### West Side — Residential + Hidden
- **Andres's House** — northwest, feels like a neighborhood
- **Idea Graveyard** — southwest, through overgrown palm trees. Ben Horowitz at the gate.
- **Music Room** — behind Andres's house, basement entrance. 8-bit track on entry.

### East Side — The Beach Strip
Full eastern edge is ocean. Boardwalk runs north-south.
- **Secret Beach** — south end, through palm trees. Hammock, Naval NPC, sign: *"still figuring things out."*
- **Vinod Khosla** on the boardwalk
- **GitHub Library** has beach-facing side entrance

### North — The Heights
- **Lookout Hill / Rooftop Terrace** — top-center, stairs going up. Miami skyline. Sign: *"Miami, 2026. Let's build something."*
- **Engineering Lab** — northeast, off the main path. You have to explore to find it.
- **Hidden NPC mentor** — north tip, behind the hill. Deep explorer reward.

### Updated ASCII Map
```
N
↑
[LOOKOUT HILL/ROOFTOP]          [HIDDEN NPC]
[ENGINEERING LAB]               [BOARDWALK]
[MUSIC ROOM][THOVEN HQ][CHALK LAB][RECORD SHOP][GITHUB LIB]
[ANDRES HOUSE][CENTRAL PLAZA + VC OFFICE]      [OCEAN]
[IDEA GRAVEYARD] [VENTANITA][STARBUCKS]        [OCEAN]
[tall grass]     [BULLETIN BOARD]         [SECRET BEACH]
                 [WELCOME SIGN]           [BOARDWALK]
                 [DOCK / BOAT SPAWN]
↓
S
```

## The World Map (Overworld)

Town name: **ANDRES WORLD** (sign at top of map, like every Pokemon town)

### Districts / Zones

| Zone | What's There |
|------|-------------|
| **Main Street** | Thoven HQ (large, polished building), Chalk Lab |
| **Workshop District** | Buildings under construction — scaffolding, cranes, pixel hard hats. Active projects being built. |
| **The Library** | GitHub building — click redirects to GitHub |
| **The Café** | Essays / writing section |
| **The Lab** | Tools, agents, experiments shipped |
| **Bulletin Board** | "What I'm learning" — Pokemon town noticeboard style |
| **Andres's House** | About Me — protagonist's bedroom |
| **Hidden areas** | Easter eggs — paths through tall grass to secret rooms |

### Building States
- **Finished** — full building, enterable
- **Under construction** — scaffolding + cranes + pixel hard hats. Click = popup: *"Builder still hammering away... check back soon."*

---

## Interaction Model

Different buildings have different click behaviors based on content depth:

| Building | Click Behavior |
|----------|---------------|
| Thoven HQ | Full page transition → interior map |
| Chalk Lab | Modal popup with stats/updates |
| Essay Café | Full page transition → interior map |
| Tool Shop/Lab | Modal or full page (TBD per tool) |
| GitHub Library | Redirect to GitHub |
| Under construction | Popup: "Still building..." |
| Signs / Bulletin Board | Dialog box (Pokemon-style text box) |

**No "normal nav" escape hatch** — the game IS the site. Fully committed.

### NPC Dialogue Tone
**Self-aware and funny** — fourth-wall breaking, meta humor, founder jokes. NPCs know they're in a portfolio site and lean into it. e.g. *"I heard Thoven raised their first angel. Bold move in this economy."* or *"You've been walking around this map for 10 minutes. There's a contact link in Andres's room, just saying."*

---

## The Character

**Original founder sprite** — not Red, not Ash. Custom character:
- Laptop backpack visible from all directions
- Hoodie + jeans
- Coffee cup (idle animation detail)
- 4-directional walking animation (3 frames each, Gen 1 style)
- ~32x32 pixels

---

## Movement & Controls

- **Tile-based grid movement** (authentic Pokemon feel — not free roam)
- Arrow keys + WASD
- Camera follows character, world scrolls
- Press **Space or E** near building/sign = interact
- **Mobile**: D-pad overlay in corner (pixel art buttons)
- Collision on: buildings, trees, water, signs
- Walkable: paths, open ground

---

## Building Interiors

Each building you enter loads an **interior map** (like Pokemon PokeCenter / town buildings). Two-layer map system: overworld + interiors.

### Thoven HQ Interior (PokeCenter style)
- Nurse NPC at counter with live stats dialog: *"Welcome to Thoven. 75 teachers registered. 10 students enrolled. Raising $75K seed round."*
- PC in corner: links to Thoven app
- Framed Juilliard/conservatory mentions on walls
- Progress board showing milestones

### Chalk Lab (Exterior Only — Under Construction)
No interior yet. Construction site shell.
- Scaffolding, dirt foundation, construction fencing
- Sign planted in dirt: *"NEW PROJECT — Coming Soon"*
- Permit notice on fence: *"Builder: Andres Martinez. Est. completion: TBD"*
- Hard hat NPC outside: *"He started this two weeks ago. Very excited about it. Check back."*
- Click building → popup: *"Chalk is still being built. Follow along."* + Twitter link
- Interior gets built when Chalk ships enough to warrant it — site grows as projects grow

### Essay Café Interior (Café style)
- Barista NPC
- Tables with "books" (essays) you can read — press A = opens essay
- Bookshelf on wall

### Thoven HQ Interior (Music Academy themed)

**Front Desk (entry)**
- Keri NPC: *"Welcome to Thoven. We're building the operating system for music education. It's going well. Mostly."*
- Press A on desk → Thoven description + link to app

**Metrics Board (center wall — big pixel bulletin board)**
Live numbers pulled dynamically:
- Active teachers · Students enrolled · Weekly active users · Lessons completed
- Tiny pixel chart going up — building in public

**Shipped Board (side wall — corkboard)**
Like biweeklies in pixel form:
- *"Last shipped: [feature]"*
- *"Current focus: [priority]"*
- *"Under construction: [next thing]"*
Manual update — push new note when something ships.

**Practice Rooms (back of building)**
Doors labeled: Piano · Guitar · Voice · Violin
All under construction scaffolding (LMS content side still being built)

**Walls:** Pixel art instruments — guitar, piano, sheet music posters

**NPCs:**
- Keri — front desk
- Michael Seibel — waiting area: *"Make something people want."*
- Brian Chesky — by the metrics board: *"Don't fuck up the culture."* (moved from Main Street — marketplace founder in a marketplace startup)

### Engineering Lab Interior (Hacker Basement / MIT Lab)
Whiteboards with diagrams, multiple monitors, blinking server lights, cable chaos, coffee cups everywhere.

**Zone 1 — The Workbench (What I'm Playing With)**
Each experiment = a monitor or workstation. Press A → popup or redirect to live demo/tool.
- Live demos of shipped experiments
- Agents built
- Random tools
- Half-baked things labeled *"unstable — enter at your own risk"*
- Low friction to update: add a new monitor with title + link

**Zone 2 — The Wall (My Stack)**

Posters (companies/platforms):
`Anthropic · Vercel · Supabase · Stripe · n8n · Figma · Notion · Mixpanel`

Gadgets on shelves (pixel art devices):
- Claude terminal — glowing screen
- Vercel deploy dashboard — green checkmarks
- Mixpanel funnel chart — tiny pixel graph
- Figma canvas — design grid on screen
- n8n node graph — blinking connections
- Obsidian notebook — the vault

**Learning Corner (separate desk):**
- YouTube monitor — *"Where I learn most things honestly"*
- Oboe tablet — learning resource
- Bookshelf with course notes

**NPCs in lab:** Tobi Lütke, Patrick Collison, Dario Amodei
**Easter egg NPC:** Rubber duck on desk. Press A: *"I just listen."*

### Tool Shop Interior (Pokémart style)
- Shelves with tools/agents as "items"
- Press A on shelf item = popup with description + link

### GitHub Library Interior
- Bookshelf aesthetic
- Interact with desk → redirect to GitHub

### Andres's Room (Protagonist's Bedroom — One Floor Studio)

No stairs. Simple, personal, feels exactly like a Pokemon protagonist room — objects tell the story without a single word of bio copy.

| Object | Detail |
|--------|--------|
| **Bed** | Press A: *"Not yet. Too much to build."* |
| **PC desk** | Press A → popup: Twitter, LinkedIn, GitHub, email |
| **DJ booth** | Corner, pixel turntables. Press A: *"He takes this seriously."* |
| **Bookshelf** | *The Hard Thing About Hard Things* — Ben Horowitz. Press A: title + one-line take |
| **Corkboard** | Random pinned stuff — ticket stubs, notes, chaos |
| **Arsenal jersey** | On wall, #14 on the back (Thierry Henry) |
| **Venezuelan + Dominican flags** | Side by side on wall |
| **Michigan pennant** | Above desk |
| **Doxxin poster** | Dachshund framed on wall |
| **Window** | Miami skyline, palm tree outside |
| **Dad NPC** | Wandering: *"Have you eaten? Also, call me."* |
| **Two dachshund sprites** | Roaming independently around the room |

---

## Content Inventory

### Projects (Buildings)
- Thoven (main building)
- Chalk
- Canopy
- Tools / agents shipped
- GitHub (external link)

### Content (Landmarks / Interiors)
- Essays / writing (Café)
- What I'm learning (Bulletin Board)
- About Me (Andres's Room)
- Currently reading (bookshelf in room)

### Fun / Playground
- Random experiments and live demos (Lab)
- Easter eggs / hidden rooms through tall grass (see Hidden Areas below)

### NPC Roster — Real People in Andres World

| Person | Location | Dialogue |
|--------|----------|---------|
| **Paul Graham** | Starbucks corner table | *"Write simply."* |
| **Brian Chesky** | Thoven HQ — by the metrics board | *"Don't fuck up the culture."* |
| **Tobi Lütke** | Engineering Lab | *"Shipping is a feature."* |
| **Dalton Caldwell** | Lookout Hill rooftop | *"Just talk to your users."* |
| **Ben Horowitz** | Idea Graveyard | *"Nobody told you it was going to be easy. Good."* |
| **Marc Andreessen** | Main Street bulletin board | *"Software is eating the world."* |
| **Vinod Khosla** | Secret Beach | *"The best entrepreneurs ignore the odds."* |
| **Dario Amodei** | Engineering Lab (by Anthropic poster) | *"We're trying to be careful."* |
| **Michael Seibel** | Thoven HQ interior | *"Make something people want."* |
| **Patrick Collison** | Engineering Lab | *"Have you read the Stripe docs? All of them?"* |
| **John Collison** | Main Street (walking around) | *"Growth solves most problems."* |
| **Keri** | Thoven HQ — at the counter | Sincere, real Thoven dialogue |
| **Dad** | Andres's Room | *"Have you eaten? Also, call me."* |
| **Dogs (2x mini dachshunds, double dapple)** | Andres's Room | *"Woof."* (two separate sprites, wandering around the room) |

### Hidden Areas (Secret Paths Through Tall Grass)
| Area | Vibe | Detail |
|------|------|--------|
| **Secret Beach** | Chill, honest | Hammock, sign: *"still figuring things out"* — raw founder moment |
| **Music Room** | Thoven roots | Piano, plays an 8-bit music track when you enter |
| **Idea Graveyard** | Funny + real | Tombstones for failed ideas. *"RIP Music Store Partnerships, 2025 — we thought they'd refer students. They did not."* |
| **Lookout Hill** | Aspirational | Character stands at top, sign: *"Miami, 2024. Let's build something."* |
| **Hidden NPC** | Mentor figure | Gives real advice when you talk to them — sincere contrast to the funny overworld tone |

### Bulletin Board (Town Noticeboard — Outdoor)
Header: *"THINGS I'M FIGURING OUT RIGHT NOW"*

Pinned notes (each pressable — popup with what it is + why + resources):
- AI PM skills — how to spec, prioritize, and ship AI features that actually work
- LLM constraints — context windows, latency, cost, when to use what model
- RAG + embeddings — chunking strategies, retrieval, making AI actually know things
- Prompt engineering + evals — getting reliable outputs, measuring what works
- Agents — tool use, orchestration, multi-agent systems
- Design — getting better at UI/visual systems
- Game theory in AI — incentives, multi-agent dynamics

PC next to the board → reading list (books, papers, threads, YouTube — same MDX system as essays)
Bench nearby — Dalton Caldwell NPC: *"Just talk to your users."*

Low friction to update: edit a single MDX/JSON file to change pins.

### Social / Contact
- PC in Andres's Room → Twitter/X, LinkedIn, email, GitHub

---

## Art Style

- **Pixel-perfect retro** — Gen 1/2 Pokemon aesthetic
- **Miami / Florida themed** — not a generic Pokemon town. Recognizably Miami.
- **Slight 3D feel** via depth shading and layering tricks (not full isometric — top-down with perceived depth)
- Consistent tileset family (pick one and stick to it)
- Buildings under construction: scaffolding, cranes, hard hat sprites

### Miami Visual Language
| Element | Miami Treatment |
|---------|----------------|
| Trees | Palm trees (not generic Pokemon oaks) |
| Buildings | Art Deco pastel colors — pinks, yellows, teals |
| Map border | Ocean/beach on one edge (natural world boundary) |
| Background | Brickell-style skyline visible in distance tiles |
| Color palette | Sunset oranges, teal water, pastel Miami tones |
| Café | Cuban coffee ventanita (not a generic café) |
| Lookout hill | Rooftop terrace overlooking downtown |
| Idle animation | Palm trees swaying |

---

## Tech Stack

| Component | Choice | Why |
|-----------|--------|-----|
| **Dev orchestration** | **Ruflo** (github.com/ruvnet/ruflo) | 60+ specialized agents, swarm coordination, persistent memory. Building the site IS the first experiment. |
| Game framework | **Phaser 3** | Industry standard, mature, tilemap support, pixel-perfect rendering |
| Grid movement | **Grid Engine plugin** | Pokemon-style grid movement built-in, pathfinding, multi-tile collision |
| Tilemap editor | **Tiled** | Free, exports JSON, Phaser-native integration |
| Art assets | **itch.io free Pokemon packs** to prototype → custom art later |
| Build tool | **Vite + TypeScript** | Fast dev loop, modern DX |
| Deploy | **Vercel** | Familiar stack |
| Domain | **andresmartinez.com** | |

### Splash / Loading Screen
Pokemon-style title card: **"ANDRES WORLD"** with character sprite. Loading bar while assets load. No "New Game / Continue" — not an actual game with saves, just a loading screen. Press Enter (or any key) once loaded → drop into overworld.

**Key insight from research**: Pokemon-style overworld portfolio sites essentially don't exist. Bruno Simon's 3D car portfolio is the famous "game as portfolio" reference — but nobody has done Pokemon overworld. Genuinely differentiated.

---

## Open Questions (Still Brainstorming)

- [ ] What other buildings/landmarks should be on the map?
- [ ] Do we commission custom pixel art or use free itch.io assets?
- [ ] Mobile-first or desktop-first?
- [ ] NPC dialogue tone — funny/self-aware, or sincere?
- [ ] What goes in the "hidden areas" / easter eggs?
- [ ] How does the site handle SEO (since it's a canvas game)?
- [ ] Do we want a "New Game / Continue" splash screen on load?

---

## References & Research

### Direct References
| Project | URL | Why relevant |
|---------|-----|-------------|
| **ariroffe/personal-website** | github.com/ariroffe/personal-website | Pokemon Gen 1/2 overworld personal site, Phaser 3 + Tiled. 425 HN upvotes. Primary technical reference. |
| **monster-tamer** | github.com/devshareacademy/monster-tamer | Most complete Pokemon clone in Phaser 3. Full YouTube tutorial series. Watch before writing code. |
| **Bruno Simon** | bruno-simon.com | Gold standard game-as-portfolio. 3D (not pixel), but best practices on performance + load time apply. |
| **Robby Leonardi** | rleonardi.com/interactive-resume | Scroll-based platformer resume. Completion psychology insight. |

### NPC Dialogue Plugin
Rex Rainbow's UI Dialog Plugin — the standard for Phaser 3 NPC dialogue.
- https://rexrainbow.github.io/phaser3-rex-notes/docs/site/ui-dialog/

### Tilemap Tutorial (Essential)
Michael Hadley's Phaser 3 Tilemap Series:
- https://medium.com/@michaelwesthadley/modular-game-worlds-in-phaser-3-tilemaps-1-958fc7e6bbd6

### Art Assets — Miami Theme
| Asset | Price | Covers |
|-------|-------|--------|
| KR Art Deco Exteriors (Kokoro Reflections) | $17 | Art Deco city buildings, streets, exteriors |
| KR Art Deco Interiors (Kokoro Reflections) | $18 | Gatsby-style interiors, gold trim |
| Tropical Shores Tileset (Seliel the Shaper) | $20 | Palm trees, sandy shores, animated water, Tiled-ready |
| Modern Exteriors — LimeZu | $5 | Massive pack (320+ updates), beach packs included |
| Warped Miami Synth (ansimuz) | Free | Retrowave Miami aesthetic |

Nobody has built a Miami Art Deco Pokemon overworld — genuinely the first.

### Known Pitfalls
1. **Mobile** — keyboard games are broken on phones. Need touch D-pad overlay or accept desktop-only.
2. **Load time** — front-load visible area, stream the rest. Loading screen must feel intentional.
3. **SEO** — canvas has zero crawlable text. Mitigate with proper meta tags + static fallback description.
4. **Novelty wears off** — game format must reveal things a normal site can't. NPC dialogue + hidden areas solve this.

---

## Build Order (GSD Phases)

| Phase | Work | Goal |
|-------|------|------|
| 1 | Phaser 3 + Vite + TypeScript + Grid Engine + Vercel deploy | Repo exists, deploys |
| 2 | Overworld map — tilemap, character, movement, collision | Walk around empty map |
| 3 | Andres's Room — first interior, NPC system, dialogue, object interactions | Full loop working |
| 4 | Thoven HQ interior — metrics board, NPCs, dynamic data | Main building done |
| 5 | Starbucks Café — MDX essay system | Writing section live |
| 6 | Engineering Lab | Tools section live |
| 7 | Miami art assets — replace placeholder tiles | World looks like Miami |
| 8 | Hidden areas + easter eggs | Full world explorable |
| 9 | Polish — loading screen, 8-bit music, mobile D-pad, meta tags | Launch ready |

Build using GSD workflow (`/gsd:new-project` when ready to start).

## Next Steps (When Ready to Build)

1. Pick tileset from itch.io and prototype map in Tiled
2. Set up Phaser 3 + Vite + Grid Engine
3. Build overworld map (walkable paths, building shells, collision)
4. Add character sprite + movement
5. Add building click interactions (redirect / modal / full page)
6. Build first interior: Andres's Room
7. Build Thoven HQ interior
8. Add NPCs + dialog system
9. Polish + deploy to andresmartinez.com
