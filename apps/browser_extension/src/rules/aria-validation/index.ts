import { getKnownRole } from "@a11y-visualizer/dom-utils";
import type { RuleObject, RuleResult } from "../type";
import {
  ALL_ARIA_ATTRIBUTES,
  isValidAriaAttributeForRole,
  validateAriaAttributeValue,
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
  evaluate: (
    element: Element,
    { enabled }: Options = defaultOptions,
    { role = getKnownRole(element) },
  ) => {
    if (!enabled) {
      return undefined;
    }

    const results: RuleResult[] = [];

    // Validate all ARIA attributes
    for (const attribute of ALL_ARIA_ATTRIBUTES) {
      const value = element.getAttribute(attribute);

      if (value === null) {
        continue; // Attribute not present, no validation needed
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
