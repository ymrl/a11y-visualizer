import { isPresentationalChildren } from "@a11y-visualizer/dom-utils";
import { computeAccessibleName } from "dom-accessibility-api";
import type { RuleObject } from "../type";

const ruleName = "iframe-name";

const defaultOptions = {
  enabled: true,
};

export const IframeName: RuleObject = {
  ruleName,
  defaultOptions,
  tagNames: ["iframe"],
  evaluate: (
    element,
    { enabled } = defaultOptions,
    { name = computeAccessibleName(element) },
  ) => {
    if (!enabled) {
      return undefined;
    }

    const tagName = element.tagName.toLowerCase();
    const isAriaHidden = element.getAttribute("aria-hidden") === "true";
    const roleAttr = element.getAttribute("role") || "";
    const hasPresentationRole =
      roleAttr === "presentation" || roleAttr === "none";

    // Skip if aria-hidden, presentation role, or presentational children
    if (
      isAriaHidden ||
      hasPresentationRole ||
      isPresentationalChildren(element)
    ) {
      return undefined;
    }

    // iframe-name rule only handles errors and warnings
    // accessible name display is handled by accessible-name rule

    // Handle cases where there's no accessible name
    if (!name && tagName === "iframe") {
      const hasTitle = element.hasAttribute("title");
      if (hasTitle) {
        return [
          {
            type: "warning",
            message: "Empty title attribute",
            ruleName,
          },
        ];
      } else {
        return [
          {
            type: "error",
            message: "No title attribute",
            ruleName,
          },
        ];
      }
    }

    return undefined;
  },
};
