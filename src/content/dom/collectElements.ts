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
import { isPage, pageTips } from "./tips/pageTips";
import { LangSelectors, langTips, isLang } from "./tips/langTips";
import {
  TableSelectors,
  isTable,
  isTableCell,
  tableTips,
} from "./tips/tableTips";
import { InternalTable } from "./tips/internalTable";
import { getClosestByRoles } from "./getClosestByRoles";
import { getScrollBaseElement } from "./getScrollBaseElement";

const getSelector = (settings: Partial<CategorySettings>) => {
  return [
    ...(settings.image ? ImageSelectors : []),
    ...(settings.formControl ? FormSelectors : []),
    ...(settings.link ? LinkSelectors : []),
    ...(settings.heading ? HeadingSelectors : []),
    ...(settings.button ? ButtonSelectors : []),
    ...(settings.ariaHidden ? AriraHiddenSelectors : []),
    ...(settings.section ? SectionSelectors : []),
    ...(settings.lang ? LangSelectors : []),
    ...(settings.table ? TableSelectors : []),
  ].join(",");
};

export const collectElements = (
  root: Element,
  excludes: Element[],
  settings: Partial<CategorySettings>,
  options: {
    srcdoc?: boolean;
  } = {},
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
  const internalTables: InternalTable[] = [];

  return {
    rootHeight,
    rootWidth,
    elements: [
      ...(settings.page && rootTagName === "body" ? [root] : []),
      ...(selector ? [...root.querySelectorAll(getSelector(settings))] : []),
    ]
      .filter((el) => !isHidden(el))
      .filter((el) => !excludes.some((exclude) => exclude.contains(el)))
      .map((el: Element) => {
        const scrollBaseElement = getScrollBaseElement(el, d, w);
        const scrollBasePosition = scrollBaseElement
          ? getElementPosition(scrollBaseElement, w, 0, 0)
          : undefined;
        const elementPosition = getElementPosition(el, w, offsetX, offsetY);
        if (
          elementPosition.absoluteX + elementPosition.width < visibleX ||
          elementPosition.absoluteY + elementPosition.height < visibleY ||
          elementPosition.absoluteX > visibleX + visibleWidth ||
          elementPosition.absoluteY > visibleY + visibleHeight
        ) {
          return null;
        }
        if (
          scrollBasePosition &&
          (elementPosition.absoluteX + elementPosition.width <
            scrollBasePosition.absoluteX ||
            elementPosition.absoluteY + elementPosition.height <
              scrollBasePosition.absoluteY ||
            elementPosition.absoluteX >
              scrollBasePosition.absoluteX + scrollBasePosition.width ||
            elementPosition.absoluteY >
              scrollBasePosition.absoluteY + scrollBasePosition.height)
        ) {
          return null;
        }
        return {
          ...elementPosition,
          category: getElementCategory(el),
          tips: tipsForElement(el, { ...options, internalTables }),
        };
      })
      .filter((el): el is ElementMeta => el !== null),
  };
};

const getTableTips = (
  el: Element,
  internalTables: InternalTable[],
): ElementTip[] => {
  if (isTable(el) || isTableCell(el)) {
    const tagName = el.tagName.toLowerCase();
    const tableEl =
      tagName === "table"
        ? el
        : ["th", "td"].includes(tagName)
          ? el.closest("table")
          : getClosestByRoles(el, ["table", "grid", "treegrid"]);
    if (tableEl) {
      const internalTable = internalTables.find((t) => t.element === tableEl);
      if (!internalTable) {
        const newTable = new InternalTable(tableEl);
        internalTables.push(newTable);
        return tableTips(el, newTable);
      }
      return tableTips(el, internalTable);
    }
  }
  return [];
};

const tipsForElement = (
  el: Element,
  options: {
    srcdoc?: boolean;
    internalTables: InternalTable[];
  },
): ElementTip[] => {
  const name = computeAccessibleName(el);
  const nameTips: ElementTip[] = name ? [{ type: "name", content: name }] : [];
  return [
    ...headingTips(el, name),
    ...nameTips,
    ...imageTips(el, name),
    ...formTips(el, name),
    ...buttonTips(el, name),
    ...linkTips(el, name),
    ...ariaHiddenTips(el),
    ...sectionTips(el, name),
    ...getTableTips(el, options.internalTables),
    ...langTips(el),
    ...pageTips(el, !!options.srcdoc),
    ...globalTips(el),
  ];
};

const getElementCategory = (el: Element): Category => {
  if (isPage(el)) return "page";
  if (isImage(el)) return "image";
  if (isHeading(el)) return "heading";
  if (isFormControl(el) || isLink(el) || isButton(el)) return "control";
  if (isSection(el)) return "section";
  if (isTable(el)) return "table";
  if (isTableCell(el)) return "tableCell";
  if (isFieldset(el)) return "fieldset";
  if (isSection(el) || isLang(el)) return "section";
  return "general";
};
