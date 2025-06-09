import { RuleObject } from "../type";

type Options = {
  enabled: boolean;
};
const ruleName = "aria-hidden";
const defaultOptions = {
  enabled: true,
};

export const AriaHidden: RuleObject = {
  ruleName,
  defaultOptions,
  selectors: ["[aria-hidden]"],
  evaluate: (element: Element, { enabled }: Options = defaultOptions) => {
    if (!enabled) {
      return undefined;
    }
    if (element.getAttribute("aria-hidden") === "true") {
      return [
        {
          type: "warning",
          message: "aria-hidden",
          ruleName: ruleName,
        },
      ];
    }
  },
};
