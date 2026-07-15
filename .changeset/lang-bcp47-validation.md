---
"@a11y-visualizer/rules": patch
"@a11y-visualizer/browser-extension": patch
---

Validate `lang` / `xml:lang` values as BCP 47 (RFC 5646) language tags. Syntactically invalid values (e.g. `lang="japanese"`) are now reported as an error, since WCAG 3.1.1 / 3.1.2 require a valid language tag.
