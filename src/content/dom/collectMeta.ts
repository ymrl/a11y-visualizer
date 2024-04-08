import {
  computeAccessibleDescription,
  computeAccessibleName,
} from "dom-accessibility-api";
import { Category, ElementMeta } from "../types";
import { isHidden } from "./isHidden";
import { Settings } from "../../types";

export const collectMeta = (
  root: HTMLElement,
  settings: Omit<Settings, "accessibilityInfo">,
  excludes: HTMLElement[],
): Map<Category, (ElementMeta | null)[]> => {
  const result = new Map<Category, (ElementMeta | null)[]>();
  settings.image && result.set("image", collectImage(root, excludes));
  settings.formControl &&
    result.set("formControl", collectFormControl(root, excludes));
  settings.link && result.set("link", collectLink(root, excludes));
  settings.heading && result.set("heading", collectHeading(root, excludes));
  settings.ariaHidden &&
    result.set("ariaHidden", collectAriaHidden(root, excludes));
  return result;
};

const baseMeta = (el: Element): ElementMeta | null => {
  const d = el.ownerDocument;
  const w = d.defaultView;
  if (!w) return null;
  const rect = el.getBoundingClientRect();
  return {
    x: rect.x + w.scrollX,
    y: rect.y + w.scrollY,
    width: rect.width,
    height: rect.height,
    hidden: isHidden(el),
    tips: [],
  };
};

const collectImage = (
  root: HTMLElement,
  excludes: HTMLElement[],
): (ElementMeta | null)[] =>
  [...root.querySelectorAll('img, svg, [role="img"]')].map((el: Element) => {
    if (excludes.some((exclude: HTMLElement) => exclude.contains(el)))
      return null;
    const result = baseMeta(el);
    if (!result) return null;
    const name = computeAccessibleName(el);
    const description = computeAccessibleDescription(el);
    const role = el.getAttribute("role") || "";

    if (el.tagName === "IMG") {
      const hasAlt = el.hasAttribute("alt");
      if (name) result.tips.push({ type: "name", content: name });
      if (!hasAlt)
        result.tips.push({ type: "error", content: "messages.noAltImage" });
      if (hasAlt && !name)
        result.tips.push({
          type: "warning",
          content: "messages.emptyAltImage",
        });
    } else if (role === "img") {
      if (name) {
        result.tips.push({ type: "name", content: name });
      } else {
        result.tips.push({ type: "error", content: "messages.noName" });
      }
      result.tips.push({ type: "tagName", content: el.tagName.toLowerCase() });
      result.tips.push({ type: "role", content: role });
    } else if (el.tagName === "SVG") {
      if (name) result.tips.push({ type: "name", content: name });
      result.tips.push({ type: "tagName", content: "svg" });
      if (role) result.tips.push({ type: "role", content: role });
    }
    if (description)
      result.tips.push({ type: "description", content: description });
    return result;
  });

const collectFormControl = (
  root: HTMLElement,
  excludes: HTMLElement[],
): (ElementMeta | null)[] =>
  [
    ...root.querySelectorAll(
      [
        'input:not([type="hidden"])',
        "textarea",
        "select",
        "button",
        '[role="button"]',
        '[role="checkbox"]',
        '[role="combobox"]',
        '[role="radio"]',
        '[role="searchbox"]',
        '[role="slider"]',
        '[role="spinbutton"]',
        '[role="switch"]',
        '[role="textbox"]',
      ].join(","),
    ),
  ].map((el: Element) => {
    if (excludes.some((exclude: HTMLElement) => exclude.contains(el)))
      return null;
    const result = baseMeta(el);
    if (!result) return null;
    const name = computeAccessibleName(el);
    const description = computeAccessibleDescription(el);
    if (name) {
      result.tips.push({ type: "name", content: name });
    } else {
      result.tips.push({ type: "error", content: "messages.noName" });
    }
    const role = el.getAttribute("role") || "";
    if (!["INPUT", "TEXTAREA", "SELECT", "BUTTON"].includes(el.tagName)) {
      result.tips.push({ type: "role", content: role });
      result.tips.push({ type: "tagName", content: el.tagName.toLowerCase() });
    }
    if (description)
      result.tips.push({ type: "description", content: description });
    return result;
  });

const collectLink = (
  root: HTMLElement,
  excludes: HTMLElement[],
): (ElementMeta | null)[] =>
  [...root.querySelectorAll('a, [role="link"]')].map((el: Element) => {
    if (excludes.some((exclude: HTMLElement) => exclude.contains(el)))
      return null;
    const result = baseMeta(el);
    if (!result) return null;
    const name = computeAccessibleName(el);
    const description = computeAccessibleDescription(el);
    const role = el.getAttribute("role") || "";
    if (el.tagName === "A") {
      if (!el.hasAttribute("href")) {
        result.tips.push({ type: "warning", content: "messages.noHref" });
      } else if (name && !role) {
        result.tips.push({ type: "name", content: name });
      } else {
        result.tips.push({ type: "error", content: "messages.noName" });
      }
      if (role) result.tips.push({ type: "role", content: role });
    } else if (role === "link") {
      if (name) {
        result.tips.push({ type: "name", content: name });
      } else {
        result.tips.push({ type: "error", content: "messages.noName" });
      }
      result.tips.push({ type: "role", content: "link" });
      result.tips.push({ type: "tagName", content: el.tagName.toLowerCase() });
    }
    if (description)
      result.tips.push({ type: "description", content: description });
    return result;
  });

const collectHeading = (
  root: HTMLElement,
  excludes: HTMLElement[],
): (ElementMeta | null)[] =>
  [...root.querySelectorAll('h1, h2, h3, h4, h5, h6, [role="heading"]')].map(
    (el: Element) => {
      if (excludes.some((exclude: HTMLElement) => exclude.contains(el)))
        return null;
      const result = baseMeta(el);
      if (!result) return null;
      const name = computeAccessibleName(el);
      const description = computeAccessibleDescription(el);

      if (!name) {
        result.tips.push({ type: "error", content: "messages.emptyHeading" });
      }
      if (["H1", "H2", "H3", "H4", "H5", "H6"].includes(el.tagName)) {
        result.tips.push({ type: "level", content: `${el.tagName.slice(1)}` });
      } else {
        result.tips.push({ type: "role", content: "heading" });
        result.tips.push({
          type: "tagName",
          content: el.tagName.toLowerCase(),
        });
        const ariaLevel = el.getAttribute("aria-level");
        if (ariaLevel) {
          result.tips.push({ type: "level", content: `${ariaLevel}` });
        } else {
          result.tips.push({
            type: "error",
            content: "messages.noHeadingLevel",
          });
        }
      }
      if (description)
        result.tips.push({ type: "description", content: description });
      return result;
    },
  );

const collectAriaHidden = (
  root: HTMLElement,
  excludes: HTMLElement[],
): (ElementMeta | null)[] =>
  [...root.querySelectorAll('[aria-hidden="true"]')].map((el: Element) => {
    if (excludes.some((exclude: HTMLElement) => exclude.contains(el)))
      return null;
    const result = baseMeta(el);
    if (!result) return null;
    result.tips.push({ type: "warning", content: "messages.ariaHidden" });
    return result;
  });
