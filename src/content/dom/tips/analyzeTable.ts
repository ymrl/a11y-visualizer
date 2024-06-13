type Scope = "row" | "col" | "rowgroup" | "colgroup" | "auto" | "none";
type Cell = {
  element: Element;
  sizeX: number;
  sizeY: number;
  positionX: number;
  positionY: number;
  header: boolean;
  scope: Scope;
  headers: Element[];
};
type RowGroup = {
  positionY: number;
  sizeY: number;
};

type ColGroup = {
  positionX: number;
  sizeX: number;
};

export const analyzeTable = (table: HTMLTableElement) => {
  const rowGroupElements = table.querySelectorAll("thead, tbody, tfoot");
  const rowGroups =
    rowGroupElements.length > 0
      ? [...rowGroupElements].reduce((groups, group) => {
          const lastGroup =
            groups.length > 0 ? groups[groups.length - 1] : null;
          const positionY = lastGroup
            ? lastGroup.positionY + lastGroup.sizeY
            : 0;
          const sizeY = group.querySelectorAll("tr").length;
          return [...groups, { positionY, sizeY }];
        }, [] as RowGroup[])
      : [{ positionY: 0, sizeY: table.querySelectorAll("tr").length }];
  const colGroupElements = table.querySelectorAll("colgroup");
  const colGroups =
    colGroupElements.length > 0
      ? [...colGroupElements].reduce((groups, group) => {
          const lastGroup =
            groups.length > 0 ? groups[groups.length - 1] : null;
          const positionX = lastGroup
            ? lastGroup.positionX + lastGroup.sizeX
            : 0;
          const span = group.getAttribute("span");
          const sizeX = span
            ? parseInt(span, 10)
            : [...group.querySelectorAll("col")].reduce((prev, col) => {
                const span = col.getAttribute("span");
                return prev + (span ? parseInt(span, 10) : 1);
              }, 0);
          group.querySelectorAll("col").length;
          return [...groups, { positionX, sizeX }];
        }, [] as ColGroup[])
      : [
          {
            positionX: 0,
            sizeX: [
              ...(table.querySelector("tr")?.querySelectorAll("td, th") ?? []),
            ].reduce((prev, tdh) => {
              const colSpan = tdh.getAttribute("colspan");
              return prev + (colSpan ? parseInt(colSpan, 10) : 1);
            }, 0),
          },
        ];

  const cells: Cell[][] = [...table.querySelectorAll("tr")].reduce(
    (rows, tr, y): Cell[][] => {
      return [
        ...rows,
        [...tr.querySelectorAll("td, th")].reduce((cells, tdh): Cell[] => {
          const leftCell = cells.length > 0 ? cells[cells.length - 1] : null;
          const dx = leftCell ? leftCell.positionX + leftCell.sizeX : 0;
          let positionX: number = dx;
          if (y > 0) {
            let dy = y - 1;
            while (dy >= 0) {
              const upper = rows[dy].find(
                (cell) =>
                  cell.positionX <= dx && dx < cell.positionX + cell.sizeX,
              );
              if (upper) {
                if (upper.sizeY > y - dy) {
                  positionX = upper.positionX + upper.sizeX;
                }
                break;
              }
              dy--;
            }
          }
          const colSpan = tdh.getAttribute("colspan");
          const rowSpan = tdh.getAttribute("rowspan");
          const header = tdh.tagName.toLowerCase() === "th";
          const sizeX = colSpan ? parseInt(colSpan, 10) : 1;
          const sizeY = rowSpan ? parseInt(rowSpan, 10) : 1;
          const scopeAttr = tdh.getAttribute("scope")?.toLowerCase();
          const scope: Scope = !header
            ? "none"
            : ["row", "col", "rowgroup", "colgroup"].includes(
                  scopeAttr as Scope,
                )
              ? (scopeAttr as Scope)
              : "auto";
          const colGroup = colGroups.find(
            (group) =>
              group.positionX <= positionX &&
              positionX < group.positionX + group.sizeX,
          );
          const rowGroup = rowGroups.find(
            (group) =>
              group.positionY <= y && y < group.positionY + group.sizeY,
          );
          const colHeaders = rows.reduceRight(
            (prev, row) => [
              ...prev,
              ...row
                .filter(
                  (cell) =>
                    cell.header &&
                    ((colGroup &&
                      cell.scope === "colgroup" &&
                      colGroup.positionX <= cell.positionX &&
                      cell.positionX + cell.sizeX <=
                        colGroup.positionX + colGroup.sizeX) ||
                      ((cell.scope === "auto" || cell.scope === "col") &&
                        ((cell.positionX <= positionX &&
                          positionX < cell.positionX + cell.sizeX) ||
                          (positionX <= cell.positionX &&
                            cell.positionX + cell.sizeX <=
                              positionX + sizeX)))),
                )
                .map((cell) => cell.element),
            ],
            [] as Element[],
          );
          const prevRowHeaders = rows
            .slice(rowGroup?.positionY ?? 0)
            .reduce(
              (prev, row) => [
                ...prev,
                ...row
                  .filter(
                    (cell) =>
                      cell.header &&
                      cell.positionX <= positionX &&
                      ((rowGroup &&
                        cell.scope === "rowgroup" &&
                        rowGroup.positionY <= cell.positionY &&
                        cell.positionY + cell.sizeY <=
                          rowGroup.positionY + rowGroup.sizeY) ||
                        (cell.scope === "row" &&
                          cell.positionY <= y &&
                          y < cell.positionY + cell.sizeY)),
                  )
                  .map((cell) => cell.element),
              ],
              [] as Element[],
            );
          const rowHeaders = cells
            .filter(
              (cell) =>
                cell.header &&
                (cell.scope === "row" || cell.scope === "rowgroup"),
            )
            .map((cell) => cell.element);

          const headerIds = tdh.getAttribute("headers")?.split(" ") ?? [];
          const structuredHeaders = [
            ...colHeaders,
            ...prevRowHeaders,
            ...rowHeaders,
          ];
          const headers = headerIds
            .filter(
              (id) => !structuredHeaders.find((header) => header.id === id),
            )
            .map((id) => table.querySelector(`th#${id}, td#${id}`))
            .filter((header) => header)
            .filter((header): header is Element => !!header)
            .concat(structuredHeaders);

          return [
            ...cells,
            {
              element: tdh,
              sizeX,
              sizeY,
              positionX,
              positionY: y,
              header,
              scope,
              headers,
            },
          ];
        }, [] as Cell[]),
      ];
    },
    [] as Cell[][],
  );
  return {
    cells,
    rowGroups,
    colGroups,
  };
};
