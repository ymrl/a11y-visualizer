import { isInInert } from "@a11y-visualizer/dom-utils";
import type { RuleObject } from "../type";

const ruleName = "inert";
const defaultOptions = {
  enabled: true,
};

export const Inert: RuleObject = {
  ruleName,
  defaultOptions,
  evaluate: (element, { enabled } = defaultOptions) => {
    if (!enabled) {
      return undefined;
    }
    if (isInInert(element)) {
      return [
        {
          type: "warning",
          message: "inert",
          ruleName,
        },
      ];
    }
    return undefined;
  },
};
