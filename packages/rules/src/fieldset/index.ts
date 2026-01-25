import type { RuleObject } from "../type";

const ruleName = "fieldset";
const defaultOptions = { enabled: true };
export const Fieldset: RuleObject = {
  ruleName,
  defaultOptions,
  tagNames: ["fieldset"],
  evaluate: (element, { enabled }) => {
    if (!enabled) {
      return undefined;
    }
    if (
      !element.hasAttribute("role") &&
      element.tagName.toLowerCase() === "fieldset"
    ) {
      return [
        {
          type: "tagName",
          content: "fieldset",
          ruleName,
        },
      ];
    }
    return undefined;
  },
};
