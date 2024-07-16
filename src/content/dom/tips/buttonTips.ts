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
