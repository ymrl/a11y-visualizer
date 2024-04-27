import { ElementMeta, Category } from "../types";
import { getPositionBaseElement } from "./getPositionBaseElement";
import { isHidden } from "./isHidden";
import { getElementPosition } from "./getElementPosition";
import { globalTips } from "./tips/globalTips";
import { ariaHiddenTips } from "./tips/ariaHiddenTips";
import { headingTips } from "./tips/headingTips";
import { linkTips } from "./tips/linkTips";
import { buttonTips } from "./tips/buttonTips";
import { formTips } from "./tips/formTips";
import { imageTips } from "./tips/imageTips";

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
  '[role="menuitemcheckbox"]',
  '[role="menuitemradio"]',
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
        const images = imageTips(el);
        const forms = formTips(el);
        const buttons = buttonTips(el);
        const links = linkTips(el);
        const heading = headingTips(el);
        const ariaHidden = ariaHiddenTips(el);
        const global = globalTips(el);
        return {
          ...getElementPosition(el, w, offsetX, offsetY),
          hidden: isHidden(el),
          categories: [
            images.length > 0 ? "image" : "",
            forms.length > 0 ? "formControl" : "",
            buttons.length > 0 ? "button" : "",
            links.length > 0 ? "link" : "",
            heading.length > 0 ? "heading" : "",
            ariaHidden.length > 0 ? "ariaHidden" : "",
          ].filter(Boolean) as Category[],
          tips: [
            ...images,
            ...forms,
            ...buttons,
            ...links,
            ...heading,
            ...ariaHidden,
            ...global,
          ],
        };
      })
      .filter((el): el is ElementMeta => el !== null),
  };
};
