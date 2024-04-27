import { computeAccessibleName } from "dom-accessibility-api";
import { ElementTip } from "../../types";
import { isAriaHidden } from "../index";

export const imageTips = (el: Element): ElementTip[] => {
  const result: ElementTip[] = [];
  const tagName = el.tagName.toLowerCase();
  const roleAttr = el.getAttribute("role") || "";
  if (tagName === "img" || roleAttr === "img" || tagName === "svg") {
    const name = computeAccessibleName(el);
    if (name) {
      result.push({ type: "name", content: name });
    } else if (!isAriaHidden(el) || roleAttr !== "presentation") {
      if (tagName === "img") {
        const hasAlt = el.hasAttribute("alt");
        if (hasAlt) {
          result.push({
            type: "warning",
            content: "messages.emptyAltImage",
          });
        } else {
          result.push({ type: "error", content: "messages.noAltImage" });
        }
      } else {
        result.push({ type: "error", content: "messages.noName" });
      }
    }
    if (tagName === "svg" && roleAttr === "") {
      result.push({ type: "tagName", content: "svg" });
    }
  }
  return result;
};
