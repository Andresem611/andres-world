# S01: Infrastructure

**Goal:** Bootstrap the Phaser 3 + Grid Engine + Vite + TypeScript project scaffold from scratch.
**Demo:** Bootstrap the Phaser 3 + Grid Engine + Vite + TypeScript project scaffold from scratch.

## Must-Haves


## Tasks

- [x] **T01: 01-infrastructure 01** `est:1min`
  - Bootstrap the Phaser 3 + Grid Engine + Vite + TypeScript project scaffold from scratch. The deliverable is a blank canvas that boots locally and produces a clean production build — no gameplay, just the skeleton every later phase builds on.

Purpose: All 9 phases depend on this scaffold existing. Nothing can be built until `npm run dev` works.
Output: A complete project structure with all config files, a minimal Boot scene, and pixel-perfect rendering configured.
- [x] **T02: 01-infrastructure 02** `est:10min`
  - Wire the Vercel deployment pipeline and verify the live site at andresmartinez.com. The deliverable is a green Vercel deploy accessible at the custom domain.

Purpose: FOUND-02 requires the site to be live at andresmartinez.com before Phase 1 is complete. All later phases ship incrementally to this URL.
Output: vercel.json added to repo, Vercel project connected to GitHub, andresmartinez.com returns the Phaser canvas.

## Files Likely Touched

- `package.json`
- `vite.config.ts`
- `tsconfig.json`
- `index.html`
- `src/main.ts`
- `src/game/main.ts`
- `src/game/scenes/Boot.ts`
- `public/style.css`
- `vercel.json`
