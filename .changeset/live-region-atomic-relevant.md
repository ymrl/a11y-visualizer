---
"@a11y-visualizer/browser-extension": patch
---

Improve live region announcement detection to better match ARIA semantics:

- An explicit `aria-atomic="false"` on `role="status"` / `role="alert"` regions is now honored instead of always being treated as atomic.
- Text changes are only announced when `aria-relevant` includes `text` (or `all`). Because inserting text into a region is a text-node addition (not an element addition), regions such as `aria-relevant="additions"` no longer announce inserted or mutated text, matching NVDA's behavior.
