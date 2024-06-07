import { computeAccessibleDescription } from "dom-accessibility-api";
import { ElementTip } from "../../types";
import { getKnownRole, KnownRole } from "../getKnownRole";

const globalAriaStates = [
  "aria-busy",
  "aria-current",
  // "aria-grabbed",
  // "aria-hidden",
] as const;

const ariaStateValues: { [ariaState: string]: (string | null)[] } = {
  "aria-busy": ["true", "false"],
  "aria-current": ["true", "false", "page", "step", "location", "date", "time"],
  "aria-checked": ["true", "false", "mixed", "undefined"],
  "aria-disabled": ["true", "false"],
  "aria-expanded": ["true", "false", "undefined"],
  "aria-invalid": ["true", "false", "grammar", "spelling"],
  "aria-pressed": ["true", "false", "mixed", "undefined"],
  "aria-selected": ["true", "false", "undefined"],
};

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
  const roleAttr = el.getAttribute("role");
  const role = getKnownRole(el);
  const tagName = el.tagName.toLowerCase();

  if (roleAttr) {
    result.push({ type: "tagName", content: tagName });
    result.push({ type: "role", content: roleAttr });
  }

  for (const state of globalAriaStates) {
    const value = el.getAttribute(state);
    if (value) {
      if (ariaStateValues[state].includes(value)) {
        result.push({
          type: "ariaStatus",
          content: `ariaStatus.${state}.${value}`,
        });
      } else {
        result.push({
          type: "error",
          content: `messages.invalidAriaValue`,
        });
      }
    }
  }

  for (const [ariaState, roles] of Object.entries(ariaStateRoles)) {
    if (role && roles.includes(role)) {
      const ariaStateValue = el.getAttribute(ariaState);
      if (ariaStateValue) {
        if (ariaStateValues[ariaState].includes(ariaStateValue)) {
          result.push({
            type: "ariaStatus",
            content: `ariaStatus.${ariaState}.${ariaStateValue}`,
          });
        } else {
          result.push({
            type: "error",
            content: `messages.invalidAriaValue`,
          });
        }
      }
    }
  }

  if (
    tagName === "input" &&
    (["checkbox", "radio"] as (string | null)[]).includes(
      el.getAttribute("type"),
    ) &&
    !el.hasAttribute("aria-checked")
  ) {
    result.push({
      type: "ariaStatus",
      content: `ariaStatus.aria-checked.${
        (el as HTMLInputElement).checked ? "true" : "false"
      }`,
    });
  }

  if (
    [
      "button",
      "fieldset",
      "optgroup",
      "option",
      "select",
      "textarea",
      "input",
    ].includes(tagName)
  ) {
    if (
      el.hasAttribute("disabled") ||
      (el.closest("fieldset[disabled]") && !el.closest("legend"))
    ) {
      result.push({
        type: "ariaStatus",
        content: "ariaStatus.aria-disabled.true",
      });
    }
  }

  if (description) {
    result.push({ type: "description", content: description });
  }

  return result;
};
