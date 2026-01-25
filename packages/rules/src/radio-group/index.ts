import { querySelectorAllFromRoots } from "@a11y-visualizer/dom-utils";
import type { RuleObject } from "../type";

const ruleName = "radio-group";
const defaultOptions = {
  enabled: true,
};
export const RadioGroup: RuleObject = {
  ruleName,
  defaultOptions,
  selectors: ['input[type="radio"]'],
  evaluate: (element, { enabled } = defaultOptions, { shadowRoots } = {}) => {
    if (!enabled) {
      return undefined;
    }

    const nameAttr = element.getAttribute("name");
    if (!nameAttr) {
      return [
        {
          type: "error",
          message: "No name attribute",
          ruleName,
        },
      ];
    } else {
      const form = element.closest("form");
      const radios = querySelectorAllFromRoots(
        `input[type="radio"][name="${CSS.escape(nameAttr)}"]`,
        form || element.ownerDocument,
        shadowRoots,
      );
      if (radios.length < 2) {
        return [
          {
            type: "error",
            message: "Ungrouped radio button",
            ruleName,
          },
        ];
      }
    }
  },
};
