# Phase 3.4: Character + NPC Sprites - Research

**Researched:** 2026-03-14
**Domain:** AI pixel art sprite generation, Phaser 3 spritesheet integration, dialogue extraction refactoring
**Confidence:** MEDIUM

## Summary

Phase 3.4 has three distinct workstreams: (1) replacing the placeholder player sprite with a real 32x32 4-directional walk cycle character, (2) replacing at least 5 NPC colored-box placeholders with real pixel art sprites, and (3) extracting all NPC dialogue strings from `npcs.ts` into a typed content layer (`src/content/dialogue.ts` + `src/types/dialog.ts`).

The GATE UPDATE changes the sprite sourcing approach from human commission ($50-80) to AI generation via PixelLab or Retro Diffusion. PixelLab is the stronger choice -- it supports 4-directional and 8-directional character generation, outputs 16 frames for 32x32 sprites per request, and integrates with Aseprite for post-generation editing. Retro Diffusion's `four_angle_walking` style is locked to 48x48, which would require downscaling or cropping to hit the 32x32 target.

The dialogue extraction is pure code refactoring with zero runtime risk -- the `dialog` field already exists on every NPC config entry as `string[]`. The work is moving those arrays into a separate file organized by zone and defining a `DialogEntry` interface that adds `speaker`, `condition`, `link`, and `onComplete` fields for future phases.

**Primary recommendation:** Use PixelLab ($9/mo tier) to generate the protagonist spritesheet and 5+ NPC variants. Export as PNG spritesheets, post-process in Aseprite to match the PIPOYA row order (Down/Left/Right/Up, 3 frames per direction). Do the dialogue extraction as a separate code-only plan with no asset dependency.

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-----------------|
| CHAR-04 | Player character shows hoodie + backpack sprite with 4-directional walk animation | PixelLab generates 32x32 4-dir walk cycles; spritesheet must match existing PIPOYA layout (96x128px, 3 cols x 4 rows) |
| CHAR-05 | At least 5 NPC sprites are real pixel art (not colored-box placeholders) | PixelLab character creator can generate consistent NPC variants; LimeZu Modern Interiors also includes character sprites as fallback |
| NPC-06 | All NPC string arrays extracted into src/content/dialogue.ts with DialogEntry interface in src/types/dialog.ts | Pure refactoring -- ADR Decision 2 defines the exact DialogEntry interface and migration path |
</phase_requirements>

## Standard Stack

### Core (Already in project)
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| Phaser 3 | ^3.90.0 | Game framework | Already installed, handles spritesheet loading |
| Grid Engine | ^2.48.0 | Grid-based movement | Already installed, walkingAnimationMapping drives animation |
| Vitest | ^4.0.18 | Test framework | Already installed |

### Supporting (New for this phase)
| Tool | Purpose | When to Use |
|------|---------|-------------|
| PixelLab | AI pixel art sprite generation | Generate protagonist + NPC spritesheets |
| Aseprite | Pixel art editor for post-processing | Rearrange frames to PIPOYA row order, touch up AI output |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| PixelLab | Retro Diffusion | RD's four_angle_walking is locked to 48x48; would need downscaling to 32x32 which degrades pixel art |
| PixelLab | LimeZu Modern Interiors character sprites | LimeZu characters are 16x32 (not square 32x32); different proportions than current placeholder; still a valid fallback |
| PixelLab | Human commission | Original ADR plan ($50-80); overridden by GATE UPDATE to use AI generation |

## Architecture Patterns

### Current Spritesheet Format (CRITICAL -- must match)
```
character-placeholder.png: 96x128px
  - 3 columns (frames per direction) x 4 rows (directions)
  - Frame size: 32x32px
  - Row 0: Down (frames 0, 1, 2)
  - Row 1: Left (frames 3, 4, 5)
  - Row 2: Right (frames 6, 7, 8)
  - Row 3: Up (frames 9, 10, 11)
  - This is the PIPOYA row order convention
```

