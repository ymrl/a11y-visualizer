import { isFocusable } from "@a11y-visualizer/dom-utils";
import type { RuleObject, RuleResult } from "../type";
import { hasAnyContent } from "./hasAnyContent";

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

/**
 * WAI-ARIA属性の値をすべて表示する
 */
export const AriaAttributes: RuleObject = {
  ruleName,
  defaultOptions,
  evaluate: (element: Element, { enabled }: Options = defaultOptions) => {
    if (!enabled) {
      return undefined;
    }

    const ariaAttributesList: Array<{ name: string; value: string }> = [];
    const warnings: RuleResult[] = [];

    // 要素に存在する属性を検出し、ariaAttributes配列の順序で処理
    for (const attribute of ariaAttributes) {
      const value = element.getAttribute(attribute);
      if (value === null) {
        continue;
      }
      // aria-hidden="true"の場合は警告も表示
      if (attribute === "aria-hidden" && value === "true") {
        // コンテンツを含まない、かつフォーカス可能でない、それ自身がコンテンツではない要素は警告を表示しない
        const hasContent = hasAnyContent(element);
        const isSelfFocusable = isFocusable(element, true);
        const isContent = element.matches("img, svg, canvas, video");

        if (hasContent || isSelfFocusable || isContent) {
          warnings.push({
            type: "warning",
            message: "Inaccessible",
            ruleName,
          });
        }
      }
      // すべてのaria属性をariaAttributesに含める
      ariaAttributesList.push({ name: attribute, value });
    }

    const results: RuleResult[] = [];

    // 警告は個別に表示
    results.push(...warnings);

    // aria属性がある場合は配列形式で結果を返す
    if (ariaAttributesList.length > 0) {
      results.push({
        type: "ariaAttributes",
        attributes: ariaAttributesList,
        ruleName,
      });
    }

    return results.length > 0 ? results : undefined;
  },
};
