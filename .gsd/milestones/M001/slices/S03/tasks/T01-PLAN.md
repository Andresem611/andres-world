# T01: 03-interaction-npc-system 01

**Slice:** S03 — **Milestone:** M001

## Description

Create the three Wave 0 test files that validate all 10 Phase 3 requirements. These tests are written first (RED) and must fail until implementation is in place. All tests cover pure TypeScript logic — no Phaser, no DOM, no WebGL.

Purpose: Nyquist compliance requires test scaffolds exist before implementation tasks run. Every automated verify command in Plans 02-05 references these files.
Output: Three failing test files in tests/ that become green as implementation plans execute.

## Must-Haves

- [ ] "All 10 requirement behaviors have automated test coverage before implementation begins"
- [ ] "Test suite runs in under 10 seconds with no Phaser/DOM dependencies"
- [ ] "Tests are in failing (RED) state — no implementation exists yet"

## Files

- `tests/npc-config.test.ts`
- `tests/interaction-router.test.ts`
- `tests/dialog-box.test.ts`