### walkingAnimationMapping = 0
Grid Engine's `walkingAnimationMapping: 0` means "use character at row offset 0" in the spritesheet. With 3 frames per direction and 4 directions:
- Frame 0-2: walk down (idle, step-right, step-left)
- Frame 3-5: walk left
- Frame 6-8: walk right
- Frame 9-11: walk up

**The new sprite PNG MUST be exactly this layout.** Any AI-generated spritesheet will likely need post-processing in Aseprite to match this frame order.

### NPC Sprite Loading Pattern (Current)
```typescript
// Boot.ts: NPCs loaded as single images (not spritesheets)
this.load.image(`npc-${id}`, `assets/sprites/npc-${id}.png`);

// Overworld.ts: NPCs have NO walkingAnimationMapping
// They are static single-frame sprites
```
NPCs currently use `this.load.image()` (single frame), not `this.load.spritesheet()`. Replacing NPC placeholders means dropping in new 32x32 PNGs at the same file paths. No code changes needed for static NPCs -- just replace the PNG files.

For John Collison (patrol NPC), upgrading to an animated spritesheet would require changing from `this.load.image()` to `this.load.spritesheet()` and adding `walkingAnimationMapping`. This is V2 scope per REQUIREMENTS.md (V2-09: "NPC animation (walking cycles for patrol NPCs)"). For this phase, John gets a static sprite like everyone else.

### Dialogue Extraction Pattern
```
BEFORE (current):
  src/game/config/npcs.ts
    - NpcDefinition has dialog: string[]
    - Each NPC entry has inline dialog strings

AFTER (target):
  src/types/dialog.ts
    - DialogEntry interface (from ADR Decision 2)
  src/content/dialogue.ts
    - All dialogue organized by zone
    - Keyed by NPC id
  src/game/config/npcs.ts
    - dialog field removed or references dialogue.ts
  src/game/scenes/Overworld.ts
    - interactionMap reads from dialogue.ts instead of npc.dialog
```

### Recommended File Structure
```
src/
  types/
    dialog.ts          # DialogEntry interface
    global.d.ts        # (existing)
  content/
    dialogue.ts        # All NPC dialogue, organized by zone
  game/
    config/
      npcs.ts          # NPC positions + spriteKeys (dialog removed)
    scenes/
      Boot.ts          # Sprite loading (may change image->spritesheet for player)
      Overworld.ts     # Reads dialogue from content layer
```

### DialogEntry Interface (from ADR Decision 2)
```typescript
// src/types/dialog.ts
export interface DialogEntry {
  speaker?: string;
  lines: string[];
  condition?: keyof GameState;  // for future conditional dialogue
  link?: { label: string; url: string };  // for future link interactions
  onComplete?: string;  // for future post-dialog triggers
}
```

### Anti-Patterns to Avoid
- **Generating 48x48 sprites and downscaling to 32x32:** Destroys pixel art crispness. Generate at target resolution.
- **Changing walkingAnimationMapping value:** It must stay 0. The spritesheet layout must conform to the engine, not vice versa.
- **Making NPC sprites animated spritesheets in this phase:** V2 scope. Keep them as single-frame images.
- **Coupling dialogue extraction to sprite replacement:** These are independent workstreams. Plan them as separate plans.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Pixel art character sprites | Draw from scratch in Aseprite | PixelLab AI generation + Aseprite touch-up | Speed: 16 frames generated per request vs hours of manual pixel art |
| Spritesheet frame reordering | Manual copy-paste of frames | Aseprite layer/frame reorder tools | Aseprite handles frame indices natively, exports to exact grid layout |
| NPC visual consistency | Generate each NPC independently | PixelLab's character creator with style locking | Consistent palette and proportions across all NPCs |

## Common Pitfalls

### Pitfall 1: Wrong Spritesheet Row Order
**What goes wrong:** AI-generated spritesheets often use Left/Down/Right/Up or other orderings. Grid Engine with walkingAnimationMapping:0 expects PIPOYA order: Down/Left/Right/Up.
**Why it happens:** No standard row order across sprite generators.
**How to avoid:** After generation, open in Aseprite, verify row order, reorder if needed before saving to `assets/sprites/`.
**Warning signs:** Character walks left when pressing down, or animation frames are scrambled.

