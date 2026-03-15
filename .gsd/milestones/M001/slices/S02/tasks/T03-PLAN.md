# T03: 02-overworld-map 03

**Slice:** S02 — **Milestone:** M001

## Description

Full-stack smoke test: verify the complete Phase 2 system works end-to-end in a browser. The map (Plan 02-01) and scene code (Plan 02-02) are built independently — this plan confirms they integrate correctly and the world is playable.

Purpose: Human verification is the only way to confirm pixel art looks right, movement feels like Pokemon, collision is accurate across the map, and the world reads as Miami.
Output: Phase 2 declared complete. Human confirms playability.

## Must-Haves

- [ ] "Player character spawns at south dock facing north on page load"
- [ ] "Arrow keys and WASD move the character one tile at a time in all 4 directions"
- [ ] "Walking animation plays during movement; idle standing frame shows when stopped"
- [ ] "Camera scrolls with the player; world edges clamp the camera"
- [ ] "Buildings, water, and palm trees stop movement (collision works)"
- [ ] "Map reads as Miami: palm trees on west/plaza, ocean on east, distinct dock entry from south"
- [ ] "All 6 zones are visually distinguishable: dock, main street, plaza, west side, beach strip, heights"
- [ ] "Under-construction buildings (Chalk Lab, VC Office) show scaffolding visuals"
