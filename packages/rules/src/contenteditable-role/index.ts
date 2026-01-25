import { getKnownRole } from "@a11y-visualizer/dom-utils";
import type { RuleObject } from "../type";

const ruleName = "contenteditable-role";
const defaultOptions = {
  enabled: true,
};

export const ContenteditableRole: RuleObject = {
  ruleName,
  defaultOptions,
  selectors: ["[contenteditable='true']", "[contenteditable='']"],
  evaluate: (element, options) => {
    if (!options.enabled) {
      return;
    }

    const isContenteditable = element.hasAttribute("contenteditable");
    if (!isContenteditable) {
      return;
    }

    // Check if element has a role attribute
    const roleAttribute = element.getAttribute("role");
    if (!roleAttribute) {
      return [
        {
          type: "warning",
          message: "Should have an appropriate role",
          ruleName,
        },
      ];
    }

    // Get the known role of the element for actual role checking
    const knownRole = getKnownRole(element);
    if (knownRole) {
      // Check if the role is appropriate for contenteditable
      const appropriateRoles = ["textbox", "searchbox", "combobox"];
      if (!appropriateRoles.includes(knownRole)) {
        return [
          {
            type: "warning",
            message: "Has inappropriate role for text input",
            ruleName,
          },
        ];
      }
    }

    return;
  },
};
