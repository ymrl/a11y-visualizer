import {
  hasInteractiveDescendant,
  hasTabIndexDescendant,
} from "@a11y-visualizer/dom-utils";
import type { RuleObject } from "../type";

const ruleName = "nested-interactive";
const defaultOptions = {
  enabled: true,
};

export const NestedInteractive: RuleObject = {
  ruleName,
  defaultOptions,
  tagNames: [
    "a",
    "button",
    "details",
    "embed",
    "iframe",
    "label",
    "select",
    "textarea",
    "audio",
    "img",
    "input",
    "video",
  ],
  selectors: [
    "[tabindex]",
    "audio[controls]",
    "img[usemap]",
    'input:not([type="hidden"])',
    "video[controls]",
  ],
  evaluate: (element, { enabled } = defaultOptions) => {
    if (!enabled) {
      return undefined;
    }
    const tagName = element.tagName.toLowerCase();
    if (
      // 子孫にインタラクティブ要素があるか探す
      (["a", "button"].includes(tagName) &&
        (hasInteractiveDescendant(element) ||
          hasTabIndexDescendant(element))) ||
      // a要素の場合は子孫のa要素があってはいけない (hasInteractiveDscendantはhrefの有無が反映される)
      (tagName === "a" && element.querySelector("a")) ||
      // 先祖のインタラクティブ要素を探す
      (([
        "button",
        "details",
        "embed",
        "iframe",
        "label",
        "select",
        "textarea",
      ].includes(tagName) ||
        (tagName === "a" && element.hasAttribute("href")) ||
        (tagName === "audio" && element.hasAttribute("controls")) ||
        (tagName === "img" && element.hasAttribute("usemap")) ||
        (tagName === "input" && element.getAttribute("type") !== "hidden") ||
        (tagName === "video" && element.hasAttribute("controls")) ||
        element.getAttribute("tabindex")) &&
        element.parentElement &&
        element.parentElement.closest("a, button")) ||
      // hrefのないa要素の先祖にa要素がないことの確認
      (tagName === "a" &&
        !element.hasAttribute("href") &&
        element.parentElement &&
        element.parentElement.closest("a"))
    ) {
      return [
        {
          type: "error",
          message: "Nested interactive element",
          ruleName,
        },
      ];
    }
    return undefined;
  },
};
