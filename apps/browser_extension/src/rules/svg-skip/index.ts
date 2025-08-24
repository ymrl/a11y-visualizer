import { RuleObject } from "../type";
import { isPresentationalChildren } from "../../dom/isPresentationalChildren";

type Options = {
  enabled: boolean;
};
type Condition = { role?: string | null };
const ruleName = "svg-skip";
const defaultOptions: Options = {
  enabled: true,
};

export const SvgSkip: RuleObject<Options, Condition> = {
  ruleName,
  defaultOptions,
  tagNames: ["svg"],
  evaluate: (
    element: Element,
    { enabled }: Options = defaultOptions,
  ) => {
    if (!enabled) {
      return undefined;
    }
    const tagName = element.tagName.toLowerCase();

    // Check if SVG has title element for accessible name
    const hasTitle = element.querySelector("title");

    if (
      tagName === "svg" &&
      element.getAttribute("aria-hidden") !== "true" &&
      !element.hasAttribute("role") &&
      !hasTitle &&
      !isPresentationalChildren(element)
    ) {
      return [
        {
          type: "warning",
          message: "May be skipped",
          ruleName: ruleName,
        },
      ];
    }
    return undefined;
  },
};
