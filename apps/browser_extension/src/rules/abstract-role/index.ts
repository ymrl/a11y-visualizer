import type { RuleObject } from "../type";

const ruleName = "abstract-role";
const defaultOptions = { enabled: true };

const ABSTRACT_ROLES = [
  "command",
  "composite",
  "input",
  "landmark",
  "range",
  "roletype",
  "section",
  "sectionhead",
  "select",
  "structure",
  "widget",
  "window",
] as const;

export const AbstractRole: RuleObject = {
  ruleName,
  defaultOptions,
  evaluate: (element, { enabled }) => {
    if (!enabled) {
      return undefined;
    }

    const roleAttribute = element.getAttribute("role");
    if (!roleAttribute) {
      return undefined;
    }

    // Split role attribute by whitespace and check each role
    const roles = roleAttribute.split(/\s+/).filter((role) => role.length > 0);

    for (const role of roles) {
      if (ABSTRACT_ROLES.includes(role as (typeof ABSTRACT_ROLES)[number])) {
        return [
          {
            type: "error",
            ruleName,
            message: "Abstract role cannot be used",
          },
        ];
      }
    }

    return undefined;
  },
};
