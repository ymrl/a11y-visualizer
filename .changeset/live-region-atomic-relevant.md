---
"@a11y-visualizer/browser-extension": patch
---

Improve live region announcement detection to better match ARIA semantics:

- An explicit `aria-atomic="false"` on `role="status"` / `role="alert"` regions is now honored instead of always being treated as atomic.
- Text changes are only announced when `aria-relevant` includes `text` (or `all`), so regions such as `aria-relevant="additions"` no longer announce text mutations.
