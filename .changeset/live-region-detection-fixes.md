---
"@a11y-visualizer/browser-extension": patch
---

Improve live region announcement accuracy:

- An explicit `aria-live` value now overrides the implicit level of a role, so `role="alert" aria-live="polite"` is announced politely.
- Announcement text now excludes descendants hidden with `aria-hidden="true"` or CSS (`display:none` / `visibility:hidden`), matching what screen readers actually read.
- Elements whose effective role is not a live region (e.g. `role="button status"`) and invalid `aria-live` values are no longer treated as live regions.
- For atomic regions, the accessible name is taken from the atomic element that is announced.
- Live regions added inside existing Shadow DOM are now detected.
