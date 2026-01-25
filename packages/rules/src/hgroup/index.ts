import type { RuleObject } from "../type";

const ruleName = "hgroup";
const defaultOptions = { enabled: true };
export const Hgroup: RuleObject = {
  ruleName,
  defaultOptions,
  tagNames: ["hgroup"],
  evaluate: (element, { enabled }) => {
    if (!enabled) {
      return undefined;
    }
    if (
      !element.hasAttribute("role") &&
      element.tagName.toLowerCase() === "hgroup"
    ) {
      return [
        {
          type: "tagName",
          content: "hgroup",
          ruleName,
        },
      ];
    }
    return undefined;
  },
};
