import { getKnownRole, KnownRole } from "../../dom/getKnownRole";
import { RuleObject, RuleResultMessage, RuleResultState } from "../type";

const ruleName = "aria-state";
const defaultOptions = { enabled: true };

const globalAriaStates = [
  "aria-busy",
  "aria-current",
  // "aria-grabbed", // deprecated on WAI-ARIA 1.1
  // "aria-hidden", // handled by aria-hidden rule (for warning)
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

const ariaStateNames: { [ariaState: string]: string } = {
  "aria-busy": "Busy",
  "aria-current": "Current",
  "aria-checked": "Checked",
  "aria-disabled": "Disabled",
  "aria-expanded": "Expanded",
  "aria-invalid": "Invalid",
  "aria-pressed": "Pressed",
  "aria-selected": "Selected",
} as const;

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

export const AriaState: RuleObject = {
  ruleName,
  defaultOptions,
  evaluate: (element, { enabled }, { role = getKnownRole(element) }) => {
    if (!enabled) {
      return undefined;
    }
    const result: (RuleResultState | RuleResultMessage)[] = [];

    for (const state of globalAriaStates) {
      const value = element.getAttribute(state);
      if (value) {
        if (ariaStateValues[state].includes(value)) {
          result.push({
            type: "state",
            state: `${ariaStateNames[state]}: ${value}`,
            ruleName,
          });
        } else if (
          !result.find(
            (r) =>
              r.type === "error" &&
              r.message === "Invalid WAI-ARIA attribute value",
          )
        ) {
          result.push({
            type: "error",
            message: "Invalid WAI-ARIA attribute value",
            ruleName,
          });
        }
      }
    }

    const tagName = element.tagName.toLowerCase();
    for (const [state, roles] of Object.entries(ariaStateRoles)) {
      if (role && (roles as string[]).includes(role)) {
        const ariaStateValue = element.getAttribute(state);
        const nativeValue =
          state === "aria-checked" &&
          tagName === "input" &&
          ["checkbox", "radio"].includes(element.getAttribute("type") || "")
            ? (element as HTMLInputElement).checked
              ? "true"
              : "false"
            : state === "aria-disabled" &&
                [
                  "button",
                  "fieldset",
                  "optgroup",
                  "option",
                  "select",
                  "textarea",
                  "input",
                ].includes(tagName) &&
                (element.hasAttribute("disabled") ||
                  element.closest("fieldset[disabled]"))
              ? (element as HTMLInputElement).disabled ||
                element.closest("fieldset[disabled]")
                ? "true"
                : "false"
              : state === "aria-expanded" &&
                  tagName === "summary" &&
                  element.matches("details > summary:first-child")
                ? element.closest("details")?.open
                  ? "true"
                  : "false"
                : null;
        const value = nativeValue || ariaStateValue;
        if (value) {
          if (ariaStateValues[state].includes(value)) {
            result.push({
              type: "state",
              state: `${ariaStateNames[state]}: ${value}`,
              ruleName,
            });
          } else if (
            !result.find(
              (r) =>
                r.type === "error" &&
                r.message === "Invalid WAI-ARIA attribute value",
            )
          ) {
            result.push({
              type: "error",
              message: "Invalid WAI-ARIA attribute value",
              ruleName,
            });
          }
        }
      } else if (
        element.hasAttribute(state) &&
        !result.find(
          (r) =>
            r.type === "error" &&
            r.message === "Invalid role for WAI-ARIA attribute",
        )
      ) {
        result.push({
          type: "error",
          message: "Invalid role for WAI-ARIA attribute",
          ruleName,
        });
      }
    }
    if (result.length > 0) {
      return result;
    }
    return undefined;
  },
};