### Pitfall 2: Frame Count Mismatch
**What goes wrong:** PixelLab outputs 16 frames (4 frames x 4 directions) but the current spritesheet uses 12 frames (3 frames x 4 directions).
**Why it happens:** PixelLab's documented output for 32x32 is 16 frames. Current placeholder has 3 frames per direction.
**How to avoid:** Either (a) use 4 frames per direction and update the frameWidth/frameHeight math -- Grid Engine handles both 3 and 4 frames per direction with walkingAnimationMapping, OR (b) trim to 3 frames per direction in Aseprite. Option (a) is better -- 4 frames gives smoother walk animation (idle/step-right/idle/step-left).
**Warning signs:** Spritesheet PNG dimensions don't match `{ frameWidth: 32, frameHeight: 32 }` grid evenly.

### Pitfall 3: Transparent Background Issues
**What goes wrong:** AI-generated sprites may have near-transparent artifacts or anti-aliased edges that create halos on the pixel art canvas.
**How to avoid:** In Aseprite, flatten to indexed color mode (max 15 colors + transparent), remove any semi-transparent pixels. The ADR spec says: "Max 15 colors + 1 transparent key. No anti-aliasing on edges."

### Pitfall 4: NPC Sprite Size Inconsistency
**What goes wrong:** Some AI-generated NPCs are slightly different sizes, breaking visual consistency.
**How to avoid:** Generate all NPC sprites in the same session/style. All NPCs must be 32x32 single-frame PNGs with transparent background.

### Pitfall 5: Dialogue Extraction Breaking interactionMap
**What goes wrong:** After extracting dialogue, the `interactionMap.set()` call in Overworld.ts still references `npc.dialog` which no longer exists on the NPC config.
**How to avoid:** Update the interactionMap registration loop to read from `dialogue.ts` import instead of `npc.dialog`.

## Code Examples

### Current Player Sprite Loading (Boot.ts)
```typescript
// Source: src/game/scenes/Boot.ts line 31-34
this.load.spritesheet("player", "assets/sprites/character-placeholder.png", {
  frameWidth: 32,
  frameHeight: 32,
});
```

### Updated Player Sprite Loading (4 frames per direction)
```typescript
// If AI generates 4 frames per direction (128x128px sheet: 4 cols x 4 rows)
this.load.spritesheet("player", "assets/sprites/player.png", {
  frameWidth: 32,
  frameHeight: 32,
});
// walkingAnimationMapping: 0 still works -- Grid Engine auto-detects
// 3 or 4 frames per direction based on spritesheet width
```

### DialogEntry Interface (from ADR Decision 2)
```typescript
// src/types/dialog.ts
export interface DialogEntry {
  speaker?: string;
  lines: string[];
  condition?: keyof GameState;
  link?: { label: string; url: string };
  onComplete?: string;
}

// GameState placeholder for future use
export interface GameState {
  // populated in Phase 4+ as conditional dialogue is added
  [key: string]: boolean;
}
```

### Dialogue Content File
```typescript
// src/content/dialogue.ts
import { DialogEntry } from "../types/dialog";

// Organized by zone for future zone-based loading
export const DIALOGUE: Record<string, DialogEntry> = {
  // === MAIN STREET ===
  "marc-andreessen": {
    speaker: "Marc Andreessen",
    lines: ["Software is eating the world."],
  },
  "john-collison": {
    speaker: "John Collison",
    lines: ["Growth solves most problems."],
  },
  // ... remaining NPCs

  // === SIGNS ===
  "welcome-sign": {
    lines: ["Welcome to Andres World.", "Population: always building."],
  },

  // === UNDER CONSTRUCTION ===
  "under-construction-default": {
    lines: ["Builder still hammering away... check back soon."],
  },
};
```

