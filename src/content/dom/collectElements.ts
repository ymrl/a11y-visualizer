import { ElementMeta, Category, ElementTip } from "../types";
import { getPositionBaseElement } from "./getPositionBaseElement";
import { isHidden } from "./isHidden";
import { getElementPosition } from "./getElementPosition";
import { globalTips } from "./tips/globalTips";
import { AriraHiddenSelectors, ariaHiddenTips } from "./tips/ariaHiddenTips";
import { HeadingSelectors, headingTips, isHeading } from "./tips/headingTips";
import { LinkSelectors, isLink, linkTips } from "./tips/linkTips";
import { ButtonSelectors, buttonTips, isButton } from "./tips/buttonTips";
import { FormSelectors, formTips, isFormControl } from "./tips/formTips";
import { imageTips, isImage, ImageSelectors } from "./tips/imageTips";
import { computeAccessibleName } from "dom-accessibility-api";
import { isAriaHidden } from "./isAriaHidden";
import { CategorySettings } from "../../settings";
import { SectionSelectors, isSection, sectionTips } from "./tips/sectionTips";

const getSelector = (settings: Partial<CategorySettings>) => {
  return [
    ...(settings.image ? ImageSelectors : []),
    ...(settings.formControl ? FormSelectors : []),
    ...(settings.link ? LinkSelectors : []),
    ...(settings.heading ? HeadingSelectors : []),
    ...(settings.button ? ButtonSelectors : []),
    ...(settings.ariaHidden ? AriraHiddenSelectors : []),
    ...(settings.section ? SectionSelectors : []),
  ].join(",");
};

export const collectElements = (
  root: Element,
  excludes: Element[],
  settings: Partial<CategorySettings> = {
    image: true,
    formControl: true,
    link: true,
    button: true,
    heading: true,
    ariaHidden: true,
  },
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
  const offsetPosition = positionBaseElement
    ? getElementPosition(positionBaseElement, w, 0, 0)
    : {
        x: 0,
        y: 0,
        width: 0,
        height: 0,
      };
  const offsetX = offsetPosition.x;
  const offsetY = offsetPosition.y;

  const selector = getSelector(settings);

  return {
    rootHeight,
    rootWidth,
    elements: selector
      ? [...root.querySelectorAll(getSelector(settings))]
          .map((el: Element) => {
            if (excludes.some((exclude: Element) => exclude.contains(el)))
              return null;
            const name = computeAccessibleName(el);
            const nameTips: ElementTip[] = name
              ? [{ type: "name", content: name }]
              : [];
            const images = imageTips(el);
            const forms = formTips(el);
            const buttons = buttonTips(el);
            const links = linkTips(el);
            const heading = headingTips(el);
            const ariaHidden = ariaHiddenTips(el);
            const section = sectionTips(el);
            const global = globalTips(el);
            return {
              ...getElementPosition(el, w, offsetX, offsetY),
              hidden: isHidden(el),
              categories: [
                isImage(el) ? "image" : "",
                isFormControl(el) ? "formControl" : "",
                isButton(el) ? "button" : "",
                isLink(el) ? "link" : "",
                isHeading(el) ? "heading" : "",
                isAriaHidden(el) ? "ariaHidden" : "",
                isSection(el) ? "section" : "",
              ].filter(Boolean) as Category[],
              tips: [
                ...heading,
                ...nameTips,
                ...images,
                ...forms,
                ...buttons,
                ...links,
                ...ariaHidden,
                ...section,
                ...global,
              ],
            };
          })
          .filter((el): el is ElementMeta => el !== null)
      : [],
  };
};
