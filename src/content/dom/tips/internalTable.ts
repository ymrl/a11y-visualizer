import { getKnownRole } from "../getKnownRole";

type RowGroup = {
  positionY: number;
  sizeY: number;
  element: Element | null;
};

type ColGroup = {
  positionX: number;
  sizeX: number;
};

type Scope = "row" | "col" | "rowgroup" | "colgroup" | "auto" | "none";
type Cell = {
  element: Element;
  sizeX: number;
  sizeY: number;
  positionX: number;
  positionY: number;
  headerScope: Scope;
};

export class InternalTable {
  element: Element;
  rowGroups: RowGroup[];
  colGroups: ColGroup[];
  cells: Cell[][];
  rowCount: number;
  colCount: number;

  constructor(table: Element) {
    this.element = table;
    const tagName = table.tagName.toLowerCase();
    const rowElements = getRowElements(table);
    const rowGroupElements = getRowGroupElements(table);

    const { rowGroups } = rowElements.reduce(
      (prev, row, rowIndex) => {
        const { rowGroups, groupElements } = prev;
        const prevGroup =
          rowGroups.length > 0 ? rowGroups[rowGroups.length - 1] : null;
        if (
          prevGroup &&
          ((prevGroup.element && prevGroup.element.contains(row)) ||
            (!prevGroup.element && !rowGroupElements[0]) ||
            (!prevGroup.element && !groupElements[0].contains(row)))
        ) {
          prevGroup.sizeY += 1;
          return prev;
        }
        const element = groupElements[0]?.contains(row)
          ? groupElements[0]
          : null;
        const restElements = element ? groupElements.slice(1) : groupElements;
        return {
          rowGroups: [...rowGroups, { positionY: rowIndex, sizeY: 1, element }],
          groupElements: restElements,
        };
      },
      { rowGroups: [] as RowGroup[], groupElements: rowGroupElements },
    );
    const cells: Cell[][] = rowElements.reduce((rows, row, rowIndex) => {
      const cellElements = getCellElements(row);
      const prevRow = rows.length > 0 ? rows[rows.length - 1] : null;
      const prevFirstCell = prevRow ? prevRow[0] : null;
      const ariaRowIndex = row.getAttribute("aria-rowindex");
      const rowPositionY = ariaRowIndex
        ? parseInt(ariaRowIndex, 10) - 1
        : prevFirstCell
          ? prevFirstCell.positionY + 1
          : rowIndex;
      return [
        ...rows,
        cellElements.reduce((cells, cell) => {
          const cellTagName = cell.tagName.toLowerCase();
          const cellRole = getKnownRole(cell);
          const ariaRowIndex = row.getAttribute("aria-rowindex");
          const ariaColIndex = cell.getAttribute("aria-colindex");
          const positionY = ariaRowIndex
            ? parseInt(ariaRowIndex, 10) - 1
            : rowPositionY;
          const leftCell = cells.length > 0 ? cells[cells.length - 1] : null;
          const dx = ariaColIndex
            ? parseInt(ariaColIndex, 10) - 1
            : leftCell
              ? leftCell.positionX + leftCell.sizeX
              : 0;
          let positionX: number = dx;
          if (!ariaColIndex && rowIndex > 0) {
            let dy = rowIndex - 1;
            while (dy >= 0) {
              const upper = rows[dy].find(
                (cell) =>
                  cell.positionX <= dx && dx < cell.positionX + cell.sizeX,
              );
              if (upper) {
                if (upper.sizeY > rowIndex - dy) {
                  positionX = upper.positionX + upper.sizeX;
                }
                break;
              }
              dy--;
            }
          }
          const isNativeTag = ["th", "td"].includes(cellTagName);
          const colSpan =
            (!isNativeTag && cell.getAttribute("aria-colspan")) ||
            cell.getAttribute("colspan");
          const rowSpan =
            (!isNativeTag && cell.getAttribute("aria-rowspan")) ||
            cell.getAttribute("rowspan");
          const sizeX = colSpan ? parseInt(colSpan, 10) : 1;
          const sizeY = rowSpan ? parseInt(rowSpan, 10) : 1;
          const scopeAttr = cell.getAttribute("scope")?.toLowerCase();
          const headerScope: Scope =
            cellTagName === "th"
              ? scopeAttr &&
                ["row", "col", "rowgroup", "colgroup"].includes(scopeAttr)
                ? (scopeAttr as Scope)
                : "auto"
              : cellRole === "columnheader"
                ? "col"
                : cellRole === "rowheader"
                  ? "row"
                  : "none";
          return [
            ...cells,
            {
              element: cell,
              sizeX,
              sizeY,
              positionX,
              positionY,
              headerScope,
            },
          ];
        }, [] as Cell[]),
      ];
    }, [] as Cell[][]);
    const ariaRowCount = table.getAttribute("aria-rowcount");
    const ariaColCount = table.getAttribute("aria-colcount");
    const rowCount = ariaRowCount
      ? parseInt(ariaRowCount, 10)
      : cells[cells.length - 1].reduce(
          (prev, cell) => Math.max(prev, cell.positionY + cell.sizeY),
          0,
        );
    const colCount = ariaColCount
      ? parseInt(ariaColCount, 10)
      : cells.reduce(
          (prev, row) =>
            row.reduce(
              (prev, cell) => Math.max(prev, cell.positionX + cell.sizeX),
              prev,
            ),
          0,
        );
    const colGroupElements =
      tagName === "table"
        ? [...table.children].filter(
            (child) => child.tagName.toLowerCase() === "colgroup",
          )
        : [];
    const minPositionX = cells.reduce(
      (prev, row) => Math.min(prev, row[0]?.positionX || 0),
      0,
    );
    const colGroups: ColGroup[] =
      colGroupElements.length > 0
        ? colGroupElements.reduce((groups, group, groupIndex) => {
            const lastGroup =
              groups.length > 0 ? groups[groups.length - 1] : null;
            const positionX = lastGroup
              ? lastGroup.positionX + lastGroup.sizeX
              : minPositionX;
            const span = group.getAttribute("span");
            const sizeX = span
              ? parseInt(span, 10)
              : [...group.querySelectorAll("col")].reduce((prev, col) => {
                  const span = col.getAttribute("span");
                  return prev + (span ? parseInt(span, 10) : 1);
                }, 0);
            if (
              groupIndex === colGroupElements.length - 1 &&
              positionX + sizeX < colCount
            ) {
              return [
                ...groups,
                { positionX, sizeX },
                {
                  positionX: positionX + sizeX,
                  sizeX: colCount - (positionX + sizeX),
                },
              ];
            }
            return [...groups, { positionX, sizeX }];
          }, [] as ColGroup[])
        : [{ positionX: 0, sizeX: colCount }];
    this.rowGroups = rowGroups;
    this.colGroups = colGroups;
    this.cells = cells;
    this.rowCount = rowCount;
    this.colCount = colCount;
  }

