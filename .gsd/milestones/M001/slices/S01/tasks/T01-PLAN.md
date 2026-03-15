# T01: 01-infrastructure 01

**Slice:** S01 — **Milestone:** M001

## Description

Bootstrap the Phaser 3 + Grid Engine + Vite + TypeScript project scaffold from scratch. The deliverable is a blank canvas that boots locally and produces a clean production build — no gameplay, just the skeleton every later phase builds on.

Purpose: All 9 phases depend on this scaffold existing. Nothing can be built until `npm run dev` works.
Output: A complete project structure with all config files, a minimal Boot scene, and pixel-perfect rendering configured.

## Must-Haves

- [ ] "`npm run dev` starts a local dev server on localhost:5173 with no console errors"
- [ ] "`npm run build` produces a `dist/` directory with no TypeScript or Vite errors"
- [ ] "A black canvas renders in the browser — no white/blank page, no JS exceptions"
- [ ] "Canvas pixels are crisp at 100% browser zoom — no anti-aliasing blur on pixel edges"
- [ ] "Grid Engine plugin is registered in the Phaser config (ready for Phase 2 use)"

## Files

- `package.json`
- `vite.config.ts`
- `tsconfig.json`
- `index.html`
- `src/main.ts`
- `src/game/main.ts`
- `src/game/scenes/Boot.ts`
- `public/style.css`
