# Architecture Decision Record — Andres World
Generated: 2026-03-10
Source: Gemini Deep Research + 3-Agent Debate (Conservatist / Aggressive Architect / Risk Assessor)

---

## Verdict on What's Already Built

| Component | Assessment |
|-----------|------------|
| Phaser 3.90 + Grid Engine + Vite + TypeScript | Solid. TypeScript will save debugging hours as scene count grows. |
| Custom DialogBox | Smart. Keep it — just separate the data feeding it from logic files. |
| Interaction system (Space/E → facing tile → interactionMap) | Works. **Hidden risk:** interactionMap scope must be per-scene, not module-scoped. Verify before Phase 4. |
| generate-map.ts programmatic generation | Correct for the overworld. Must never be extended to interiors. Constraint now locked in file. |
| John Collison patrol | Hardcoded to overworld tile coordinates. Cannot be reused naively for interior NPCs. |
| GID constants in generate-map.ts | Hardcoded integers with no symbolic registry. One LimeZu version bump silently corrupts the map. **Pin now.** |

---

## Decision 1: Interior Scene Architecture
**Decision:** Option C — InteriorBaseScene base class with one subclass per interior.

**Pattern:**
```
InteriorBaseScene extends Phaser.Scene
  constructor: { mapKey, spawnTile, exitTile, returnTo }
  handles: tilemap load, Grid Engine init, exit detection + fade,
           interaction dispatch, NPC registration

AndresRoomScene extends InteriorBaseScene
ThovenHQScene extends InteriorBaseScene
(one subclass per interior)
  overrides create() with super.create() + room-specific init
```

**ALL interiors authored in Tiled GUI.** generate-map.ts = overworld only, permanently.

**Critical pre-Phase 4 gate:** Write one complete transition test — enter interior stub, walk to exit, return to overworld at correct position with correct facing direction. Grid Engine teardown + reinit on scene transition is a sharp edge. Fix it once before 8 interiors depend on it.

**Locked: YES**

---

## Decision 2: Dialogue + Content System
**Decision:** DialogEntry TypeScript interface now. YAML pipeline deferred until Phase 6.

**Collapse threshold is Phase 4, not Phase 7.** Thoven HQ live metrics board and conditional NPC dialogue already break string arrays.

**Migration path:**
1. Before Phase 4: Define `DialogEntry` in `src/types/dialog.ts`:
   ```ts
   interface DialogEntry {
     speaker?: string
     lines: string[]
     condition?: keyof GameState
     link?: { label: string; url: string }
     onComplete?: string
   }
   ```
2. Extract all NPC string arrays from GameScene.ts → `src/content/dialogue.ts` organized by zone.
3. Phase 4+: Thoven metrics use `onComplete` to trigger data fetch. Conditional NPCs use `condition` field.
4. Phase 6+ (when volume demands): Migrate to YAML-to-JSON Vite pipeline.

**Locked: YES**

---

## Decision 3: Sprite Sourcing
**Decision:** Commission protagonist immediately. NPCs via base mannequin delivered as individual pre-composited sheets.

**Protagonist spec:**
- 32x32 pixels per frame
- 4-directional walk (Down / Up / Left / Right)
- 4 frames per direction: Idle / Step-Right / Idle / Step-Left = 16 frames total
- Single horizontal PNG strip, transparent background
- Max 15 colors + 1 transparent key
- No anti-aliasing on edges (no haloing)
- Details: hoodie, laptop backpack from all directions, coffee cup (idle frames)
- Source: X/Twitter #PixelArt #GameDev or r/gameDevClassifieds. Do NOT use Fiverr.
- Budget: $50–80

**NPC sourcing:** One base mannequin from same artist. Clothing/hair overlays commissioned per character. Artist delivers fully composited individual sprite sheets (not runtime layers). Cost: ~$10–15 per NPC vs $30–50 per standalone. Total NPC budget: ~$150–200 for all 14.

**Start timing:** Commission opens NOW, before Phase 3.3 planning. Lead time 2–4 weeks.
**Public gate:** Splash screen env variable on andresmartinez.com stays active until real sprite is ready.

**Locked: YES**

