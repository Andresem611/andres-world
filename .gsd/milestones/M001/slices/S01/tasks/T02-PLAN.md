# T02: 01-infrastructure 02

**Slice:** S01 — **Milestone:** M001

## Description

Wire the Vercel deployment pipeline and verify the live site at andresmartinez.com. The deliverable is a green Vercel deploy accessible at the custom domain.

Purpose: FOUND-02 requires the site to be live at andresmartinez.com before Phase 1 is complete. All later phases ship incrementally to this URL.
Output: vercel.json added to repo, Vercel project connected to GitHub, andresmartinez.com returns the Phaser canvas.

## Must-Haves

- [ ] "Pushing to the main branch triggers an automatic Vercel deploy"
- [ ] "andresmartinez.com returns a 200 response and renders the Phaser canvas"
- [ ] "vercel.json SPA rewrite is in place so page refreshes don't 404"

## Files

- `vercel.json`
