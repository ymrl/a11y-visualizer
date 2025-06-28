import { RuleObject, RuleResult } from "../type";

type Options = {
  enabled: boolean;
};
const ruleName = "aria-attributes";
const defaultOptions = {
  enabled: true,
};

// WAI-ARIA 1.2 全属性リスト
const ariaAttributes = [
  "aria-activedescendant",
  "aria-atomic",
  "aria-autocomplete",
  "aria-braillelabel",
  "aria-brailleroledescription",
  "aria-busy",
  "aria-checked",
  "aria-colcount",
  "aria-colindex",
  "aria-colindextext",
  "aria-colspan",
  "aria-controls",
  "aria-current",
  "aria-describedby",
  "aria-description",
  "aria-details",
  "aria-disabled",
  "aria-dropeffect",
  "aria-errormessage",
  "aria-expanded",
  "aria-flowto",
  "aria-grabbed",
  "aria-haspopup",
  "aria-hidden",
  "aria-invalid",
  "aria-keyshortcuts",
  "aria-label",
  "aria-labelledby",
  "aria-level",
  "aria-live",
  "aria-modal",
  "aria-multiline",
  "aria-multiselectable",
  "aria-orientation",
  "aria-owns",
  "aria-placeholder",
  "aria-posinset",
  "aria-pressed",
  "aria-readonly",
  "aria-relevant",
  "aria-required",
  "aria-roledescription",
  "aria-rowcount",
  "aria-rowindex",
  "aria-rowindextext",
  "aria-rowspan",
  "aria-selected",
  "aria-setsize",
  "aria-sort",
  "aria-valuemax",
  "aria-valuemin",
  "aria-valuenow",
  "aria-valuetext",
] as const;

export const AriaAttributes: RuleObject = {
  ruleName,
  defaultOptions,
  evaluate: (element: Element, { enabled }: Options = defaultOptions) => {
    if (!enabled) {
      return undefined;
    }

    const results: RuleResult[] = [];

    for (const attribute of ariaAttributes) {
      const value = element.getAttribute(attribute);
      if (value === null) {
        continue;
      }
      if (attribute === "aria-hidden" && value === "true") {
        results.push({
          type: "warning",
          message: `${attribute}: ${value}`,
          ruleName,
        });
      } else {
        results.push({
          type: "ariaAttribute",
          content: `${attribute}: ${value}`,
          ruleName,
        });
      }
    }

    return results.length > 0 ? results : undefined;
  },
};
