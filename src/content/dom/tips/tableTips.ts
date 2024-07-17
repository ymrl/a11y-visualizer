import { getKnownRole } from "../../../dom/getKnownRole";

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
