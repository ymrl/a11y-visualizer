import { computeAccessibleName } from "dom-accessibility-api";
import { RuleObject } from "../type";
import { getKnownRole } from "../../dom/getKnownRole";
import { isPresentationalChildren } from "../../dom/isPresentationalChildren";

const ruleName = "image-name";

const defaultOptions = {
  enabled: true,
};

export const ImageName: RuleObject = {
  ruleName,
  defaultOptions,
  tagNames: ["img"],
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
    if (
      !name &&
      !isAriaHidden &&
      !hasPresentationRole &&
      !isPresentationalChildren(element)
    ) {
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
