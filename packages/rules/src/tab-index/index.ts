import type { RuleObject, RuleResult } from "../type";

type Options = {
  enabled: boolean;
};

const ruleName = "tab-index";
const defaultOptions = {
  enabled: true,
};

/**
 * tabindex属性の値を表示し、1以上の値を警告する
 */
export const TabIndex: RuleObject = {
  ruleName,
  defaultOptions,
  selectors: ["[tabindex]"] as const,
  evaluate: (element: Element, { enabled }: Options = defaultOptions) => {
    if (!enabled) {
      return undefined;
    }

    const tabindexValue = element.getAttribute("tabindex");
    if (tabindexValue === null) {
      return undefined;
    }

    const results: RuleResult[] = [];

    // 数値としてパースして検証
    const numericValue = parseInt(tabindexValue, 10);
    if (Number.isNaN(numericValue)) {
      // parseIntで失敗した場合は不正なtabindex
      results.push({
        type: "warning",
        message: "Invalid tabindex",
        ruleName,
      });
    } else if (numericValue >= 1) {
      // 1以上の値は警告
      results.push({
        type: "warning",
        message: "Positive tabindex",
        ruleName,
      });
    }
    // tabindex値を表示
    results.push({
      type: "tabIndex",
      content: `tabindex="${tabindexValue}"`,
      ruleName,
    });

    return results.length > 0 ? results : undefined;
  },
};
