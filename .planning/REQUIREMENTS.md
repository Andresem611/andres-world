# Requirements: Andres World

**Defined:** 2026-03-08
**Core Value:** Visitors discover who Andres is by *playing* the world — every building, NPC, and hidden area reveals something real, in a format nobody else has built.

## v1 Requirements

### Foundation

- [x] **FOUND-01**: Project builds with `vite build` and runs locally with `vite dev` (Phaser 3 + Grid Engine + TypeScript + Vite)
- [ ] **FOUND-02**: Deployed build is accessible at andresmartinez.com via Vercel CI/CD
- [x] **FOUND-03**: Pixel-perfect rendering with no anti-aliasing or blurring artifacts at 1x scale

### World Map

- [ ] **WORLD-01**: Overworld tilemap loads and renders (~50×40 tiles, Miami-themed)
- [ ] **WORLD-02**: Player character spawns at south dock entry point facing north
- [ ] **WORLD-03**: Tile-based grid movement: character moves one tile at a time (arrow keys + WASD)
- [ ] **WORLD-04**: Camera follows character, world scrolls as player moves
- [ ] **WORLD-05**: Collision system blocks movement on buildings, water, trees, and signs
- [ ] **WORLD-06**: Map has distinct zones visible on overworld: dock, main street, beach strip, plaza, heights
- [ ] **WORLD-07**: Palm trees render as Miami-appropriate trees (not generic Pokemon oaks)
- [ ] **WORLD-08**: Ocean renders on east edge as natural world boundary

### Character Sprite

- [ ] **CHAR-01**: Original founder sprite renders (hoodie, laptop backpack — not Red/Ash)
- [ ] **CHAR-02**: 4-directional walking animation (3 frames each, ~32×32px, Gen 1 style)
- [ ] **CHAR-03**: Idle animation plays when character is stationary

### Interaction System

- [ ] **INTER-01**: Press Space or E near a building/sign triggers interaction
- [ ] **INTER-02**: Interacting with a finished building loads its interior map (full page transition)
- [ ] **INTER-03**: Interacting with an under-construction building shows popup: *"Builder still hammering away... check back soon."*
- [ ] **INTER-04**: Interacting with signs shows Pokemon-style dialog text box at bottom of screen
- [ ] **INTER-05**: Dialog text box supports multi-line text and advances with Space/E

### NPC System

- [ ] **NPC-01**: NPCs render as distinct pixel sprites on the overworld
- [ ] **NPC-02**: Pressing Space/E near an NPC opens dialog with their quote (Pokemon-style text box)
- [ ] **NPC-03**: NPC dialogue is self-aware/funny, fourth-wall breaking in tone
- [ ] **NPC-04**: Walking NPCs (John Collison on Main Street) have patrol movement patterns
- [ ] **NPC-05**: All 14 NPCs from the NPC roster are placed in their correct map locations

### Andres's Room (First Interior)

