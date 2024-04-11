import {
  computeAccessibleName,
  computeAccessibleDescription,
} from "dom-accessibility-api";
import { ElementMeta } from "../types";
import { getPositionBaseElement } from "./getPositionBaseElement";
import { isHidden } from "./isHidden";

const Selectors = [
  // images
  "img",
  "svg",
  '[role="img"]',

  // form controls
  "input:not([type='hidden'])",
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

  // links
  "a",
  '[role="link"]',

  // headings
  "h1",
  "h2",
  "h3",
  "h4",
  "h5",
  "h6",
  '[role="heading"]',

  // aria-hidden
  '[aria-hidden="true"]',
].join(",");

export const collectElements = (
  root: Element,
  excludes: Element[],
): {
  elements: ElementMeta[];
  rootWidth: number;
  rootHeight: number;
} => {
  const d = root.ownerDocument;
  const w = d.defaultView;
  const rootWidth = root.scrollWidth;
  const rootHeight = root.scrollHeight;
  if (!w) return { elements: [], rootWidth, rootHeight };
  const positionBaseElement = getPositionBaseElement(root, d, w);
  const offsetRect = positionBaseElement?.getBoundingClientRect();
  const offsetX = offsetRect?.left || 0;
  const offsetY = offsetRect?.top || 0;
  return {
    rootHeight,
    rootWidth,
    elements: [...root.querySelectorAll(Selectors)]
      .map((el: Element) => {
        if (excludes.some((exclude: Element) => exclude.contains(el)))
          return null;
        const rect = el.getBoundingClientRect();
        const meta: ElementMeta = {
          x: rect.x + w.scrollX - offsetX,
          y: rect.y + w.scrollY - offsetY,
          width: rect.width,
          height: rect.height,
          hidden: isHidden(el),
          categories: [],
          tips: [],
        };
        const name = computeAccessibleName(el);
        const description = computeAccessibleDescription(el);
        const roleAttr = el.getAttribute("role") || "";
        const isAriaHidden = el.getAttribute("aria-hidden") === "true";
        addImageInfo({ meta, el, name, roleAttr, isAriaHidden });
        addFormControlInfo({ meta, el, name, roleAttr, isAriaHidden });
        addLinkInfo({ meta, el, name, roleAttr, isAriaHidden });
        addHeadingInfo({ meta, el, name, roleAttr, isAriaHidden });
        addAriaHiddenInfo({ meta, isAriaHidden });

        if (roleAttr) {
          meta.tips.push({ type: "role", content: roleAttr });
        }
        if (description) {
          meta.tips.push({
            type: "description",
            content: description,
          });
        }
        return meta;
      })
      .filter((el): el is ElementMeta => el !== null),
  };
};

const addImageInfo = ({
  meta,
  el,
  name,
  roleAttr,
  isAriaHidden,
}: {
  meta: ElementMeta;
  el: Element;
  name: string;
  roleAttr: string;
  isAriaHidden: boolean;
}) => {
  if (el.tagName === "IMG") {
    meta.categories.push("image");
    const hasAlt = el.hasAttribute("alt");
    if (name) {
      meta.tips.push({ type: "name", content: name });
    } else if (hasAlt) {
      meta.tips.push({
        type: "warning",
        content: "messages.emptyAltImage",
      });
    } else if (!isAriaHidden) {
      meta.tips.push({ type: "error", content: "messages.noAltImage" });
    }
  } else if (roleAttr === "img") {
    meta.categories.push("image");
    if (name) {
      meta.tips.push({ type: "name", content: name });
    } else if (!isAriaHidden) {
      meta.tips.push({ type: "error", content: "messages.noName" });
    }
    meta.tips.push({ type: "tagName", content: el.tagName.toLowerCase() });
  } else if (el.tagName === "SVG") {
    meta.categories.push("image");
    if (name) {
      meta.tips.push({ type: "name", content: name });
    }
    meta.tips.push({ type: "tagName", content: "svg" });
  }
};

