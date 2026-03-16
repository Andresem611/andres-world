# S10: Andres's Room

**Goal:** First complete interior — player enters Andres's House, explores room with furniture interactions, talks to Dad NPC and dachshunds, exits back to overworld.
**Demo:** Enter house → walk to bed (interact) → walk to PC (interact, shows links) → talk to Dad → exit.

## Must-Haves

- Room map 10×8 tiles with proper floor/walls/exit
- Bed, PC desk, DJ booth, bookshelf as interactable objects
- Wall items rendered: jersey, flags, pennant, poster, window
- Dad NPC with dialogue
- Two dachshund NPCs with "Woof." dialogue  
- PC desk popup with social links (Twitter/X, LinkedIn, GitHub, email)
- All ROOM-01 through ROOM-13 requirements addressed

## Tasks

- [ ] **T01: Build room map + furniture layout** `est:15min`
  - Generate andres-room.json (10×8) with floor, walls, furniture layer, exits, collision. Script-generated.
- [ ] **T02: Room interactions + NPCs** `est:15min`
  - AndresRoom.ts: register furniture interactions via InteriorBaseScene pattern. Add Dad + dachshund NPCs. PC desk popup with links.
- [ ] **T03: Verify + test** `est:5min`
  - Tests for room requirements. Build clean. Visual verify.

## Files Likely Touched

- `public/assets/maps/andres-room.json`
- `src/game/scenes/AndresRoom.ts`
- `src/content/dialogue.ts`
- `tests/andres-room.test.ts`
