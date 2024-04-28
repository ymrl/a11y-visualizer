import { computeAccessibleName } from "dom-accessibility-api";
import { ElementTip } from "../../types";
import { isAriaHidden } from "../isAriaHidden";
import { isFocusable } from "../isFocusable";

export const LinkSelectors = ["a", "area", '[role="link"]'] as const;

export const linkTips = (el: Element): ElementTip[] => {
  const result: ElementTip[] = [];
  const tagName = el.tagName.toLowerCase();
  const hidden = isAriaHidden(el);
  const hasLinkTag = ["a", "area"].includes(tagName);
  const hasLinkRole = el.getAttribute("role") === "link";
  const href = el.getAttribute("href");

  if (hasLinkTag || hasLinkRole) {
    const name = computeAccessibleName(el);
    if (name) {
      result.push({ type: "name", content: name });
    } else if ((hasLinkRole || href) && !hidden) {
      result.push({ type: "error", content: "messages.noName" });
    }
  }
  if (hasLinkTag) {
    if (!el.hasAttribute("href")) {
      result.push({ type: "warning", content: "messages.noHref" });
    }
  }
  if (hasLinkRole && !isFocusable(el)) {
    result.push({ type: "error", content: "messages.notFocusable" });
  }
  return result;
};
