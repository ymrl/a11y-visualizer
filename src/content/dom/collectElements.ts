import {
  computeAccessibleName,
  computeAccessibleDescription,
} from "dom-accessibility-api";
import { ElementMeta } from "../types";
import { getPositionBaseElement } from "./getPositionBaseElement";
import { isHidden } from "./isHidden";
import { getElementPosition } from "./getElementPoistion";

const FOCUSABLE_TAGNAMES = [
  "a",
  "area",
  "button",
  "input",
  "object",
  "select",
  "textarea",
  "summary",
];

const LABELABLE_SELECTORS = [
  "button",
  "input:not([type='hidden'])",
  "meter",
  "output",
  "progress",
  "select",
  "textarea",
] as const;

const Selector = [
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
  "label",

  // links
  "a",
  "map area",
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
  const rootWidth =
    root.tagName.toLowerCase() === "body"
      ? Math.max(
          d.documentElement.offsetWidth,
          d.documentElement.scrollWidth,
          root.scrollWidth,
        )
      : root.scrollWidth;
  const rootHeight =
    root.tagName.toLowerCase() === "body"
      ? Math.max(
          d.documentElement.offsetHeight,
          d.documentElement.scrollHeight,
          root.scrollHeight,
        )
      : root.scrollHeight;
  if (!w) return { elements: [], rootWidth, rootHeight };
  const positionBaseElement = getPositionBaseElement(root, d, w);
  const offsetRect = positionBaseElement?.getBoundingClientRect();
  const offsetX = offsetRect?.left || 0;
  const offsetY = offsetRect?.top || 0;
  return {
    rootHeight,
    rootWidth,
    elements: [...root.querySelectorAll(Selector)]
      .map((el: Element) => {
        if (excludes.some((exclude: Element) => exclude.contains(el)))
          return null;
        const meta: ElementMeta = {
          ...getElementPosition(el, w, offsetX, offsetY),
          hidden: isHidden(el),
          categories: [],
          tips: [],
        };
        const name = computeAccessibleName(el);
        const description = computeAccessibleDescription(el);
        const roleAttr = el.getAttribute("role") || "";
        const isAriaHidden = el.getAttribute("aria-hidden") === "true";
        const tagName = el.tagName.toLowerCase();
        addImageInfo({ meta, el, tagName, name, roleAttr, isAriaHidden });
        addFormControlInfo({ meta, el, tagName, name, roleAttr, isAriaHidden });
        addButtonInfo({ meta, el, tagName, name, roleAttr, isAriaHidden });
        addLinkInfo({ meta, el, tagName, name, roleAttr, isAriaHidden });
        addHeadingInfo({ meta, el, tagName, name, roleAttr, isAriaHidden });
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
  tagName,
  roleAttr,
  isAriaHidden,
}: {
  meta: ElementMeta;
  el: Element;
  tagName: string;
  name: string;
  roleAttr: string;
  isAriaHidden: boolean;
}) => {
  if (tagName === "img") {
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
    meta.tips.push({ type: "tagName", content: tagName });
  } else if (el.tagName === "svg") {
    meta.categories.push("image");
    if (name) {
      meta.tips.push({ type: "name", content: name });
    } else if (!isAriaHidden) {
      meta.tips.push({ type: "error", content: "messages.noName" });
    }
    meta.tips.push({ type: "tagName", content: "svg" });
  }
};

const addFormControlInfo = ({
  meta,
  el,
  tagName,
  name,
  roleAttr,
  isAriaHidden,
}: {
  meta: ElementMeta;
  el: Element;
  tagName: string;
  name: string;
  roleAttr: string;
  isAriaHidden: boolean;
}) => {
  const typeAttr = el.getAttribute("type");
  if (
    (tagName === "input" &&
      typeAttr &&
      !["button", "submit", "reset", "image", "hidden"].includes(typeAttr)) ||
    tagName === "textarea" ||
    tagName === "select"
  ) {
    meta.categories.push("formControl");
    if (name) {
      meta.tips.push({ type: "name", content: name });
    } else if (!isAriaHidden) {
      meta.tips.push({ type: "error", content: "messages.noName" });
    }
  } else if (
    [
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
    meta.tips.push({ type: "tagName", content: tagName });
    if (
      (tagName === "a" && !el.hasAttribute("href")) ||
      (tagName === "area" && el.closest("map") && !el.hasAttribute("href")) ||
      (!FOCUSABLE_TAGNAMES.includes(tagName) && !el.hasAttribute("tabindex"))
    ) {
      meta.tips.push({ type: "error", content: "messages.notFocusable" });
    }
  } else if (tagName === "label") {
    const forAttr = el.getAttribute("for");
    const controlByFor = forAttr
      ? el.ownerDocument.querySelector(
          LABELABLE_SELECTORS.map((e) => `${e}#${forAttr}`).join(","),
        )
      : null;
    const controlInside = el.querySelector(LABELABLE_SELECTORS.join(","));
    if (
      (!controlByFor && !controlInside) ||
      (controlByFor && isHidden(controlByFor)) ||
      (controlInside && isHidden(controlInside))
    ) {
      meta.categories.push("formControl");
      meta.tips.push({
        type: "warning",
        content: "messages.noControlForLabel",
      });
    }
  }
};

const addButtonInfo = ({
  meta,
  el,
  tagName,
  name,
  roleAttr,
  isAriaHidden,
}: {
  meta: ElementMeta;
  el: Element;
  tagName: string;
  name: string;
  roleAttr: string;
  isAriaHidden: boolean;
}) => {
  const typeAttr = el.getAttribute("type");
  if (
    tagName === "button" ||
    (tagName === "input" &&
      typeAttr &&
      ["button", "submit", "reset", "image"].includes(typeAttr))
  ) {
    meta.categories.push("button");
    if (name) {
      meta.tips.push({ type: "name", content: name });
    } else if (!isAriaHidden) {
      meta.tips.push({ type: "error", content: "messages.noName" });
    }
  } else if (roleAttr === "button") {
    meta.categories.push("button");
    if (name) {
      meta.tips.push({ type: "name", content: name });
    } else if (!isAriaHidden) {
      meta.tips.push({ type: "error", content: "messages.noName" });
    }
    if (
      (tagName === "a" && !el.hasAttribute("href")) ||
      (tagName === "area" && !el.hasAttribute("href")) ||
      (!FOCUSABLE_TAGNAMES.includes(tagName) && !el.hasAttribute("tabindex"))
    ) {
      meta.tips.push({ type: "error", content: "messages.notFocusable" });
    }
  }
};

const addLinkInfo = ({
  meta,
  el,
  tagName,
  name,
  roleAttr,
  isAriaHidden,
}: {
  meta: ElementMeta;
  el: Element;
  tagName: string;
  name: string;
  roleAttr: string;
  isAriaHidden: boolean;
}) => {
  if (tagName === "a") {
    meta.categories.push("link");
    if (name) {
      meta.tips.push({ type: "name", content: name });
    } else if (!isAriaHidden) {
      meta.tips.push({ type: "error", content: "messages.noName" });
    }
    if (!el.hasAttribute("href")) {
      meta.tips.push({ type: "warning", content: "messages.noHref" });
    }
  } else if (tagName === "area") {
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
    meta.tips.push({ type: "tagName", content: tagName });
  }
};

const addHeadingInfo = ({
  meta,
  el,
  tagName,
  name,
  roleAttr,
  isAriaHidden,
}: {
  meta: ElementMeta;
  el: Element;
  tagName: string;
  name: string;
  roleAttr: string;
  isAriaHidden: boolean;
}) => {
  if (["h1", "h2", "h3", "h4", "h5", "h6"].includes(tagName)) {
    meta.categories.push("heading");
    meta.tips.push({ type: "level", content: `${tagName.slice(1)}` });
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
    meta.tips.push({ type: "tagName", content: tagName });
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