### Updated NPC Config (dialog removed)
```typescript
// src/game/config/npcs.ts -- after extraction
export interface NpcDefinition {
  id: string;
  name: string;
  spriteKey: string;
  dialogId: string;  // references key in DIALOGUE map
  startPosition: { x: number; y: number };
  facingDirection?: Direction;
  patrol?: boolean;
}
```

### Updated interactionMap Registration
```typescript
// src/game/scenes/Overworld.ts -- after extraction
import { DIALOGUE } from "../../content/dialogue";

// In create():
for (const npc of NPC_CONFIG) {
  const entry = DIALOGUE[npc.id];
  this.interactionMap.set(`${npc.startPosition.x},${npc.startPosition.y}`, {
    type: "npc",
    id: npc.id,
    dialog: entry?.lines ?? ["..."],
  });
}
```

## AI Sprite Generation: PixelLab Workflow

### Recommended Approach
1. Sign up for PixelLab ($9/mo Tier 1)
2. Use the Character Creator feature for protagonist:
   - Prompt: "top-down RPG character, hoodie, laptop backpack, 32x32, pixel art, 4-directional walk cycle"
   - Request 4-direction rotation
   - Download the spritesheet PNG
3. Open in Aseprite:
   - Verify frame order matches PIPOYA: Down/Left/Right/Up
   - Reorder rows if needed
   - Flatten to indexed color (15 colors + transparent)
   - Export as `player.png` (replacing `character-placeholder.png`)
4. For NPCs:
   - Use same session/style for consistency
   - Generate single static frames (front-facing) for each NPC
   - Export as 32x32 PNGs: `npc-marc-andreessen.png`, etc.
   - Replace existing placeholder files in `public/assets/sprites/`

### PixelLab Output Expectations (MEDIUM confidence)
- 32x32 sprites: 16 frames per generation (4 frames x 4 directions)
- Output is PNG with transparency
- Row order may NOT match PIPOYA -- post-processing likely needed
- Single-frame NPC generation supported via static character creation

### Retro Diffusion as Backup
- `four_angle_walking` style outputs 48x48 (not 32x32)
- Would need to either: accept 48x48 and update frameWidth/frameHeight, or downscale (degrades quality)
- Less suitable than PixelLab for this specific use case
- 50 free credits on signup for testing

### LimeZu Modern Interiors as Interim Fallback
- Includes character generator with 100+ outfits, 200 hairstyles
- Characters are 16x32 proportions (not 32x32 square) -- different from current placeholder
- Available in 16x16, 32x32, 48x48 tile sizes
- Could work as interim if AI generation quality is unsatisfactory
- Already purchased (part of existing LimeZu asset collection)
- Price: included with Modern Interiors pack ($2.50-$5)

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Manual pixel art commission | AI generation (PixelLab/RetroDiffusion) | 2024-2025 | Minutes per sprite vs days of artist turnaround |
| Inline dialog strings | Typed content layer (DialogEntry) | ADR Decision 2 (2026-03-10) | Prerequisite for conditional dialogue in Phase 4+ |
| Commission human artist ($50-80) | AI sprite generation | Phase 3.4 GATE UPDATE | No wait time, iterate faster |

## Open Questions

1. **PixelLab output row order**
   - What we know: PixelLab generates 4-direction walk cycles as spritesheets
   - What's unclear: Exact row order of the output (PIPOYA or something else?)
   - Recommendation: Generate one test sprite, inspect in Aseprite, document the row order. Budget 30 min for this.

2. **3 frames vs 4 frames per direction**
   - What we know: Current placeholder uses 3 frames/direction (96x128px). PixelLab likely outputs 4 frames/direction (128x128px).
   - What's unclear: Does Grid Engine's walkingAnimationMapping:0 auto-adapt to either 3 or 4 frames?
   - Recommendation: Test with a 4-frame sheet first. If Grid Engine handles it, use 4 frames (smoother animation). If not, trim to 3 in Aseprite.

