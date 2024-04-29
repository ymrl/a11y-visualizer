import { computeAccessibleName } from "dom-accessibility-api";

const TEXT_THRESHOULD = 30 as const;
const SINGLE_ELEMENTS = ["html", "head", "body", "main"] as const;
const NON_TEXT_ELEMENTS = [
  "img",
  "input",
  "select",
  "textarea",
  "svg",
] as const;
export const elementNickName = (element: Element): string => {
  const tagName = element.tagName.toLowerCase();
  const idAttr = element.getAttribute("id");
  if (SINGLE_ELEMENTS.includes(tagName as (typeof SINGLE_ELEMENTS)[number])) {
    return tagName;
  }
  if (
    NON_TEXT_ELEMENTS.includes(tagName as (typeof NON_TEXT_ELEMENTS)[number])
  ) {
    const name = computeAccessibleName(element);
    return `${tagName}${name ? ` ${name}` : idAttr ? `#${idAttr}` : ""}`;
  }

  const textContent = element.textContent ? element.textContent.trim() : "";
  const suffix = textContent
    ? ` ${textContent.slice(0, TEXT_THRESHOULD)}${textContent.length > TEXT_THRESHOULD ? "..." : ""}`
    : idAttr
      ? `#${idAttr}`
      : "";
  return `${tagName}${suffix}`;
};
