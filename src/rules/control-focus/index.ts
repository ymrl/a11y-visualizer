import { RuleObject } from "../type";
import { isFocusable } from "../../dom/isFocusable";

const ruleName = "control-focus";
const defaultOptions = {
  enabled: true,
};

export const ControlFocus: RuleObject = {
  ruleName,
  defaultOptions,
  tagNames: ["button", "select", "textarea"],
  roles: [
    "button",
    "menuitem",
    "tab",
    "checkbox",
    "combobox",
    "listbox",
    "radio",
    "searchbox",
    "slider",
    "spinbutton",
    "switch",
    "textbox",
    "menuitemcheckbox",
    "menuitemradio",
    "link",
  ],
  selectors: [
    'input:not([type="hidden"])',
    "details > summary:first-child",
    "a[href]",
    "area[href]",
  ],
  evaluate: (element, { enabled } = defaultOptions) => {
    if (!enabled) {
      return undefined;
    }
    if (!isFocusable(element)) {
      return [
        {
          type: "error",
          message: "Not focusable",
          ruleName,
        },
      ];
    }
    if (!isFocusable(element, true)) {
      return [
        {
          type: "warning",
          message: "Not focusable",
          ruleName,
        },
      ];
    }
    return undefined;
  },
};
