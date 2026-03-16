# M001: Andres World v1.0

**Vision:** A personal website built as a playable Pokemon Gen 1/2 pixel-art overworld game at andresmartinez.com. Visitors control a character and walk around "Andres World" — a Miami-themed, top-down tile-based map where every building is a project, section, or piece of Andres's life.

## Success Criteria

- Visitors can walk the full Miami-themed overworld map and talk to all 14 NPCs
- Every building entrance either loads an interior scene or shows an under-construction popup
- All 5 hidden areas are reachable via their correct paths
- Player character is a hoodie+backpack founder sprite with 4-directional walk animation
- The site loads with a Pokemon-style title card before entering the overworld
- 8-bit background music plays on a loop
- Mobile shows a graceful static landing page (no broken canvas)
- The site is live at andresmartinez.com with correct Open Graph meta tags

## Slices

- [x] **S01: Infrastructure** `risk:low` `depends:[]`
  > After this: Phaser 3 + Vite + TypeScript scaffold deployed to andresmartinez.com, pixel-perfect canvas rendering.
- [x] **S02: Overworld Map** `risk:medium` `depends:[S01]`
  > After this: Player spawns at south dock and can walk the full 50×40 Miami-themed map with collision.
- [x] **S03: Interaction + NPC System** `risk:medium` `depends:[S02]`
  > After this: All 14 NPCs visible and talkable, Pokemon-style dialog box, building entrance routing, John Collison patrols Main Street.
- [x] **S04: Art Foundation — Real Tilesets** `risk:medium` `depends:[S03]`
  > After this: Overworld renders real LimeZu 16x16 pixel-art tiles instead of placeholder colored blocks.
- [x] **S05: Map Visual Design** `risk:medium` `depends:[S04]`
  > After this: Buildings, palm trees, and scaffolding are visible pixel art — transparent-tile bug fixed.
- [x] **S06: Map Layout Design** `risk:medium` `depends:[S05]`
  > After this: All building footprints corrected, tall grass zones added, boardwalk/streets/Secret Beach walkable. Building coordinates locked for interior scenes.
- [x] **S07: Tiled Visual Map Design Pass** `risk:medium` `depends:[S06]`
  > After this: Flat placeholder blocks replaced with multi-tile building facades via automated script. Villas tileset added for Andres's House.
- [x] **S08: Character + NPC Sprites** `risk:medium` `depends:[S06]`
  > After this: Player has hoodie+backpack sprite with 4-dir walk animation. At least 5 NPCs are real pixel art. All dialogue in typed content layer.
- [x] **S09: Pre-Interior Architecture** `risk:high` `depends:[S08]`
  > After this: InteriorBaseScene bugs fixed, 4x zoom, mobile gate for touch devices, 16 tests verify transition contract.
- [x] **S10: Andres's Room** `risk:medium` `depends:[S09]`
  > After this: First complete interior — bed, PC, DJ booth, bookshelf interactions, wall decorations, Dad NPC, two dachshunds. 18 tests.
- [ ] **S11: Thoven HQ** `risk:medium` `depends:[S10]`
  > After this: Thoven HQ interior with metrics board, shipped corkboard, practice rooms, Keri/Michael Seibel/Brian Chesky NPCs.
- [ ] **S12: Starbucks Cafe + Engineering Lab** `risk:medium` `depends:[S11]`
  > After this: Essay reading system via HTML overlay + tools/experiments section. Paul Graham, Tobi, Patrick, Dario NPCs.
- [ ] **S13: Hidden Areas + Under-Construction + Bulletin Board** `risk:medium` `depends:[S12]`
  > After this: All 5 hidden areas accessible with correct content. Bulletin board with 7 pressable learning pins.
- [ ] **S14: Loading Screen** `risk:low` `depends:[S13]`
  > After this: Pokemon-style "ANDRES WORLD" title card with loading bar on page load.
- [ ] **S15: Miami Art + Polish** `risk:low` `depends:[S14]`
  > After this: 8-bit music, mobile graceful degradation, Open Graph meta tags. Ship-ready.
