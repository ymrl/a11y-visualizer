import { getKnownRole } from "@a11y-visualizer/dom-utils";
import type { RuleObject, RuleResult } from "./type";

export const isRuleTargetElement = (
  element: Element,
  ruleObject: RuleObject,
  role: string | null = getKnownRole(element),
): boolean => {
  const tagName = element.tagName.toLowerCase();
  if (!ruleObject.roles && !ruleObject.tagNames && !ruleObject.selectors)
    return true;
  if (ruleObject.tagNames?.includes(tagName)) return true;
  if (ruleObject.roles && role && ruleObject.roles.includes(role)) return true;
  if (ruleObject.selectors && element.matches(ruleObject.selectors.join(",")))
    return true;
  return false;
};

export const getRuleResultIdentifier = (result: RuleResult): string => {
  switch (result.type) {
    case "error":
    case "warning":
      return `${result.type}-${result.ruleName}-${result.message}`;
    case "state":
      return `${result.type}-${result.state}`;
    case "ariaAttributes":
      return "ariaAttributes";
    default:
      return `${result.type}-${result.content}`;
  }
};
