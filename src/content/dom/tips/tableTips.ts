import { computeAccessibleName } from "dom-accessibility-api";
import { ElementTip } from "../../types";
import { getKnownRole } from "../getKnownRole";
import { InternalTable } from "./internalTable";
const TableElements = [
  "table",
  // 'thead',
  // 'tbody',
  // 'tfoot',
  // 'tr',
  "th",
  "td",
  // 'caption',
] as const;

const TableRoles = [
  "table",
  "grid",
  // 'row',
  "columnheader",
  "rowheader",
  "gridcell",
  "cell",
] as const;

export const TableSelectors = [
  ...TableElements,
  ...TableRoles.map((role) => `[role="${role}"]`),
] as const;

export const isTable = (el: Element): boolean => {
  const role = getKnownRole(el);
  return (
    el.tagName.toLowerCase() === "table" ||
    role === "table" ||
    role === "grid" ||
    role === "treegrid"
  );
};

export const isTableCell = (el: Element): boolean => {
  const role = getKnownRole(el);
  const tagName = el.tagName.toLowerCase();

  return (
    ["th", "td"].includes(tagName) ||
    (!!role && ["columnheader", "rowheader", "gridcell", "cell"].includes(role))
  );
};

export const tableTips = (
  el: Element,
  internalTable: InternalTable,
): ElementTip[] => {
  const result: ElementTip[] = [];

  if (isTableCell(el)) {
    const cell = internalTable.getCell(el);
    if (cell) {
      internalTable.getHeaderElements(cell).forEach((header) => {
        result.push({
          type: "tableHeader",
          content: computeAccessibleName(header),
        });
      });
    }
  }

  return result;
};
