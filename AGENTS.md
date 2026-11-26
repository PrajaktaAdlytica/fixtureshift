# Prototype Instructions

Run the local server yourself and open the preview in the browser available to this environment. Do not give the user server-start instructions when you can run it.

Before making substantial visual changes, use the Product Design plugin's `get-context` skill when the visual source is unclear or no longer matches the current goal. When the user gives durable prototype-specific design feedback, preferences, or decisions, record them in `AGENTS.md`.

When implementing from a selected generated mock, treat that image as the source of truth for layout, component anatomy, density, spacing, color, typography, visible content, and hierarchy.

Build app UI in `src/`. Keep `.openai/hosting.json`, `worker/index.js`, `scripts/prepare-sites-build.mjs`, and `tests/sites-worker.test.mjs` intact so the same local prototype can be handed to Sites. Before a Sites handoff, run `npm run build` and `npm run test:sites`; the build must leave `dist/client/index.html`, `dist/server/index.js`, and `dist/.openai/hosting.json`.

FixtureShift visual target is the approved continuous mosaic mockup. Keep the pitch grid and F-107 tile connected from the opening through comparison and review. All cards and screen panels stay upright, with weathered sports colors. The public walkthrough is simulated, records team notices locally, and leaves final operating authority with league staff.

The cinematic homepage direction replaces the flat paper opening. Lead with real ceramic mosaic artwork in separate camera angles, animate imagery and upright fixtures with Lenis and GSAP, and keep the map selection synchronized with the workbench. Preserve the reduced-motion path.

Keep the improved hero composition. Make chapter transitions scroll-controlled with a push into the ceramic surface, an overhead match cut, and separate Case, Compare, and Evidence reveals. Hold the dashboard in place on large screens while its panels appear.

Give Product, Use cases, Pricing and Closing distinct mosaic scenes and distinct upright scroll reveals. Preserve the horizontal product rail, pricing actions, mobile legibility and the motion-off view.

Extend the ceramic visual language to all FixtureShift routes. Use a distinct scene and route-specific diagram outside the homepage, with level dashboard columns and cards. Use the tessera icon family and restrained ceramic hover and focus treatments in navigation, cards, buttons and footer.

The approved FixtureShift identity is The Shift Tile mosaic. Use the outlined dark-surface lockup in shared navigation and footer, and the compact standalone mark in the rescheduling views. Keep the simplified 16 px favicon and the detailed larger variants.

Homepage scroll should feel deliberate. Keep the camera easing gentle, give the atlas transition and dashboard beats enough scroll distance, and preserve native touch and reduced-motion behavior.
