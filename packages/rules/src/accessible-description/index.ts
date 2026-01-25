import { computeAccessibleDescription } from "dom-accessibility-api";
import type { RuleObject } from "../type";

const ruleName = "accessible-description";
const defaultOptions = {
  enabled: true,
};
export const AccessibleDescription: RuleObject = {
  ruleName,
  defaultOptions,
  evaluate: (element, { enabled }) => {
    if (!enabled) {
      return undefined;
    }
    const description = computeAccessibleDescription(element);

    if (description) {
      return [
        {
          type: "description",
          content: description,
          ruleName,
        },
      ];
    }
    return undefined;
  },
};
