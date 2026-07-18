import { getElementByIdFromRoots, isHidden } from "@a11y-visualizer/dom-utils";
import type { RuleObject } from "../type";

const LABELABLE_SELECTOR = [
  "button",
  "input:not([type='hidden'])",
  "meter",
  "output",
  "progress",
  "select",
  "textarea",
].join(",");
const ruleName = "label-associated-control";
const defaultOptions = { enabled: true };
export const LabelAssociatedControl: RuleObject = {
  ruleName,
  defaultOptions,
  tagNames: ["label"],
  evaluate: (
    element,
    { enabled },
    { elementDocument = element.ownerDocument, shadowRoots },
  ) => {
    if (!enabled) {
      return undefined;
    }

    const forAttr = element.getAttribute("for");
    // HTML仕様上、for属性が指定されている場合は参照先のIDで関連コントロールが
    // 決まり、参照が解決できなくても内包コントロールへのフォールバックは
    // 発生しない。for属性がない場合のみ内包コントロールが関連付けられる
    let control: Element | null;
    if (forAttr !== null) {
      const forElement = getElementByIdFromRoots(
        forAttr,
        elementDocument,
        shadowRoots,
      );
      control = forElement?.matches(LABELABLE_SELECTOR) ? forElement : null;
    } else {
      control = element.querySelector(LABELABLE_SELECTOR);
    }
    if (!control || isHidden(control)) {
      return [
        {
          type: "warning",
          message: "Not associated with any control",
          ruleName,
        },
      ];
    }
    return undefined;
  },
};
