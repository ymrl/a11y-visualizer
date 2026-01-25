import { getClosestByRoles } from "@a11y-visualizer/dom-utils";
import { Table } from "@a11y-visualizer/table";
import { computeAccessibleName } from "dom-accessibility-api";
import type { RuleObject, RuleResult } from "../type";

const ruleName = "table-header";
const defaultOptions = {
  enabled: true,
};
export const TableHeader: RuleObject = {
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
    const result: RuleResult[] = [];
    if (cell) {
      table.getHeaderElements(cell).forEach((header) => {
        result.push({
          type: "tableHeader",
          content: computeAccessibleName(header),
          ruleName,
        });
      });
    }
    if (result.length > 0) {
      return result;
    }
    return undefined;
  },
};
