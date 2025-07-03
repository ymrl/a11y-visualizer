import { RuleObject } from "../type";

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
 * Validates that referenced IDs exist in the document
 */
export const IdReference: RuleObject = {
  ruleName,
  defaultOptions,
  evaluate: (element: Element, { enabled }: Options = defaultOptions) => {
    if (!enabled) {
      return undefined;
    }

    const missingIds: string[] = [];
    const attributesWithMissingIds: string[] = [];

    // Check single ID reference attributes
    for (const attribute of ID_REFERENCE_ATTRIBUTES) {
      const value = element.getAttribute(attribute);
      if (value) {
        const id = value.trim();
        if (id && !document.getElementById(id)) {
          missingIds.push(id);
          attributesWithMissingIds.push(attribute);
        }
      }
    }

    // Check ID list reference attributes
    for (const attribute of ID_REFERENCE_LIST_ATTRIBUTES) {
      const value = element.getAttribute(attribute);
      if (value) {
        const ids = value
          .trim()
          .split(/\s+/)
          .filter((id) => id.length > 0);
        let hasAnyMissingIds = false;
        for (const id of ids) {
          if (!document.getElementById(id)) {
            missingIds.push(id);
            hasAnyMissingIds = true;
          }
        }
        if (hasAnyMissingIds) {
          attributesWithMissingIds.push(attribute);
        }
      }
    }

    if (missingIds.length > 0) {
      return [
        {
          type: "error",
          message: "Referenced IDs do not exist: {{ids}}",
          messageParams: {
            ids: missingIds.join(", "),
            attributes: attributesWithMissingIds.join(", "),
          },
          ruleName,
        },
      ];
    }

    return undefined;
  },
};