3. **Which 5 NPCs to prioritize for real sprites?**
   - What we know: 14 total NPCs on overworld. Need at least 5 with real sprites.
   - Recommendation: Prioritize the most visible/interacted NPCs: Paul Graham, Marc Andreessen, Michael Seibel, Keri, Dad. These are all near main paths.

4. **SPRITE-SOURCES.md format**
   - What we know: Success criteria requires documenting all sprite sources and licenses
   - Recommendation: Simple markdown table: sprite filename | source | license | date generated

## Validation Architecture

### Test Framework
| Property | Value |
|----------|-------|
| Framework | Vitest ^4.0.18 |
| Config file | vitest.config.ts |
| Quick run command | `npx vitest run` |
| Full suite command | `npx vitest run` |

### Phase Requirements to Test Map
| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| CHAR-04 | Player spritesheet is 32x32 frames, 4 directions | unit (file dimensions check) | `npx vitest run tests/sprite-format.test.ts -t "player spritesheet"` | Wave 0 |
| CHAR-05 | At least 5 NPC sprites are non-placeholder PNGs (>200 bytes) | unit (file size check) | `npx vitest run tests/sprite-format.test.ts -t "NPC sprites"` | Wave 0 |
| NPC-06 | DialogEntry interface exists, DIALOGUE map has entries for all NPCs, npcs.ts dialog field removed or delegated | unit | `npx vitest run tests/dialogue-extraction.test.ts` | Wave 0 |

### Sampling Rate
- **Per task commit:** `npx vitest run`
- **Per wave merge:** `npx vitest run`
- **Phase gate:** Full suite green before `/gsd:verify-work`

### Wave 0 Gaps
- [ ] `tests/sprite-format.test.ts` -- covers CHAR-04, CHAR-05 (file existence + size checks)
- [ ] `tests/dialogue-extraction.test.ts` -- covers NPC-06 (DialogEntry type check, DIALOGUE keys match NPC_CONFIG ids)
- [ ] Update `tests/npc-config.test.ts` -- adjust for dialog field removal (dialogId replaces dialog)

## Sources

### Primary (HIGH confidence)
- Source code inspection: Boot.ts, Overworld.ts, npcs.ts, DialogBox.ts -- current spritesheet format and loading patterns
- ARCHITECTURE-DECISIONS.md Decision 2 -- DialogEntry interface definition
- ARCHITECTURE-DECISIONS.md Decision 3 -- Original sprite commission spec (now superseded by AI generation gate)
- Boot.ts comment block -- PIPOYA row order documented: Down/Left/Right/Up, 3 frames per direction, 96x128px

### Secondary (MEDIUM confidence)
- [PixelLab](https://www.pixellab.ai/) -- AI sprite generation tool; supports 32x32, 4/8-direction, walk cycles
- [PixelLab Review by Jonathan Yu](https://www.jonathanyu.xyz/2025/12/31/pixellab-review-the-best-ai-tool-for-2d-pixel-art-games/) -- $9/mo tier, 16 frames per 32x32 request, Aseprite integration
- [Retro Diffusion](https://retrodiffusion.ai/) -- Alternative; four_angle_walking locked to 48x48
- [LimeZu Modern Interiors](https://limezu.itch.io/moderninteriors) -- Character generator with 100+ outfits; 16x32 proportions
- [Grid Engine docs](https://annoraaq.github.io/grid-engine/p/create-first-game/index.html) -- walkingAnimationMapping usage

### Tertiary (LOW confidence)
- PixelLab output row order (needs empirical verification)
- Grid Engine auto-detection of 3 vs 4 frames per direction (needs testing)

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH -- all tools already in project, well-understood
- Sprite generation (PixelLab): MEDIUM -- tool capabilities verified via reviews, but exact output format needs empirical testing
- Dialogue extraction: HIGH -- pure refactoring, ADR defines exact interface, code patterns clear from source inspection
- Pitfalls: HIGH -- derived from direct codebase analysis

**Research date:** 2026-03-14
**Valid until:** 2026-04-14 (stable domain -- sprite tools may update but core patterns are stable)
