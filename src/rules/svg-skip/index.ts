import { RuleObject } from "../type";
import { getKnownRole } from "../../dom/getKnownRole";
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
    { role = getKnownRole(element) }: Condition,
  ) => {
    if (!enabled) {
      return undefined;
    }
    const tagName = element.tagName.toLowerCase();
    if (
      tagName === "svg" &&
      element.getAttribute("aria-hidden") !== "true" &&
      !role &&
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
