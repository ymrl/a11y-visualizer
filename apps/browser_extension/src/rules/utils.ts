import { getKnownRole } from "../dom/getKnownRole";
import { RuleObject } from "./type";

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
