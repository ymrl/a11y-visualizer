import { computeAccessibleName } from "dom-accessibility-api";
import { RuleObject } from "../type";

const ruleName = "accessible-name";
const defaultOptions = { enabled: true };
export const AccessibleName: RuleObject = {
  ruleName,
  defaultOptions,
  evaluate: (
    element,
    { enabled },
    { name = computeAccessibleName(element) },
  ) => {
    if (!enabled) {
      return undefined;
    }
    if (name) {
      return [
        {
          type: "name",
          content: `${name}`,
          ruleName,
        },
      ];
    }
    const tagName = element.tagName.toLowerCase();
    if (!name && tagName === "area") {
      // area elements are display:hidden by default in Firefox,
      // name may be empty even if alt is present
      // FIXME: It must refer the Accessible Name and Description Computation specification.
      // (cannot use aria-label/aria-labelledby)
      const alt = element.getAttribute("alt");
      const title = element.getAttribute("title");
      if (alt || title) {
        return [
          {
            type: "name",
            content: `${alt || title}`,
            ruleName,
          },
        ];
      }
    }
    // errors will be handled by other rules
    return undefined;
  },
};
