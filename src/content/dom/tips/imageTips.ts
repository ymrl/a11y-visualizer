import { computeAccessibleName } from "dom-accessibility-api";
import { ElementTip } from "../../types";
import { isAriaHidden } from "../index";
import { isPresentationalChildren } from "../../../dom/isPresentationalChildren";

export const ImageSelectors = ["img", "svg", '[role="img"]'] as const;

export const isImage = (el: Element): boolean => {
  const tagName = el.tagName.toLowerCase();
  return (
    tagName === "img" || tagName === "svg" || el.getAttribute("role") === "img"
  );
};

export const imageTips = (
  el: Element,
  name: string = computeAccessibleName(el),
): ElementTip[] => {
  const result: ElementTip[] = [];
  const tagName = el.tagName.toLowerCase();
  const roleAttr = el.getAttribute("role") || "";
  const hasPresentationRole =
    roleAttr === "presentation" || roleAttr === "none";

  if (tagName === "img" || roleAttr === "img") {
    if (
      !name &&
      !isAriaHidden(el) &&
      !hasPresentationRole &&
      !isPresentationalChildren(el)
    ) {
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
  } else if (tagName === "svg") {
    if (
      !isAriaHidden(el) &&
      !hasPresentationRole &&
      !isPresentationalChildren(el)
    ) {
      result.push({ type: "warning", content: "messages.mayBeSkipped" });
    }
  }
  return result;
};
