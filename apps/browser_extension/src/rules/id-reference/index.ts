import {
  getElementByIdFromRoots,
  getKnownRole,
} from "@a11y-visualizer/dom-utils";
import type { RuleObject } from "../type";

const ruleName = "id-reference";
const defaultOptions = { enabled: true };

/**
 * Attributes that reference IDs (single ID)
 */
const ID_REFERENCE_ATTRIBUTES = [
  "for", // label[for] -> form control[id]
  "aria-activedescendant", // container -> active child[id]
  "aria-details", // element -> details[id]
  "aria-errormessage", // form control -> error message[id]
  "list", // input[list] -> datalist[id]
  "form", // form controls -> form[id]
  "contextmenu", // element -> menu[id] (deprecated but still in use)
] as const;

/**
 * Attributes that reference multiple IDs (space-separated list)
 */
const ID_REFERENCE_LIST_ATTRIBUTES = [
  "aria-describedby", // element -> description elements[id]
  "aria-labelledby", // element -> label elements[id]
  "aria-controls", // control -> controlled elements[id]
  "aria-flowto", // element -> next elements in reading order[id]
  "aria-owns", // container -> owned children[id]
  "headers", // td[headers] -> th[id]
] as const;

type Options = {
  enabled: boolean;
};

/**
 * Check if aria-controls attribute should be ignored based on element state
 */
const shouldIgnoreAriaControls = (
  element: Element,
  role: string | null,
): boolean => {
  // Skip aria-controls when aria-expanded="false" (collapsed state)
  if (element.getAttribute("aria-expanded") === "false") {
    return true;
  }

  // Skip aria-controls when role="tab" and aria-selected="false" (inactive tab)
  if (role === "tab" && element.getAttribute("aria-selected") === "false") {
    return true;
  }

  return false;
};

/**
 * Validates that referenced IDs exist in the document
 */
export const IdReference: RuleObject = {
  ruleName,
  defaultOptions,
  evaluate: (
    element: Element,
    { enabled }: Options = defaultOptions,
    {
      role = getKnownRole(element),
      elementDocument = element.ownerDocument,
      shadowRoots,
    } = {},
  ) => {
    if (!enabled) {
      return undefined;
    }

    const missingIdsByAttribute: Record<string, string[]> = {};

    // Check single ID reference attributes
    for (const attribute of ID_REFERENCE_ATTRIBUTES) {
      const value = element.getAttribute(attribute);
      if (value) {
        const id = value.trim();
        if (id && !getElementByIdFromRoots(id, elementDocument, shadowRoots)) {
          missingIdsByAttribute[attribute] = [id];
        }
      }
    }

    // Check ID list reference attributes
    for (const attribute of ID_REFERENCE_LIST_ATTRIBUTES) {
      // Special handling for aria-controls
      if (
        attribute === "aria-controls" &&
        shouldIgnoreAriaControls(element, role)
      ) {
        continue;
      }

      const value = element.getAttribute(attribute);
      if (value) {
        const ids = value
          .trim()
          .split(/\s+/)
          .filter((id) => id.length > 0);
        const missingIds = ids.filter(
          (id) => !getElementByIdFromRoots(id, elementDocument, shadowRoots),
        );
        if (missingIds.length > 0) {
          missingIdsByAttribute[attribute] = missingIds;
        }
      }
    }

    if (Object.keys(missingIdsByAttribute).length > 0) {
      // Create ordered list of attributes with missing IDs
      const allAttributes = [
        ...ID_REFERENCE_ATTRIBUTES,
        ...ID_REFERENCE_LIST_ATTRIBUTES,
      ];
      const orderedEntries = allAttributes
        .filter((attribute) => missingIdsByAttribute[attribute])
        .map(
          (attribute) => [attribute, missingIdsByAttribute[attribute]] as const,
        );

      return [
        {
          type: "warning",
          message: "Referenced IDs do not exist: {{idsWithAttributes}}",
          messageParams: {
            idsWithAttributes: orderedEntries
              .map(([attribute, ids]) => `${ids.join(", ")} (${attribute})`)
              .join("; "),
          },
          ruleName,
        },
      ];
    }

    return undefined;
  },
};
