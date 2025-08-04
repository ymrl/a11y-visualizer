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
    // For SVG elements without computed accessible name, check for title element
    const tagName = element.tagName.toLowerCase();
    if (!name && tagName === "svg") {
      const titleElement = element.querySelector("title");
      if (titleElement && titleElement.textContent) {
        return [
          {
            type: "name",
            content: titleElement.textContent,
            ruleName,
          },
        ];
      }
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
