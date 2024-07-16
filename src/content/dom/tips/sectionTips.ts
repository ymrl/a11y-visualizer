const sectionTags = [
  "article",
  "section",
  "nav",
  "aside",
  "footer",
  "header",
  "main",
  "form",
  "search",
] as const;
const sectionRoles = [
  "article",
  "banner",
  "complementary",
  "contentinfo",
  "main",
  "form",
  "navigation",
  "region",
  "search",
  "application",
] as const;

export const SectionSelectors = [
  ...sectionTags,
  ...sectionRoles.map((role) => `[role="${role}"]`),
] as const;

export const isSection = (el: Element): boolean =>
  hasSectionTag(el) || hasSectionRole(el);

const hasSectionRole = (el: Element): boolean =>
  (sectionRoles as readonly string[]).includes(el.getAttribute("role") || "");

const hasSectionTag = (el: Element): boolean =>
  (sectionTags as readonly string[]).includes(el.tagName.toLowerCase());
