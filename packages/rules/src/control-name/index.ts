import { computeAccessibleName } from "dom-accessibility-api";
import type { RuleObject } from "../type";

const ruleName = "control-name";
const defaultOptions = {
  enabled: true,
};

export const ControlName: RuleObject = {
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
  evaluate: (
    element: Element,
    { enabled } = defaultOptions,
    { name = computeAccessibleName(element) },
  ) => {
    if (!enabled) {
      return undefined;
    }
    const isAriaHidden = element.getAttribute("aria-hidden") === "true";
    const tagName = element.tagName.toLowerCase();
    if (tagName === "area" && !isAriaHidden && !name) {
      // area elements are display:hidden by default in Firefox,
      // name may be empty even if alt is present
      const alt = element.getAttribute("alt");
      const href = element.getAttribute("href");
      if (!alt && href) {
        return [
          {
            type: "error",
            message: "No accessible name",
            ruleName,
          },
        ];
      }
    } else if (!isAriaHidden && !name) {
      return [
        {
          type: "error",
          message: "No accessible name",
          ruleName,
        },
      ];
    }
    return undefined;
  },
};