  getHeaderElements = (cell: Cell): Element[] =>
    [
      ...this.getRowHeaderElements(cell),
      ...this.getRowGroupHeaderElements(cell),
      ...this.getColHeaderElements(cell),
      ...this.getColGroupHeaderElements(cell),
      ...this.getAttributeHeaderElements(cell),
    ].reduce(
      (prev, el) => (prev.includes(el) ? prev : [...prev, el]),
      [] as Element[],
    );

  getRowHeaderElements = (cell: Cell): Element[] => {
    const { positionY, sizeY, positionX } = cell;
    return this.cells
      .map((row) =>
        row.filter(
          (c) =>
            c.headerScope === "row" &&
            c.positionY < positionY + sizeY &&
            c.positionY + c.sizeY > positionY &&
            c.positionX < positionX,
        ),
      )
      .flat()
      .map((c) => c.element);
  };
  getRowGroupHeaderElements = (cell: Cell): Element[] => {
    const { positionY, positionX } = cell;
    const rowGroup = this.rowGroups.find(
      (group) =>
        group.positionY <= positionY &&
        group.positionY + group.sizeY > positionY,
    );
    if (!rowGroup) return [];
    return this.cells
      .map((row) =>
        row.filter(
          (c) =>
            c.headerScope === "rowgroup" &&
            c.positionY < rowGroup.positionY + rowGroup.sizeY &&
            c.positionY + c.sizeY > rowGroup.positionY &&
            c.positionX < positionX &&
            c.positionY <= positionY,
        ),
      )
      .flat()
      .map((c) => c.element);
  };

