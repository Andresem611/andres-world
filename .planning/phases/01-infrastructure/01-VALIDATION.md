---
phase: 1
slug: infrastructure
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-03-09
---

# Phase 1 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | None — greenfield project (build smoke test only) |
| **Config file** | none — Wave 0 installs |
| **Quick run command** | `npm run build` |
| **Full suite command** | `npm run build && npx tsc --noEmit` |
| **Estimated runtime** | ~15 seconds |

---

## Sampling Rate

- **After every task commit:** Run `npm run build`
- **After every plan wave:** Run `npm run build && npx tsc --noEmit`
- **Before `/gsd:verify-work`:** Full suite must be green + Vercel deploy green + visual pixel check
- **Max feedback latency:** 15 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|-----------|-------------------|-------------|--------|
| 1-01-01 | 01 | 0 | FOUND-01 | smoke | `npm run build` | ❌ W0 | ⬜ pending |
| 1-01-02 | 01 | 0 | FOUND-02 | deploy smoke | `vercel --prod` | ❌ W0 | ⬜ pending |
| 1-01-03 | 01 | 0 | FOUND-03 | visual/manual | Visual inspection in browser | ❌ W0 | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

- [ ] `package.json` — with `dev`, `build`, `preview` scripts
- [ ] `vite.config.ts` — Vite config for Phaser + TypeScript
- [ ] `tsconfig.json` — TypeScript config
- [ ] `src/main.ts` — application entry point
- [ ] `src/game/main.ts` — Phaser game config with `pixelArt: true` and Grid Engine plugin
- [ ] `src/game/scenes/Boot.ts` — minimal Boot scene
- [ ] `public/style.css` — canvas `image-rendering: pixelated`
- [ ] `index.html` — mounts canvas, loads entry point
- [ ] `vercel.json` — SPA rewrite rule

*Full scaffold is Wave 0 — this is a greenfield project.*

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Canvas renders without anti-aliasing blur at 1x scale | FOUND-03 | Visual inspection required | Open in browser at 100% zoom, inspect canvas edges — should be crisp pixels, not blurred |
| Vercel deploy accessible at andresmartinez.com | FOUND-02 | DNS/deploy check | Push to main, wait for Vercel deploy, open andresmartinez.com, confirm 200 response |

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency < 15s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
