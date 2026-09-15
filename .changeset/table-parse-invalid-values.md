---
"@a11y-visualizer/table": patch
"@a11y-visualizer/browser-extension": patch
---

Fix crashes and hangs when analyzing tables with unusual or invalid markup:

- Tables with no rows, or whose rows contain no cells, no longer throw while being parsed.
- Invalid `rowspan` / `colspan` / `aria-rowspan` / `aria-colspan` values (non-numeric or negative) now fall back to the default of 1, instead of producing `NaN` sizes that made header lookup throw.
- Invalid `aria-rowindex` / `aria-colindex` values now fall back to the position implied by document order, instead of producing `NaN` coordinates.
- `aria-rowspan` / `aria-colspan` are clamped to the same limits as their HTML counterparts, so an extreme value no longer blocks the page for several seconds during header lookup.
- The reported row count now accounts for every row, so a trailing row without cells no longer reports the table as empty, and a `rowspan` reaching past the last row extends the row count as the HTML table model requires.
