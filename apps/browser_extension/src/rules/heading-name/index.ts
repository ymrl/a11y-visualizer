import { computeAccessibleName } from "dom-accessibility-api";
import type { RuleObject } from "../type";

const ruleName = "heading-name";
const defaultOptions = { enabled: true };
export const HeadingName: RuleObject = {
  ruleName,
  defaultOptions,
  tagNames: ["h1", "h2", "h3", "h4", "h5", "h6"],
  roles: ["heading"],
  evaluate: (
    element,
    { enabled },
    { name = computeAccessibleName(element) },
  ) => {
    if (!enabled) {
      return undefined;
    }
    if (!name) {
      return [
        {
          type: "error",
          ruleName,
          message: "Empty heading",
        },
      ];
    }
  },
};
