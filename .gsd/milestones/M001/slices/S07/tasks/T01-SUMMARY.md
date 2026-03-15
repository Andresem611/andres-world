---
id: T01
parent: S07
milestone: M001
provides:
  - generate-map.ts RETIRED (not deleted — keeps historical reference)
  - overworld-map.test.ts deleted (programmatic GID assertions invalid once Tiled owns map)
requires: []
affects: []
key_files:
  - scripts/generate-map.ts
  - tests/overworld-map.test.ts
key_decisions:
  - "generate-map.ts RETIRED not deleted — keeps historical reference of programmatic map construction"
  - "overworld-map.test.ts deleted — programmatic GID assertions invalid once Tiled owns overworld.json"
patterns_established: []
observability_surfaces: []
drill_down_paths: []
duration: 2min
verification_result: passed
completed_at: 2026-03-14
---
# T01: Code prep — retire generate-map.ts
generate-map.ts marked RETIRED with warning banner. overworld-map.test.ts deleted. Baseline verified green.
