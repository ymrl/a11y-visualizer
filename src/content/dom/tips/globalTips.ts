import { computeAccessibleDescription } from "dom-accessibility-api";
import { ElementTip } from "../../types";
import { getKnownRole, KnownRole } from "../getKnownRole";

const globalAriaStates = [
  "aria-busy",
  "aria-current",
  // "aria-grabbed",
  // "aria-hidden",
] as const;

const ariaStateRoles: { [ariaState: string]: KnownRole[] } = {
  "aria-checked": [
    "checkbox",
    "menuitemcheckbox",
    "option",
    "radio",
    "switch",
    "menuitemradio",
    "treeitem",
  ],
  "aria-disabled": [
    "application",
    "button",
    "composite",
    "gridcell",
    "group",
    "input",
    "link",
    "menuitem",
    "scrollbar",
    "separator",
    "tab",
    "checkbox",
    "columnheader",
    "combobox",
    "grid",
    "listbox",
    "menu",
    "menubar",
    "menuitemcheckbox",
    "menuitemradio",
    "option",
    "radio",
    "radiogroup",
    "row",
    "rowheader",
    "searchbox",
    "select",
    "slider",
    "spinbutton",
    "switch",
    "tablist",
    "textbox",
    "toolbar",
    "tree",
    "treegrid",
    "treeitem",
  ],
  "aria-expanded": [
    "application",
    "button",
    "checkbox",
    "combobox",
    "gridcell",
    "link",
    "listbox",
    "menuitem",
    "row",
    "rowheader",
    "tab",
    "treeitem",
    "columnheader",
    "menuitemcheckbox",
    "menuitemradio",
    "rowheader",
    "switch",
  ],
  "aria-invalid": [
    "application",
    "checkbox",
    "combobox",
    "gridcell",
    "listbox",
    "radiogroup",
    "slider",
    "spinbutton",
    "textbox",
    "tree",
    "columnheader",
    "rowheader",
    "searchbox",
    "switch",
    "treegrid",
  ],
  "aria-pressed": ["button"],
  "aria-selected": [
    "gridcell",
    "option",
    "row",
    "tab",
    "columnheader",
    "rowheader",
    "treeitem",
  ],
} as const;

export const globalTips = (el: Element): ElementTip[] => {
  const result: ElementTip[] = [];
  const description = computeAccessibleDescription(el);
  const roleAttr = el.getAttribute("role") || "";
  const role = getKnownRole(el);

  if (roleAttr) {
    const tagName = el.tagName.toLowerCase();
    result.push({ type: "tagName", content: tagName });
    result.push({ type: "role", content: roleAttr });
  }

  for (const state of globalAriaStates) {
    const value = el.getAttribute(state);
    if (value) {
      result.push({
        type: "ariaStatus",
        content: `ariaStatus.${state}.${value}`,
      });
    }
  }

  for (const [ariaState, roles] of Object.entries(ariaStateRoles)) {
    if (role && roles.includes(role)) {
      const ariaStateValue = el.getAttribute(ariaState);
      if (ariaStateValue) {
        result.push({
          type: "ariaStatus",
          content: `ariaStatus.${ariaState}.${ariaStateValue}`,
        });
      }
    }
  }

  if (description) {
    result.push({ type: "description", content: description });
  }

  return result;
};
