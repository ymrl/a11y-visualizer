import type { RuleObject } from "../type";

const ruleName = "heading-level";
const defaultOptions = { enabled: true };
export const HeadingLevel: RuleObject = {
  ruleName,
  defaultOptions,
  tagNames: ["h1", "h2", "h3", "h4", "h5", "h6"],
  roles: ["heading"],
  evaluate: (element, { enabled }) => {
    if (!enabled) {
      return undefined;
    }
    const tagName = element.tagName.toLowerCase();
    const level = ["h1", "h2", "h3", "h4", "h5", "h6"].includes(tagName)
      ? tagName.slice(1)
      : element.getAttribute("aria-level");
    if (!level) {
      return [
        {
          type: "error",
          message: "No heading level",
          ruleName,
        },
      ];
    }
    const levelNumber = parseInt(level, 10);
    if (levelNumber < 1 || Number.isNaN(levelNumber)) {
      return [
        {
          type: "error",
          message: "Invalid heading level",
          ruleName,
        },
      ];
    }
    return [
      {
        type: "heading",
        content: level,
        contentLabel: "Heading level",
        ruleName,
      },
    ];
  },
};
