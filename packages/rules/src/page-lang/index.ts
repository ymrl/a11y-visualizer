import type { RuleObject } from "../type";

const ruleName = "page-lang";
const defaultOptions = { enabled: true };

export const PageLang: RuleObject = {
  ruleName,
  defaultOptions,
  tagNames: ["body"],
  evaluate: (
    element,
    { enabled },
    { elementDocument = element.ownerDocument },
  ) => {
    if (!enabled) {
      return undefined;
    }
    const lang = elementDocument.documentElement.getAttribute("lang");
    const xmlLang = elementDocument.documentElement.getAttribute("xml:lang");
    if (!lang && !xmlLang) {
      return [
        {
          type: "error",
          ruleName,
          message: "No lang attribute on <html>",
        },
      ];
    }
    if (lang && xmlLang && lang !== xmlLang) {
      return [
        {
          type: "error",
          ruleName,
          message: "lang and xml:lang attributes must have the same value",
        },
      ];
    }

    if (lang || xmlLang) {
      return [
        {
          type: "lang",
          ruleName,
          content: `${lang || xmlLang}`,
          contentLabel: "Page language",
        },
      ];
    }
    return undefined;
  },
};
