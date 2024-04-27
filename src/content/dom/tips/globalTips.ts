import { computeAccessibleDescription } from "dom-accessibility-api";
import { ElementTip } from "../../types";

export const globalTips = (el: Element): ElementTip[] => {
  const result: ElementTip[] = [];
  const description = computeAccessibleDescription(el);
  const roleAttr = el.getAttribute("role") || "";
  if (roleAttr) {
    const tagName = el.tagName.toLowerCase();
    result.push({ type: "tagName", content: tagName });
    result.push({ type: "role", content: roleAttr });
  }
  if (description) {
    result.push({ type: "description", content: description });
  }

  return result;
};