  getColHeaderElements = (cell: Cell): Element[] => {
    const { positionY, positionX, sizeX } = cell;
    return this.cells
      .map((row) =>
        row.filter(
          (c) =>
            c.positionY < positionY &&
            (c.headerScope === "col" || c.headerScope === "auto") &&
            c.positionX < positionX + sizeX &&
            c.positionX + c.sizeX > positionX,
        ),
      )
      .flat()
      .map((c) => c.element);
  };

  getColGroupHeaderElements = (cell: Cell): Element[] => {
    const { positionY, positionX } = cell;
    const colGroup = this.colGroups.find(
      (group) =>
        group.positionX <= positionX &&
        group.positionX + group.sizeX > positionX,
    );
    if (!colGroup) return [];
    return this.cells
      .map((row) =>
        row.filter(
          (c) =>
            c.positionY < positionY &&
            c.headerScope === "colgroup" &&
            c.positionX < colGroup.positionX + colGroup.sizeX &&
            c.positionX + c.sizeX > colGroup.positionX,
        ),
      )
      .flat()
      .map((c) => c.element);
  };

  getAttributeHeaderElements = (cell: Cell): Element[] => {
    const { element } = cell;
    const tagName = element.tagName.toLowerCase();
    if (!["th", "td"].includes(tagName)) return [];
    const headers = element.getAttribute("headers");
    if (!headers) return [];
    const headerIds = headers.split(" ");
    return headerIds
      .map((id) => this.element.querySelector(`th#${id}, td#${id}`))
      .filter((el): el is Element => !!el);
  };
}

export const getRowElements = (el: Element): Element[] => {
  const tagName = el.tagName.toLowerCase();
  const role = getKnownRole(el);
  if (
    tagName === "table" ||
    role === "table" ||
    role === "grid" ||
    role === "treegrid"
  ) {
    return [...el.children].reduce((prev, child) => {
      return [...prev, ...getRowElementsInElement(child, tagName === "table")];
    }, [] as Element[]);
  }

  return [];
};

const getRowElementsInElement = (
  el: Element,
  inTableElement: boolean,
): Element[] => {
  const tagName = el.tagName.toLowerCase();
  const role = getKnownRole(el);
  if ((inTableElement && tagName === "tr") || role === "row") {
    return [el];
  } else if (
    (inTableElement && ["thead", "tbody", "tfoot"].includes(tagName)) ||
    role === "rowgroup" ||
    role === "presentation" ||
    role === "none"
  ) {
    return [...el.children].reduce((prev, child) => {
      return [...prev, ...getRowElementsInElement(child, inTableElement)];
    }, [] as Element[]);
  }
  return [];
};

export const getRowGroupElements = (el: Element): Element[] => {
  const tagName = el.tagName.toLowerCase();
  const role = getKnownRole(el);
  if (
    tagName === "table" ||
    role === "table" ||
    role === "grid" ||
    role === "treegrid"
  ) {
    return [...el.children].reduce((prev, child) => {
      return [
        ...prev,
        ...getRowGroupElementsInElement(child, tagName === "table"),
      ];
    }, [] as Element[]);
  }
  return [];
};
const getRowGroupElementsInElement = (
  el: Element,
  inTableElement: boolean,
): Element[] => {
  const tagName = el.tagName.toLowerCase();
  const role = getKnownRole(el);
  if (
    (inTableElement && ["thead", "tbody", "tfoot"].includes(tagName)) ||
    role === "rowgroup"
  ) {
    return [el];
  } else if (
    (inTableElement && tagName === "tr") ||
    role === "row" ||
    role === "presentation" ||
    role === "none"
  ) {
    return [...el.children].reduce((prev, child) => {
      return [...prev, ...getRowGroupElementsInElement(child, inTableElement)];
    }, [] as Element[]);
  }
  return [];
};

export const getCellElements = (el: Element): Element[] => {
  const tagName = el.tagName.toLowerCase();
  const role = getKnownRole(el);
  if (tagName === "tr") {
    return [...el.children].filter((child) =>
      ["td", "th"].includes(child.tagName.toLowerCase()),
    );
  }
  if (["row", "presentation", "none"].includes(role as string)) {
    return [...el.children]
      .map((child) => {
        const childRole = getKnownRole(child);
        if (
          ["cell", "gridcell", "columnheader", "rowheader"].includes(
            childRole as string,
          )
        ) {
          return child;
        }
        if (["presentation", "none"].includes(childRole as string)) {
          return getCellElements(child);
        }
        return [];
      })
      .flat();
  }
  return [];
};
