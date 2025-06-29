import { getKnownRole } from "../../dom/getKnownRole";
import { RuleObject, RuleResult } from "../type";
import {
  ALL_ARIA_ATTRIBUTES,
  validateAriaAttributeValue,
  isValidAriaAttributeForRole,
} from "./ariaSpec";

type Options = {
  enabled: boolean;
};

const ruleName = "aria-validation";
const defaultOptions = { enabled: true };

/**
 * Validates all WAI-ARIA attributes for value validity and role compatibility
 * Handles both AriaState attributes (native duplicates) and AriaValidation attributes
 */
export const AriaValidation: RuleObject = {
  ruleName,
  defaultOptions,
  evaluate: (element: Element, { enabled }: Options = defaultOptions) => {
    if (!enabled) {
      return undefined;
    }

    const results: RuleResult[] = [];
    const role = getKnownRole(element);

    // Validate all ARIA attributes
    for (const attribute of ALL_ARIA_ATTRIBUTES) {
      const value = element.getAttribute(attribute);

      if (value === null) {
        continue; // Attribute not present, no validation needed
      }

      // Skip aria-hidden as it's handled by AriaAttributes rule
      if (attribute === "aria-hidden") {
        continue;
      }

      // Validate attribute value
      if (!validateAriaAttributeValue(attribute, value)) {
        results.push({
          type: "error",
          message: "Invalid WAI-ARIA attribute value: {{attribute}}",
          messageParams: { attribute },
          ruleName,
        });
        continue; // Don't check role validity if value is already invalid
      }

      // Validate attribute is allowed for current role
      if (!isValidAriaAttributeForRole(attribute, role)) {
        results.push({
          type: "error",
          message: "Invalid role for WAI-ARIA attribute: {{attribute}}",
          messageParams: { attribute },
          ruleName,
        });
      }
    }

    return results.length > 0 ? results : undefined;
  },
};
