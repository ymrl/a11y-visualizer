import { getKnownRole, type KnownRole } from "@a11y-visualizer/dom-utils";
import { computeAccessibleName } from "dom-accessibility-api";
import type { RuleObject } from "../type";

const ruleName = "landmark";
const defaultOptions = { enabled: true };
const roles: KnownRole[] = [
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
  "dialog",
  "alertdialog",
] as const;

const tagToRole: Record<string, string> = {
  article: "article",
  nav: "navigation",
  main: "main",
  form: "form",
  search: "search",
  dialog: "dialog",
} as const;

export const Landmark: RuleObject = {
  ruleName,
  defaultOptions,
  tagNames: [
    "article",
    "section",
    "nav",
    "aside",
    "footer",
    "header",
    "main",
    "form",
    "search",
  ] as const,
  roles,
  evaluate: (
    element,
    { enabled },
    { name = computeAccessibleName(element), role = getKnownRole(element) },
  ) => {
    if (!enabled) return undefined;
    const hasSectionRole =
      element.hasAttribute("role") && role && roles.includes(role as KnownRole);
    if (hasSectionRole) {
      return [
        {
          type: "landmark",
          content: role,
          ruleName,
        },
      ];
    }
    const tagName = element.tagName.toLowerCase();

    if (tagName === "section") {
      if (name) {
        return [
          {
            type: "landmark",
            content: "region",
            ruleName,
          },
        ];
      }
    }

    if (tagName === "aside") {
      if (
        name ||
        !element.parentElement?.closest("article, aside, nav, section")
      ) {
        return [{ type: "landmark", content: "complementary", ruleName }];
      }
    }

    if (tagName === "header" || tagName === "footer") {
      if (!element.closest("article, aside, nav, section, main")) {
        return [
          {
            type: "landmark",
            content: tagName === "header" ? "banner" : "contentinfo",
            ruleName,
          },
        ];
      }
    }

    if (tagToRole[tagName]) {
      return [
        {
          type: "landmark",
          content: tagToRole[tagName],
          ruleName,
        },
      ];
    } else if (!hasSectionRole) {
      return [{ type: "tagName", content: tagName, ruleName }];
    }
    return undefined;
  },
};
