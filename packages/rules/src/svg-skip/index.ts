import {
  isInAriaHidden,
  isPresentationalChildren,
} from "@a11y-visualizer/dom-utils";
import { computeAccessibleName } from "dom-accessibility-api";
import type { RuleObject } from "../type";

type Options = {
  enabled: boolean;
};
const ruleName = "svg-skip";
const defaultOptions: Options = {
  enabled: true,
};

export const SvgSkip: RuleObject<Options> = {
  ruleName,
  defaultOptions,
  tagNames: ["svg"],
  evaluate: (
    element: Element,
    { enabled }: Options = defaultOptions,
    { name = computeAccessibleName(element) } = {},
  ) => {
    if (!enabled) {
      return undefined;
    }
    const tagName = element.tagName.toLowerCase();

    // Check if SVG has title element for accessible name
    const hasTitle = element.querySelector("title");

    if (
      tagName === "svg" &&
      !isInAriaHidden(element) &&
      !element.hasAttribute("role") &&
      !hasTitle &&
      !isPresentationalChildren(element)
    ) {
      // Check if SVG has accessible name
      if (!name) {
        return [
          {
            type: "warning",
            message: "No accessible name",
            ruleName: ruleName,
          },
        ];
      } else {
        return [
          {
            type: "warning",
            message: "May be skipped",
            ruleName: ruleName,
          },
        ];
      }
    }
    return undefined;
  },
};
