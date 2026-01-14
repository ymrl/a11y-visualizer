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
    const forElement = forAttr
      ? getElementByIdFromRoots(forAttr, elementDocument, shadowRoots)
      : null;
    const controlByFor = forElement?.matches(LABELABLE_SELECTOR)
      ? forElement
      : null;
    const controlInside = element.querySelector(LABELABLE_SELECTOR);
    if (
      (!controlByFor && !controlInside) ||
      (controlByFor && isHidden(controlByFor)) ||
      (controlInside && isHidden(controlInside))
    ) {
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
