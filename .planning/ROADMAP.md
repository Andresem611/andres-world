# Roadmap: Andres World

## Overview

Build a Pokemon Gen 1/2 pixel-art overworld personal website from the ground up. The journey starts with infrastructure and a deployable skeleton, then layers in the map, movement, interaction engine, and interiors one by one. Each phase delivers a coherent, playable increment — visitors can walk the world by Phase 2, talk to NPCs by Phase 3, and explore every building and hidden area by Phase 8. Phase 9 replaces placeholder art with Miami-specific assets and ships the launch-ready version.

## Phases

- [ ] **Phase 1: Infrastructure** - Phaser 3 + Vite + TypeScript + Grid Engine scaffold deployed to andresmartinez.com
- [ ] **Phase 2: Overworld Map** - Miami-themed tilemap with player character, grid movement, and collision
- [ ] **Phase 3: Interaction + NPC System** - Building interactions, sign dialogs, and all overworld NPCs
- [ ] **Phase 4: Andres's Room** - First complete interior with full object interactions and wandering sprites
- [ ] **Phase 5: Thoven HQ** - Second interior with metrics board, corkboard, practice rooms, and NPCs
- [ ] **Phase 6: Starbucks Cafe + Engineering Lab** - Essay reading system and tools/experiments section
- [ ] **Phase 7: Hidden Areas + Under-Construction + Bulletin Board** - Full world exploration complete
- [ ] **Phase 8: Loading Screen** - Pokemon-style title card and asset load progress
- [ ] **Phase 9: Miami Art + Polish** - Final art assets, music, mobile D-pad, and SEO

## Phase Details

### Phase 1: Infrastructure
**Goal**: The repo builds, runs locally, and is live at andresmartinez.com
**Depends on**: Nothing (first phase)
**Requirements**: FOUND-01, FOUND-02, FOUND-03
**Success Criteria** (what must be TRUE):
  1. `vite dev` starts locally with no errors and a browser window opens
  2. `vite build` produces a production build with no errors
  3. Pushing to main triggers Vercel deploy and the build is accessible at andresmartinez.com
  4. Canvas renders at 1x scale with no anti-aliasing blur on pixel edges
**Plans**: TBD

### Phase 2: Overworld Map
**Goal**: A visitor can drop into the world and walk the full Miami-themed map
**Depends on**: Phase 1
**Requirements**: WORLD-01, WORLD-02, WORLD-03, WORLD-04, WORLD-05, WORLD-06, WORLD-07, WORLD-08, CHAR-01, CHAR-02, CHAR-03
**Success Criteria** (what must be TRUE):
  1. Player character spawns at the south dock facing north and can be walked to every zone on the map using arrow keys and WASD
  2. The camera follows the character as they move; the world scrolls naturally
  3. Walking into a building, water tile, tree, or sign stops movement (collision works)
  4. The map reads as Miami: palm trees (not oaks), ocean on the east edge, Art Deco pastel building shells, distinct dock/main street/plaza/beach/heights zones
  5. Character sprite is a hoodie-and-backpack founder figure (not Red/Ash) with 4-directional walk animation and idle state
**Plans**: TBD

### Phase 3: Interaction + NPC System
**Goal**: Pressing Space or E near anything interactive produces the right response, and all overworld NPCs are placed and talkable
**Depends on**: Phase 2
**Requirements**: INTER-01, INTER-02, INTER-03, INTER-04, INTER-05, NPC-01, NPC-02, NPC-03, NPC-04, NPC-05
**Success Criteria** (what must be TRUE):
  1. Pressing Space or E near any building entrance, sign, or NPC triggers an interaction (no dead zones)
  2. Interacting with a finished building transitions to its interior map
  3. Interacting with an under-construction building shows the correct popup instead of loading an interior
  4. Sign text and NPC dialogue appear in a Pokemon-style text box at the bottom of the screen, advance with Space/E, and support multi-line text
  5. All 14 NPCs from the roster are visible in their correct map locations; John Collison patrols Main Street
**Plans**: TBD

### Phase 4: Andres's Room
**Goal**: The first complete interior is explorable — every object in the room tells something real about Andres
**Depends on**: Phase 3
**Requirements**: ROOM-01, ROOM-02, ROOM-03, ROOM-04, ROOM-05, ROOM-06, ROOM-07, ROOM-08, ROOM-09, ROOM-10, ROOM-11, ROOM-12, ROOM-13
**Success Criteria** (what must be TRUE):
  1. Walking into the house entrance loads the room interior; walking to the exit returns to the overworld at the house entrance
  2. Every interactive object (bed, PC desk, DJ booth, bookshelf) responds when pressed with its correct dialogue or popup
  3. Decorative wall items (Arsenal jersey, Venezuelan and Dominican flags, Michigan pennant, Doxxin poster, Miami window) are visible and correctly positioned
  4. Dad NPC wanders the room and speaks when approached; both dachshund sprites wander independently and say "Woof." when pressed
**Plans**: TBD

