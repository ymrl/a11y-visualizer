import { Table } from "@a11y-visualizer/table";
import type { RuleObject } from "../type";

const ruleName = "table-size";
const defaultOptions = {
  enabled: true,
};
export const TableSize: RuleObject = {
  ruleName,
  defaultOptions,
  tagNames: ["table"],
  roles: ["table", "grid", "treegrid"],
  evaluate: (element, { enabled }, { tables = [] }) => {
    if (!enabled) {
      return undefined;
    }
    const table =
      tables.find((t) => t.element === element) ||
      (() => {
        const t = new Table(element);
        tables.push(t);
        return t;
      })();
    if (table) {
      return [
        {
          type: "tableSize",
          contentLabel: "Table size",
          content: `${table.colCount}x${table.rowCount}`,
          ruleName,
        },
      ];
    }
    return undefined;
  },
};
