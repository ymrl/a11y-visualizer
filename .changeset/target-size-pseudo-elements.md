---
"@a11y-visualizer/rules": patch
"@a11y-visualizer/browser-extension": patch
---

Target size: a small control whose clickable area is expanded to at least 24×24px by a `::before` or `::after` pseudo-element is no longer reported as a small target. Pseudo-elements without content, or with `display: none`, `visibility: hidden` or `pointer-events: none`, are not counted.
