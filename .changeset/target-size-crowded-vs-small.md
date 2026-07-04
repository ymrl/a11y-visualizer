---
"@a11y-visualizer/browser-extension": patch
"@a11y-visualizer/rules": patch
---

Refine target-size warnings to distinguish crowded targets from isolated small targets:

- A small target that is close to another target (inadequate spacing) is now reported as "Crowded small targets".
- A small target with adequate spacing (including an isolated target with no nearby targets) is now consistently reported as "Small target", instead of being suppressed when other targets exist elsewhere on the page.
