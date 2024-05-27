import { computeAccessibleName } from "dom-accessibility-api";
import { ElementTip } from "../../types";

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

const tagToRole: Record<string, string> = {
  article: "article",
  nav: "navigation",
  aside: "complementary",
  footer: "contentinfo",
  header: "banner",
  main: "main",
  form: "form",
  search: "search",
} as const;

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

export const sectionTips = (el: Element): ElementTip[] => {
  const result: ElementTip[] = [];
  if (hasSectionRole(el)) {
    const role = el.getAttribute("role");
    if (role) result.push({ type: "landmark", content: role });
  } else if (hasSectionTag(el)) {
    const tagName = el.tagName.toLowerCase();
    const name = computeAccessibleName(el);
    if (tagName === "section") {
      if (name) {
        result.push({ type: "landmark", content: "region" });
      } else {
        result.push({ type: "warning", content: "messages.noNameSection" });
      }
    } else if (tagName === "aside") {
      if (!el.parentElement?.closest("article, aside, nav, section") || name) {
        result.push({ type: "landmark", content: "complementary" });
      }
    } else if (tagName === "header" || tagName === "footer") {
      if (!el.closest("article, aside, nav, section, main")) {
        result.push({
          type: "landmark",
          content: tagName === "header" ? "banner" : "contentinfo",
        });
      }
    } else {
      const role = tagToRole[tagName];
      if (role) result.push({ type: "landmark", content: role });
    }
  }
  return result;
};
