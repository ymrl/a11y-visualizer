import {
  getComputedImplictRole,
  getKnownRole,
  isInAriaHidden,
} from "@a11y-visualizer/dom-utils";
import { computeAccessibleName } from "dom-accessibility-api";
import type { RuleObject, RuleResult } from "../type";

const NAMING_PROHIBITED_ROLES = [
  "caption",
  "code",
  "deletion",
  "emphasis",
  "generic",
  "insertion",
  "paragraph",
  "presentation",
  "none",
  "strong",
  "subscript",
  "superscript",
];
const NAMING_WARNING_ROLES = [
  "definition",
  "mark",
  "suggestion",
  "term",
  "time",
];

const ruleName = "accessible-name";
const defaultOptions = { enabled: true };
export const AccessibleName: RuleObject = {
  ruleName,
  defaultOptions,
  evaluate: (
    element,
    { enabled },
    { name = computeAccessibleName(element), role = getKnownRole(element) },
  ) => {
    if (!enabled) {
      return undefined;
    }

    // Skip elements that are aria-hidden or have aria-hidden ancestors
    if (isInAriaHidden(element)) {
      return undefined;
    }
    const computedRole =
      role || element.getAttribute("role") || getComputedImplictRole(element);
    const isNamingProhibited =
      computedRole && NAMING_PROHIBITED_ROLES.includes(computedRole);
    if (
      isNamingProhibited &&
      (element.hasAttribute("aria-label") ||
        element.hasAttribute("aria-labelledby"))
    ) {
      return [
        {
          type: "error",
          message: "Cannot be named",
          ruleName,
        },
      ];
    } else if (isNamingProhibited) {
      return undefined;
    }

    const tagName = element.tagName.toLowerCase();
    const results: RuleResult[] = name
      ? [
          {
            type: "name",
            content: `${name}`,
            ruleName,
          },
        ]
      : [];

    // For SVG elements without computed accessible name, check for title element
    if (!name && tagName === "svg") {
      const titleElement = element.querySelector("title");
      if (titleElement?.textContent) {
        results.push({
          type: "name",
          content: titleElement.textContent,
          ruleName,
        });
      }
    }

    if (!name && tagName === "area") {
      // area elements are display:hidden by default in Firefox,
      // name may be empty even if alt is present
      // FIXME: It must refer the Accessible Name and Description Computation specification.
      // (cannot use aria-label/aria-labelledby)
      const alt = element.getAttribute("alt");
      const title = element.getAttribute("title");
      if (alt || title) {
        results.push({
          type: "name",
          content: `${alt || title}`,
          ruleName,
        });
      }
    }

    if (
      ((computedRole && NAMING_WARNING_ROLES.includes(computedRole)) ||
        !computedRole) &&
      (element.hasAttribute("aria-label") ||
        element.hasAttribute("aria-labelledby"))
    ) {
      results.push({
        type: "warning",
        message: "Should not be named",
        ruleName,
      });
    }

    return results.length > 0 ? results : undefined;
  },
};
