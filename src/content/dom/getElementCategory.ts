import { Category } from "../types";
import { getKnownRole } from "../../dom/getKnownRole";

export const getElementCategory = (
  el: Element,
  role = getKnownRole(el),
): Category => {
  if (isPage(el)) return "page";
  if (isImage(el, role)) return "image";
  if (isHeading(el, role)) return "heading";
  if (isFormControl(el, role) || isLink(el, role) || isButton(el, role))
    return "control";
  if (isSection(el, role)) return "section";
  if (isTable(el, role)) return "table";
  if (isTableCell(el, role)) return "tableCell";
  if (isFieldset(el)) return "fieldset";
  if (isLang(el)) return "section";
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

export const isFieldset = (el: Element): boolean =>
  el.tagName.toLowerCase() === "fieldset";

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
