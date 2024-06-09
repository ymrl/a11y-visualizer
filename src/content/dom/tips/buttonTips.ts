import { computeAccessibleName } from "dom-accessibility-api";
import { ElementTip } from "../../types";
import { isAriaHidden } from "../isAriaHidden";
import { isFocusable } from "../isFocusable";

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

export const isButton = (el: Element): boolean => {
  const tagName = el.tagName.toLowerCase();
  const typeAttr = el.getAttribute("type");
  const hasButtonTag =
    tagName === "button" ||
    (tagName === "summary" && el.matches("details > summary:first-child")) ||
    (tagName === "input" &&
      !!typeAttr &&
      ["button", "submit", "reset", "image"].includes(typeAttr));
  const role = el.getAttribute("role");
  const hasButtonRole = role === "button" || role === "menuitem";
  return hasButtonTag || hasButtonRole;
};

export const buttonTips = (el: Element): ElementTip[] => {
  const result: ElementTip[] = [];

  if (isButton(el)) {
    const name = computeAccessibleName(el);
    if (!name && !isAriaHidden(el)) {
      result.push({ type: "error", content: "messages.noName" });
    }
    if (!isFocusable(el)) {
      result.push({ type: "error", content: "messages.notFocusable" });
    }
  }
  return result;
};
