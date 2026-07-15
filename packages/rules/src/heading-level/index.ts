import type { RuleObject } from "../type";

const ruleName = "heading-level";
const defaultOptions = { enabled: true };

const HEADING_TAGS = ["h1", "h2", "h3", "h4", "h5", "h6"];

// role="heading" で aria-level が指定されていない場合の暗黙の見出しレベル
// （WAI-ARIA における heading の aria-level の暗黙値）
const DEFAULT_HEADING_LEVEL = "2";

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
    const isHeadingTag = HEADING_TAGS.includes(tagName);
    const ariaLevel = element.getAttribute("aria-level")?.trim() || null;

    // role="heading" で aria-level がない場合、暗黙のレベルは 2 になる。
    // 明示的なレベル指定が推奨されるため、レベル 2 として扱いつつ警告する。
    if (!isHeadingTag && !ariaLevel) {
      return [
        {
          type: "warning",
          message: "No heading level",
          ruleName,
        },
        {
          type: "heading",
          content: DEFAULT_HEADING_LEVEL,
          contentLabel: "Heading level",
          ruleName,
        },
      ];
    }

    // aria-level は h1〜h6 のタグ名による暗黙のレベルを上書きする
    const level = ariaLevel ?? tagName.slice(1);
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
        content: `${levelNumber}`,
        contentLabel: "Heading level",
        ruleName,
      },
    ];
  },
};
