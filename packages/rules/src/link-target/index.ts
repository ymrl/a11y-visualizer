import type { RuleObject } from "../type";

const ruleName = "link-target";
const defaultOptions = { enabled: true };
export const LinkTarget: RuleObject = {
  ruleName,
  defaultOptions,
  tagNames: ["a"],
  evaluate: (element, { enabled }) => {
    if (!enabled) {
      return undefined;
    }
    const target = element.getAttribute("target");
    if (target) {
      return [
        {
          type: "linkTarget",
          content: `${target}`,
          ruleName,
        },
      ];
    }
    return undefined;
  },
};
