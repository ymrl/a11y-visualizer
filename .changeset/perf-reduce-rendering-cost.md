---
"@a11y-visualizer/browser-extension": patch
---

Improve rendering performance on complex web applications:

- Stop re-collecting and re-evaluating the whole page on every mouse move. Pointer-driven re-collection now happens only when the element under the pointer changes (`mouseover`/`mouseout`), which still picks up CSS `:hover`-driven UI such as dropdown menus.
- Throttle pointer-tracking updates in interactive mode with `requestAnimationFrame`, and memoize each tip so only tips whose hover state changed re-render.
- Use stable React keys based on the target element, avoiding unnecessary unmount/remount of tips when the collected list shifts.
- Share the language setting across all tips through a single store, instead of reading extension storage and registering a listener per tip.
- Skip scroll-container lookup (which walks ancestors with `getComputedStyle`) for elements outside the viewport, and cache lookup results within a collection pass.
