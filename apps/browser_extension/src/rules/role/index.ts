import { getKnownRole } from "@a11y-visualizer/dom-utils";
import type { RuleObject } from "../type";

const ruleName = "role";
const defaultOptions = { enabled: true };

export const Role: RuleObject = {
  ruleName,
  defaultOptions,
  evaluate: (element, { enabled }, { role = getKnownRole(element) }) => {
    if (!enabled) {
      return undefined;
    }
    const hasRole = element.getAttribute("role");
    if (!hasRole) {
      return undefined;
    }

    if (role) {
      return [
        {
          type: "tagName",
          ruleName,
          content: element.tagName.toLowerCase(),
        },
        {
          type: "role",
          ruleName,
          content: role,
        },
      ];
    }
    return [
      {
        type: "error",
        ruleName,
        message: "Unknown role",
      },
    ];
  },
};
