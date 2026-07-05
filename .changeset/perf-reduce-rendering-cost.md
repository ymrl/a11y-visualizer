---
"@a11y-visualizer/browser-extension": patch
---

Improve rendering performance on complex web applications:

- Stop re-collecting and re-evaluating the whole page on every mouse move. DOM changes are still detected by the MutationObserver.
- Throttle pointer-tracking updates in interactive mode with `requestAnimationFrame`, and memoize each tip so only tips whose hover state changed re-render.
- Use stable React keys based on the target element, avoiding unnecessary unmount/remount of tips when the collected list shifts.
- Share the language setting across all tips through a single store, instead of reading extension storage and registering a listener per tip.
- Skip scroll-container lookup (which walks ancestors with `getComputedStyle`) for elements outside the viewport, and cache lookup results within a collection pass.
