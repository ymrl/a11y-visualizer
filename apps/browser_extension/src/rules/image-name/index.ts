import { computeAccessibleName } from "dom-accessibility-api";
import { getKnownRole } from "../../dom/getKnownRole";
import { isPresentationalChildren } from "../../dom/isPresentationalChildren";
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
    const roleAttr = element.getAttribute("role") || "";
    // <img alt=""> has implicit role of "presentation", using role attribute.
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

    // For SVG elements, if they have title but no computed accessible name, use title text
    let effectiveName = name;
    if (tagName === "svg" && !name) {
      const titleElement = element.querySelector("title");
      if (titleElement?.textContent) {
        effectiveName = titleElement.textContent;
      }
    }

    // For SVG elements, we don't need to return the name here - accessible-name rule handles that
    // image-name rule is only for errors and warnings

    // Handle cases where there's no accessible name
    if (!effectiveName) {
      if (tagName === "img") {
        const hasAlt = element.hasAttribute("alt");
        if (hasAlt) {
          return [
            {
              type: "warning",
              message: "Empty alt attribute",
              ruleName,
            },
          ];
        } else {
          return [
            {
              type: "error",
              message: "No alt attribute",
              ruleName,
            },
          ];
        }
      } else if (role === "img") {
        return [
          {
            type: "error",
            message: "No accessible name",
            ruleName,
          },
        ];
      }
    }

    return undefined;
  },
};
