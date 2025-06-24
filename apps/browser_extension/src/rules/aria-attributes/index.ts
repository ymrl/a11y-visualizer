import { RuleObject } from "../type";

type Options = {
  enabled: boolean;
};
const ruleName = "aria-attributes";
const defaultOptions = {
  enabled: true,
};

// WAI-ARIA 1.2 全属性リスト
// コメントアウトされた属性は既存のルールでカバーされている
const ariaAttributes = [
  "aria-activedescendant",
  "aria-atomic",
  "aria-autocomplete",
  "aria-braillelabel",
  "aria-brailleroledescription",
  // "aria-busy", // handled by aria-state rule
  // "aria-checked", // handled by aria-state rule
  "aria-colcount",
  "aria-colindex",
  "aria-colindextext",
  "aria-colspan",
  "aria-controls",
  // "aria-current", // handled by aria-state rule
  // "aria-describedby", // handled by accessible-description rule
  "aria-description",
  "aria-details",
  // "aria-disabled", // handled by aria-state rule
  "aria-dropeffect",
  "aria-errormessage",
  // "aria-expanded", // handled by aria-state rule
  "aria-flowto",
  "aria-grabbed",
  "aria-haspopup",
  // "aria-hidden", // handled by aria-hidden rule
  // "aria-invalid", // handled by aria-state rule
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
  // "aria-pressed", // handled by aria-state rule
  // "aria-readonly", // handled by aria-state rule
  "aria-relevant",
  // "aria-required", // handled by aria-state rule
  "aria-roledescription",
  "aria-rowcount",
  "aria-rowindex",
  "aria-rowindextext",
  "aria-rowspan",
  // "aria-selected", // handled by aria-state rule
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

    const results = [];

    for (const attribute of ariaAttributes) {
      const value = element.getAttribute(attribute);
      if (value !== null) {
        results.push({
          type: "state" as const,
          state: `${attribute}: ${value}`,
          ruleName,
        });
      }
    }

    return results.length > 0 ? results : undefined;
  },
};
