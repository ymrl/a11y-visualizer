import { ElementMeta, Category } from "../types";
import { getPositionBaseElement } from "./getPositionBaseElement";
import { isHidden } from "./isHidden";
import { getElementPosition } from "./getElementPosition";
import { globalTips } from "./tips/globalTips";
import { AriraHiddenSelectors, ariaHiddenTips } from "./tips/ariaHiddenTips";
import { HeadingSelectors, headingTips } from "./tips/headingTips";
import { LinkSelectors, linkTips } from "./tips/linkTips";
import { ButtonSelectors, buttonTips } from "./tips/buttonTips";
import { FormSelectors, formTips } from "./tips/formTips";
import { imageTips, isImage, ImageSelectors } from "./tips/imageTips";

const Selector = [
  ...(ImageSelectors || []),
  ...(FormSelectors || []),
  ...(LinkSelectors || []),
  ...(HeadingSelectors || []),
  ...(ButtonSelectors || []),
  ...(AriraHiddenSelectors || []),
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
            isImage(el) ? "image" : "",
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
