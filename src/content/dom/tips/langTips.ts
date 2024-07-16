export const LangSelectors = ["[lang]", "[xml\\:lang]"] as const;

export const isLang = (el: Element): boolean => {
  return el.hasAttribute("lang") || el.hasAttribute("xml:lang");
};
