---
phase: 2
slug: overworld-map
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-03-09
---

# Phase 2 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | vitest (already configured in Phase 1) |
| **Config file** | `vitest.config.ts` (or `vite.config.ts` if vitest is bundled) |
| **Quick run command** | `npx vitest run --reporter=verbose` |
| **Full suite command** | `npx vitest run` |
| **Estimated runtime** | ~10 seconds |

---

## Sampling Rate

- **After every task commit:** Run `npx vitest run --reporter=verbose`
- **After every plan wave:** Run `npx vitest run`
- **Before `/gsd:verify-work`:** Full suite must be green
- **Max feedback latency:** 15 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|-----------|-------------------|-------------|--------|
| 2-01-01 | 01 | 0 | WORLD-01 | unit | `npx vitest run --reporter=verbose` | ❌ W0 | ⬜ pending |
| 2-01-02 | 01 | 1 | WORLD-01 | manual | Open browser, see tilemap | N/A | ⬜ pending |
| 2-01-03 | 01 | 1 | WORLD-06, WORLD-07, WORLD-08 | manual | Walk all zones visible | N/A | ⬜ pending |
| 2-02-01 | 02 | 1 | CHAR-01, CHAR-02, CHAR-03 | manual | Sprite moves, animates, idles | N/A | ⬜ pending |
| 2-02-02 | 02 | 1 | WORLD-02 | manual | Spawn at south dock facing north | N/A | ⬜ pending |
| 2-02-03 | 02 | 1 | WORLD-03 | unit | `npx vitest run --reporter=verbose` | ❌ W0 | ⬜ pending |
| 2-02-04 | 02 | 1 | WORLD-04 | manual | Camera follows, world scrolls | N/A | ⬜ pending |
| 2-02-05 | 02 | 2 | WORLD-05 | manual | Collision blocks buildings/water/trees | N/A | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

- [ ] `src/game/__tests__/overworld.test.ts` — stubs for map loading, layer existence, Grid Engine config shape (WORLD-01, WORLD-03)
- [ ] `src/game/__tests__/gridengine.config.test.ts` — validates GridEngineConfig structure and character data shape

*These tests are structural unit tests; visual/movement correctness is verified manually in browser.*

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Tilemap renders Miami zones correctly | WORLD-06 | Canvas rendering, no DOM | Load game, confirm dock/street/beach/plaza/heights zones visible |
| Palm trees render (not oak trees) | WORLD-07 | Visual tile check | Walk map east side, confirm palm tile GIDs used |
| Ocean appears on east edge | WORLD-08 | Visual tile check | Walk to east edge, confirm water tiles block movement |
| Character has 4-dir walk animation | CHAR-02 | Animation is visual | Move in all 4 directions, confirm 3-frame animation plays |
| Idle state stops at standing frame | CHAR-03 | Animation is visual | Release all keys, confirm sprite stops at center frame |
| Camera follows and world scrolls | WORLD-04 | Camera behavior is visual | Walk to map edges, confirm camera tracks and clamps at bounds |
| Spawn position is south dock facing north | WORLD-02 | Spawn position is visual | Load game, confirm character appears at dock facing up |
| Collision blocks entry to buildings | WORLD-05 | Physics is visual | Walk into building/tree/water tile, confirm movement stops |

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency < 15s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
