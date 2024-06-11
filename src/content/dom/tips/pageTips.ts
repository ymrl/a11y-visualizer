import { ElementTip } from "../../types";
import { langTips } from "./langTips";

export const isPage = (el: Element): boolean => {
  return el.tagName.toLowerCase() === "body";
};

export const pageTips = (el: Element, srcdoc: boolean): ElementTip[] => {
  if (!isPage(el)) return [];
  const result: ElementTip[] = [];
  const d = el.ownerDocument;
  const h = d.documentElement;
  const lang = langTips(h);
  if (!srcdoc && !d.title) {
    result.push({ type: "error", content: "messages.noTitlePage" });
  }
  if (d.title) {
    result.push({ type: "pageTitle", content: d.title });
  }
  if (lang.length === 0) {
    result.push({ type: "error", content: "messages.noLangPage" });
  }
  return [...result, ...lang];
};
