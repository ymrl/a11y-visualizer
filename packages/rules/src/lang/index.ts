import { isWellFormedLanguageTag } from "../bcp47";
import type { RuleObject } from "../type";

const ruleName = "lang";
const defaultOptions = { enabled: true };

export const Lang: RuleObject = {
  ruleName,
  defaultOptions,
  selectors: ["[lang]", "[xml\\:lang]"],
  evaluate: (element, { enabled }) => {
    if (!enabled) {
      return undefined;
    }

    const lang = element.getAttribute("lang");
    const xmlLang = element.getAttribute("xml:lang");

    if (lang && xmlLang && lang !== xmlLang) {
      return [
        {
          type: "error",
          ruleName,
          message: "lang and xml:lang attributes must have the same value",
        },
      ];
    } else if (lang || xmlLang) {
      const value = `${lang || xmlLang}`;
      if (!isWellFormedLanguageTag(value)) {
        return [
          {
            type: "error",
            ruleName,
            message: "Invalid language tag format",
          },
        ];
      }
      return [{ type: "lang", ruleName, content: value }];
    }
    return undefined;
  },
};
