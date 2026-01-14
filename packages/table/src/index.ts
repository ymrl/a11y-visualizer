import { getKnownRole } from "@a11y-visualizer/dom-utils";

type RowGroup = {
  positionY: number;
  sizeY: number;
  element: Element;
};

type ColGroup = {
  positionX: number;
  sizeX: number;
  element: Element;
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

export class Table {
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
      rows.push(
        cellElements.reduce((cells, cell) => {
          const cellTagName = cell.tagName.toLowerCase();
          const cellRole = getKnownRole(cell);
          const ariaRowIndex = row.getAttribute("aria-rowindex");
          const ariaColIndex = cell.getAttribute("aria-colindex");
          const positionY = ariaRowIndex
            ? parseInt(ariaRowIndex, 10) - 1
            : rowPositionY;
          const leftCell = cells.length > 0 ? cells[cells.length - 1] : null;
          let positionX = ariaColIndex
            ? parseInt(ariaColIndex, 10) - 1
            : leftCell
              ? leftCell.positionX + leftCell.sizeX
              : 0;
          // let positionX: number = dx;
          if (!ariaColIndex && rowIndex > 0) {
            let dy = rowIndex - 1;
            while (dy >= 0) {
              for (let i = 0; i < rows[dy].length; i++) {
                const cell = rows[dy][i];
                if (
                  cell.positionX + cell.sizeX > positionX &&
                  cell.positionX <= positionX &&
                  positionX < cell.positionX + cell.sizeX
                ) {
                  // positionXがセルの範囲内にある場合
                  if (cell.positionY + cell.sizeY > positionY) {
                    // rowspanで行に割り込んできている: positionXはそれより右
                    positionX = cell.positionX + cell.sizeX;
                  } else {
                    break;
                  }
                }
              }
              dy--;
            }
          }
          const isNativeTag = ["th", "td"].includes(cellTagName);
          const ariaColSpan = !isNativeTag && cell.getAttribute("aria-colspan");
          const ariaRowSpan = !isNativeTag && cell.getAttribute("aria-rowspan");
          const nativeColSpan = isNativeTag && cell.getAttribute("colspan");
          const nativeRowSpan = isNativeTag && cell.getAttribute("rowspan");
          const sizeX = ariaColSpan
            ? parseInt(ariaColSpan, 10)
            : nativeColSpan
              ? Math.min(parseInt(nativeColSpan, 10), 1000)
              : 1;
          const sizeY = ariaRowSpan
            ? parseInt(ariaRowSpan, 10)
            : nativeRowSpan
              ? Math.min(parseInt(nativeRowSpan, 10), 65534)
              : 1;
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
          cells.push({
            element: cell,
            sizeX,
            sizeY,
            positionX,
            positionY,
            headerScope,
          });
          return cells;
        }, [] as Cell[]),
      );
      return rows;
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

    const rowGroupElements = getRowGroupElements(table);
    const { rowGroups } = rowElements.reduce(
      (prev, row, rowIndex) => {
        const { rowGroups, groupElements } = prev;
        const prevGroup =
          rowGroups.length > 0 ? rowGroups[rowGroups.length - 1] : null;
        if (
          prevGroup &&
          (prevGroup.element?.contains(row) ||
            (!prevGroup.element && !rowGroupElements[0]) ||
            (!prevGroup.element && !groupElements[0].contains(row)))
        ) {
          prevGroup.sizeY += 1;
          return prev;
        }
        if (groupElements[0]?.contains(row)) {
          return {
            rowGroups: [
              ...rowGroups,
              { positionY: rowIndex, sizeY: 1, element: groupElements[0] },
            ],
            groupElements: groupElements.slice(1),
          };
        }
        return prev;
      },
      { rowGroups: [] as RowGroup[], groupElements: rowGroupElements },
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
        ? colGroupElements.reduce((groups, group) => {
            const lastGroup =
              groups.length > 0 ? groups[groups.length - 1] : null;
            const positionX = lastGroup
              ? lastGroup.positionX + lastGroup.sizeX
              : minPositionX;
            const span = group.getAttribute("span");
            const sizeX = span
              ? Math.min(parseInt(span, 10), 1000)
              : Math.max(
                  [...group.querySelectorAll("col")].reduce((prev, col) => {
                    const span = col.getAttribute("span");
                    return (
                      prev + (span ? Math.min(parseInt(span, 10), 1000) : 1)
                    );
                  }, 0),
                  1,
                );
            groups.push({ positionX, sizeX, element: group });
            return groups;
          }, [] as ColGroup[])
        : [];
    this.rowGroups = rowGroups;
    this.colGroups = colGroups;
    this.cells = cells;
    this.rowCount = rowCount;
    this.colCount = colCount;
  }

  getCell = (el: Element): Cell | null => {
    const cell = this.cells
      .map((row) => row.find((cell) => cell.element === el))
      .filter((cell): cell is Cell => !!cell);
    return cell ? cell[0] : null;
  };

  getHeaderElements = (cell: Cell): Element[] => {
    const tagName = cell.element.tagName.toLowerCase();
    return (
      ["th", "td"].includes(tagName) && cell.element.hasAttribute("headers")
        ? this.getAttributeHeaderElements(cell)
        : [
            ...this.getRowHeaderElements(cell),
            ...this.getRowGroupHeaderElements(cell),
            ...this.getColHeaderElements(cell),
            ...this.getColGroupHeaderElements(cell),
          ]
    ).reduce((prev, el) => {
      if (prev.includes(el)) {
        return prev;
      }
      prev.push(el);
      return prev;
    }, [] as Element[]);
  };

  getSlotCells = (x: number, y: number): Cell[] => {
    return this.cells
      .map((row) =>
        row.find(
          (cell) =>
            cell.positionX <= x &&
            cell.positionX + cell.sizeX > x &&
            cell.positionY <= y &&
            cell.positionY + cell.sizeY > y,
        ),
      )
      .filter((cell): cell is Cell => !!cell);
  };

  isColHeader = (cell: Cell): boolean => {
    const { headerScope } = cell;
    return (
      headerScope === "col" ||
      (headerScope === "auto" &&
        !this.cells.some((row) =>
          row.some(
            (c) =>
              c.headerScope === "none" &&
              c.positionY < cell.positionY + cell.sizeY &&
              c.positionY + c.sizeY > cell.positionY,
          ),
        ))
    );
  };

  isRowHeader = (cell: Cell): boolean => {
    const { headerScope } = cell;
    return (
      headerScope === "row" ||
      (headerScope === "auto" &&
        !this.isColHeader(cell) &&
        !this.cells.some((row) =>
          row.some(
            (c) =>
              c.headerScope === "none" &&
              c.positionX < cell.positionX + cell.sizeX &&
              c.positionX + c.sizeX > cell.positionX,
          ),
        ))
    );
  };

  getRowHeaderElements = (cell: Cell): Element[] => {
    const { positionY, sizeY, positionX, element } = cell;
    const headers: Element[] = [];
    Array(sizeY)
      .fill(0)
      .map((_, i) => positionY + i)
      .forEach((y) => {
        let inHeaderBlock: boolean = cell.headerScope !== "none";
        let headersFromCurrentHeaderBlock: Cell[] = inHeaderBlock ? [cell] : [];
        let opaqueHeaders: Cell[] = [];
        Array(positionX)
          .fill(0)
          .map((_, i) => positionX - 1 - i)
          .forEach((x) => {
            const candidates = this.getSlotCells(x, y);
            candidates.forEach((c) => {
              if (c.headerScope !== "none") {
                inHeaderBlock = true;
                headersFromCurrentHeaderBlock.push(c);
                const blocked =
                  opaqueHeaders.some(
                    (cell) => cell.positionY === y && cell.sizeY === sizeY,
                  ) || !this.isRowHeader(c);
                if (!blocked) {
                  headers.push(c.element);
                }
              } else if (inHeaderBlock) {
                inHeaderBlock = false;
                opaqueHeaders = [
                  ...opaqueHeaders,
                  ...headersFromCurrentHeaderBlock,
                ];
                headersFromCurrentHeaderBlock = [];
              }
            });
          });
      });
    return headers.filter((el) => el !== element && !isEmptyCellElement(el));
  };

  getRowGroupHeaderElements = (cell: Cell): Element[] => {
    const { positionY, element } = cell;
    const rowGroup = this.rowGroups.find(
      (group) =>
        group.positionY <= positionY &&
        group.positionY + group.sizeY > positionY,
    );
    if (!rowGroup) return [];
    return this.cells
      .flatMap((row) =>
        row.filter(
          (c) =>
            c.headerScope === "rowgroup" &&
            c.positionY < rowGroup.positionY + rowGroup.sizeY &&
            c.positionY + c.sizeY > rowGroup.positionY,
        ),
      )
      .map((c) => c.element)
      .filter((el) => el !== element && !isEmptyCellElement(el));
  };

  getColHeaderElements = (cell: Cell): Element[] => {
    const { positionY, positionX, sizeX, element } = cell;
    const headers: Element[] = [];

    Array(sizeX)
      .fill(0)
      .map((_, i) => positionX + i)
      .forEach((x) => {
        let inHeaderBlock: boolean = cell.headerScope !== "none";
        let headersFromCurrentHeaderBlock: Cell[] = inHeaderBlock ? [cell] : [];
        let opaqueHeaders: Cell[] = [];
        Array(positionY)
          .fill(0)
          .map((_, i) => positionY - 1 - i)
          .forEach((y) => {
            const candidates = this.getSlotCells(x, y);
            candidates.forEach((c) => {
              if (c.headerScope !== "none") {
                inHeaderBlock = true;
                headersFromCurrentHeaderBlock.push(c);
                const blocked =
                  opaqueHeaders.some(
                    (cell) => cell.positionX === x && cell.sizeX === sizeX,
                  ) || !this.isColHeader(c);
                if (!blocked) {
                  headers.push(c.element);
                }
              } else if (inHeaderBlock) {
                inHeaderBlock = false;
                opaqueHeaders = [
                  ...opaqueHeaders,
                  ...headersFromCurrentHeaderBlock,
                ];
                headersFromCurrentHeaderBlock = [];
              }
            });
          });
      });
    return headers.filter((el) => el !== element && !isEmptyCellElement(el));
  };

  getColGroupHeaderElements = (cell: Cell): Element[] => {
    const { positionY, positionX, element } = cell;
    const colGroup = this.colGroups.find(
      (group) =>
        group.positionX <= positionX &&
        group.positionX + group.sizeX > positionX,
    );
    if (!colGroup) return [];
    return this.cells
      .flatMap((row) =>
        row.filter(
          (c) =>
            c.positionY < positionY &&
            c.headerScope === "colgroup" &&
            c.positionX < colGroup.positionX + colGroup.sizeX &&
            c.positionX + c.sizeX > colGroup.positionX,
        ),
      )
      .map((c) => c.element)
      .filter((el) => el !== element && !isEmptyCellElement(el));
  };

  getAttributeHeaderElements = (cell: Cell): Element[] => {
    const { element } = cell;
    const tagName = element.tagName.toLowerCase();
    if (!["th", "td"].includes(tagName)) return [];
    const headers = element.getAttribute("headers");
    if (!headers) return [];
    const headerIds = headers.split(" ");
    return headerIds
      .map((id) =>
        this.element.querySelector(
          `th#${CSS.escape(id)}, td#${CSS.escape(id)}`,
        ),
      )
      .filter(
        (el): el is Element =>
          !!el && el !== element && !isEmptyCellElement(el),
      );
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
    const children = [...el.children];
    const footers = children.filter(
      (child) => child.tagName.toLowerCase() === "tfoot",
    );
    const exceptFooters = children.filter(
      (child) => child.tagName.toLowerCase() !== "tfoot",
    );
    return [...exceptFooters, ...footers].reduce((acc, child) => {
      acc.push(...getRowElementsInElement(child, tagName === "table"));
      return acc;
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
    ["rowgroup", "none", "presentation"].includes(role as string)
  ) {
    return [...el.children].reduce((acc, child) => {
      acc.push(...getRowElementsInElement(child, inTableElement));
      return acc;
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
    const children = [...el.children];
    const footers = children.filter(
      (child) => child.tagName.toLowerCase() === "tfoot",
    );
    const exceptFooters = children.filter(
      (child) => child.tagName.toLowerCase() !== "tfoot",
    );
    return [...exceptFooters, ...footers].reduce((acc, child) => {
      acc.push(...getRowGroupElementsInElement(child, tagName === "table"));
      return acc;
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
    return [...el.children].reduce((acc, child) => {
      acc.push(...getRowGroupElementsInElement(child, inTableElement));
      return acc;
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
    return [...el.children].flatMap((child) => {
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
    });
  }
  return [];
};

export const isEmptyCellElement = (el: Element): boolean =>
  el.children.length === 0 && (!el.textContent || el.textContent.trim() === "");
