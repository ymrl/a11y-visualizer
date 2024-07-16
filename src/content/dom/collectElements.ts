import { ElementMeta, Category } from "../types";
import { getPositionBaseElement } from "./getPositionBaseElement";
import { isHidden } from "../../dom/isHidden";
import { getElementPosition } from "./getElementPosition";
import { AriraHiddenSelectors } from "./tips/ariaHiddenTips";
import { HeadingSelectors, isHeading } from "./tips/headingTips";
import { LinkSelectors, isLink } from "./tips/linkTips";
import { ButtonSelectors, isButton } from "./tips/buttonTips";
import { FormSelectors, isFieldset, isFormControl } from "./tips/formTips";
import { isImage, ImageSelectors } from "./tips/imageTips";
import { computeAccessibleName } from "dom-accessibility-api";
import { CategorySettings } from "../../settings";
import { SectionSelectors, isSection } from "./tips/sectionTips";
import { isPage } from "./tips/pageTips";
import { LangSelectors, isLang } from "./tips/langTips";
import { TableSelectors, isTable, isTableCell } from "./tips/tableTips";
import { Table } from "../../table";
import { getScrollBaseElement } from "./getScrollBaseElement";
import { isRuleTargetElement, RuleResult, Rules } from "../../rules";
import { getKnownRole } from "../../dom/getKnownRole";

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
  const internalTables: Table[] = [];
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
        const role = getKnownRole(el);
        const name = computeAccessibleName(el);

        return {
          ...elementPosition,
          name: name || "",
          category: getElementCategory(el),
          ruleResults: Rules.reduce((prev, rule) => {
            const result = isRuleTargetElement(el, rule, role)
              ? rule.evaluate(el, rule.defaultOptions, {
                  tables: internalTables,
                  elementDocument: d,
                  elementWindow: w,
                  name,
                  role,
                  srcdoc: options.srcdoc,
                })
              : undefined;
            return result ? prev.concat(result) : prev;
          }, [] as RuleResult[]),
        };
      })
      .filter((el): el is ElementMeta => el !== null),
  };
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
