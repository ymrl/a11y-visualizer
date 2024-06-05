import { ElementTip } from "../../types";
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
  const role = el.getAttribute("role");
  return (
    el.tagName.toLowerCase() === "table" || role === "table" || role === "grid"
  );
};

export const isTableCell = (el: Element): boolean => {
  const role = el.getAttribute("role") || "";
  const tagName = el.tagName.toLowerCase();

  return (
    ["th", "td"].includes(tagName) ||
    ["columnheader", "rowheader", "gridcell", "cell"].includes(role)
  );
};

export const tableTips = (el: Element): ElementTip[] => {
  const result: ElementTip[] = [];
  const role = el.getAttribute("role");
  const tagName = el.tagName.toLowerCase();

  if (isTable(el)) {
    if (!role) {
      result.push({ type: "tagName", content: tagName });
    }
  } else if (isTableCell(el)) {
    if (!role) {
      result.push({ type: "tagName", content: tagName });
    }
  }
  return result;
};