### Phase 5: Thoven HQ
**Goal**: Thoven HQ interior is complete — visitors understand what Thoven is, see live-ish metrics, and meet the team
**Depends on**: Phase 4
**Requirements**: THOV-01, THOV-02, THOV-03, THOV-04, THOV-05, THOV-06, THOV-07, THOV-08
**Success Criteria** (what must be TRUE):
  1. Walking into Thoven HQ entrance loads the interior map
  2. Keri NPC is at the front desk with sincere Thoven dialogue; Michael Seibel and Brian Chesky are in their correct spots with their lines
  3. The metrics board on the center wall shows teacher, student, and user counts (manually updateable)
  4. The shipped corkboard shows last feature shipped, current focus, and what's under construction
  5. Practice room doors (Piano, Guitar, Voice, Violin) are visible and render as under-construction; PC in corner links to the Thoven app
**Plans**: TBD

### Phase 6: Starbucks Cafe + Engineering Lab
**Goal**: The essay section and tools/experiments section are both live and explorable
**Depends on**: Phase 5
**Requirements**: CAFE-01, CAFE-02, CAFE-03, CAFE-04, CAFE-05, LAB-01, LAB-02, LAB-03, LAB-04, LAB-05, LAB-06, LAB-07
**Success Criteria** (what must be TRUE):
  1. Walking into Starbucks Cafe loads the cafe interior; Paul Graham and barista NPCs are in place with their dialogue
  2. At least 2 books on the cafe tables are interactable — pressing A opens readable essay content
  3. Walking into the Engineering Lab loads its interior (accessible via north/hidden path)
  4. Workbench monitors are interactable and open a popup or redirect to a live demo/tool
  5. The stack wall has posters for all 8 tools; Tobi, Patrick, and Dario NPCs are placed with their quotes; the rubber duck easter egg responds with "I just listen."
**Plans**: TBD

### Phase 7: Hidden Areas + Under-Construction + Bulletin Board
**Goal**: The full world is explorable — every hidden area is accessible, every under-construction building is correctly dressed, and the bulletin board is live
**Depends on**: Phase 6
**Requirements**: CONST-01, CONST-02, CONST-03, CONST-04, HIDE-01, HIDE-02, HIDE-03, HIDE-04, HIDE-05, BULL-01, BULL-02, BULL-03, BULL-04, BULL-05
**Success Criteria** (what must be TRUE):
  1. All 5 hidden areas are reachable via their correct paths: Secret Beach (south palm path), Music Room (behind house), Idea Graveyard (southwest overgrown path), Lookout Hill (stairs top-center), Hidden NPC (north tip)
  2. Each hidden area has its correct content: Secret Beach has hammock + Vinod Khosla NPC; Music Room plays an 8-bit track on entry; Idea Graveyard has tombstones + Ben Horowitz NPC; Lookout Hill has skyline sign + Dalton Caldwell NPC; Hidden NPC delivers sincere mentor dialogue
  3. Chalk Lab, VC Office, and any other under-construction buildings render with scaffolding/construction visuals and respond correctly when interacted with
  4. The bulletin board is interactable with its 7 pressable learning pins; the adjacent PC links to a reading list; Dalton Caldwell NPC is present on the nearby bench
**Plans**: TBD

### Phase 8: Loading Screen
**Goal**: The site has a proper Pokemon-style title card that loads before the game starts
**Depends on**: Phase 7
**Requirements**: LOAD-01, LOAD-02, LOAD-03
**Success Criteria** (what must be TRUE):
  1. On page load, a Pokemon-style title card reading "ANDRES WORLD" with the character sprite appears before the game
  2. A loading bar is visible and tracks actual asset load progress
  3. Pressing any key (or auto-advance on completion) transitions from the title card into the overworld
**Plans**: TBD

### Phase 9: Miami Art + Polish
**Goal**: The world looks like Miami, sounds like an 8-bit game, and is ready to ship publicly
**Depends on**: Phase 8
**Requirements**: POLI-01, POLI-02, POLI-03, POLI-04, POLI-05
**Success Criteria** (what must be TRUE):
  1. 8-bit background music plays on a loop in the overworld
  2. Music Room plays a distinct 8-bit track when the interior loads
  3. On a touch device, a pixel D-pad overlay appears in the corner and controls character movement
  4. The page has correct Open Graph meta tags (title, description, og:image) visible when the URL is shared
  5. The page has descriptive static HTML content below the canvas that search crawlers can index
**Plans**: TBD

## Progress

**Execution Order:** 1 → 2 → 3 → 4 → 5 → 6 → 7 → 8 → 9

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Infrastructure | 0/TBD | Not started | - |
| 2. Overworld Map | 0/TBD | Not started | - |
| 3. Interaction + NPC System | 0/TBD | Not started | - |
| 4. Andres's Room | 0/TBD | Not started | - |
| 5. Thoven HQ | 0/TBD | Not started | - |
| 6. Starbucks Cafe + Engineering Lab | 0/TBD | Not started | - |
| 7. Hidden Areas + Under-Construction + Bulletin Board | 0/TBD | Not started | - |
| 8. Loading Screen | 0/TBD | Not started | - |
| 9. Miami Art + Polish | 0/TBD | Not started | - |
