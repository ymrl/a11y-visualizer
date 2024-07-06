import { computeAccessibleName } from "dom-accessibility-api";
import { ElementTip } from "../../types";
import { isAriaHidden } from "../isAriaHidden";
import { isFocusable } from "../isFocusable";
import { hasInteractiveDescendant } from "../hasInteractiveDescendant";
import { hasTabIndexDescendant } from "../hasTabIndexDescendant";
import { isInline } from "../isInline";
import { isDefaultSize } from "./isDefaultSize";
import { isSmallTarget } from "./isSmallTarget";
import { hasSpacing } from "../hasSpacing";

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
  const tagName = el.tagName.toLowerCase();
  const hasTag = hasLinkTag(el);
  const hasRole = hasLinkRole(el);
  const href = el.getAttribute("href");
  const target = el.getAttribute("target");

  if (tagName === "a" || hasRole) {
    if (!name && (hasRole || href) && !hidden) {
      result.push({ type: "error", content: "messages.noName" });
    }
    if (
      el.parentElement &&
      el.parentElement.closest('a, button, [role="button"]')
    ) {
      result.push({ type: "error", content: "messages.nestedInteractive" });
    }

    if (
      isSmallTarget(el) &&
      !(isInline(el) || isDefaultSize(el) || hasSpacing(el))
    ) {
      result.push({ type: "warning", content: "messages.smallTargetSize" });
    }
  }

  if (tagName === "area") {
    // area elements are display:hidden by default in Firefox,
    // name may be empty even if alt is present
    const alt = el.getAttribute("alt");
    const title = el.getAttribute("title");
    if (!alt && href) {
      result.push({ type: "error", content: "messages.noAltImageMap" });
    }

    // for Firefox
    if (!name) {
      if (alt) {
        result.push({ type: "name", content: alt });
      } else if (title) {
        result.push({ type: "name", content: title });
      }
    }
  }

  if (hasTag) {
    if (!el.hasAttribute("href")) {
      result.push({ type: "warning", content: "messages.noHref" });
    }
    if (target) {
      result.push({ type: "linkTarget", content: target });
    }
    if (
      hasInteractiveDescendant(el) ||
      hasTabIndexDescendant(el) ||
      (el.tagName.toLowerCase() === "a" && el.querySelector("a"))
    ) {
      result.push({ type: "error", content: "messages.nestedInteractive" });
    }
  }
  if (hasRole && !isFocusable(el)) {
    result.push({ type: "error", content: "messages.notFocusable" });
  }
  return result;
};
