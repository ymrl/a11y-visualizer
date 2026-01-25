import {
  getKnownRole,
  isPresentationalChildren,
} from "@a11y-visualizer/dom-utils";
import { computeAccessibleName } from "dom-accessibility-api";
import type { RuleObject } from "../type";

const ruleName = "image-name";

const defaultOptions = {
  enabled: true,
};

export const ImageName: RuleObject = {
  ruleName,
  defaultOptions,
  tagNames: ["img", "svg"],
  roles: ["img"],
  evaluate: (
    element,
    { enabled } = defaultOptions,
    { name = computeAccessibleName(element), role = getKnownRole(element) },
  ) => {
    if (!enabled) {
      return undefined;
    }
    const tagName = element.tagName.toLowerCase();
    const isAriaHidden = element.getAttribute("aria-hidden") === "true";
    // Use computed role instead of role attribute for presentation check
    const hasPresentationRole = role === "presentation" || role === "none";

    // For SVG elements, if they have title but no computed accessible name, use title text
    let effectiveName = name;
    if (tagName === "svg" && !name) {
      const titleElement = element.querySelector("title");
      if (titleElement?.textContent) {
        effectiveName = titleElement.textContent;
      }
    }

    // Handle img elements - check for alt attribute regardless of aria-hidden or presentation state
    if (tagName === "img") {
      const hasAlt = element.hasAttribute("alt");
      if (!hasAlt) {
        return [
          {
            type: "error",
            message: "No alt attribute",
            ruleName,
          },
        ];
      } else {
        const altValue = element.getAttribute("alt") || "";
        if (altValue.trim() === "") {
          return [
            {
              type: "warning",
              message: "Empty alt attribute",
              ruleName,
            },
          ];
        }
      }
      // If alt attribute exists and has content, no need to show any error for img elements
      return undefined;
    }

    // Skip other checks if aria-hidden, presentation role, or presentational children
    if (
      isAriaHidden ||
      hasPresentationRole ||
      isPresentationalChildren(element)
    ) {
      return undefined;
    }

    // Handle other elements with img role - check for accessible name
    if (role === "img" && !effectiveName) {
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
