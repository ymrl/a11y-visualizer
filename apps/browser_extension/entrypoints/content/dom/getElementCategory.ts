import { getKnownRole } from "@a11y-visualizer/dom-utils";
import type { Category } from "../types";

export const getElementCategory = (
  el: Element,
  role = getKnownRole(el),
): Category => {
  if (isPage(el)) return "page";
  if (isImage(el, role)) return "image";
  if (isHeading(el, role)) return "heading";
  if (isFormControl(el, role) || isLink(el, role) || isButton(el, role))
    return "control";
  if (isList(el, role)) return "list";
  if (isListItem(el, role)) return "listItem";
  if (isSection(el, role)) return "section";
  if (isTable(el, role)) return "table";
  if (isTableCell(el, role)) return "tableCell";
  if (isGroup(el)) return "group";
  if (isLang(el)) return "section";
  if (isTabIndex(el)) return "tabIndex";
  if (isWaiAria(el, role)) return "wai-aria";
  return "general";
};

export const isImage = (el: Element, role = getKnownRole(el)): boolean => {
  const tagName = el.tagName.toLowerCase();
  return tagName === "img" || tagName === "svg" || role === "img";
};

export const isPage = (el: Element): boolean => {
  return el.tagName.toLowerCase() === "body";
};

export const isHeading = (el: Element, role = getKnownRole(el)): boolean =>
  ["h1", "h2", "h3", "h4", "h5", "h6"].includes(el.tagName.toLowerCase()) ||
  role === "heading";

export const isGroup = (el: Element, role = getKnownRole(el)): boolean =>
  ["fieldset", "hgroup"].includes(el.tagName.toLowerCase()) || role === "group";

export const isFormControl = (
  el: Element,
  role = getKnownRole(el),
): boolean => {
  const tagName = el.tagName.toLowerCase();
  const typeAttr = el.getAttribute("type");
  return (
    (tagName === "input" &&
      (typeAttr === null ||
        (typeAttr &&
          !["button", "submit", "reset", "image", "hidden"].includes(
            typeAttr,
          )))) ||
    tagName === "textarea" ||
    tagName === "select" ||
    (!!role &&
      [
        "checkbox",
        "combobox",
        "radio",
        "searchbox",
        "slider",
        "spinbutton",
        "switch",
        "textbox",
        "menuitemcheckbox",
        "menuitemradio",
      ].includes(role))
  );
};

export const isButton = (el: Element, role = getKnownRole(el)): boolean => {
  const tagName = el.tagName.toLowerCase();
  const typeAttr = el.getAttribute("type");
  const hasButtonTag =
    tagName === "button" ||
    tagName === "summary" ||
    (tagName === "input" &&
      !!typeAttr &&
      ["button", "submit", "reset", "image"].includes(typeAttr));
  const hasButtonRole = role === "button" || role === "menuitem";
  return hasButtonTag || hasButtonRole;
};

export const isLang = (el: Element): boolean => {
  return el.hasAttribute("lang") || el.hasAttribute("xml:lang");
};

export const isLink = (el: Element, role = getKnownRole(el)): boolean =>
  ["a", "area"].includes(el.tagName.toLowerCase()) || role === "link";

export const isList = (el: Element, role = getKnownRole(el)): boolean =>
  ["ul", "ol", "dl", "menu"].includes(el.tagName.toLowerCase()) ||
  (!!role && ["list", "directory", "menu", "menubar"].includes(role));

export const isListItem = (el: Element, role = getKnownRole(el)): boolean =>
  ["li", "dt", "dd"].includes(el.tagName.toLowerCase()) ||
  (!!role &&
    ["listitem", "menuitem", "menuitemcheckbox", "menuitemradio"].includes(
      role,
    ));

export const isSection = (el: Element, role = getKnownRole(el)): boolean =>
  [
    "article",
    "section",
    "nav",
    "aside",
    "footer",
    "header",
    "main",
    "form",
    "search",
    "dialog",
    "iframe",
  ].includes(el.tagName.toLowerCase()) ||
  (!!role &&
    [
      "article",
      "banner",
      "complementary",
      "contentinfo",
      "main",
      "form",
      "navigation",
      "region",
      "search",
      "application",
      "dialog",
      "alertdialog",
    ].includes(role));

export const isTable = (el: Element, role = getKnownRole(el)): boolean => {
  return (
    el.tagName.toLowerCase() === "table" ||
    role === "table" ||
    role === "grid" ||
    role === "treegrid"
  );
};

export const isTableCell = (el: Element, role = getKnownRole(el)): boolean => {
  const tagName = el.tagName.toLowerCase();
  return (
    ["th", "td"].includes(tagName) ||
    (!!role && ["columnheader", "rowheader", "gridcell", "cell"].includes(role))
  );
};

export const isTabIndex = (el: Element): boolean => {
  return el.hasAttribute("tabindex");
};

export const isWaiAria = (el: Element, role = getKnownRole(el)): boolean => {
  // Check for role attribute
  if (role) return true;

  // Check for aria-* attributes
  for (const attr of el.attributes) {
    if (attr.name.startsWith("aria-")) {
      return true;
    }
  }

  return false;
};
