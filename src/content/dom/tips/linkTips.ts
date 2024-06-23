import { computeAccessibleName } from "dom-accessibility-api";
import { ElementTip } from "../../types";
import { isAriaHidden } from "../isAriaHidden";
import { isFocusable } from "../isFocusable";
import { hasInteractiveDescendant } from "../hasInteractiveDescendant";
import { hasTabIndexDescendant } from "../hasTabIndexDescendant";

export const LinkSelectors = ["a", "area", '[role="link"]'] as const;

export const isLink = (el: Element): boolean =>
  hasLinkRole(el) || hasLinkTag(el);

const hasLinkRole = (el: Element): boolean =>
  el.getAttribute("role") === "link";

const hasLinkTag = (el: Element): boolean =>
  ["a", "area"].includes(el.tagName.toLowerCase());

export const linkTips = (
  el: Element,
  name: string = computeAccessibleName(el),
): ElementTip[] => {
  const result: ElementTip[] = [];
  const hidden = isAriaHidden(el);
  const hasTag = hasLinkTag(el);
  const hasRole = hasLinkRole(el);
  const href = el.getAttribute("href");
  const target = el.getAttribute("target");

  if (hasTag || hasRole) {
    if (!name && (hasRole || href) && !hidden) {
      result.push({ type: "error", content: "messages.noName" });
    }
    if (
      hasInteractiveDescendant(el) ||
      hasTabIndexDescendant(el) ||
      (el.tagName.toLowerCase() === "a" && el.querySelector("a"))
    ) {
      result.push({ type: "error", content: "messages.nestedInteractive" });
    }
    if (
      el.parentElement &&
      el.parentElement.closest('a, button, [role="link"], [role="button"]')
    ) {
      result.push({ type: "error", content: "messages.nestedInteractive" });
    }
  }
  if (hasTag) {
    if (!el.hasAttribute("href")) {
      result.push({ type: "warning", content: "messages.noHref" });
    }
    if (target) {
      result.push({ type: "linkTarget", content: target });
    }
  }
  if (hasRole && !isFocusable(el)) {
    result.push({ type: "error", content: "messages.notFocusable" });
  }
  return result;
};