- [ ] **ROOM-01**: Interior map loads when player interacts with Andres's House entrance
- [ ] **ROOM-02**: Exit transition returns player to overworld at house entrance
- [ ] **ROOM-03**: Bed interaction: *"Not yet. Too much to build."*
- [ ] **ROOM-04**: PC desk interaction: popup with Twitter/X, LinkedIn, GitHub, email links
- [ ] **ROOM-05**: DJ booth interaction: *"He takes this seriously."*
- [ ] **ROOM-06**: Bookshelf interaction: The Hard Thing About Hard Things title + one-line take
- [ ] **ROOM-07**: Arsenal jersey (#14) renders on wall
- [ ] **ROOM-08**: Venezuelan + Dominican flags render side by side on wall
- [ ] **ROOM-09**: Michigan pennant renders above desk
- [ ] **ROOM-10**: Doxxin dachshund poster renders on wall
- [ ] **ROOM-11**: Window shows Miami skyline + palm tree
- [ ] **ROOM-12**: Dad NPC wanders room: *"Have you eaten? Also, call me."*
- [ ] **ROOM-13**: Two dachshund sprites wander room independently: *"Woof."*

### Thoven HQ (Second Interior)

- [ ] **THOV-01**: Interior map loads when player interacts with Thoven HQ entrance
- [ ] **THOV-02**: Keri NPC at front desk with Thoven description dialogue
- [ ] **THOV-03**: Metrics board on center wall showing teacher/student/user counts (manual update)
- [ ] **THOV-04**: Shipped board (corkboard): last feature shipped, current focus, under construction
- [ ] **THOV-05**: Practice rooms (back): Piano, Guitar, Voice, Violin doors — all under construction
- [ ] **THOV-06**: Michael Seibel NPC in waiting area: *"Make something people want."*
- [ ] **THOV-07**: Brian Chesky NPC by metrics board: *"Don't fuck up the culture."*
- [ ] **THOV-08**: PC in corner links to Thoven app URL

### Starbucks Café (Essay System)

- [ ] **CAFE-01**: Interior map loads when player interacts with Starbucks Café entrance
- [ ] **CAFE-02**: Paul Graham NPC at corner table: *"Write simply."*
- [ ] **CAFE-03**: Barista NPC at counter
- [ ] **CAFE-04**: Books on tables are interactable — pressing A opens essay content
- [ ] **CAFE-05**: At least 2 essays are readable from the café interior on launch

### Engineering Lab

- [ ] **LAB-01**: Interior map loads (accessible via north/hidden path)
- [ ] **LAB-02**: Workbench zone: each experiment = a monitor, press A → popup or link to live demo
- [ ] **LAB-03**: Stack wall: posters for Anthropic, Vercel, Supabase, Stripe, n8n, Figma, Notion, Mixpanel
- [ ] **LAB-04**: Tobi Lütke NPC: *"Shipping is a feature."*
- [ ] **LAB-05**: Patrick Collison NPC: *"Have you read the Stripe docs? All of them?"*
- [ ] **LAB-06**: Dario Amodei NPC: *"We're trying to be careful."*
- [ ] **LAB-07**: Easter egg — Rubber duck on desk: *"I just listen."*

### Under-Construction Buildings

- [ ] **CONST-01**: Chalk Lab renders with scaffolding, dirt foundation, construction fencing
- [ ] **CONST-02**: Hard hat NPC outside Chalk Lab: *"He started this two weeks ago. Very excited about it. Check back."*
- [ ] **CONST-03**: Interacting with Chalk Lab → popup: *"Chalk is still being built. Follow along."* + Twitter link
- [ ] **CONST-04**: VC Office renders (locked door) — *"Sand Hill & Co."* sign visible

### Hidden Areas

- [ ] **HIDE-01**: Secret Beach accessible via palm tree path (south beach area) — hammock, Vinod Khosla NPC, sign: *"still figuring things out."*
- [ ] **HIDE-02**: Music Room accessible via hidden path behind Andres's House — piano, 8-bit track plays on entry
- [ ] **HIDE-03**: Idea Graveyard accessible via overgrown path (southwest) — tombstones for failed ideas, Ben Horowitz NPC
- [ ] **HIDE-04**: Lookout Hill accessible via stairs (top-center) — Miami skyline, Dalton Caldwell NPC, sign: *"Miami, 2026. Let's build something."*
- [ ] **HIDE-05**: Hidden NPC at north tip behind hill — sincere mentor dialogue (contrast to overworld humor)

### Bulletin Board

- [ ] **BULL-01**: Outdoor bulletin board is interactable (near dock/main street entry)
- [ ] **BULL-02**: Header: *"THINGS I'M FIGURING OUT RIGHT NOW"*
- [ ] **BULL-03**: 7 pins are pressable: AI PM skills, LLM constraints, RAG + embeddings, Prompt engineering + evals, Agents, Design, Game theory in AI
- [ ] **BULL-04**: PC next to board links to reading list
- [ ] **BULL-05**: Bench nearby has Dalton Caldwell NPC (also appears on Lookout Hill)

### Loading Screen

- [ ] **LOAD-01**: Pokemon-style title card: "ANDRES WORLD" with character sprite renders on load
- [ ] **LOAD-02**: Loading bar shows asset load progress
- [ ] **LOAD-03**: Press any key (or auto-advance) from title screen → drops into overworld

### Polish & SEO

- [ ] **POLI-01**: 8-bit background music plays in overworld (looping track)
- [ ] **POLI-02**: Music Room plays a distinct 8-bit track on interior entry
- [ ] **POLI-03**: Mobile D-pad overlay renders in corner on touch devices
- [ ] **POLI-04**: Page has proper Open Graph meta tags (title, description, og:image)
- [ ] **POLI-05**: Page has descriptive static HTML content for SEO crawlers below canvas

## v2 Requirements

### Extended Content

- **V2-01**: GitHub Library interior (bookshelf, desk → GitHub redirect)
- **V2-02**: Record Shop interior (small music store, 8-bit track)
- **V2-03**: Tool Shop interior (Pokémart-style, tools/agents as shelf items)
- **V2-04**: Canopy building (once Canopy warrants it)

### Dynamic Data

- **V2-05**: Thoven metrics board pulls live data from API (teachers, students, WAU)
- **V2-06**: "Reading list" PC content pulls from dynamic source (MDX or JSON)

### Enhancements

- **V2-07**: Palm tree idle animation (swaying)
- **V2-08**: Character coffee cup idle animation detail
- **V2-09**: NPC animation (walking cycles for patrol NPCs)
- **V2-10**: Sound effects on interactions (dialog open, door entry)
- **V2-11**: Custom commissioned pixel art sprites for all real-person NPCs

## Out of Scope

| Feature | Reason |
|---------|--------|
| Traditional site navigation | Game IS the site — no escape hatch by design |
| Free-roam movement | Breaks Pokemon authenticity; Grid Engine enforces grid |
| Save/load game state | Portfolio, not a game with progression |
| Server-side rendering | Vercel static + canvas; SEO via meta tags |
| Real-time multiplayer | Single player only |
| "New Game / Continue" save dialog | No save states needed |
| OAuth / user accounts | No user data to store |
| Mobile-first redesign | Desktop primary; mobile gets D-pad accommodation only |
| Video posts / media upload | Not a content platform |

## Traceability

| Requirement | Phase | Status |
|-------------|-------|--------|
| FOUND-01 | Phase 1 — Infrastructure | Complete |
| FOUND-02 | Phase 1 — Infrastructure | Pending |
| FOUND-03 | Phase 1 — Infrastructure | Complete |
| WORLD-01 | Phase 2 — Overworld Map | Pending |
| WORLD-02 | Phase 2 — Overworld Map | Pending |
| WORLD-03 | Phase 2 — Overworld Map | Pending |
| WORLD-04 | Phase 2 — Overworld Map | Pending |
| WORLD-05 | Phase 2 — Overworld Map | Pending |
| WORLD-06 | Phase 2 — Overworld Map | Pending |
| WORLD-07 | Phase 2 — Overworld Map | Pending |
| WORLD-08 | Phase 2 — Overworld Map | Pending |
| CHAR-01 | Phase 2 — Overworld Map | Pending |
| CHAR-02 | Phase 2 — Overworld Map | Pending |
| CHAR-03 | Phase 2 — Overworld Map | Pending |
| INTER-01 | Phase 3 — Interaction + NPC System | Pending |
| INTER-02 | Phase 3 — Interaction + NPC System | Pending |
| INTER-03 | Phase 3 — Interaction + NPC System | Pending |
| INTER-04 | Phase 3 — Interaction + NPC System | Pending |
| INTER-05 | Phase 3 — Interaction + NPC System | Pending |
| NPC-01 | Phase 3 — Interaction + NPC System | Pending |
| NPC-02 | Phase 3 — Interaction + NPC System | Pending |
| NPC-03 | Phase 3 — Interaction + NPC System | Pending |
| NPC-04 | Phase 3 — Interaction + NPC System | Pending |
| NPC-05 | Phase 3 — Interaction + NPC System | Pending |
| ROOM-01 | Phase 4 — Andres's Room | Pending |
| ROOM-02 | Phase 4 — Andres's Room | Pending |
| ROOM-03 | Phase 4 — Andres's Room | Pending |
| ROOM-04 | Phase 4 — Andres's Room | Pending |
| ROOM-05 | Phase 4 — Andres's Room | Pending |
| ROOM-06 | Phase 4 — Andres's Room | Pending |
| ROOM-07 | Phase 4 — Andres's Room | Pending |
| ROOM-08 | Phase 4 — Andres's Room | Pending |
| ROOM-09 | Phase 4 — Andres's Room | Pending |
| ROOM-10 | Phase 4 — Andres's Room | Pending |
| ROOM-11 | Phase 4 — Andres's Room | Pending |
| ROOM-12 | Phase 4 — Andres's Room | Pending |
| ROOM-13 | Phase 4 — Andres's Room | Pending |
| THOV-01 | Phase 5 — Thoven HQ | Pending |
| THOV-02 | Phase 5 — Thoven HQ | Pending |
| THOV-03 | Phase 5 — Thoven HQ | Pending |
| THOV-04 | Phase 5 — Thoven HQ | Pending |
| THOV-05 | Phase 5 — Thoven HQ | Pending |
| THOV-06 | Phase 5 — Thoven HQ | Pending |
| THOV-07 | Phase 5 — Thoven HQ | Pending |
| THOV-08 | Phase 5 — Thoven HQ | Pending |
| CAFE-01 | Phase 6 — Starbucks Cafe + Engineering Lab | Pending |
| CAFE-02 | Phase 6 — Starbucks Cafe + Engineering Lab | Pending |
| CAFE-03 | Phase 6 — Starbucks Cafe + Engineering Lab | Pending |
| CAFE-04 | Phase 6 — Starbucks Cafe + Engineering Lab | Pending |
| CAFE-05 | Phase 6 — Starbucks Cafe + Engineering Lab | Pending |
| LAB-01 | Phase 6 — Starbucks Cafe + Engineering Lab | Pending |
| LAB-02 | Phase 6 — Starbucks Cafe + Engineering Lab | Pending |
| LAB-03 | Phase 6 — Starbucks Cafe + Engineering Lab | Pending |
| LAB-04 | Phase 6 — Starbucks Cafe + Engineering Lab | Pending |
| LAB-05 | Phase 6 — Starbucks Cafe + Engineering Lab | Pending |
| LAB-06 | Phase 6 — Starbucks Cafe + Engineering Lab | Pending |
| LAB-07 | Phase 6 — Starbucks Cafe + Engineering Lab | Pending |
| CONST-01 | Phase 7 — Hidden Areas + Under-Construction + Bulletin Board | Pending |
| CONST-02 | Phase 7 — Hidden Areas + Under-Construction + Bulletin Board | Pending |
| CONST-03 | Phase 7 — Hidden Areas + Under-Construction + Bulletin Board | Pending |
| CONST-04 | Phase 7 — Hidden Areas + Under-Construction + Bulletin Board | Pending |
| HIDE-01 | Phase 7 — Hidden Areas + Under-Construction + Bulletin Board | Pending |
| HIDE-02 | Phase 7 — Hidden Areas + Under-Construction + Bulletin Board | Pending |
| HIDE-03 | Phase 7 — Hidden Areas + Under-Construction + Bulletin Board | Pending |
| HIDE-04 | Phase 7 — Hidden Areas + Under-Construction + Bulletin Board | Pending |
| HIDE-05 | Phase 7 — Hidden Areas + Under-Construction + Bulletin Board | Pending |
| BULL-01 | Phase 7 — Hidden Areas + Under-Construction + Bulletin Board | Pending |
| BULL-02 | Phase 7 — Hidden Areas + Under-Construction + Bulletin Board | Pending |
| BULL-03 | Phase 7 — Hidden Areas + Under-Construction + Bulletin Board | Pending |
| BULL-04 | Phase 7 — Hidden Areas + Under-Construction + Bulletin Board | Pending |
| BULL-05 | Phase 7 — Hidden Areas + Under-Construction + Bulletin Board | Pending |
| LOAD-01 | Phase 8 — Loading Screen | Pending |
| LOAD-02 | Phase 8 — Loading Screen | Pending |
| LOAD-03 | Phase 8 — Loading Screen | Pending |
| POLI-01 | Phase 9 — Miami Art + Polish | Pending |
| POLI-02 | Phase 9 — Miami Art + Polish | Pending |
| POLI-03 | Phase 9 — Miami Art + Polish | Pending |
| POLI-04 | Phase 9 — Miami Art + Polish | Pending |
| POLI-05 | Phase 9 — Miami Art + Polish | Pending |

**Coverage:**
- v1 requirements: 70 total
- Mapped to phases: 70
- Unmapped: 0

---
*Requirements defined: 2026-03-08*
*Last updated: 2026-03-08 after roadmap creation*
