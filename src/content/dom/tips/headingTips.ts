const hasHeadingTag = (el: Element): boolean => {
  const tagName = el.tagName.toLowerCase();
  return ["h1", "h2", "h3", "h4", "h5", "h6"].includes(tagName);
};

const hasHeadingRole = (el: Element): boolean =>
  el.getAttribute("role") === "heading";

export const isHeading = (el: Element): boolean =>
  hasHeadingRole(el) || hasHeadingTag(el);
