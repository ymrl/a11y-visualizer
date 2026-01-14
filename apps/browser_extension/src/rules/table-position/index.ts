import { getClosestByRoles } from "@a11y-visualizer/dom-utils";
import { Table } from "@a11y-visualizer/table";
import type { RuleObject } from "../type";

const ruleName = "table-position";
const defaultOptions = {
  enabled: true,
};
export const TablePosition: RuleObject = {
  ruleName,
  defaultOptions,
  tagNames: ["th", "td"],
  roles: ["columnheader", "rowheader", "gridcell", "cell"],
  evaluate: (element, { enabled }, { tables = [] }) => {
    if (!enabled) {
      return undefined;
    }
    const tagName = element.tagName.toLowerCase();
    const tableElement = ["th", "td"].includes(tagName)
      ? element.closest("table")
      : getClosestByRoles(element, ["table", "grid", "treegrid"]);
    if (!tableElement) {
      return undefined;
    }
    const table =
      tables.find((t) => t.element === tableElement) ||
      (() => {
        const t = new Table(tableElement);
        tables.push(t);
        return t;
      })();
    const cell = table.getCell(element);
    if (cell) {
      return [
        {
          type: "tableCellPosition",
          content: `${cell.positionX + 1},${cell.positionY + 1}`,
          ruleName,
        },
      ];
    }
    return undefined;
  },
};
