# S04: Building Interactions + Interior Framework

**Goal:** Player can enter Andres's Room (first interior). Camera fades, interior React view loads with its own tile grid, objects, and NPCs. Player can exit back to overworld at correct position. Under-construction buildings show dialog popup. Signs are interactable.

**Demo:** Walk to Andres's House, press Space — fade to interior. Walk around the room, interact with bed, PC, bookshelf. Walk to exit — fade back to overworld at house entrance.

## Must-Haves

- Interaction map for overworld signs, building entrances, under-construction
- Scene transition system (overworld ↔ interior)
- Interior tile renderer (reuses TileRenderer with interior MapData)
- Andres's Room fully interactive (bed, PC, DJ, bookshelf, wall decorations, Dad, 2 dogs)
- Under-construction popup for Chalk Lab and VC Office
- Welcome sign interactable at dock

## Verification

- `tests/interior.test.ts` — interior map structure, interaction routing, scene transitions
- Browser: enter Andres's Room, interact with objects, exit back to overworld

## Tasks

- [ ] **T01: Interaction map + sign/building routing + under-construction** `est:20m`
- [ ] **T02: Interior framework + Andres's Room** `est:40m`

## Files Likely Touched

- `src/maps/interactions.ts` — interaction map for overworld
- `src/maps/interiors/andres-room.ts` — interior map data
- `src/components/InteriorView.tsx` — interior rendering
- `src/hooks/useSceneTransition.ts` — scene transition state
- `src/components/GameContainer.tsx` — extend interaction system
- `tests/interior.test.ts`
