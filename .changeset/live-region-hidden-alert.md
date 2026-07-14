---
"@a11y-visualizer/browser-extension": patch
---

Announce alerts that become visible after being hidden. Previously, a `role="alert"` element that was hidden (via `display:none`, the `hidden` attribute, `aria-hidden`, `inert`, or `aria-busy`) when first scanned would never be announced even after it became visible. Such alerts are now re-checked on subsequent scans and announced once they become renderable.
