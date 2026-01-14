import { getKnownRole } from "@a11y-visualizer/dom-utils";
import type { RuleObject, RuleResult } from "../type";

const ruleName = "list";
const defaultOptions = { enabled: true };
const roles = ["list", "directory", "menu", "menubar"];

export const List: RuleObject = {
  ruleName,
  defaultOptions,
  tagNames: ["ul", "ol", "dl", "menu"],
  roles: roles,
  evaluate: (element, { enabled }, { role = getKnownRole(element) }) => {
    if (!enabled) {
      return undefined;
    }
    const result: RuleResult[] = [];
    const tagName = element.tagName.toLowerCase();
    const listItems = getListItems(element, tagName, role);
    if (tagName === "ul" || tagName === "ol" || tagName === "menu") {
      if (
        [...element.children].some(
          (child) =>
            !["li", "template", "script"].includes(child.tagName.toLowerCase()),
        )
      ) {
        result.push({
          type: "error",
          ruleName,
          message: "Must only contain <li>",
        });
      }
    } else if (tagName === "dl") {
      if (
        ![...element.children].every((child) => {
          const childTagName = child.tagName.toLowerCase();
          return (
            ["dt", "dd", "script", "template"].includes(childTagName) ||
            (childTagName === "div" &&
              // divの子要素はすべてdt, dd, script, templateである
              [...child.children].every((grandChild) =>
                ["dt", "dd", "script", "template"].includes(
                  grandChild.tagName.toLowerCase(),
                ),
              ) &&
              // divの子要素にテキストノードがある場合は、それが空である
              [...child.childNodes].every(
                (grandChild) =>
                  grandChild.nodeType !== Node.TEXT_NODE ||
                  !grandChild.nodeValue?.trim(),
              ))
          );
        })
      ) {
        result.push({
          type: "error",
          ruleName,
          message: "Must only contain <dt>, <dd>, or them within a <div>",
        });
      }
    }
    const hasRole = element.hasAttribute("role");
    if (
      (!hasRole && tagName === "dl") ||
      (role && ["menu", "menubar", "list", "directory"].includes(role))
    ) {
      result.push({
        type: "listType",
        ruleName,
        content:
          !hasRole && tagName === "dl"
            ? "listType.definitionList"
            : role === "menu" || role === "menubar"
              ? `listType.${role}`
              : "listType.list",
      });
    }

    if (role !== "presentation" && role !== "none") {
      result.push({
        type: "list",
        ruleName,
        content: `${listItems.length}`,
        contentLabel: "List items",
      });
    }

    return result.length > 0 ? result : undefined;
  },
};

const isItemRole = (
  role: string | null,
  listRole: (typeof roles)[number] | null,
): boolean =>
  ((listRole === "list" || listRole === "directory") && role === "listitem") ||
  ((listRole === "menu" || listRole === "menubar") &&
    (role === "menuitem" ||
      role === "menuitemcheckbox" ||
      role === "menuitemradio"));

export const getListItems = (
  element: Element,
  listTagName: string,
  listRole: (typeof roles)[number] | null,
): Element[] => {
  const tagName = element.tagName.toLowerCase();
  const hasRole = element.hasAttribute("role");
  const role = hasRole ? getKnownRole(element) : null;
  return [...element.children]
    .map((child) => {
      const childTagName = child.tagName.toLowerCase();
      const childHasRole = child.hasAttribute("role");
      const childRole = childHasRole ? getKnownRole(child) : null;
      if (tagName === "ul" || tagName === "ol" || tagName === "menu") {
        if (childTagName !== "li") {
          return null;
        } else if (
          childRole === "presentation" ||
          childRole === "none" ||
          ((listRole === "menu" || listRole === "menubar") &&
            childRole === "group")
        ) {
          return getListItems(child, listTagName, listRole);
        } else if (
          (role !== "presentation" && role !== "none" && !childHasRole) ||
          isItemRole(childRole, listRole)
        ) {
          return child;
        }
        return null;
      }
      if (tagName === "dl") {
        if (
          childTagName !== "dt" &&
          childTagName !== "dd" &&
          childTagName !== "div"
        ) {
          return null;
        } else if (childTagName === "div") {
          return [...child.children]
            .map((grandchild) => {
              const grandChildTagName = grandchild.tagName.toLowerCase();
              if (grandChildTagName !== "dt" && grandChildTagName !== "dd") {
                return null;
              }
              const grandChildHasRole = grandchild.hasAttribute("role");
              const grandChildRole = grandChildHasRole
                ? getKnownRole(grandchild)
                : null;
              if (
                grandChildRole === "presentation" ||
                grandChildRole === "none" ||
                ((listRole === "menu" || listRole === "menubar") &&
                  grandChildRole === "group")
              ) {
                return getListItems(grandchild, listTagName, listRole);
              }
              if (!grandChildHasRole || isItemRole(grandChildRole, listRole)) {
                return grandchild;
              }
              return null;
            })
            .reduce((acc: Element[], curr: Element | Element[] | null) => {
              if (Array.isArray(curr)) {
                acc.push(...curr);
              } else if (curr) {
                acc.push(curr);
              }
              return acc;
            }, [] as Element[]);
        } else if (
          childRole === "presentation" ||
          childRole === "none" ||
          ((listRole === "menu" || listRole === "menubar") &&
            childRole === "group")
        ) {
          return getListItems(child, listTagName, listRole);
        } else if (
          (role !== "presentation" && role !== "none" && !childHasRole) ||
          isItemRole(childRole, listRole)
        ) {
          return child;
        }
        return null;
      }
      if (isItemRole(childRole, listRole)) {
        return child;
      }
      if (
        childRole === "presentation" ||
        childRole === "none" ||
        ((listRole === "menu" || listRole === "menubar") &&
          childRole === "group") ||
        (["div", "span"].includes(childTagName) && !childHasRole)
      ) {
        return getListItems(child, listTagName, listRole);
      }
      return null;
    })
    .reduce((acc: Element[], curr: Element | Element[] | null) => {
      if (Array.isArray(curr)) {
        acc.push(...curr);
      } else if (curr) {
        acc.push(curr);
      }
      return acc;
    }, [] as Element[]);
};
