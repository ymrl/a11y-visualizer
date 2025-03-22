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
  "aria-required": ["true", "false"],
  "aria-readonly": ["true", "false"],
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
  "aria-required": "Required", // property
  "aria-readonly": "Read Only", // property
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
  "aria-required": [
    "checkbox",
    "combobox",
    "gridcell",
    "listbox",
    "radiogroup",
    "spinbutton",
    "textbox",
    "tree",
    "columnheader",
    "rowheader",
    "searchbox",
    "switch",
    "treegrid",
  ],
  "aria-readonly": [
    "checkbox",
    "combobox",
    "grid",
    "gridcell",
    "listbox",
    "radiogroup",
    "slider",
    "spinbutton",
    "textbox",
    "columnheader",
    "rowheader",
    "searchbox",
    "switch",
    "treegrid",
  ],
} as const;

const getNativeCheckedValue = (element: Element) => {
  if (
    element.tagName.toLowerCase() === "input" &&
    ["checkbox", "radio"].includes(element.getAttribute("type") || "")
  ) {
    return (element as HTMLInputElement).checked ? "true" : "false";
  }
  return null;
};

const getNativeDisabledValue = (element: Element) => {
  const tagName = element.tagName.toLowerCase();
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
    return (element as HTMLInputElement).disabled
      ? "true"
      : element.closest("fieldset[disabled]")
        ? "true"
        : null;
  }
  return null;
};

const getNativeExpandedValue = (element: Element) => {
  const tagName = element.tagName.toLowerCase();
  if (
    tagName === "summary" &&
    element.matches("details > summary:first-child")
  ) {
    return element.closest("details")?.open ? "true" : "false";
  }
  return null;
};

const getNativeInvalidValue = (element: Element) => {
  const tagName = element.tagName.toLowerCase();
  if (["input", "select", "textarea"].includes(tagName)) {
    const validity = (element as HTMLInputElement).validity;
    if (!validity) {
      return null;
    }
    return validity.valid ? null : "true";
  }
  return null;
};
const getNativeRequiredValue = (element: Element) => {
  const tagName = element.tagName.toLowerCase();
  if (["input", "select", "textarea"].includes(tagName)) {
    const required = (element as HTMLInputElement).required;
    return required ? "true" : null;
  }
  return null;
};

const getNativeReadonlyValue = (element: Element) => {
  const tagName = element.tagName.toLowerCase();
  if (["input", "textarea"].includes(tagName)) {
    const readOnly = (element as HTMLInputElement).readOnly;
    return readOnly ? "true" : null;
  }
  return null;
};

const getNativeValue = (state: string, element: Element) => {
  switch (state) {
    case "aria-checked":
      return getNativeCheckedValue(element);
    case "aria-disabled":
      return getNativeDisabledValue(element);
    case "aria-expanded":
      return getNativeExpandedValue(element);
    case "aria-invalid":
      return getNativeInvalidValue(element);
    case "aria-required":
      return getNativeRequiredValue(element);
    case "aria-readonly":
      return getNativeReadonlyValue(element);
    default:
      return null;
  }
};

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

    for (const [state, roles] of Object.entries(ariaStateRoles)) {
      if (role && (roles as string[]).includes(role)) {
        const ariaStateValue = element.getAttribute(state);
        const nativeValue = getNativeValue(state, element);
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
