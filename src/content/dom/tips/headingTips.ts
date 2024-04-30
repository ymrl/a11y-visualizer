import { computeAccessibleName } from "dom-accessibility-api";
import { ElementTip } from "../../types";
import { isAriaHidden } from "../isAriaHidden";

export const HeadingSelectors = [
  "h1",
  "h2",
  "h3",
  "h4",
  "h5",
  "h6",
  '[role="heading"]',
] as const;

const hasHeadingTag = (el: Element): boolean => {
  const tagName = el.tagName.toLowerCase();
  return ["h1", "h2", "h3", "h4", "h5", "h6"].includes(tagName);
};

const hasHeadingRole = (el: Element): boolean =>
  el.getAttribute("role") === "heading";

export const isHeading = (el: Element): boolean =>
  hasHeadingRole(el) || hasHeadingTag(el);

export const headingTips = (el: Element): ElementTip[] => {
  const result: ElementTip[] = [];
  const tagName = el.tagName.toLowerCase();
  const hidden = isAriaHidden(el);
  const hasTag = hasHeadingTag(el);
  const hasRole = hasHeadingRole(el);

  if (hasTag) {
    result.push({ type: "level", content: `${tagName.slice(1)}` });
  }
  if (hasRole) {
    const ariaLevel = el.getAttribute("aria-level");
    if (ariaLevel) {
      result.push({ type: "level", content: `${ariaLevel}` });
    } else if (!hidden) {
      result.push({
        type: "error",
        content: "messages.noHeadingLevel",
      });
    }
  }
  if (hasTag || hasRole) {
    const name = computeAccessibleName(el);
    if (!name && !hidden) {
      result.push({ type: "error", content: "messages.noName" });
    }
  }

  return result;
};
