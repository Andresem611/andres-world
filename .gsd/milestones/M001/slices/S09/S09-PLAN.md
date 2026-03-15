# S09: Pre-Interior Architecture Foundations

**Goal:** Everything that must be true before the first interior can be built: scene transition contract, InteriorBaseScene, interactionMap scope verified, mobile gate implemented, tileset registry locked.
**Demo:** One complete transition test passes: player enters Thoven HQ stub → walks to exit tile → returns to overworld at correct position with correct facing direction. Mobile shows static landing page instead of Phaser canvas.

## Must-Haves

- InteriorBaseScene extends Phaser.Scene with tilemap load, Grid Engine init, exit detection, camera fade, player restore
- Complete transition test: enter → walk → exit → return to correct overworld position
- interactionMap confirmed per-scene (no global scope bugs)
- Mobile detection: static landing page instead of Phaser canvas
- TILE-REGISTRY.md documenting LimeZu tileset versions and GID ranges

## Tasks


## Files Likely Touched

