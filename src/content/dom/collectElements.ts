import { ElementMeta, Category, ElementTip } from "../types";
import { getPositionBaseElement } from "./getPositionBaseElement";
import { isHidden } from "./isHidden";
import { getElementPosition } from "./getElementPosition";
import { globalTips } from "./tips/globalTips";
import { AriraHiddenSelectors, ariaHiddenTips } from "./tips/ariaHiddenTips";
import { HeadingSelectors, headingTips, isHeading } from "./tips/headingTips";
import { LinkSelectors, isLink, linkTips } from "./tips/linkTips";
import { ButtonSelectors, buttonTips, isButton } from "./tips/buttonTips";
import {
  FormSelectors,
  formTips,
  isFieldset,
  isFormControl,
} from "./tips/formTips";
import { imageTips, isImage, ImageSelectors } from "./tips/imageTips";
import { computeAccessibleName } from "dom-accessibility-api";
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
  if (!d || !w) return { elements: [], rootWidth: 0, rootHeight: 0 };
  const rootTagName = root.tagName.toLowerCase();
  const rootWidth =
    rootTagName === "body"
      ? Math.max(
          d.documentElement.offsetWidth,
          d.documentElement.scrollWidth,
          root.scrollWidth,
        )
      : root.scrollWidth;
  const rootHeight =
    rootTagName === "body"
      ? Math.max(
          d.documentElement.offsetHeight,
          d.documentElement.scrollHeight,
          root.scrollHeight,
        )
      : root.scrollHeight;
  const positionBaseElement = getPositionBaseElement(root, d, w);
  const offsetPosition = positionBaseElement
    ? getElementPosition(positionBaseElement, w, 0, 0)
    : { x: 0, y: 0 };
  const offsetX = offsetPosition.x;
  const offsetY = offsetPosition.y;
  const visibleX = w.scrollX;
  const visibleY = w.scrollY;
  const visibleWidth = w.innerWidth;
  const visibleHeight = w.innerHeight;

  const selector = getSelector(settings);

  return {
    rootHeight,
    rootWidth,
    elements: selector
      ? [...root.querySelectorAll(getSelector(settings))]
          .filter((el) => !isHidden(el))
          .map((el: Element) => {
            if (excludes.some((exclude: Element) => exclude.contains(el)))
              return null;
            const elementPosition = getElementPosition(el, w, offsetX, offsetY);
            if (
              elementPosition.absoluteX + elementPosition.width < visibleX ||
              elementPosition.absoluteY + elementPosition.height < visibleY ||
              elementPosition.absoluteX > visibleX + visibleWidth ||
              elementPosition.absoluteY > visibleY + visibleHeight
            ) {
              return null;
            }

            const name = computeAccessibleName(el);
            const nameTips: ElementTip[] = name
              ? [{ type: "name", content: name }]
              : [];
            const images = imageTips(el, name);
            const forms = formTips(el, name);
            const buttons = buttonTips(el, name);
            const links = linkTips(el, name);
            const heading = headingTips(el, name);
            const ariaHidden = ariaHiddenTips(el);
            const section = sectionTips(el, name);
            const global = globalTips(el);

            return {
              ...elementPosition,
              category: getElementCategory(el),
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

const getElementCategory = (el: Element): Category => {
  if (isImage(el)) return "image";
  if (isHeading(el)) return "heading";
  if (isFormControl(el) || isLink(el) || isButton(el)) return "control";
  if (isSection(el)) return "section";
  if (isFieldset(el)) return "fieldset";
  return "general";
};
