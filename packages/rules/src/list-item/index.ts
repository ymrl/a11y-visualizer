import { getKnownRole } from "@a11y-visualizer/dom-utils";
import type { RuleObject, RuleResult } from "../type";

const ruleName = "list-item";
const defaultOptions = { enabled: true };
const menuItemRoles = ["menuitem", "menuitemcheckbox", "menuitemradio"];
const roles = ["listitem", ...menuItemRoles];

export const ListItem: RuleObject = {
  ruleName,
  defaultOptions,
  tagNames: ["li", "dt", "dd"],
  roles: roles,
  evaluate: (element, { enabled }, { role = getKnownRole(element) }) => {
    if (!enabled || !element.parentElement) {
      return undefined;
    }
    const tagName = element.tagName.toLowerCase();
    const hasRole = element.hasAttribute("role");
    const parentTagName = element.parentElement.tagName.toLowerCase();
    if (tagName === "li") {
      if (
        parentTagName !== "ul" &&
        parentTagName !== "ol" &&
        parentTagName !== "menu"
      ) {
        const result: (RuleResult | undefined)[] = [
          !hasRole
            ? { type: "tagName", ruleName, content: tagName }
            : undefined,
          {
            type: "error",
            ruleName,
            message: "Not inside <ul>, <ol>, or <menu>",
          },
        ];
        return result.filter(
          (result): result is RuleResult => result !== undefined,
        );
      }
    } else if (tagName === "dt" || tagName === "dd") {
      if (parentTagName === "dl") {
        return undefined;
      }
      const grandParent = element.parentElement.parentElement;
      const grandParentTagName = grandParent?.tagName.toLowerCase();
      if (
        parentTagName === "div" &&
        (!grandParent || grandParentTagName === "dl")
      ) {
        return undefined;
      }
      const result: (RuleResult | undefined)[] = [
        !hasRole ? { type: "tagName", ruleName, content: tagName } : undefined,
        {
          type: "error",
          ruleName,
          message: `Not inside <dl> or <div> within <dl>`,
        },
      ];
      return result.filter(
        (result): result is RuleResult => result !== undefined,
      );
    }
    if (hasRole && role && roles.includes(role)) {
      const isMenuItem = menuItemRoles.includes(role);
      let parent: HTMLElement | null = element.parentElement;
      while (parent) {
        const parentTagName = parent.tagName.toLowerCase();
        const parentHasRole = parent.hasAttribute("role");
        const parentRole = getKnownRole(parent);
        if (
          (role === "listitem" && parentRole === "list") ||
          (isMenuItem && parentRole === "menu")
        ) {
          return undefined;
        }
        if (
          parentRole === "presentation" ||
          parentRole === "none" ||
          (isMenuItem && parentRole === "group") ||
          (["div", "span"].includes(parentTagName) && !parentHasRole)
        ) {
          parent = parent.parentElement;
        } else {
          return [
            {
              type: "error",
              ruleName,
              message:
                role === "listitem"
                  ? 'Not inside "list" role'
                  : 'Not inside "menu" role',
            },
          ];
        }
      }
    }
    return undefined;
  },
};
