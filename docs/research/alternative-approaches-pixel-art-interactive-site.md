# Alternative Approaches — Pixel Art Interactive Personal Site

**Date**: 2026-03-18
**Context**: The current Phaser 3 + Tiled approach has been too complex. Tiled map design is hard to visualize, metadata gaps cause layout issues, and the full game engine stack creates unnecessary friction. Researching simpler alternatives that still achieve the Pokemon overworld feel.

**Goal**: Find approaches that are interactive, pixel-art styled, and achievable without deep game engine expertise or complex tilemap tooling.

---

## Table of Contents
1. [Lightweight Game-Like Frameworks (Simpler Than Phaser)](#1-lightweight-game-like-frameworks)
2. [CSS/HTML/DOM-Based Pixel Art Approaches (No Canvas)](#2-csshtml-dom-based-approaches)
3. [Visual Map Editors & Design Tools (Easier Than Tiled)](#3-visual-map-editors--design-tools)
4. [Real Examples & Case Studies](#4-real-examples--case-studies)
5. [Recommendation & Decision Matrix](#5-recommendation--decision-matrix)

---

## 1. Lightweight Game-Like Frameworks (Simpler Than Phaser)
The current stack (Phaser 3 + Grid Engine + Tiled) is powerful but carries significant complexity. Below is a thorough evaluation of lighter alternatives, ranging from rendering libraries to full visual game editors to purpose-built RPG frameworks.

---

### 1.1 PixiJS

**What it is:** A fast, lightweight 2D rendering library (not a game framework). Phaser actually uses PixiJS under the hood for rendering.

**Complexity vs Phaser:** PixiJS is simpler in the sense that it does less -- it is a rendering library, not a game engine. You get a canvas/WebGL renderer and sprite management, but no built-in physics, no scene manager, no input handling, no audio system, no camera system. You build all of that yourself or bolt on separate libraries. For a portfolio site that just needs to display a world and handle clicks, this *could* be a pro -- less magic, more control. But for anything resembling a game (movement, collisions, transitions, dialog), you end up reimplementing what Phaser gives you for free.

**Tilemap/pixel art support:** PixiJS has a `@pixi/tilemap` plugin that provides low-level rectangular tilemap rendering. It supports Tiled map data but requires more manual wiring than Phaser's built-in tilemap loader. Performance is excellent (3x smaller bundle at ~450KB vs Phaser's ~1.2MB, 2x faster raw rendering). Pixel art rendering is crisp with proper nearest-neighbor scaling.

**Grid movement:** No built-in grid movement. You would implement this from scratch -- snapping positions to tile coordinates, handling input, managing collision against tile data. Not hard, but not trivial either. No equivalent to Grid Engine exists for PixiJS.

**Web deployment:** Excellent. Small bundle, fast load, great mobile performance. This is PixiJS's strongest suit.

**Community/docs:** Very strong. PixiJS is one of the most popular 2D rendering libraries on npm, with extensive documentation and examples. Active maintenance (PixiJS v8 released recently).

**Visual map design:** No built-in editor. You would use Tiled and import the JSON, same as now.

**Verdict:** PixiJS trades Phaser's built-in game systems for a smaller bundle and more control. For this project, it would mean writing more code to get the same result. The complexity reduction is illusory -- you move complexity from "learning Phaser's API" to "building your own game systems." Not recommended unless the goal is maximum performance with minimal bundle size and you are comfortable building movement/collision/dialog from scratch.

---

### 1.2 Kaplay.js (formerly Kaboom.js)

**What it is:** A JavaScript/TypeScript game library that bills itself as making games "fast and fun." It is the spiritual successor to Kaboom.js, which was created by Replit but abandoned. The community forked it as Kaplay in May 2024 and has been actively developing it since.

**Complexity vs Phaser:** Significantly simpler API. Kaplay uses a functional, chainable style that feels more like scripting than engine programming. Adding a sprite, giving it movement, and handling collisions can be done in a few lines. The learning curve is much lower than Phaser 3's class-based scene/game object hierarchy.

**Tilemap/pixel art support:** Kaplay supports Tiled map integration (JSON format). There are community guides on using Tiled with Kaplay. It also has its own web-based editor (KAPLAYGROUND) with 90+ examples. Pixel art rendering works well. The framework includes a navigation mesh / pathfinding system that could be leveraged for NPC movement.

**Grid movement:** No built-in grid movement system. You would need to implement tile-snapping manually. The pathfinding system helps with NPC AI but does not provide Pokemon-style grid-locked player movement out of the box.

**Web deployment:** Good. Kaplay is JavaScript-native, so bundle sizes are reasonable and deployment is straightforward. Mobile support exists with input bindings that unify mouse, keyboard, and gamepad.

**Community/docs:** Growing. The Kaplay team is actively developing v4000 (next major version) while maintaining v3001 as stable. The community is smaller than Phaser's but enthusiastic. Documentation is solid with the KAPLAYGROUND providing interactive examples.

**Visual map design:** KAPLAYGROUND is a web-based editor, but it is more of a code playground than a visual map designer. You would still use Tiled for map design.

**Verdict:** Kaplay is genuinely simpler than Phaser for getting something running quickly. The API is more approachable. However, the lack of built-in grid movement and the smaller ecosystem mean you still need to build some custom systems. Good option if you want a lighter framework and are OK implementing grid movement yourself. The risk is that the community is smaller -- if you hit an edge case, there are fewer Stack Overflow answers to find.

---

### 1.3 Excalibur.js

**What it is:** A TypeScript-first 2D game engine for the web. Built from the ground up in TypeScript (not JS with types bolted on). Feels familiar to developers coming from C# or Java game frameworks.

**Complexity vs Phaser:** Comparable complexity, but with a cleaner TypeScript API. Excalibur is opinionated in a good way -- it provides scenes, actors, actions, cameras, and tilemaps with a consistent API. The code feels more modern than Phaser 3. It is not dramatically simpler, but the TypeScript integration is tighter and the API is more intuitive.

**Tilemap/pixel art support:** Excellent. Excalibur has first-class Tiled support via the `@excaliburjs/excalibur-tiled` plugin, supporting both orthogonal and isometric maps. It also has a dedicated **pixel art mode** (released in v0.29.0) with `pixelRatio` settings for crisp upscaling of low-resolution art. This is one of the best pixel art stories among all the frameworks evaluated.

**Grid movement:** No built-in grid movement plugin equivalent to Grid Engine. You would implement it using Excalibur's action system (which supports move-to with easing), which makes it more feasible than raw PixiJS but still requires custom code.

**Web deployment:** Good. ESM builds reduce bundle size significantly. Active development with three major releases in 2024 (v0.28, v0.29, v0.30). The engine targets web-first deployment.

**Community/docs:** Solid documentation, active GitHub, regular blog posts. Smaller community than Phaser but well-maintained. The team is responsive.

**Visual map design:** Use Tiled, same as current workflow. No built-in visual editor. Also has an official LDtk plugin and Sprite Fusion plugin.

**Verdict:** Excalibur is the most compelling "swap Phaser for something similar but cleaner" option. The TypeScript-first design, dedicated pixel art mode, and Tiled plugin make it well-suited for this project. The downside is that it does not dramatically reduce complexity -- it is a different flavor of the same approach rather than a fundamentally simpler paradigm. If the problem is "Phaser's API is confusing," Excalibur helps. If the problem is "game engine architecture is too complex," Excalibur does not solve that.

---

### 1.4 RPGJS

**What it is:** A framework specifically designed to create RPGs (and MMORPGs) in the browser with TypeScript. Uses PixiJS for rendering and Vue.js for UI. This is the most purpose-built option for exactly what Andres World needs.

**Complexity vs Phaser:** For an RPG specifically, RPGJS is *much* simpler because it handles RPG-specific patterns out of the box: map transitions, player movement, events on tiles, NPC interactions, dialog systems. You are not building an RPG on top of a generic game engine -- you are configuring an RPG engine. The tradeoff is less flexibility for non-RPG features.

**Tilemap/pixel art support:** Built around Tiled. Maps are created in Tiled and loaded directly. The framework handles tile layers, collision layers, and event placement on tiles natively. Supports animated tiles, world maps (connecting multiple maps into a seamless world), and dynamic map updates.

**Grid movement:** Built in. This is an RPG framework -- character movement on a tile grid is the default behavior. Map transitions between rooms are also built in. This eliminates the need for Grid Engine entirely.

**Web deployment:** Good. JavaScript/TypeScript native. Uses PixiJS for rendering (fast WebGL). Vue.js handles UI overlays (dialog boxes, menus) which means you get proper DOM-based UI for text rather than canvas-rendered text.

**Community/docs:** Smaller community than Phaser or Excalibur. Documentation exists (v4 docs available) but is less comprehensive. The framework is maintained by a small team. v4 is the current version with ongoing development including AI-powered tools for map/asset generation.

**Visual map design:** Uses Tiled for map design (same as current workflow). Also has an AI-powered "RPG Studio" editor for generating maps and assets, though this is newer and less proven.

**Verdict:** RPGJS is the most interesting option specifically for this project. It solves the exact problems Andres World has: grid movement, map transitions, NPC events, dialog boxes, Tiled integration -- all built in. The Vue.js UI layer is a significant advantage for rendering dialog and menus as DOM elements rather than canvas text. The risk is the smaller community and the fact that you are locked into RPG patterns. If the site needs to do something the RPG engine does not expect, you may fight the framework. Worth a serious prototype.

---

### 1.5 RPG Maker MV/MZ (Web Export)

**What it is:** A commercial visual game editor ($80 for MZ) specifically designed for making RPGs. Design everything visually -- maps, events, dialog, characters -- then export to web (HTML5).

**Complexity vs Phaser:** Radically simpler for the map/event design phase. RPG Maker is a visual tool -- you paint tiles, place events, write dialog in a GUI. No code required for basic functionality. The web export is an HTML page with a canvas, the engine in JavaScript, and all assets as images/JSON.

**Tilemap/pixel art support:** This is what RPG Maker was built for. The tilemap editor is excellent -- you paint tiles directly in the editor with autotile support, multiple layers, and event placement. Pixel art is the default aesthetic (the engine ships with RPG-style tilesets).

**Grid movement:** Built in. RPG Maker's entire movement system is grid-based by default. Character follows grid, events trigger on tile interaction.

**Web deployment:** Functional but heavy. MV exports had stuttering and performance issues. MZ improved significantly (updated PixiJS, better memory management). The main concern is file size -- audio ships in dual formats (m4a + ogg), and the engine runtime adds overhead. A simple game can be 20-40MB for the web export. Loading times are noticeable.

**Community/docs:** Massive community (decades of RPG Maker users). Extensive plugin ecosystem. However, the community skews toward traditional RPG game development, not web portfolio sites. Finding help for "embed RPG Maker in a portfolio" is harder than "make an RPG."

**Visual map design:** The best visual map design experience of any option here. This is RPG Maker's core value proposition.

**Verdict:** RPG Maker is the fastest path to "walk around a pixel art world with NPCs and dialog" -- if you accept its constraints. The web export is functional but not optimized for a portfolio site (large bundle, no easy way to integrate with external web content, limited customization of the shell HTML). The $80 price is not a blocker. The real issue is that RPG Maker's web exports feel like "a game embedded in a webpage" rather than "a website that is a game." Customizing the UI, linking to external URLs, or pulling dynamic data (like Thoven metrics) requires fighting the engine with plugins. Good for prototyping the concept; potentially limiting for the final product.

---

### 1.6 ct.js

**What it is:** A free, open-source 2D game engine with a visual IDE (desktop app). You design rooms, place objects, and write logic in TypeScript, JavaScript, CoffeeScript, or a visual scripting language called Catnip. Exports to WebGL games that run in the browser.

**Complexity vs Phaser:** Significantly simpler for visual design. ct.js has a room editor where you visually place game objects, a sprite editor, and modular "catmods" for adding features (physics, UI, etc.). Code is still required for logic, but the visual tools reduce the amount of manual coordinate math. The Catnip visual scripting option means you can avoid code entirely for simple behaviors.

**Tilemap/pixel art support:** ct.js supports tilemaps and has a visual room editor. Bitmap font support ensures crisp pixel art text. The engine renders via WebGL for good performance. However, its tilemap system is less mature than Phaser's or Excalibur's Tiled integration.

**Grid movement:** Not built in. Would need custom implementation.

**Web deployment:** One-click web export (the engine is built on web technologies). Bundle sizes are reasonable. Desktop builds are also available.

**Community/docs:** Smaller but dedicated community. v4.0.0 was a major release with hundreds of new features. Documentation is praised as exhaustive. The main risk is the smaller user base -- fewer tutorials, fewer Stack Overflow answers.

**Visual map design:** The room editor is the main selling point. You visually place objects, set up tile layers, and configure collision. This is better than coding coordinates but less powerful than Tiled for complex maps.

**Verdict:** ct.js is a solid middle ground between "code everything" (Phaser) and "no-code" (RPG Maker/GDevelop). The visual room editor reduces friction, and web export is native. However, it lacks RPG-specific features (grid movement, dialog systems, map transitions) that you would need to build. Best suited for simpler games or prototypes.

---

### 1.7 Godot (HTML5 Export)

**What it is:** A full-featured open-source game engine (primarily for desktop/mobile games) with HTML5 web export capability. Godot 4 is the current major version.

**Complexity vs Phaser:** Godot is a full game engine with a visual editor, scene system, GDScript (Python-like language), and a massive feature set. For designing a game, it is arguably *easier* than Phaser because of the visual tools. But the engine is designed for standalone games, not web-first applications.

**Tilemap/pixel art support:** Excellent. Godot has a built-in TileMap node with a visual tile editor, autotile support, collision painting, and multiple layers. Pixel art support is first-class with nearest-neighbor filtering and pixel-perfect collision. This is one of the best tilemap design experiences available.

**Grid movement:** Not built in as a default, but straightforward to implement in GDScript. Many tutorials exist for Pokemon-style grid movement in Godot.

**Web deployment:** This is Godot's weakness for this use case. Godot 4 web exports are problematic:
- **Bundle size:** ~40MB uncompressed WASM (~5MB with Brotli compression). Even with aggressive optimization, expect 2-5MB compressed minimum for a simple 2D game.
- **Loading time:** Initial load can take 30-60 seconds as the browser compiles the WASM module.
- **Performance:** Significant FPS drops in HTML5 vs native. Reports of stuttering, input lag, and rendering artifacts. Simple sprite rendering can drop below 50fps.
- **Mobile:** Poor mobile HTML5 performance. Blurry/pixelated rendering on Android Chrome.
- Godot's web export has improved with each version, but it remains the engine's weakest deployment target.

**Community/docs:** Enormous and growing. Godot is one of the most popular open-source game engines. Extensive tutorials for pixel art RPGs specifically.

**Visual map design:** The TileMap editor in Godot is excellent -- visual tile painting, autotile, collision shapes, layers. One of the best visual map design tools.

**Verdict:** Godot is a fantastic game engine hampered by weak web export. The visual tilemap editor and pixel art support are superb, and designing the game in Godot would be a pleasant experience. But the web export adds a 40MB+ WASM payload, loading times measured in minutes, and performance issues on mobile. For a personal site that needs to load fast and run smoothly in a browser, Godot's web story is not ready. If Godot's web export improves significantly, this would be worth revisiting.

---

### 1.8 GDevelop

**What it is:** An open-source no-code/low-code game maker with an event-based visual programming system. Available as a web app or desktop app. Exports to web, mobile, and desktop.

**Complexity vs Phaser:** Dramatically simpler. GDevelop uses drag-and-drop and an event system (if/then conditions) instead of code. You can build a complete game without writing a single line of code. The learning curve is measured in hours, not weeks.

**Tilemap/pixel art support:** GDevelop has a built-in tilemap object for painting tile-based maps directly in the editor. It also supports importing Tiled/LDtk maps via an external tilemap object. Pixel art support is good with animation systems for sprites.

**Grid movement:** Not built in as a default behavior, but GDevelop has pre-built RPG mechanics and behaviors that can be configured. Grid-snapping movement would require event-based logic but is feasible without code.

**Web deployment:** Functional. Games export to HTML5 and can be hosted on any web server (or GDevelop's own gd.games platform). The engine does not compile -- it wraps the HTML5 game for each platform, which means performance is lower than compiled alternatives. Complex games with many objects and events can become laggy.

**Community/docs:** Large and active. GDevelop is popular with beginners and hobbyists. Extensive marketplace of behaviors and templates. Good documentation.

**Visual map design:** Good visual editor for placing objects and painting tilemaps. Not as powerful as Tiled or Godot's TileMap editor, but more than adequate for a portfolio site.

**Verdict:** GDevelop is the easiest path to "something working" but the least flexible for the long term. Performance concerns are real -- the no-compile wrapper approach means sluggish behavior on complex scenes. The no-code approach also makes it harder to integrate with external web APIs (pulling Thoven metrics, linking to external URLs). Good for prototyping the concept in an afternoon; probably not the final solution.

---

### 1.9 LittleJS

**What it is:** A tiny, fast HTML5 game engine with zero dependencies. Designed for simplicity and performance, with the entire engine fitting in a few KB (7KB zip for the JS13k build).

**Complexity vs Phaser:** Much simpler. LittleJS is intentionally minimal -- rendering, physics, particles, sound, and input in a tiny package. The API is straightforward. But "simpler" also means "less built-in" -- no scene management, no dialog system, no tilemap loader.

**Tilemap/pixel art support:** Basic tilemap support exists (platformer demo uses Tiled data). Pixel art rendering works via the canvas. But the tilemap system is bare-bones compared to Phaser or Excalibur.

**Grid movement:** Not built in. Would require custom implementation.

**Web deployment:** Excellent. The entire engine is tiny. Load times are near-instant. Performance is great. This is the best web deployment story of any option.

**Community/docs:** Small but the code is clean and well-documented. The project is maintained by a single developer (KilledByAPixel). Small community means fewer resources for troubleshooting.

**Visual map design:** No visual editor. You use Tiled or code map data directly.

**Verdict:** LittleJS is best suited for game jams and small experiments where bundle size matters above all else. For Andres World, you would be building too many systems from scratch (dialog, map transitions, NPC interactions, grid movement). The tiny bundle is appealing but the development effort would be high.

---

### 1.10 melonJS

**What it is:** A lightweight, open-source HTML5 game engine maintained by a small team at AltByte (Singapore). MIT licensed.

**Complexity vs Phaser:** Comparable, possibly slightly simpler. melonJS is a full game framework with sprites, tilemaps, collision, input, audio, and scene management. The API is clean but the feature set is similar in scope to Phaser.

**Tilemap/pixel art support:** Strong Tiled integration. Supports orthogonal, isometric, and hexagonal maps, multiple layers, animated tiles, multiple tilesets, and shape-based collision from Tiled. This is one of the more complete Tiled integrations.

**Grid movement:** Not built in. The framework focuses on platformer-style physics rather than RPG grid movement.

**Web deployment:** Good. Lightweight engine with reasonable bundle sizes. Designed for HTML5 from the start.

**Community/docs:** Small but stable community. The engine has been around for years and is actively maintained. Used in some commercial games (Player Killers, etc.). Documentation is adequate but not as extensive as Phaser's.

**Visual map design:** Uses Tiled for map design. No built-in visual editor.

**Verdict:** melonJS is a solid, mature framework that does not offer a compelling reason to switch from Phaser. It is roughly equivalent in complexity and capability, with a smaller community. The Tiled integration is excellent, but that is also true of Phaser. Not recommended as a switch target unless there is a specific melonJS feature that appeals.

---

### 1.11 Comparison Table

| Framework | Complexity vs Phaser | Pixel Art Support | Grid Movement | Web Performance | Visual Map Editor | Tiled Support | Community Size | Best For |
|-----------|---------------------|-------------------|---------------|-----------------|-------------------|---------------|----------------|----------|
| **PixiJS** | Lower (but more DIY) | Good | DIY | Excellent | No | Plugin | Large | Custom rendering-heavy apps |
| **Kaplay.js** | Simpler | Good | DIY | Good | KAPLAYGROUND (code) | Yes | Growing | Quick prototypes, simple games |
| **Excalibur.js** | Similar (cleaner TS) | Excellent (pixel mode) | DIY | Good | No | Excellent plugin | Medium | TS-first Phaser alternative |
| **RPGJS** | Much simpler (for RPGs) | Good | Built in | Good | Tiled + AI Studio | Built in | Small | RPGs specifically (best fit) |
| **RPG Maker MZ** | Much simpler (visual) | Excellent | Built in | Heavy (~20-40MB) | Excellent built-in | Built-in (own format) | Huge | Traditional RPGs, prototyping |
| **ct.js** | Simpler (visual IDE) | Good | DIY | Good | Room editor | Basic | Small | Visual game design + code |
| **Godot** | Similar (visual tools) | Excellent | Tutorials available | Poor (WASM bloat) | Excellent TileMap | Built-in | Huge | Desktop games (not web) |
| **GDevelop** | Much simpler (no-code) | Good | Event-based | Mediocre | Good built-in | Yes (import) | Large | No-code prototyping |
| **LittleJS** | Much simpler (tiny) | Basic | DIY | Excellent (tiny) | No | Basic | Tiny | Game jams, tiny bundles |
| **melonJS** | Similar | Good | DIY | Good | No | Excellent | Small | Tiled-heavy 2D games |

### 1.12 Top Picks for Andres World

1. **RPGJS** -- Purpose-built for exactly this use case. Grid movement, map transitions, Tiled support, dialog, NPC events all built in. Vue.js UI layer for DOM-based dialog boxes. Biggest risk is small community.
2. **Kaplay.js** -- Simpler API than Phaser with good enough features. Would still need custom grid movement but the overall DX is much friendlier.
3. **Excalibur.js** -- Best option if you want to stay in "game framework" territory but with cleaner TypeScript and dedicated pixel art support. Also has LDtk and Sprite Fusion plugins.
4. **RPG Maker MZ** -- Fastest to prototype but web export is heavy and customization is limited for a portfolio site.

## 2. CSS/HTML/DOM-Based Pixel Art Approaches (No Canvas)

The core question: can we skip the canvas/game engine entirely and build the Pokemon overworld feel using standard web technologies? The answer is nuanced -- several approaches are viable, each with real tradeoffs.

### Critical Shared Technique: `image-rendering: pixelated`

Before diving into approaches, every DOM-based pixel art method relies on this CSS property:

```css
img, .sprite, .tile {
  image-rendering: pixelated;       /* Chrome, Edge, Firefox 93+ */
  image-rendering: crisp-edges;     /* Firefox fallback */
  -ms-interpolation-mode: nearest-neighbor; /* IE */
}
```

This tells the browser to use nearest-neighbor scaling instead of bilinear interpolation, preserving hard pixel edges when scaling up small sprites. Without it, your 16x16 tiles become blurry mush at 3x or 4x scale. Browser support is excellent in 2026 (97%+ global coverage).

**Caveat**: When CSS pixels don't align with device pixels (non-integer devicePixelRatio), some pixels may render larger than others, creating a slightly non-uniform look. This is more noticeable on high-DPI mobile screens.

---

### Approach A: CSS Grid + Sprite Sheets (DOM Tiles)

**How it works**: Render the tilemap as a CSS Grid where each cell is a `<div>` with a `background-image` pointing to a sprite sheet. Use `background-position` to select the correct tile. The character and NPCs are absolutely-positioned `<div>` elements on top, moved via CSS `transform: translate()` or `top`/`left` changes.

```html
<!-- Conceptual structure -->
<div class="world" style="display: grid; grid-template-columns: repeat(50, 32px);">
  <div class="tile" style="background-position: -64px -32px;"></div>
  <!-- ...2000 tiles for a 50x40 map -->
</div>
<div class="character" style="transform: translate(160px, 320px);">
  <!-- Sprite with background-position animation -->
</div>
```

**Character animation**: CSS `steps()` timing function with `@keyframes` shifting `background-position` across a sprite sheet. This is a well-established technique for frame-by-frame sprite animation without JavaScript animation loops.

```css
.character.walking-down {
  animation: walk-down 0.4s steps(4) infinite;
}
@keyframes walk-down {
  from { background-position: 0 0; }
  to { background-position: -128px 0; }
}
```

**Grid movement**: JavaScript listens for keydown events, calculates the target grid position, checks a collision array, then applies a CSS transition (`transition: transform 0.2s linear`) to smoothly slide the character to the next tile. This gives the authentic Pokemon grid-snap movement feel.

**Evaluation**:
| Criterion | Assessment |
|-----------|-----------|
| Grid-based movement | Yes -- CSS transitions on transform give smooth tile-to-tile movement. Collision checks via JS array lookup. |
| Interactivity | Excellent. Each tile/building is a real DOM element. `click`, `hover`, `focus` events work natively. Dialogs are standard HTML/CSS overlays. |
| Performance | A 50x40 map = 2,000 DOM elements for tiles alone. Modern browsers handle this fine for static grids, but scrolling/updating many elements simultaneously can lag on low-end mobile. Hardware-accelerated CSS transforms help significantly. |
| Map design/updates | Define the map as a 2D array in JS/JSON. Each number maps to a tile in the sprite sheet. Easy to edit programmatically, but no visual editor -- you're editing arrays of numbers. |
| Mobile | Good. Touch events can trigger the same movement logic. D-pad overlay is standard HTML buttons. |
| Accessibility | **Major advantage over canvas.** Every building can be a `<button>` or `<a>` with `aria-label`. NPCs can be focusable. Screen readers can announce "Thoven HQ -- press Enter to enter." Dialog text is real DOM text, not drawn on canvas. |
| Real examples | [DOM Sprites: a Viable Alternative to Canvas](http://buildnewgames.com/dom-sprites/) demonstrates this approach works. Sprite animation without canvas is documented at [dev.to](https://dev.to/polluterofminds/how-to-create-a-sprite-animation-without-canvas-57cg). |

**Verdict**: The most practical DOM-based approach for Andres World. The 50x40 tile count (2,000 elements) is well within DOM performance limits. The main gap is the lack of a visual tilemap editor -- you would need to build the map as a JSON array or write a small custom editor.

---

### Approach B: React + Pixel Art Component Libraries

**How it works**: Use React to render the tilemap and game state declaratively. Several libraries exist for pixel-art-styled React UIs:

- **Pixelact UI** (pixelactui.com) -- Built on shadcn/ui, provides pixel-art-styled buttons, modals, cards, inputs. Registry-based (components copied into your project). Great for NPC dialog boxes, menus, and UI overlays. Does NOT provide tilemap rendering or game mechanics.
- **Pxlkit** (pxlkit.xyz) -- 53 production-ready retro-styled React components with pixel art icons. Similar scope to Pixelact UI.
- **Retro UI** (retroui.io) -- Another pixel-perfect React component library. Buttons, panels, text boxes.
- **ArcadeUI** -- Pixel-perfect React components for retro-styled UIs.
- **react-game-kit** (FormidableLabs) -- Had a `TileMap` component for rendering tile maps from a tile atlas. **Archived and unmaintained.** Not recommended.

**The gap**: None of these libraries handle the game part -- tilemap rendering, character movement, collision detection, camera following. They handle UI elements (dialog boxes, menus, overlays). You would still need to build the game logic yourself, either with raw DOM manipulation (Approach A) or a lightweight canvas layer.

**Recommended pattern**: Use Approach A (CSS Grid tilemap + transform-based movement) for the game world, and Pixelact UI or Pxlkit for dialog boxes, menus, and interactive overlays. This gives you the best of both worlds -- React's component model for UI, raw DOM for the game map.

**Evaluation**:
| Criterion | Assessment |
|-----------|-----------|
| Grid-based movement | Not provided by any library. Must be custom-built in React state (character position as state, useEffect for keyboard listeners, CSS transition for animation). |
| Interactivity | Excellent. React components handle click/hover/focus natively. Dialog system can be a React state machine. |
| Performance | React re-renders on state change. Moving the character re-renders the character component, not the whole map (if structured correctly with memo/context). React 18+ concurrent features help. |
| Map design/updates | Map defined as a TypeScript 2D array or JSON file. React renders it declaratively. Changing a tile = changing a number in the array. |
| Mobile | Same as Approach A. |
| Accessibility | Same major advantages as Approach A, plus React's ecosystem of a11y tools (react-aria, etc.). |
| Real examples | **Mewmew's Accessible Retro Portfolio** -- an accessible retro gamified portfolio with 2D pixel art, built with React 18 + Vite + TypeScript + XState. Won the DEV Community portfolio challenge. Uses React Context for state, XState for interaction flows, meets WCAG 2.1 AA/AAA. Live at [GitHub](https://github.com/mewmewdevart/DevCommunityPortfolioChallenge2026). This is the closest real-world example to what Andres World wants to achieve. |

**Verdict**: React is the right framework for managing game state and UI, but you still need to build the tile rendering and movement system yourself. The pixel art component libraries solve the dialog/menu problem well. Pair with Approach A's rendering strategy.

---

### Approach C: SVG-Based Maps

**How it works**: Draw the entire overworld map as an SVG, with each building/region as a named `<path>`, `<rect>`, or `<g>` element. Character is an SVG `<image>` or `<g>` element moved via transform attributes. Clickable regions use standard SVG event handlers.

**Evaluation**:
| Criterion | Assessment |
|-----------|-----------|
| Grid-based movement | Technically possible but awkward. SVG doesn't have a built-in grid concept. You'd need to manually calculate grid positions and apply transforms. |
| Interactivity | Good. Each SVG element gets native click/hover events. Tooltips and overlays work via foreignObject or DOM overlays. |
| Performance | SVG struggles with many elements. A detailed tilemap would mean thousands of SVG nodes, which renders slower than equivalent DOM elements or canvas. SVG is optimized for vector shapes, not sprite-based pixel art. |
| Map design/updates | Can be designed in Inkscape/Illustrator, exported as SVG. However, tile-based maps are not SVG's strength -- you'd be fighting the format. |
| Mobile | SVG scales well to any screen size (vector), but performance on mobile is worse than DOM or canvas for element-heavy scenes. |
| Accessibility | Excellent in theory. SVG elements support `<title>`, `<desc>`, `aria-label`, role attributes. Screen readers can traverse SVG DOM. |
| Real examples | SVG interactive maps are common for geographic data (country maps with clickable regions), but no known examples of SVG-based Pokemon-style overworlds. |

**Verdict**: Not recommended for Andres World. SVG is the wrong tool for tile-based pixel art rendering. It excels at vector illustrations, geographic maps, and data visualization, not sprite-sheet-based game worlds. The pixel art aesthetic requires raster sprites, which SVG handles poorly.

---

### Approach D: Isometric CSS Layouts

**How it works**: Use CSS 3D transforms to create an isometric perspective on a grid of DOM elements. The Codrops article ["Crafting Generative CSS Worlds"](https://tympanus.net/codrops/2025/11/10/crafting-generative-css-worlds/) (November 2025) demonstrates this approach with the Layoutit Terrain Generator -- stacking CSS Grid layers with 3D transforms to create a fully addressable 3D space in the browser.

**Evaluation**:
| Criterion | Assessment |
|-----------|-----------|
| Grid-based movement | Possible but complex. The isometric transform means screen coordinates don't map 1:1 to grid coordinates. Movement logic must account for the projection. |
| Interactivity | Each tile is a DOM element, so click events work. But the 3D transform can make hit testing tricky -- elements overlap in unexpected ways. |
| Performance | **Severe limitations.** The Codrops article explicitly states: "A 32x32x12 grid is roughly the safe limit for most modern systems; beyond that, rendering becomes unpredictable, frame rates drop, and tiles may flicker or disappear." A 50x40 map with even 2 layers would push these limits. |
| Map design/updates | The Layoutit Terrain Generator is procedural (noise-based), not hand-designed. For a hand-crafted Pokemon overworld, you'd need to build your own editor. |
| Mobile | Poor. CSS 3D transforms are GPU-intensive and the performance ceiling is already tight on desktop. |
| Accessibility | Same as Approach A (DOM elements are accessible), but the 3D visual layer adds complexity for screen reader users trying to understand spatial layout. |
| Real examples | Layoutit Terrain Generator demos. No known production sites using this for navigation-based interaction. |

**Verdict**: Not recommended. The aesthetic is wrong (isometric, not top-down), the performance ceiling is too low for the map size needed, and the complexity is high. Cool tech demo, wrong tool for this job.

---

### Approach E: Raw HTML Canvas (No Framework)

**How it works**: Use the Canvas 2D API directly -- `drawImage()` to blit tiles from a sprite sheet, `requestAnimationFrame()` for the game loop, manual collision detection. No Phaser, no Grid Engine, no framework. Just vanilla JS/TS and the Canvas API.

MDN has comprehensive documentation on this exact pattern:
- [Tilemaps overview](https://developer.mozilla.org/en-US/docs/Games/Techniques/Tilemaps)
- [Static tilemaps implementation](https://developer.mozilla.org/en-US/docs/Games/Techniques/Tilemaps/Square_tilemaps_implementation:_Static_maps)
- [Scrolling tilemaps](https://developer.mozilla.org/en-US/docs/Games/Techniques/Tilemaps/Square_tilemaps_implementation:_Scrolling_maps)

The core rendering loop is simple:

```js
// Draw one tile from sprite sheet to canvas
ctx.drawImage(
  spriteSheet,        // source image
  tileX * TILE_SIZE,  // source x (position in sprite sheet)
  tileY * TILE_SIZE,  // source y
  TILE_SIZE,          // source width
  TILE_SIZE,          // source height
  screenX,            // destination x
  screenY,            // destination y
  TILE_SIZE * SCALE,  // destination width (scaled)
  TILE_SIZE * SCALE   // destination height (scaled)
);
```

**What you build yourself**: Game loop, tile rendering, camera system, character movement + animation, collision detection, interaction system (proximity + keypress), dialog system (can be DOM overlay on top of canvas), map data loading.

**What you skip**: Phaser's 100KB+ bundle, Grid Engine's abstraction layer, plugin system complexity, scene management, physics engine you don't need.

**Evaluation**:
| Criterion | Assessment |
|-----------|-----------|
| Grid-based movement | Yes -- calculate target tile, check collision array, interpolate position over frames. ~50 lines of code for basic grid movement. |
| Interactivity | Requires manual hit-testing (check character position vs. building bounds). Dialog overlays should be DOM elements on top of canvas for accessibility. |
| Performance | Excellent. Canvas draws thousands of tiles per frame trivially. No DOM overhead per tile. Smooth 60fps even on mobile. |
| Map design/updates | Same as Approach A -- 2D array of tile indices. Can import Tiled JSON if desired (just read the array data, ignore the editor complexity). Or define maps in plain JS arrays. |
| Mobile | Canvas performs well on mobile. Touch input requires manual handling but is straightforward. |
| Accessibility | **Same problems as Phaser** -- canvas is a black box to screen readers. Mitigation: use DOM overlays for all text/interactive elements, add aria-live regions for dialog, provide alt text describing the scene. |
| Real examples | [canvas-tile-map on GitHub](https://github.com/rbcasperson/canvas-tile-map) -- simple tile map rendering with canvas. The MDN tutorials provide working examples. Countless indie games use raw canvas. |

**Verdict**: This is the "middle path" -- much simpler than Phaser but still canvas-based, so you inherit the accessibility problems. The actual code for a Pokemon-style overworld in raw canvas is probably 500-800 lines (vs. the framework configuration overhead of Phaser + Grid Engine). Worth considering if you want maximum rendering performance and don't mind the accessibility tradeoffs.

---

### Approach F: Three.js / React Three Fiber with 2D Pixel Art

**How it works**: Use Three.js (or its React wrapper, react-three-fiber / R3F) to render a 3D scene, but with an orthographic camera looking straight down and 2D sprite textures on flat planes. Characters use "billboarded" sprites (always face camera). The Drei library provides `SpriteAnimator` for sprite sheet animation.

**Key reference**: [Coldi's r3f-game-demo](https://github.com/coldi/r3f-game-demo) -- a tile-based 2D RPG built with React and R3F. Architecture inspired by Unity's GameObject/Component pattern. The core engine was extracted and used to build [Colmen's Quest](https://coldigames.itch.io/colmens-quest), a full RPG.

The R3F approach is documented in detail at [dev.to](https://dev.to/flagrede/making-a-2d-rpg-game-with-react-tree-fiber-4af1) and [fundamental.sh](https://fundamental.sh/p/sprite-sheet-animation-aseprite-react-threejs).

**Architecture highlights from Coldi's demo**:
- `GameObject` component as the core abstraction (holds position, layer, enabled state)
- `Script` components for reusable behaviors (collision, interaction, movement)
- Tile map defined as a 2D array, each tile rendered as a textured plane
- React state management for game state
- Three.js handles rendering, React handles component composition

**Evaluation**:
| Criterion | Assessment |
|-----------|-----------|
| Grid-based movement | Yes -- demonstrated in Coldi's demo. Movement scripts calculate grid positions, Three.js interpolates the visual position. |
| Interactivity | Three.js raycasting for click detection on sprites. Dialog UI should be React DOM overlays (not rendered in 3D). |
| Performance | Three.js with WebGL renders thousands of sprites at 60fps trivially. GPU-accelerated. Actually overkill for a 50x40 tilemap, but the overhead is minimal. |
| Map design/updates | Map as a 2D array, rendered as Three.js planes. Easy to update. Coldi's demo shows the pattern. |
| Mobile | WebGL runs on all modern mobile browsers. Performance is excellent. |
| Accessibility | Canvas-equivalent problems (WebGL canvas is opaque to screen readers). Same mitigation strategy: DOM overlays for text and interactive elements. |
| Real examples | Coldi's r3f-game-demo, Colmen's Quest. Several R3F portfolio sites exist (3D rooms, not pixel art overworlds). |

**Verdict**: Viable but likely overkill. You're adding Three.js (150KB+) and WebGL complexity to render what is fundamentally a 2D grid of sprites. The GameObject/Script architecture from Coldi's demo is elegant, but you could achieve the same with plain React components and CSS transforms (Approach A + B). R3F makes more sense if you want to add 3D effects (camera tilt, depth-of-field, lighting) to your pixel art world -- which could look great but diverges from the Pokemon Gen 1/2 aesthetic.

---

### Approach G: Image Map with Character Overlay

**How it works**: Render the entire overworld as a single large pre-rendered image (e.g., a 1600x1280 pixel art illustration). Use HTML `<map>` and `<area>` elements (or absolutely-positioned invisible `<div>` hotspots) to define clickable regions for each building. The character is a separate `<div>` or `<img>` overlaid on top, moved via CSS `transform: translate()`.

```html
<div class="world-container">
  <img src="overworld.png" usemap="#world-map" class="world-bg">
  <map name="world-map">
    <area shape="rect" coords="200,100,280,160" href="#thoven" alt="Thoven HQ">
    <area shape="rect" coords="320,200,380,260" href="#starbucks" alt="Starbucks Cafe">
  </map>
  <div class="character" style="transform: translate(160px, 320px);"></div>
</div>
```

**Evaluation**:
| Criterion | Assessment |
|-----------|-----------|
| Grid-based movement | Possible with JS -- snap character position to grid, use CSS transition for animation. The "grid" is implicit (defined by your movement increment) rather than rendered. |
| Interactivity | Image maps provide clickable regions natively. Hover effects require CSS tricks (overlay divs that match area coordinates). Building entry would be proximity-based (character near building + keypress). |
| Performance | Excellent. One image + one overlay element. Minimal DOM. Scrolling is native browser behavior. |
| Map design/updates | **Major drawback.** Changing the map means re-rendering the entire illustration and re-mapping all hotspot coordinates. No modularity. Cannot change individual tiles. |
| Mobile | Image maps are not responsive by default (coordinates are pixel-based). Requires JS to recalculate on resize. Touch events on `<area>` elements are inconsistent across mobile browsers. |
| Accessibility | `<area>` elements support `alt` text and are focusable. Better than canvas, worse than full DOM approaches. |
| Real examples | Common for geographic maps and infographics. No known examples for game-like overworlds with character movement. |

**Verdict**: Too rigid for Andres World. The map-as-single-image approach breaks down the moment you want to add a new building, move an NPC, or change any layout detail. It works for static, rarely-changed illustrations, not for an evolving world that "grows as projects grow." The design doc explicitly calls for buildings to transition from construction to finished states -- this requires tile-level modularity.

---

### Approach H: Scrollytelling / Parallax Pixel Art

**How it works**: Instead of free-roaming grid movement, the visitor scrolls down the page. The "world" unfolds vertically (or horizontally) as they scroll. Parallax layers create depth (foreground palm trees scroll faster than background buildings). Pixel art elements animate in as the user reaches them. Character walks forward automatically as the user scrolls.

**Evaluation**:
| Criterion | Assessment |
|-----------|-----------|
| Grid-based movement | No. Movement is scroll-driven, not player-controlled. This fundamentally changes the interaction model from "explore a world" to "read a story." |
| Interactivity | Scroll-triggered animations, clickable elements at each "stop." Buildings appear as the user scrolls past them. |
| Performance | Very good. Scroll-based animations are well-optimized in modern browsers (IntersectionObserver, CSS scroll-timeline). |
| Map design/updates | Easy. Each "section" is a block of HTML/CSS. Adding a building = adding a section. Standard web development. |
| Mobile | Excellent. Scrolling is the most natural mobile interaction. No D-pad needed. |
| Accessibility | Excellent. All content is standard HTML. Screen readers handle it natively. Keyboard users just Tab through. |
| Real examples | [Robby Leonardi's interactive resume](http://rleonardi.com/interactive-resume/) (platformer-style scrolling portfolio). Various parallax marketing sites with pixel art aesthetics. Retrofuturism is a noted 2026 web design trend combining pixel art with modern interactions. |

**Verdict**: This is the "nuclear simplification" option. You lose the free-roaming exploration and the Pokemon feel entirely, but you gain massive simplicity, perfect accessibility, and trivial mobile support. It is a fundamentally different product, though. The design doc says "No 'normal nav' escape hatch -- the game IS the site. Fully committed." A scrollytelling approach breaks that commitment. Only consider this if you're willing to rethink the core concept.

---

### Summary Matrix: DOM-Based Approaches

| Approach | Grid Movement | Interactivity | Performance | Map Updates | Mobile | Accessibility | Complexity |
|----------|:---:|:---:|:---:|:---:|:---:|:---:|:---:|
| **A. CSS Grid + Sprites** | Good | Excellent | Good | Medium | Good | Excellent | Low-Medium |
| **B. React + Pixel Libraries** | Custom-build | Excellent | Good | Easy | Good | Excellent | Medium |
| **C. SVG Maps** | Awkward | Good | Poor | Medium | Fair | Excellent | Medium |
| **D. Isometric CSS** | Complex | Fair | Poor | Hard | Poor | Good | High |
| **E. Raw Canvas** | Good | Manual | Excellent | Medium | Good | Poor | Medium |
| **F. R3F / Three.js** | Good | Good | Excellent | Easy | Good | Poor | High |
| **G. Image Map** | Possible | Fair | Excellent | Hard | Fair | Fair | Low |
| **H. Scrollytelling** | No | Good | Excellent | Easy | Excellent | Excellent | Low |

### Top Recommendations for Andres World

**Best DOM-only approach: A + B combined.** Use CSS Grid with sprite sheet `background-position` for the tile map, React for state management and UI components (dialogs, menus, overlays), and a pixel art component library (Pixelact UI or Pxlkit) for styled dialog boxes. Character movement via CSS `transform` with transitions. Map defined as a TypeScript 2D array.

This gives you:
- Authentic grid-based Pokemon movement
- Real DOM elements for accessibility (buildings are focusable, dialogs are screen-reader-friendly)
- React's component model for managing game state, NPC dialogs, and interactive overlays
- No canvas, no game engine, no Tiled dependency
- Map is just a JSON/TS array -- easy to edit, version-control, and update

**The tradeoff you accept**: No visual tilemap editor. You design the map by editing arrays of tile indices. For a 50x40 map, this is tedious but manageable (especially with a helper script that renders a preview). You could also build a simple browser-based editor in React that lets you paint tiles and export the array.

**Notable real-world precedent**: [Mewmew's Accessible Retro Portfolio](https://github.com/mewmewdevart/DevCommunityPortfolioChallenge2026) -- won the DEV Community 2026 portfolio challenge using React 18 + Vite + TypeScript + XState for a 2D pixel art walkable room with interactable objects, meeting WCAG 2.1 AA/AAA. This validates the React + DOM + pixel art approach for exactly this kind of project.

## 3. Visual Map Editors & Design Tools (Easier Than Tiled)

The core pain point: Tiled produces complex JSON with GID chains, tileset metadata, and collision layers that are nearly impossible to debug without the editor open. You cannot look at the data and "see" the world. This section evaluates alternatives across the spectrum — from better visual editors to fully programmatic approaches.

---

### 3.1 LDtk (Level Designer Toolkit)

**What it is**: A modern, open-source 2D level editor created by Sebastien Benard (director of Dead Cells). Purpose-built for indie devs working on top-down and platformer games.

**Visual design experience**: Significantly better than Tiled. LDtk's standout feature is the **World View** — you can see all your levels/rooms at once, drag them around, and reorganize with plain drag-and-drop. You can switch between "Grid-vania", "linear", or "free" world layouts. The **Auto-Layer** system lets you paint abstract IntGrid values (e.g., "ground", "wall", "water") and rules automatically place the correct visual tiles. You paint *intent*, not tile GIDs. This is the single biggest improvement over Tiled for visualization.

**Entity system**: Fully customizable entities with typed fields (e.g., a "Door" entity with a "target_room" string field, or a "Mob" entity with "hitPoints" limited to [0,10]). Far more structured than Tiled's freeform object layers.

**Export format**: Well-documented JSON that is deliberately readable. Double-underscore fields (e.g., `__tile`, `__x`) exist solely to make parsing easier. Also supports optional Tiled TMX export for migration. A "Super Simple Export" mode generates a composite PNG per level + a minimal JSON file — useful for prototyping with zero parsing.

**Web/Phaser integration**: No native Phaser plugin exists. You would need to write a custom JSON parser or use the TMX export and load it through Phaser's existing Tiled loader. The Excalibur.js framework has an official LDtk plugin, suggesting the format is parser-friendly. For Phaser, the TMX compatibility export is the lowest-friction path.

**Learning curve**: Easier than Tiled for new users. The UI is more opinionated (focused on platformers and top-down), which means fewer confusing options. The auto-layer system has a learning curve for rule setup, but once configured, iteration is dramatically faster.

**Cost**: Free and open-source (MIT license). Pay-what-you-want on itch.io, including free for commercial projects.

**Verdict for Andres World**: **Strong candidate if staying with a tilemap editor.** The auto-layer system and world view directly solve the "can't visualize metadata" problem. The entity system is perfect for defining NPC positions, door triggers, and interaction zones with structured data. Main downside: no first-party Phaser loader — you would need to build one or use the TMX fallback export.

---

### 3.2 RPG Maker MV/MZ

**What it is**: A full visual game creation suite with a map editor, event system, character generator, and battle system. Designed to make complete RPGs without code. MZ is the current version (released 2020).

**Visual design experience**: The best "what you see is what you get" map editor in this list. You paint tiles directly onto the map with a palette, place events (NPCs, doors, signs) as interactive objects, and preview the entire scene in the editor. You can walk around your map in a built-in test player. For designing a Pokemon-style overworld, this is the closest tool to "just draw the world."

**Export format**: Deploys as an HTML5 web application (index.html + assets folder). The output is a complete runnable game, not raw map data. The entire RPG Maker runtime ships with the export. This is both the strength and the limitation — you get a working game, but you're locked into the RPG Maker runtime and its JavaScript plugin architecture.

**Web integration**: HTML5 export works out of the box. Upload the exported folder to any web server (including Vercel). The game runs in-browser. The catch: this replaces your entire tech stack. No Phaser, no Grid Engine, no custom TypeScript — you are building inside RPG Maker's ecosystem, extending via its JavaScript plugin system.

**Learning curve**: Very low for map design. High if you want to do anything RPG Maker wasn't designed for (custom UI, dynamic data, external API calls, non-RPG interactions). The plugin system uses JavaScript and is extensible, but you are working against the grain for a portfolio site.

**Cost**: $79.99 on Steam (frequently on sale for $30-40). One-time purchase.

**Verdict for Andres World**: **Tempting for speed, but wrong tradeoff.** RPG Maker would let you design the entire world visually in hours, but you would lose all custom interaction logic (NPC dialogue system, Thoven HQ live metrics, essay rendering, external links). Everything would need to be rebuilt as RPG Maker plugins. The exported bundle is also heavy (~50MB+ for a basic project). Best suited for actual RPGs, not interactive websites.

---

### 3.3 Aseprite + Custom Tooling

**What it is**: The industry-standard pixel art editor ($19.99 on Steam, or free if compiled from source). Has native tilemap support since v1.3, with ongoing improvements planned for v1.4.

**Visual design experience**: Aseprite's tilemap mode lets you create a tilemap layer where each grid cell references a tile from a tileset. Two editing modes: **Pixels Mode** (edit individual tile pixels) and **Tiles Mode** (place tiles from the tileset onto the grid). Three tile modification modes: Manual, Auto, and Stack. You can see your map as you build it, and you are working in the same tool you use to create the art. This eliminates the "create art in one tool, arrange it in another" friction.

**Export format**: Exports to its own `.aseprite` format and PNG sprite sheets. A community script (`export-aseprite-file`) can dump tilemap data as JSON with tile indices, width, and height. However, this JSON is not Tiled-compatible — it is a raw tile index array. You would need custom tooling to add collision data, interaction zones, and entity positions.

**The "draw map as pixel art" approach**: The real power here is using Aseprite not as a tilemap editor, but as a visual design canvas. Draw the entire overworld as a single pixel art image. Then overlay interaction zones programmatically — define clickable regions, collision areas, and NPC positions in a separate config file (JSON/TypeScript) that maps pixel coordinates to behaviors. The map image becomes a static background, and all interactivity lives in code.

**Web/Phaser integration**: No direct integration. The exported PNG or JSON would need custom loader code. For the "draw and overlay" approach, you would load the map as a sprite/image and define collision rectangles in code.

**Cost**: $19.99 on Steam, or free if compiled from GitHub source (GPLv2).

**Verdict for Andres World**: **Good for the art pipeline, not a map editor replacement.** Aseprite's tilemap features are limited compared to Tiled or LDtk — no entity system, no collision metadata, no multi-level support. The "draw and overlay" approach is interesting (see Section 3.10 for the programmatic version of this idea), but you lose the tile-based grid movement that makes it feel like Pokemon. Best used alongside another tool, not instead of one.

---

### 3.4 Pyxel Edit

**What it is**: A pixel art editor with built-in tilemap editing features. Designed to be the all-in-one tool for indie devs who create art and levels.

**Visual design experience**: Good for combined art + map workflows. You draw tiles, then arrange them on a tilemap canvas with multiple layers. Includes auto-tiling and tile stamping, which reduce repetitive placement. The animation timeline lets you preview animated tiles (water, palm sway) in context. You can see your entire map as you build it, with the tileset palette alongside.

**Export format**: Exports tilemap data as JSON, XML, or plain text. The JSON export includes width, height, and tile indices, with pretty-printed output for readability. Also exports images as sprite sheets, animated GIFs, or per-frame files. The tilemap JSON is simpler than Tiled's format but also less feature-rich — no entity system, no custom properties per tile.

**Web/Phaser integration**: No direct Phaser plugin. You would parse the JSON export and map it to Phaser's tilemap format, or use the exported image as a static background. The JSON format is straightforward enough that a custom parser would be simple.

**Learning curve**: Lower than Tiled if you are already a pixel artist. The combined art+map workflow reduces context switching. Limited compared to Tiled for complex level design (no object layers, no polygon collision shapes).

**Cost**: $9 (one-time, currently in beta pricing). Available from pyxeledit.com.

**Verdict for Andres World**: **Decent budget option if you want art + map in one tool.** Simpler than Tiled, but also less powerful. The auto-tiling is useful. Main limitation: no entity/object system means NPCs, doors, and interaction zones still need to be defined externally. Better than Aseprite for map layout, worse than LDtk for structured game data.

---

### 3.5 GDevelop Scene Editor

**What it is**: An open-source, no-code game engine with a built-in visual scene editor. Includes a simple tilemap painting tool and Piskel integration for pixel art. Exports to HTML5.

**Visual design experience**: The scene editor is a drag-and-drop canvas where you place objects, paint tiles, and set up interactions visually. The built-in tilemap tool supports freehand brush painting, tile erasing, and horizontal/vertical flipping. For more complex maps, GDevelop can load external Tiled or LDtk tilemaps. Piskel is bundled for creating pixel art sprites directly in the editor.

**Export format**: Exports complete HTML5 games that can be hosted on any web server, itch.io, or gd.games. Like RPG Maker, the export is a full game runtime, not raw map data.

**Web integration**: HTML5 export works natively. The output can be deployed to Vercel. However, like RPG Maker, this replaces your entire stack. All game logic is defined in GDevelop's visual event system (no-code), not TypeScript.

**Learning curve**: Very low for basic games. The visual event system is intuitive. However, the built-in tilemap editor is described as "quick and easy" rather than powerful — GDevelop's own docs recommend Tiled or LDtk for advanced use cases. For a Pokemon-style RPG with dialogue systems, inventory, and scene transitions, you would outgrow the no-code system quickly.

**Cost**: Free (open-source). Premium features available for $5/month but not required for HTML5 export.

**Verdict for Andres World**: **Not the right fit.** GDevelop is great for simple games, but a Pokemon-style overworld with custom NPC dialogue, interior transitions, and dynamic content would push against its no-code constraints. The built-in tilemap editor is simpler than Tiled but less capable. If you are going to learn a tool, LDtk gives you more for the same effort. GDevelop makes more sense if you want to abandon code entirely, but the project's custom interaction requirements (live Thoven metrics, essay rendering, external links) make that impractical.

---

### 3.6 Figma/Design Tool to Code Pipeline

**What it is**: Use Figma (or any design tool) to visually lay out the world map, then export coordinates and zone definitions for code-based rendering.

**Visual design experience**: Excellent for design — Figma is the best visual design tool available. You can draw the entire map, place building shapes, define zones with named frames, and see everything at once. A Figma community member built an entire adventure game ("Figmacraft") using Figma Make in 7 days, proving the concept is viable. There are also pixel art game asset packs and UI kits available in Figma Community.

**The pipeline**: Design the map in Figma at pixel scale (e.g., 800x640 canvas for a 50x40 tile grid at 16px). Each building, NPC zone, and interaction area is a named Figma frame with position/size metadata. Export the visual as PNG and the zone data via Figma's REST API or a plugin. A "Tiled" plugin exists in Figma Community but focuses on UI layout, not game tilemaps.

**Export format**: PNG for visuals. Zone data would come from Figma's API (frame names, positions, dimensions) as JSON. No tilemap-specific export — you would build a custom pipeline to extract zone coordinates.

**Web/Phaser integration**: Fully custom. Load the PNG as a background image in Phaser, then define collision and interaction rectangles from the exported zone data. This abandons tile-based rendering entirely in favor of image + overlay zones.

**Cost**: Figma is free for personal use. The API is free. Any export plugins are generally free.

**Verdict for Andres World**: **Interesting hybrid, but high custom effort.** The visual design experience is unmatched, but the export pipeline does not exist — you would build it yourself. This approach works best if you abandon tile-based grid movement (see Section 2 for DOM-based approaches where this pipeline makes more sense). For authentic Pokemon-style tile movement, Figma adds a design layer without simplifying the technical implementation.

---

### 3.7 Piskel

**What it is**: A free, open-source pixel art editor that runs in the browser. Bundled inside GDevelop. Focused on sprites and animation rather than map editing.

**Visual design experience**: Clean, simple pixel editor with grid, layers, and animation timeline. Good for creating individual tiles and sprite animations. Not designed for map layout — you work on one sprite/tile at a time, not an entire world.

**Tilemap capabilities**: Minimal. You can design individual tiles and export them as sprite sheets, but there is no tilemap arrangement view. You cannot place tiles on a grid to compose a map. Piskel is an art tool, not a level editor.

**Export format**: PNG sprite sheets, animated GIFs, or individual frame PNGs. No tilemap data export.

**Cost**: Free. Web-based (no install), also has desktop builds.

**Verdict for Andres World**: **Not a Tiled replacement.** Piskel is useful for creating tile art and sprite animations, but it has zero map editing capability. Use it as a companion tool for art creation alongside a real map editor.

---

### 3.8 Sprite Fusion

**What it is**: A free, web-based tilemap editor with multi-engine export support. Newer tool focused on simplicity and broad compatibility.

**Visual design experience**: Drag-and-drop tileset loading, auto-tiling system for terrain, and visual tile painting on a canvas. Runs entirely in the browser — no install needed, no account required. The auto-tile system "intelligently fills in terrain based on neighboring tiles," which simplifies ground/path painting. Collision layers are supported — you can mark any layer as a collider. Custom tile data was added in October 2025.

**Export format**: Exports to JSON, TMX (Tiled format), or PNG. Specifically supports export to: **Phaser**, Unity, Godot 3/4, Bevy, Cocos, GDevelop, Love2D, GBStudio, and Defold. The Phaser export is significant — this means the output is directly loadable by Phaser's tilemap system without custom parsing.

**Web/Phaser integration**: **Direct Phaser export support.** This is the only tool in this list (besides Tiled itself) with explicit Phaser compatibility. Export your map, load it in Phaser — done. The Excalibur.js framework also has an official Sprite Fusion plugin.

**Learning curve**: Very low. The web-based interface is simpler than Tiled. No installation, no project setup, just drag in a tileset and start painting. Less powerful than Tiled (no scripting, limited custom properties), but that simplicity is the point.

**Cost**: Free for personal and commercial use. No account required.

**Verdict for Andres World**: **The most practical Tiled replacement for this project.** Free, web-based, Phaser export support, auto-tiling, collision layers, and dramatically simpler than Tiled. The main risk is maturity — Sprite Fusion is newer and less battle-tested than Tiled. But for a 50x40 tile overworld with straightforward layer needs (ground, above, collision), it covers the requirements. Worth testing immediately.

---

### 3.9 Tilesetter

**What it is**: A tileset generator and map editor focused on auto-tiling. Creates "smart tilesets" that automatically composite and update based on rules.

**Visual design experience**: The core workflow is different from other tools — you start with a single base tile, and Tilesetter automatically generates all the edge/corner variants (a full auto-tile set). Then you paint in a sandbox view where Tilesetter "cleverly fixes tiles for you as you draw." This is primarily a tileset creation tool with a map editor bolted on, not a full level editor.

**Export format**: Exports maps as JSON from the sandbox view (tile placements per layer). Also exports directly to Defold Tilemaps, GameMaker Studio 2 Rooms, Godot Tilemaps, and Unity Tilemaps. Auto-tile bitmasks are pre-configured for Blob and Wang sets. No Phaser export.

**Web/Phaser integration**: No direct Phaser support. The JSON export would need custom parsing. The tool is more useful for generating tileset PNGs that you then use in another editor (Tiled, LDtk, Sprite Fusion).

**Learning curve**: Low for tileset generation (its primary use case). Medium for map editing (the sandbox is basic).

**Cost**: $12.99 minimum (available on itch.io and Steam).

**Verdict for Andres World**: **Useful as a tileset prep tool, not a map editor.** If you need to generate auto-tile variants from base tiles, Tilesetter is excellent. But for actual map layout and game data authoring, use it alongside another editor, not instead of one.

---

### 3.10 Programmatic Map Generation (Code-First Approach)

**What it is**: Define the map entirely in code or config files. No visual editor. The project already has a version of this: `scripts/generate-map.ts` (now retired in favor of Tiled).

**How it works in practice**: The existing `generate-map.ts` demonstrates the pattern — define tile GIDs as constants, write functions like `fillRect(data, 12, 14, 21, 22, BUILDING_GID)` to place buildings, and generate a Tiled-compatible JSON file. The map is defined as code, version-controlled, and reproducible.

**Why it was retired**: The script was retired because "overworld.json is now owned by Tiled GUI." The implication: the team wanted visual editing. The script works for initial generation but iterating on visual details (adjusting a palm tree position, tweaking a path curve) is painful when every change requires modifying coordinates in code, running the script, and checking the result in-game.

**Better programmatic approaches**:

- **Config-driven with hot reload**: Define the world as a high-level TypeScript config (buildings, zones, paths as named objects with positions/sizes), generate the tilemap on build, and add hot-reload so changes appear instantly in the browser. This is what `generate-map.ts` was missing — the feedback loop was too slow.

- **Hybrid: code for structure, visual for detail**: Use code to define building footprints, zones, and collision (the structural data that is hard to visualize in Tiled anyway), then use a visual editor only for the decorative ground layer. This splits the problem: code handles the metadata that matters (where buildings are, what they do), and a visual tool handles what it is good at (making it look nice).

- **Runtime generation**: Skip the build step entirely. Define the world config in TypeScript, generate the tilemap data at runtime, and feed it to Phaser's `Tilemap.createFromTileData()`. No JSON file at all. The map IS the code. Changes deploy instantly.

- **DSL (Domain-Specific Language)**: Create a simple text format that maps to tiles:

  ```
  GGGGPPPPGGGG
  G...THOV...G
  G...THOV...G
  GGGGPPPPGGGG
  ```

  Where `G` = grass, `P` = path, `THOV` = Thoven HQ footprint. A parser converts this to Phaser tilemap data. More readable than raw GID arrays, more visual than coordinate functions.

**Cost**: Free (it is your own code).

**Verdict for Andres World**: **The current `generate-map.ts` approach was on the right track but lacked feedback speed.** A hybrid approach — programmatic structure + visual polish — may be the best of both worlds. The key insight from the retired script: the problem was not the approach, it was the iteration speed. With hot-reload and a higher-level config format, code-first map generation could be more maintainable than any visual editor for a map this small (50x40 tiles).

---

### 3.11 Comparison Matrix — Visual Map Editors

| Tool | See World As You Build? | Export to Phaser? | Collision Data? | Entity/NPC System? | Learning Curve | Cost |
|------|------------------------|-------------------|-----------------|---------------------|---------------|------|
| **LDtk** | Yes (world view + auto-layers) | Via TMX export | Yes (IntGrid) | Yes (typed fields) | Low-Medium | Free (MIT) |
| **RPG Maker MZ** | Yes (full WYSIWYG) | Whole game export | Built-in | Yes (events) | Low (maps), High (custom) | $40-80 |
| **Aseprite** | Partial (tilemap mode) | No (custom parser) | No | No | Medium | $20 / Free (source) |
| **Pyxel Edit** | Yes (tilemap canvas) | No (custom parser) | No | No | Low-Medium | $9 |
| **GDevelop** | Yes (scene editor) | Whole game export | Built-in | Visual events | Low | Free |
| **Figma** | Yes (design canvas) | No (custom pipeline) | No | No | Low (design), High (pipeline) | Free |
| **Piskel** | No (sprite-only) | No | No | No | Very Low | Free |
| **Sprite Fusion** | Yes (web canvas) | Yes (direct export) | Yes (layer-based) | Limited (custom tile data) | Very Low | Free |
| **Tilesetter** | Partial (sandbox) | No | No | No | Low | $13 |
| **Programmatic** | No (code-only) | Yes (native format) | Yes (in code) | Yes (in code) | Medium-High | Free |

### 3.12 Top Picks for Andres World

1. **Sprite Fusion** — Lowest friction Tiled replacement. Free, web-based, Phaser export, auto-tiling. Try it first.
2. **LDtk** — Best-in-class level editor if you need more power. Auto-layers and entity system are excellent. Requires a custom Phaser loader or TMX export.
3. **Programmatic hybrid** — Revive the code-first approach with hot-reload and a high-level config format. Best for long-term maintainability. Combine with Sprite Fusion for visual ground layer polish.
4. **Pyxel Edit** — Budget all-in-one if you want art + map in the same tool. Simple but limited.

## 4. Real Examples & Case Studies

This section catalogs real, shipped examples of game-like, pixel-art, and interactive portfolio/personal sites. Organized by approach complexity, from full game engine builds down to pure CSS styling.

---

### 4A. Full Game Engine Builds (Phaser 3, Kaboom/KAPLAY)

These use a real HTML5 game engine with tilemap editors, sprite systems, and game loops. The heaviest approach.

#### ariroffe/personal-website (The Primary Reference)
- **URL**: https://ariroffe.github.io/personal-website/
- **Source**: https://github.com/ariroffe/personal-website
- **Tech**: Phaser 3 + Tiled (tilemap editor) + GIMP (tileset compilation)
- **HN traction**: ~425 points (Show HN, Feb 2022)
- **What it is**: A full Pokemon Gen 1/2-style overworld. Player walks around a top-down map, enters buildings, talks to NPCs. The creator (Ari Roffe, a philosophy academic) built it as their actual personal website.
- **Assets**: Public domain Pokemon-style tilesets (ChaoticCherryCake), sprites from PokeFans and OpenGameArt, 8-bit music remixes by Bulby.
- **Complexity**: HIGH. Requires Phaser 3 game engine knowledge, Tiled map editor proficiency, tileset compilation in GIMP, sprite animation, collision layer design, NPC dialogue scripting, scene transitions for interiors. The HN discussion revealed the creator wanted to embed interactive React components inside Phaser games -- a non-trivial integration challenge.
- **Mobile**: Not explicitly addressed in available documentation. Phaser 3 supports touch input but this project likely had limited/no mobile optimization.
- **Open source**: Yes, fully forkable. But forking means inheriting all the Phaser 3 + Tiled complexity.
- **Key takeaway**: This is proof that the concept works and gets attention (425 HN upvotes is significant). But the creator was building a relatively simple site (academic portfolio) -- not the multi-building, multi-interior, NPC-heavy world that Andres World requires. The complexity scales non-linearly with scope.

#### JSLegendDev/2d-portfolio-kaboom (The Tutorial Template)
- **URL**: https://github.com/JSLegendDev/2d-portfolio-kaboom
- **Tutorial**: https://www.freecodecamp.org/news/create-a-developer-portfolio-as-a-2d-game/ (2-hour freeCodeCamp video)
- **Tech**: Kaboom.js (now KAPLAY) + Tiled
- **What it is**: A beginner-friendly 2D game portfolio template. Top-down Pokemon-like world where the player walks around and interacts with objects that show portfolio content.
- **Complexity**: MEDIUM. The 2-hour tutorial covers setup, asset loading, Tiled map creation, player character, boundaries, dialogue, and camera. Designed for beginners -- but still requires Tiled for map creation.
- **Mobile**: Works on both desktop and mobile (touch controls included).
- **Open source**: Yes, designed as a forkable template.
- **Key takeaway**: This is the most accessible "full game engine" path. Kaboom.js (now KAPLAY) is significantly simpler than Phaser 3 -- fewer concepts, friendlier API, less boilerplate. The 2-hour tutorial time suggests the base is achievable in a weekend. But it still uses Tiled for maps, which is the same pain point Andres World hit.

#### KAPLAY (Kaboom.js Successor)
- **URL**: https://kaplayjs.com/
- **Source**: https://github.com/kaplayjs/kaplay
- **What it is**: Community fork of Kaboom.js after Replit abandoned it (May 2024). Drop-in compatible with Kaboom -- `kaboom()` is an alias for `kaplay()`. Has its own web-based editor (KAPLAYGROUND) with 90+ examples.
- **Relevance**: If going the lightweight game engine route, KAPLAY is the current recommended library over the abandoned Kaboom.js. Simpler API than Phaser 3, actively maintained, good documentation.

#### atilio-ts/rpg-2d-portfolio
- **URL**: https://github.com/atilio-ts/rpg-2d-portfolio
- **Tech**: JavaScript + KaboomJS
- **What it is**: Interactive 2D RPG-style portfolio for showcasing projects and certifications in a gamified environment.
- **Complexity**: MEDIUM. Uses Kaboom.js rather than Phaser, making it lighter weight.
- **Open source**: Yes.

---

### 4B. Specialized Game Tools (GB Studio, Construct)

These use visual, drag-and-drop game creation tools rather than code-first game engines. Lower barrier to entry, but constrained by the tool's capabilities.

#### Martin Gauer -- Game Boy Portfolio (martingauer.com)
- **URL**: https://martingauer.com/
- **Awards**: Awwwards Honorable Mention, FWA, CSS Design Awards, One Page Love
- **Tech**: HTML + CSS for the Game Boy shell (JS only for event handling), GB Studio for the actual game ROM, Photoshop for cartridge art
- **What it is**: A CSS-rendered Game Boy housing an actual playable Game Boy game. The Game Boy console itself is built with pure HTML/CSS. The game inside runs via GB Studio's web export, wired to the CSS buttons.
- **Build time**: ~1 month from discovering GB Studio to having the foundation working. The creator had to learn pixel art, GB Studio, Game Boy system limitations, and music tracker tools.
- **Complexity**: MEDIUM-LOW for the concept, but creative and polished. GB Studio is drag-and-drop with visual scripting -- no programming required for basic games. The clever part is the CSS Game Boy shell + GB Studio web export integration.
- **Mobile**: GB Studio's web export includes mobile controls by default.
- **Open source**: The game is on itch.io (https://2ndlawgames.itch.io/martin-gauer-portfolio-game). GB Studio is free and open source.
- **Key takeaway**: Genuinely innovative approach. GB Studio handles all the "game engine" complexity (movement, dialogue, scene transitions) through a visual editor. The constraint of Game Boy's 160x144 pixel screen actually forces simplicity. About 1 month to learn and build. Won multiple design awards. This is a very different aesthetic from Pokemon overworld, but the tooling approach (visual editor, web export) is instructive.

#### Matteo Santoro -- GameBoy Style Portfolio (matteosantoro.dev)
- **URL**: https://matteosantoro.dev/
- **Tech**: Construct engine + JavaScript
- **What it is**: A GameBoy-style portfolio where you control a small sprite using arrow keys. Inspired by 8-bit GameBoy game graphics. Has settings for color palette and sound, hidden mini-levels, door/key mechanics.
- **Complexity**: MEDIUM. Construct is a visual game engine (drag-and-drop + event sheets). JavaScript used for WebKit compatibility and responsiveness.
- **Mobile**: Fully playable on smartphones (added in a later update).
- **Open source**: Not confirmed.
- **Key takeaway**: Construct engine provides a middle ground -- more capable than GB Studio but less code-heavy than Phaser. The creator iterated with multiple updates (new easter eggs, avatar, improved core, auto-translation). Shows that game-like portfolios benefit from incremental releases.

---

### 4C. 3D / Non-Pixel-Art Interactive Portfolios (Reference Points)

Not pixel art, but the gold standards for "game as portfolio" -- useful for understanding what worked and the effort required.

#### Bruno Simon (bruno-simon.com)
- **URL**: https://bruno-simon.com/
- **Case study**: https://www.awwwards.com/brunos-portfolio-case-study.html
- **Tech**: Three.js + Cannon.js (physics)
- **Build time**: "Months of hard but fun work" -- evenings and weekends. Bruno is a Three.js expert who teaches a Three.js course (threejs-journey.com). He started building a new version in 2025 after the original (released October 2019).
- **What it is**: Drive a 3D car around a miniature world. Objects represent portfolio content. Run into things to interact.
- **Complexity**: VERY HIGH. This is expert-level WebGL/3D work. Bruno literally teaches Three.js professionally. Not a realistic comparison for most developers.
- **Mobile**: Works but experience is degraded (touch controls for a car are inherently worse than keyboard).
- **Key takeaway**: Proof that "game as portfolio" can go viral and become iconic. But the build time (months, from an expert) and the tech complexity (custom Three.js + physics engine) make this a reference point, not a template.

#### Robby Leonardi (rleonardi.com/interactive-resume)
- **URL**: http://www.rleonardi.com/interactive-resume/
- **Awards**: FWA, Awwwards, CSS Design Awards, CSS Winner
- **Tech**: Not publicly documented in detail (likely Flash originally, later HTML5/CSS/JS)
- **What it is**: Side-scrolling platformer resume. A Super Mario-inspired character travels through sections as you scroll. Each "level" represents career milestones, skills, and experience.
- **Complexity**: MEDIUM-HIGH. Scroll-based animation with parallax, character animation, and level design. Not a "real" game engine -- more like a highly choreographed animation.
- **Mobile**: Limited (scroll-based interaction works but experience is degraded).
- **Key takeaway**: The scrolling interaction model is much simpler than free-roam movement. Everything is linear -- you scroll, the character moves. No pathfinding, no collision detection, no map management. Shows that a constrained interaction model can still feel "game-like" and win major design awards. The "completion psychology" insight: people want to scroll to the end to see everything.

---

### 4D. CSS/DOM-Based Retro Portfolios (No Game Engine)

These achieve retro/pixel/game aesthetics using standard web technologies. No canvas, no game engine, no Tiled.

#### NES.css + Next.js Template (faridvatani/retro-pixel-portfolio)
- **URL**: https://github.com/faridvatani/retro-pixel-portfolio
- **Tech**: Next.js + Tailwind CSS + NES.css
- **What it is**: An 8-bit retro pixel portfolio using NES.css, a CSS framework that provides NES/Famicom-style UI components (buttons, dialog boxes, icons, progress bars). Standard portfolio sections (hero, skills, projects) but styled to look like an 8-bit game UI.
- **Complexity**: LOW. This is just a Next.js site with a CSS framework. No game logic, no sprite animation, no map. NES.css is CSS-only (no JS dependency). Components include pixel-art buttons, dialog boxes, character icons.
- **Mobile**: Responsive by default (standard web layout).
- **Open source**: Yes, forkable template.
- **NES.css itself**: https://github.com/nostalgic-css/NES.css -- 20k+ GitHub stars. Provides pixel-art styled UI components via CSS box-shadows. CSS-only, no JS.
- **Key takeaway**: Gets 80% of the visual nostalgia with 10% of the effort. Looks retro and feels game-like, but is fundamentally a standard web page. No movement, no exploration -- just styled content. Good for the aesthetic, not the interaction model.

#### bearlike/Pixel-Portfolio-Website
- **URL**: https://github.com/bearlike/Pixel-Portfolio-Webite
- **Tech**: Pure HTML + CSS (no JavaScript, no frameworks)
- **What it is**: Nintendo-inspired single-page portfolio. Lightweight, responsive, static, and minimalistic. Modular design for easy content swapping.
- **Complexity**: VERY LOW. Pure HTML/CSS, no build tools. Static site.
- **Mobile**: Fully responsive.
- **Open source**: Yes.
- **Key takeaway**: Proves you can achieve a pixel/retro aesthetic with literally zero JavaScript. But it is a styled webpage, not an interactive experience.

#### omaralhami/Pixel-Art-Portfolio-Website
- **URL**: https://github.com/omaralhami/Pixel-Art-Portfolio-Website
- **Tech**: HTML5 (semantic markup) + CSS3 (custom properties, Flexbox, Grid, animations) + vanilla JavaScript
- **What it is**: Minimalist portfolio with pixel art touches and modern design. Content-first with subtle retro elements. Responsive, accessible, optimized.
- **Complexity**: LOW. Vanilla web technologies, no build pipeline, servable with any static file server.
- **Open source**: Yes.
- **Key takeaway**: "Pixel art touches" on a modern layout. The pixel art is decorative, not structural. Shows that you do not need the full retro commitment to get the vibe.

#### 1-Bit Pixel Art Dev Portfolio (Awwwards Nominee)
- **URL**: https://www.awwwards.com/sites/1-bit-pixel-art-dev-portfolio (by console-buche)
- **Tech**: Not fully documented; appears to be standard web stack with CSS pixel art
- **What it is**: Awwwards-nominated developer portfolio using 1-bit (black and white) pixel art aesthetic.
- **Complexity**: LOW-MEDIUM. Standard web tech but with significant art direction.
- **Key takeaway**: Constraint (1-bit color) can create a stronger visual identity than more complex approaches.

---

### 4E. Hybrid Approaches (DOM + Game Elements)

These combine standard web tech with selective game-like elements. The most promising middle ground.

#### mewmewdevart -- Retro Gamified Portfolio (DEV Community Challenge Winner)
- **URL**: https://devcommunityportfoliochallenge2026-574008284484.us-central1.run.app/
- **Source**: https://github.com/mewmewdevart/DevCommunityPortfolioChallenge2026
- **Tech**: Node.js + Vite (port 5173 dev server), likely TypeScript/React-based
- **What it is**: 2D top-down pixel art room where you control a character. By interacting with objects (computer, video game console, backpack), you access projects, play mini-games, and view resume content. Inspired by Windows 95/XP and PS2 aesthetics.
- **Features**: Custom window manager (drag-and-drop, resize, minimize, z-index, focus), taskbar with real-time state, multiple apps (Notepad, Paint, Calculator), 2D character-controlled room.
- **Complexity**: MEDIUM-HIGH. The window manager alone is significant work. But it is DOM-based -- no Tiled, no game engine physics. The character movement is contained to a single room (not a full overworld).
- **Mobile**: Responsive. Meets WCAG 2.1 AA/AAA accessibility standards. Keyboard navigation and screen reader support. Multi-language (EN/ES/PT-BR).
- **Open source**: Yes.
- **Key takeaway**: Arguably the most relevant example for Andres World. It achieves the "walk around a pixel art space and interact with things" experience without a full game engine. The scope is limited to one room (not a town), which keeps complexity manageable. The Windows 95 window manager is a creative way to handle content display. Won a DEV Community portfolio challenge.

#### Retro Journey Dev (retrojourney.dev)
- **URL**: https://retrojourney.dev/
- **Tech**: React + Go (backend)
- **What it is**: Interactive pixel-art CV where you explore career milestones as a playable character in a sandbox world. Real-time player movement, discoverable career milestones.
- **Complexity**: MEDIUM. React frontend for rendering, Go backend presumably for data. The "sandbox world" is more focused than a full Pokemon overworld.
- **Key takeaway**: React-based rendering of a game-like world. No Phaser, no Tiled -- the game logic runs in React components. This validates the "DOM/React can do simple game movement" thesis.

#### Ali Shirani -- Windows 95 Portfolio
- **Tech**: React + Vite + TypeScript + Tailwind + Zustand (state management)
- **What it is**: Windows 95-themed portfolio with draggable windows, taskbar, start menu. Each section opens as a window. Components include Window.tsx, Taskbar.tsx, StartMenu.tsx, Resume.tsx, Contact.tsx. Uses absolute positioning and z-index for window simulation.
- **Complexity**: MEDIUM. Standard React patterns (no game engine), but the window management requires careful state handling. Zustand for state management.
- **Key takeaway**: Modern web tech can convincingly simulate retro OS environments. The "game-like" feeling comes from the interaction model (dragging, clicking, opening) rather than player movement.

#### LordPrkr/RPG-Portfolio (ParkerGits)
- **URL**: https://github.com/ParkerGits/RPG-Portfolio
- **What it is**: Portfolio themed as an RPG shop cutscene. Character enters a shop, approaches a shopkeeper who presents portfolio items as "wares." Uses predetermined paths + state machine instead of free keyboard movement.
- **Complexity**: LOW-MEDIUM. No free-roam movement simplifies everything dramatically. State machine approach with click-to-move between NPCs.
- **Key takeaway**: The "state machine with predetermined paths" approach is an interesting simplification. No pathfinding, no collision -- just scripted animations between fixed points. Visitors click to move between NPCs rather than using keyboard controls.

---

### 4F. Pokemon-Themed (But Not Overworld) Portfolios

#### cambboyle/pokemon-portfolio
- **URL**: https://github.com/cambboyle/pokemon-portfolio
- **Tech**: React + Vite
- **What it is**: Pokemon-themed portfolio using Pokedex-style UI to present projects. Not an overworld -- uses the Pokemon visual language (Pokedex cards, type badges) applied to standard portfolio content.
- **Complexity**: LOW. Standard React app with themed styling.
- **Key takeaway**: You can get the Pokemon nostalgia without building a game at all. Pokedex-style cards for projects, type badges for tech stack, etc. Totally different from what Andres World aims for, but shows the theming-only approach.

#### lironamy/PokemonPortfolio
- **URL**: https://github.com/lironamy/PokemonPortfolio
- **Tech**: React + TypeScript + Node.js
- **What it is**: Pokemon-themed portfolio using Pokemon visual metaphors (pocket monsters represent projects). Not a game -- a themed web app.
- **Complexity**: LOW. Standard web app with creative theming.

---

### 4G. Reference: neal.fun (Interactive But Not Game Engine)

#### neal.fun
- **URL**: https://neal.fun
- **Creator**: Neal Agarwal
- **Tech**: React + Node.js + MongoDB, hosted on Netlify. Everything runs client-side in browsers.
- **Dev tools**: VS Code, Chrome
- **What it is**: Collection of viral interactive web experiences (Spend Bill Gates' Money, The Deep Sea, The Size of Space). Each is a standalone creative page with unique interactions.
- **Complexity per page**: LOW to MEDIUM. Each experience is a focused, single-concept page. No game engine -- just creative use of scroll, click, and drag interactions with React.
- **Key takeaway**: neal.fun proves that focused, creative interactivity beats complex game engines for web engagement. Each experience is self-contained, loads fast, and works on mobile. The "just React" approach enables rapid iteration. Neal ships dozens of different experiences -- the velocity matters more than the engine sophistication.

---

### 4H. LennyRPG — The Most Directly Comparable Project (Added 2026-03-18)

#### LennyRPG (lennysnewsletter.com)
- **URL**: lennysnewsletter.com (built by Ben, covered in Lenny's Newsletter)
- **Source**: Detailed build post at lennysnewsletter.com/p/how-i-built-lennyrpg
- **Tech**: Phaser 3 + Supabase + Vercel + Claude Code + GPT Image Gen
- **What it is**: A pixel art RPG built around Lenny's Podcast. Players walk around a top-down map, encounter NPCs based on real podcast guests (250+ avatars), and take quizzes based on episode transcripts. Quiz-based battles instead of combat.
- **Build process**:
  1. Defined concept with Miro mockups
  2. Generated PRD through AI-guided Q&A
  3. **Started with RPG-JS, abandoned it** — framework was "heavily designed around inventory systems and weapon-based combat," wrong for quiz-based content
  4. Pivoted to Phaser 3 using Michael Hadley's "modular game worlds" template (the same tutorial referenced in Andres World's design doc)
  5. Used AI heavily: Claude Code for wiring audio/config, GPT for generating 250+ consistent pixel art avatars, CLI tools for batch processing 300+ transcripts
  6. Supabase MCP for automatic table creation and client config
- **Pain points**:
  - **Phaser UI polish was the hardest part** — fonts, positioning, visual hierarchy. Things that are trivial in CSS required significant effort in canvas.
  - Managing 250+ consistent pixel art avatars from diverse source images
  - Multiple framework iterations before finding the right foundation
- **Key quote**: "Nailing the core idea and PRD determines 80% of how smooth the rest of the build will be."
- **Complexity**: HIGH — but managed through heavy AI assistance and a pre-built Phaser template
- **Open source**: Not confirmed

**Critical takeaway for Andres World**:
1. **RPG-JS is disqualified in practice** — Ben tried it and abandoned it for the same type of project. Too opinionated for content sites.
2. **Phaser CAN work** but only if you start from a working template (not from scratch with Tiled) and use AI to handle the tedious parts.
3. **The UI polish problem is the real bottleneck** — not the map, not the movement, but making text, fonts, and positioning look right in canvas. This is the strongest argument for DOM rendering (Path A), where all that polish is just CSS.
4. **The build approach matters as much as the tech** — Ben's PRD-first, proof-of-concept-second, content-third workflow matches GSD's plan-first philosophy.

---

### Summary: Patterns Across All Examples

| Approach | Build Time | Complexity | Mobile | Interactivity | Examples |
|----------|-----------|------------|--------|---------------|----------|
| **Full game engine (Phaser 3)** | Weeks-months | HIGH | Hard | Full game | ariroffe |
| **Lighter game engine (Kaboom/KAPLAY)** | Days-weeks | MEDIUM | Built-in | Full game | JSLegendDev, atilio-ts |
| **Visual game tool (GB Studio/Construct)** | ~1 month | MEDIUM-LOW | Built-in | Constrained game | Martin Gauer, Matteo Santoro |
| **DOM hybrid (React + game elements)** | Days-weeks | MEDIUM | Native web | Walk + interact | mewmewdevart, retrojourney.dev |
| **Retro CSS framework (NES.css)** | Days | LOW | Native web | Standard web | faridvatani, bearlike |
| **Themed standard site** | Days | LOW | Native web | Standard web | cambboyle, lironamy |

**Key insights from the research:**
1. **Tiled is consistently the bottleneck** -- every project that used Tiled (Phaser, Kaboom) had map creation as the most time-consuming and error-prone step.
2. **Scope kills game portfolios** -- the shipped examples that actually work well have LIMITED scope (one room, one path, small map). The ambitious multi-building projects tend to stall or ship incomplete.
3. **DOM-based approaches are underrated** -- mewmewdevart and retrojourney.dev prove that React/DOM can handle simple character movement and interaction without a game engine. You get standard web benefits (accessibility, responsiveness) for free.
4. **The aesthetic matters more than the engine** -- NES.css with no game logic at all can feel more "retro game" than a poorly executed Phaser project. Art direction > tech stack.
5. **~1 month is the sweet spot** -- Martin Gauer (GB Studio), the Kaboom tutorial (weekend to learn, days to customize), and DOM hybrids all land in the "weeks not months" range for a polished result. Phaser 3 full builds push into months.
6. **Mobile support correlates inversely with game complexity** -- the simpler the approach, the better the mobile experience. Full game engines require explicit mobile work; DOM-based approaches get it for free.

## 5. Recommendation & Decision Matrix

### The Core Diagnosis

The problem isn't Phaser 3 — it's the **design pipeline**. Tiled produces opaque JSON that you can't reason about without the editor open. Every map change requires: open Tiled → find the right layer → paint tiles → export JSON → reload game → check result → repeat. For a 50x40 tile map with 10+ buildings, this loop is excruciating.

The second problem is **scope creep via engine complexity**. Phaser 3 + Grid Engine gives you collision layers, pathfinding, physics, cameras, scene management, input handling — features that are powerful but demand you learn and maintain them. For what is fundamentally a **clickable pixel art map with character movement**, this is over-engineered.

### Three Viable Paths Forward

---

#### Path A: "DOM Game" — React + CSS Grid + Pixel Art (RECOMMENDED)

**What it is**: Abandon canvas entirely. Render the map as a CSS Grid of div elements with sprite sheet backgrounds. Character moves via CSS transforms. NPCs and buildings are DOM elements with click handlers. Dialog boxes are React components.

**Why this works for Andres World**:
- 50x40 map = 2,000 divs — trivial for modern browsers
- Every building, NPC, and object is a real DOM element (accessible, clickable, SEO-friendly via aria labels)
- Dialog boxes are just React components — no plugin needed
- Interior transitions are React route changes, not Phaser scene switches
- Mobile works natively — no D-pad overlay needed, tap to move
- You design the map in TypeScript/JSX, not Tiled — the map IS the code
- Hot reload works instantly — change a building position, see it immediately
- NES.css or custom pixel art CSS gives you the retro aesthetic for free

**What you lose**:
- Smooth sprite animation (CSS `steps()` gets close but isn't pixel-perfect)
- Camera scrolling (need to implement viewport logic, but doable with CSS transforms on a container)
- The "authentic" Phaser game feel (slightly less fluid than a real game engine)

**Tech stack**: React + Vite + TypeScript + CSS Grid + NES.css (for UI components). No Phaser, no Grid Engine, no Tiled.

**Build time estimate**: 2-3 weeks to feature parity with current state, then faster iteration forever after.

**Validation**: mewmewdevart won the DEV Community 2026 portfolio challenge with exactly this pattern. retrojourney.dev ships character movement in React. Neither uses a game engine.

**Risk**: Low. If it doesn't feel right, you can always go back to Phaser. But the code you write (React components, TypeScript world config) is more portable than Phaser scenes.

---

#### Path B: "Simpler Engine" — KAPLAY + Sprite Fusion

**What it is**: Keep the game engine approach but switch to a simpler engine (KAPLAY, the Kaboom.js successor) and a simpler map editor (Sprite Fusion, web-based with direct Phaser/game engine export).

**Why this works**:
- KAPLAY has a dramatically simpler API than Phaser 3 — fewer concepts, less boilerplate
- Sprite Fusion is free, web-based, has auto-tiling, and exports to multiple formats
- The JSLegendDev 2D portfolio template provides a working starting point (2-hour tutorial)
- Still a "real game" — smooth sprite animation, proper camera, authentic feel

**What you lose**:
- Still a game engine — still need to learn KAPLAY's patterns
- Still a tilemap editor — Sprite Fusion is simpler than Tiled, but it's still a visual editor you have to learn
- Mobile still requires explicit work (touch controls)

**Tech stack**: KAPLAY + Sprite Fusion + Vite + TypeScript.

**Build time estimate**: 1-2 weeks with the JSLegendDev template as starting point.

**Risk**: Medium. You're swapping one game engine for another. The map editor problem is improved but not eliminated.

---

#### ~~Path C: "RPG Framework" — RPGJS~~ (DISQUALIFIED)

**What it is**: Use RPGJS, a purpose-built RPG framework that provides grid movement, map transitions, NPC events, dialog boxes, and a Vue.js UI layer — all built in.

**Why it was initially attractive**: Grid movement, scene transitions, NPC interactions, and dialog are all first-class features. Vue.js UI layer for DOM-rendered dialogs. Designed specifically for RPG-style games.

**Why it's disqualified**: LennyRPG's creator (Ben) started with RPG-JS and abandoned it. His finding: the framework is "heavily designed around inventory systems and weapon-based combat," making it unsuitable for content-focused sites that use RPG aesthetics without RPG mechanics. Andres World has the same problem — it's a portfolio site in RPG clothing, not an actual RPG. RPG-JS would fight you on every non-standard interaction (live metrics boards, essay rendering, external links, dynamic content).

**Additional risks**: Still uses Tiled for maps. Smaller community than Phaser. Vue.js instead of React.

---

### Decision Matrix

| Dimension | Path A: DOM Game | Path B: KAPLAY | ~~Path C: RPGJS~~ |
|-----------|-----------------|----------------|-------------------|
| **Complexity** | Lowest | Medium | ~~Medium~~ |
| **Map design** | Code (TypeScript) | Sprite Fusion | ~~Tiled/LDtk~~ |
| **Grid movement** | DIY (simple) | DIY (medium) | ~~Built-in~~ |
| **Dialog system** | React components | DIY or plugin | ~~Built-in (Vue)~~ |
| **Interior transitions** | React Router | Scene system | ~~Built-in~~ |
| **Mobile support** | Native web | Explicit work | ~~Explicit work~~ |
| **Accessibility** | Full (DOM) | None (canvas) | ~~Partial (Vue UI)~~ |
| **"Game feel"** | 70% | 90% | 95% |
| **Iteration speed** | Fastest | Medium | Medium |
| **Community** | React ecosystem | KAPLAY (small) | RPGJS (smallest) |
| **Rewrite effort** | Full rewrite | Partial rewrite | Full rewrite |
| **Long-term maintenance** | Easiest (just React) | Medium | Harder (niche) |

### My Recommendation: Path A (DOM Game)

**Start with Path A.** Here's why:

1. **The map design problem disappears.** No Tiled, no Sprite Fusion, no LDtk. The map is TypeScript. You define buildings, paths, and zones as objects with positions. Claude Code can generate and modify the map config directly. This is the single biggest quality-of-life improvement.

2. **The stack shrinks dramatically.** React + Vite + TypeScript. That's it. No Phaser docs to reference. No Grid Engine plugin to configure. No tileset GID chains to debug.

3. **Content updates are trivial.** Adding a new NPC = adding a React component. Changing a building = editing a config object. Writing dialog = editing a string. No export pipeline, no rebuild, no pray-it-still-works.

4. **You get real web benefits.** Each building could be a proper URL route (andresmartinez.com/thoven-hq). Accessibility works. Screen readers can read NPC dialog. Social sharing previews work.

5. **The aesthetic is achievable.** Pixel art CSS, NES.css for UI components, sprite sheets for character animation, CSS `image-rendering: pixelated` for crisp scaling. It won't be identical to a Phaser game, but it'll be close enough — and the pixel art direction matters more than the rendering engine.

6. **Escape hatch exists.** If the DOM approach doesn't feel right for movement, you can embed a small canvas element just for the character + movement layer while keeping everything else in DOM. This hybrid is much simpler than full Phaser.

### What Path A Looks Like Concretely

```
src/
  world-config.ts        ← buildings, zones, NPCs as typed objects
  components/
    WorldMap.tsx          ← CSS Grid container, renders tiles
    Character.tsx         ← sprite animation, keyboard movement
    NPC.tsx               ← clickable characters with dialog
    Building.tsx          ← clickable structures with enter/popup behavior
    DialogBox.tsx         ← Pokemon-style text box (NES.css styled)
    Interiors/
      ThovenHQ.tsx        ← separate "room" component
      AndresRoom.tsx
      EngineeringLab.tsx
  hooks/
    useGridMovement.ts    ← arrow keys → CSS transform updates
    useDialog.ts          ← dialog queue + typewriter effect
  styles/
    pixel.css             ← image-rendering, font, NES.css overrides
```

No Tiled. No JSON maps. No GID debugging. Just React.

### Suggested Next Step

**Build a 30-minute prototype of Path A.** A 10x10 CSS Grid, a character that moves with arrow keys, one clickable building that opens a dialog. If it feels right, commit to it. If it feels wrong, try Path B with the KAPLAY template.