const addFormControlInfo = ({
  meta,
  el,
  name,
  roleAttr,
  isAriaHidden,
}: {
  meta: ElementMeta;
  el: Element;
  name: string;
  roleAttr: string;
  isAriaHidden: boolean;
}) => {
  const tagName = el.tagName;
  if (
    tagName === "INPUT" ||
    tagName === "TEXTAREA" ||
    tagName === "SELECT" ||
    tagName === "BUTTON"
  ) {
    meta.categories.push("formControl");
    if (name) {
      meta.tips.push({ type: "name", content: name });
    } else if (!isAriaHidden) {
      meta.tips.push({ type: "error", content: "messages.noName" });
    }
  } else if (
    [
      "button",
      "checkbox",
      "combobox",
      "radio",
      "searchbox",
      "slider",
      "spinbutton",
      "switch",
      "textbox",
    ].includes(roleAttr)
  ) {
    meta.categories.push("formControl");
    if (name) {
      meta.tips.push({ type: "name", content: name });
    } else if (!isAriaHidden) {
      meta.tips.push({ type: "error", content: "messages.noName" });
    }
    meta.tips.push({ type: "tagName", content: el.tagName.toLowerCase() });
  }
};

const addLinkInfo = ({
  meta,
  el,
  name,
  roleAttr,
  isAriaHidden,
}: {
  meta: ElementMeta;
  el: Element;
  name: string;
  roleAttr: string;
  isAriaHidden: boolean;
}) => {
  if (el.tagName === "A") {
    meta.categories.push("link");
    if (name) {
      meta.tips.push({ type: "name", content: name });
    } else if (!isAriaHidden) {
      meta.tips.push({ type: "error", content: "messages.noName" });
    }
    if (!el.hasAttribute("href")) {
      meta.tips.push({ type: "warning", content: "messages.noHref" });
    }
  } else if (roleAttr === "link") {
    meta.categories.push("link");
    if (name) {
      meta.tips.push({ type: "name", content: name });
    } else if (!isAriaHidden) {
      meta.tips.push({ type: "error", content: "messages.noName" });
    }
    meta.tips.push({ type: "tagName", content: el.tagName.toLowerCase() });
  }
};

const addHeadingInfo = ({
  meta,
  el,
  name,
  roleAttr,
  isAriaHidden,
}: {
  meta: ElementMeta;
  el: Element;
  name: string;
  roleAttr: string;
  isAriaHidden: boolean;
}) => {
  if (["H1", "H2", "H3", "H4", "H5", "H6"].includes(el.tagName)) {
    meta.categories.push("heading");
    meta.tips.push({ type: "level", content: `${el.tagName.slice(1)}` });
    if (name) {
      meta.tips.push({ type: "name", content: name });
    } else if (!isAriaHidden) {
      meta.tips.push({ type: "error", content: "messages.noName" });
    }
  } else if (roleAttr === "heading") {
    meta.categories.push("heading");
    const ariaLevel = el.getAttribute("aria-level");
    if (ariaLevel) {
      meta.tips.push({ type: "level", content: `${ariaLevel}` });
    } else {
      meta.tips.push({
        type: "error",
        content: "messages.noHeadingLevel",
      });
    }
    if (name) {
      meta.tips.push({ type: "name", content: name });
    } else if (!isAriaHidden) {
      meta.tips.push({ type: "error", content: "messages.noName" });
    }
    meta.tips.push({ type: "tagName", content: el.tagName.toLowerCase() });
  }
};

const addAriaHiddenInfo = ({
  meta,
  isAriaHidden,
}: {
  meta: ElementMeta;
  isAriaHidden: boolean;
}) => {
  if (isAriaHidden) {
    meta.categories.push("ariaHidden");
    meta.tips.push({ type: "warning", content: "messages.ariaHidden" });
  }
};
