import type { RuleObject } from "../type";

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
    const isInSVG = element.namespaceURI === "http://www.w3.org/2000/svg";
    const href = element.getAttribute("href");
    const xlinkHref = element.getAttribute("xlink:href");
    if (!href && !(isInSVG && xlinkHref)) {
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
