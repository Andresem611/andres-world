---
phase: 3
slug: interaction-npc-system
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-03-09
---

# Phase 3 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | Vitest 4.0.18 |
| **Config file** | `vitest.config.ts` |
| **Quick run command** | `npm test` |
| **Full suite command** | `npm test` |
| **Estimated runtime** | ~5 seconds |

---

## Sampling Rate

- **After every task commit:** Run `npm test`
- **After every plan wave:** Run `npm test`
- **Before `/gsd:verify-work`:** Full suite must be green
- **Max feedback latency:** ~5 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|-----------|-------------------|-------------|--------|
| 3-01-01 | 01 | 0 | INTER-01, INTER-02, INTER-03 | unit | `npm test -- tests/interaction-router.test.ts` | ❌ W0 | ⬜ pending |
| 3-01-02 | 01 | 0 | INTER-04, INTER-05 | unit | `npm test -- tests/dialog-box.test.ts` | ❌ W0 | ⬜ pending |
| 3-01-03 | 01 | 0 | NPC-01 through NPC-05 | unit | `npm test -- tests/npc-config.test.ts` | ❌ W0 | ⬜ pending |
| 3-02-01 | 02 | 1 | INTER-04, INTER-05 | unit | `npm test -- tests/dialog-box.test.ts` | ❌ W0 | ⬜ pending |
| 3-02-02 | 02 | 1 | INTER-01, INTER-02, INTER-03 | unit | `npm test -- tests/interaction-router.test.ts` | ❌ W0 | ⬜ pending |
| 3-03-01 | 03 | 2 | NPC-01, NPC-02, NPC-03, NPC-05 | unit | `npm test -- tests/npc-config.test.ts` | ❌ W0 | ⬜ pending |
| 3-04-01 | 04 | 3 | NPC-04 | unit | `npm test -- tests/npc-config.test.ts` | ❌ W0 | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

- [ ] `tests/npc-config.test.ts` — stubs for NPC-01, NPC-02, NPC-03, NPC-04, NPC-05
- [ ] `tests/interaction-router.test.ts` — stubs for INTER-01, INTER-02, INTER-03
- [ ] `tests/dialog-box.test.ts` — stubs for INTER-04, INTER-05

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Dialog box renders at bottom of screen (not world-space) | INTER-04 | Requires Phaser WebGL render — no Node test environment | Run dev server, walk to sign, press Space, verify box at screen bottom |
| Dialog text advances with Space/E and closes on last page | INTER-05 | Phaser input events can't be triggered in Vitest | Walk to NPC, press Space through all pages, verify game state after |
| Movement locked while dialog is open | INTER-01 | Grid Engine movement in Phaser requires browser | Open dialog, press arrow keys, verify player does not move |
| Finished building triggers scene transition | INTER-02 | Phaser scene transitions require browser | Walk to Andres's House entrance, press Space, verify scene change |
| Under-construction building shows popup text | INTER-03 | Phaser scene rendering requires browser | Walk to Chalk Lab entrance, press Space, verify popup message |
| All 14 NPCs visible on map at correct locations | NPC-05 | Sprite placement requires Phaser render | Load overworld, visually verify each NPC is at their expected tile |
| John Collison patrols back and forth on Main Street | NPC-04 | Grid Engine movement requires Phaser runtime | Load overworld, observe John walking north then south on Main Street |
| John Collison turns to face player on interaction | NPC-04 | Grid Engine `turnTowards` requires Phaser | Stand adjacent to John, press Space, verify he turns to face you |

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency < 10s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
