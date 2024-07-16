import { RuleObject } from "../type";
const ruleName = "link-href";
const defaultOptions = { enabled: true };

export const LinkHref: RuleObject = {
  ruleName,
  defaultOptions,
  tagNames: ["a", "area"],
  evaluate: (element, { enabled }) => {
    if (!enabled) {
      return undefined;
    }
    const href = element.getAttribute("href");
    if (!href) {
      return [
        {
          type: "warning",
          message: "No href attribute",
          ruleName,
        },
      ];
    }
    return undefined;
  },
};
