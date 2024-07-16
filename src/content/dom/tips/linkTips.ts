export const LinkSelectors = ["a", "area", '[role="link"]'] as const;

export const isLink = (el: Element): boolean =>
  hasLinkRole(el) || hasLinkTag(el);

const hasLinkRole = (el: Element): boolean =>
  el.getAttribute("role") === "link";

const hasLinkTag = (el: Element): boolean =>
  ["a", "area"].includes(el.tagName.toLowerCase());
