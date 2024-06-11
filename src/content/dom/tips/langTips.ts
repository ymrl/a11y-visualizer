import { ElementTip } from "../../types";
export const LangSelectors = ["[lang]", "[xml\\:lang]"] as const;

export const isLang = (el: Element): boolean => {
  return el.hasAttribute("lang") || el.hasAttribute("xml:lang");
};
export const langTips = (el: Element): ElementTip[] => {
  const lang = el.getAttribute("lang");
  const xmlLang = el.getAttribute("xml:lang");

  if (lang && xmlLang && lang !== xmlLang) {
    return [{ type: "error", content: "messages.langAndXmlLangMustBeSame" }];
  } else if (lang || xmlLang) {
    return [{ type: "lang", content: lang || xmlLang || "" }];
  }
  return [];
};
