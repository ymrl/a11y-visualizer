---
"@a11y-visualizer/rules": patch
---

Improve heading level detection to follow WAI-ARIA and HTML-AAM:

- `aria-level` now overrides the implicit level of `h1`–`h6` elements (e.g. `<h2 aria-level="4">` is shown as level 4).
- `role="heading"` without `aria-level` is now treated as level 2 (its implicit level) and reported as a warning instead of an error.
