import { computeAccessibleName } from "dom-accessibility-api";
import { ElementTip } from "../../types";
import { isAriaHidden } from "../isAriaHidden";
import { isFocusable } from "../../../dom/isFocusable";
import { hasInteractiveDescendant } from "../../../dom/hasInteractiveDescendant";
import { hasTabIndexDescendant } from "../../../dom/hasTabIndexDescendant";
import { isInline } from "../../../dom/isInline";
import { isDefaultSize } from "../../../dom/isDefaultSize";
import { isSmallTarget } from "./isSmallTarget";
import { getKnownRole } from "../../../dom/getKnownRole";

export const ButtonSelectors = [
  "button",
  "details > summary:first-child",
  '[role="button"]',
  '[role="menuitem"]',
  'input[type="button"]',
  'input[type="submit"]',
  'input[type="reset"]',
  'input[type="image"]',
] as const;

export const isButton = (
  el: Element,
  role: string | null = getKnownRole(el),
): boolean => {
  const tagName = el.tagName.toLowerCase();
  const typeAttr = el.getAttribute("type");
  const hasButtonTag =
    tagName === "button" ||
    tagName === "summary" ||
    (tagName === "input" &&
      !!typeAttr &&
      ["button", "submit", "reset", "image"].includes(typeAttr));
  const hasButtonRole = role === "button" || role === "menuitem";
  return hasButtonTag || hasButtonRole;
};

export const buttonTips = (
  el: Element,
  name: string = computeAccessibleName(el),
): ElementTip[] => {
  const result: ElementTip[] = [];
  const tagName = el.tagName.toLowerCase();
  const role = el.getAttribute("role");

  if (isButton(el)) {
    if (!name && !isAriaHidden(el)) {
      result.push({ type: "error", content: "messages.noName" });
    }
    if (!isFocusable(el)) {
      result.push({ type: "error", content: "messages.notFocusable" });
    }
    if (
      (tagName === "button" || role === "button") &&
      (hasInteractiveDescendant(el) || hasTabIndexDescendant(el))
    ) {
      result.push({ type: "error", content: "messages.nestedInteractive" });
    }
    if (
      (tagName === "button" || role === "button") &&
      el.parentElement &&
      el.parentElement.closest('a, button, [role="button"]')
    ) {
      result.push({ type: "error", content: "messages.nestedInteractive" });
    }
    if (isSmallTarget(el) && !(isInline(el) || isDefaultSize(el))) {
      result.push({ type: "warning", content: "messages.smallTargetSize" });
    }
  }
  return result;
};
