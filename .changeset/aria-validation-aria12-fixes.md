---
"@a11y-visualizer/rules": patch
---

Align ARIA attribute validation with WAI-ARIA 1.2 to reduce false positives:

- `aria-modal` is now accepted on `alertdialog` (in addition to `dialog`).
- `aria-valuemin` / `aria-valuemax` / `aria-valuenow` / `aria-valuetext` are now accepted on `meter`.
- `aria-colcount` / `aria-rowcount` / `aria-setsize` now accept `-1` (unknown total).
- `aria-activedescendant` is now accepted on `toolbar` and `spinbutton`.
- `aria-haspopup` and `aria-errormessage` are validated as non-global attributes, so misuse on unsupported roles is now reported.
