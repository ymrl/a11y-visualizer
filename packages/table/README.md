# @a11y-visualizer/table

A table structure parser that follows the HTML table model. It computes the position and size of each cell (taking `colspan`/`rowspan` into account) and resolves the header cells that apply to a given cell.

This package is part of [Accessibility Visualizer](../../README.md), but it has no dependency on the browser extension and can be used on its own in any environment with a real DOM.

## Features

- Supports `<table>` elements and ARIA tables (`role="table"`, `grid`, `treegrid`) built with `row`, `rowgroup`, `cell`, `gridcell`, `columnheader`, and `rowheader`
- Handles `colspan`/`rowspan` and `aria-colspan`/`aria-rowspan`, clamped to the limits in the HTML spec
- Respects `aria-colindex`/`aria-rowindex` for positioning cells
- Resolves headers through the `headers` attribute, or through `scope` (`row`, `col`, `rowgroup`, `colgroup`, and auto) following the HTML header assignment algorithm
- Puts `<tfoot>` at the end, as the HTML spec does
- Tolerates malformed markup (invalid or huge span values) without crashing or hanging

## Installation

This package is not published to npm. Inside this monorepo, add it as a workspace dependency:

```json
{
  "dependencies": {
    "@a11y-visualizer/table": "workspace:*"
  }
}
```

The package exports its TypeScript sources directly (`src/index.ts`), so the consumer needs a bundler or TypeScript setup that can compile them. It depends on [`@a11y-visualizer/dom-utils`](../dom-utils/README.md).

## Usage

```ts
import { Table } from "@a11y-visualizer/table";

const tableElement = document.querySelector("table")!;
const table = new Table(tableElement);

table.rowCount; // number of rows
table.colCount; // number of columns

const td = tableElement.querySelector("td")!;
const cell = table.getCell(td);
if (cell) {
  cell.positionX; // column index (0-based)
  cell.positionY; // row index (0-based)
  cell.sizeX; // columns spanned
  cell.sizeY; // rows spanned

  // Header cells that apply to this cell
  const headers = table.getHeaderElements(cell);
  headers.map((h) => h.textContent);
}
```

Parsing a table walks its whole structure, so create one `Table` per table element and reuse it when you inspect many cells of the same table.

## API

### `class Table`

`new Table(element)` parses a `<table>` element or an element with the `table`, `grid`, or `treegrid` role.

Properties:

| Property | Description |
| --- | --- |
| `element` | The table element passed to the constructor. |
| `rowCount` / `colCount` | Size of the table in rows and columns (`aria-rowcount`/`aria-colcount` take precedence when present). |
| `cells` | Parsed cells, as an array of rows. |
| `rowGroups` / `colGroups` | Parsed row groups (`<thead>`, `<tbody>`, `<tfoot>`, `rowgroup`) and column groups (`<colgroup>`), with their position and size. |

Each cell has `element`, `positionX`, `positionY`, `sizeX`, `sizeY`, and `headerScope` (`"row" | "col" | "rowgroup" | "colgroup" | "auto" | "none"`).

Methods:

| Method | Description |
| --- | --- |
| `getCell(el)` | Returns the parsed cell for a cell element, or `null` if it is not in the table. |
| `getHeaderElements(cell)` | Returns the header cell elements for the cell: the `headers` attribute targets if present, otherwise row, column, row group, and column group headers. Empty cells and the cell itself are excluded, and there are no duplicates. **Use this in most cases.** |
| `getSlotCells(x, y)` | Returns the cells that occupy the slot at column `x`, row `y` (0-based), including cells spanning into it. |
| `isColHeader(cell)` / `isRowHeader(cell)` | Whether the cell acts as a column or row header (`scope`, or inferred from surrounding cells for auto scope). |
| `getRowHeaderElements(cell)` | Row headers only. |
| `getColHeaderElements(cell)` | Column headers only. |
| `getRowGroupHeaderElements(cell)` | Row group headers (`scope="rowgroup"`) only. |
| `getColGroupHeaderElements(cell)` | Column group headers (`scope="colgroup"`) only. |
| `getAttributeHeaderElements(cell)` | Cells referenced by the `headers` attribute only (`<th>`/`<td>`). |

### Helper functions

| Export | Description |
| --- | --- |
| `getRowElements(tableEl)` | Row elements (`<tr>` or `role="row"`) of a table, including those inside row groups and `presentation`/`none` wrappers. `<tfoot>` rows come last. |
| `getRowGroupElements(tableEl)` | Row group elements (`<thead>`/`<tbody>`/`<tfoot>` or `role="rowgroup"`) of a table. `<tfoot>` comes last. |
| `getCellElements(rowEl)` | Cell elements of a row (`<th>`/`<td>`, or `cell`/`gridcell`/`columnheader`/`rowheader` roles), looking through `presentation`/`none` wrappers. |
| `isEmptyCellElement(el)` | Whether a cell has no child elements and only whitespace text. Empty cells are never treated as headers. |

## Development

```bash
# Run tests (Vitest browser mode with Playwright: Chromium and Firefox)
pnpm --filter=@a11y-visualizer/table test

# Lint / format
pnpm --filter=@a11y-visualizer/table lint
pnpm --filter=@a11y-visualizer/table lint-fix
```

Tests run in real browsers. If Playwright browsers are not installed yet, run `pnpm install-playwright` at the repository root.

## License

MIT. See [LICENSE.txt](../../LICENSE.txt).