---

## Decision 4: Mobile Strategy
**Decision:** Graceful degradation (Option A). Unanimous across all three debate agents.

**What mobile gets:**
- Detect mobile on load (CSS media query or JS)
- Static pixel-art landing: ANDRES WORLD title, character sprite (static), one-liner, links to Twitter/LinkedIn/GitHub
- No Phaser canvas instantiated on mobile
- CTA: "Built for desktop. Visit on desktop for the full experience."

**When to implement:** Phase 3.4 (before Phase 4). It is a ~10-line conditional in index.html.

**Virtual D-pad:** Do not build. Ever. Building 8 interiors optimized for 800×600 then retrofitting touch targets + camera zoom across all of them in Phase 8 is the real risk.

**Locked: YES**

---

## Decision 5: Tilesets
**Decision:** LimeZu stays on overworld. Kokoro Reflections + Seliel the Shaper for ALL interior scenes.

- Overworld programmatic generation has hardcoded GID constants. A LimeZu→Kokoro swap there means auditing TypeScript constants, re-running generator, re-validating all tiles. Not worth it on a working map.
- All interiors are authored fresh in Tiled — zero GID dependencies. Use Kokoro Reflections Art Deco for built interiors (Thoven HQ, Andres's Room, Engineering Lab, VC Office). Use Seliel Tropical Shores for beach-adjacent rooms (Secret Beach).

**GID risk mitigation:**
- Pin LimeZu to current version in asset references.
- Create TILE-REGISTRY.md documenting tileset version + GID range per tileset.
- Never auto-update tilesets.

**Locked: YES**

---

## Decision 6: Animated Tiles
**Decision:** Use Phaser 3 native animated tile support (Phaser 3.90 has it). No plugin needed.

The phaser-animated-tiles plugin was needed for Phaser <3.60. Phaser 3.90 handles Tiled tile animations natively. Author animation frames in Tiled, export JSON — Phaser parses it automatically.

**Locked: YES**

---

## Top 5 Things To Do Before Phase 4

1. **Post sprite commission** — Brief is in Decision 3. Post today on X/Twitter + r/gameDevClassifieds. Add splash screen gate to andresmartinez.com.
2. **Extract dialogue + define DialogEntry** — Move string arrays to `src/content/dialogue.ts`, define interface in `src/types/dialog.ts`. Prerequisite for Phase 4.
3. **Verify interactionMap scope + build transition test** — Confirm interactionMap is per-scene. Write InteriorBaseScene + one complete enter→exit→return cycle. This gates all interior development.
4. **Pin tileset versions + create TILE-REGISTRY.md** — Document current LimeZu versions and GID ranges.
5. **generate-map.ts comment** ✅ — Done (2026-03-10).

---

## Things The Research Got Wrong

1. **"LimeZu must be replaced across the board"** — Wrong cost model. Overworld map is programmatically generated with hardcoded GIDs. New tilesets for new interior maps only.
2. **"Dialogue collapse in Phase 7"** — Off by three phases. Thoven HQ (Phase 5) breaks it.
3. **"YAML pipeline is the right migration now"** — Right destination, wrong timing. DialogEntry interface gives 90% of the win in 2 hours.
4. **"Grid Engine scene transitions are straightforward"** — Teardown + reinit is a documented sharp edge. Build the transition test first.
5. **"phaser-animated-tiles plugin"** — Outdated advice. Phaser 3.90 handles this natively.

---

## Open Questions Needing Andres's Input

**Q1: Tileset migration on overworld — deferred or never?**
- Option A (recommended): Keep LimeZu on overworld permanently, use Kokoro/Seliel for interiors only
- Option B: Phase 9 tileset migration pass rebuilds overworld for visual unity

**Q2: Bulletin board — external fetch or static content?**
- Option A: Host bulletin.json on GitHub Gist/S3, fetch at runtime
- Option B (recommended default): Content lives in `src/content/dialogue.ts`, updates via Vercel deploy

**Q3: Splash screen gate confirmation**
- Splash screen stays active on andresmartinez.com until real protagonist sprite is ready, regardless of which interior ships first. Confirm: yes.
