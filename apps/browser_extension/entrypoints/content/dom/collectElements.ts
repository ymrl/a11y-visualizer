import { getKnownRole, isHidden } from "@a11y-visualizer/dom-utils";
import type { Table } from "@a11y-visualizer/table";
import { computeAccessibleName } from "dom-accessibility-api";
import { collectShadowRoots } from "../../../src/dom/collectShadowRoots";
import { isOutOfSight } from "../../../src/dom/isOutOfSight";
import {
  isRuleTargetElement,
  type RuleResult,
  Rules,
} from "../../../src/rules";
import type { CategorySettings } from "../../../src/settings";
import type { ElementMeta } from "../types";
import { detectModals } from "./detectModals";
import { getElementCategory } from "./getElementCategory";
import { getElementPosition } from "./getElementPosition";
import { getPositionBaseElement } from "./getPositionBaseElement";
import { getScrollBaseElement } from "./getScrollBaseElement";
import { Selectors } from "./Selectors";

const getSelector = (settings: Partial<CategorySettings>) => {
  const s = Object.keys(settings).reduce((acc, key) => {
    if (
      settings[key as keyof CategorySettings] &&
      Selectors[key as keyof CategorySettings]
    ) {
      acc.push(...Selectors[key as keyof CategorySettings]);
    }
    return acc;
  }, [] as string[]);
  return s.join(",");
};

export const collectElements = (
  root: Element,
  excludes: Element[],
  settings: Partial<CategorySettings>,
  options: {
    srcdoc?: boolean;
    hideOutOfSightElementTips?: boolean;
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

  // Shadow DOMを収集
  const shadowRoots = collectShadowRoots(root);

  // モーダル要素を検出（通常のDOMとShadow DOM両方）
  const modals = [...detectModals(root), ...shadowRoots.flatMap(detectModals)];
  const hasActiveModals = modals.length > 0;

  return {
    rootHeight,
    rootWidth,
    elements: [
      ...(settings.page && rootTagName === "body" ? [root] : []),
      ...(selector && root.matches(selector) ? [root] : []),
      ...(selector ? [...root.querySelectorAll(selector)] : []),
      // Shadow DOM内の要素も収集
      ...shadowRoots.flatMap((shadowRoot) =>
        selector ? [...shadowRoot.querySelectorAll(selector)] : [],
      ),
    ]
      .filter((el) => !isHidden(el))
      .filter((el) => !excludes.some((exclude) => exclude.contains(el)))
      .filter((el) => {
        // モーダルが表示されている場合、モーダル外の要素を非表示にする
        if (hasActiveModals) {
          return modals.some((modal) => modal.contains(el) || modal === el);
        }
        return true;
      })
      .filter((el) => {
        // 視覚的に見えない要素のフィルタリング
        if (options.hideOutOfSightElementTips) {
          return !isOutOfSight(el, excludes);
        }
        return true;
      })
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
        const rects = Array.from(el.getClientRects()).map((rect) => ({
          relativeX: rect.x - elementPosition.x + visibleX - offsetX,
          relativeY: rect.y - elementPosition.y + visibleY - offsetY,
          width: rect.width,
          height: rect.height,
        }));

        const ruleResults = Rules.reduce<RuleResult[]>((prev, rule) => {
          const result = isRuleTargetElement(el, rule, role)
            ? rule.evaluate(el, rule.defaultOptions, {
                tables: internalTables,
                elementDocument: d,
                elementWindow: w,
                name,
                role,
                srcdoc: options.srcdoc,
                shadowRoots,
              })
            : undefined;
          return result ? prev.concat(result) : prev;
        }, []);

        return {
          ...elementPosition,
          rects,
          name: name || "",
          category: getElementCategory(el, role),
          ruleResults,
        };
      })
      .filter((el): el is ElementMeta => el !== null)
      .filter((el) => el.ruleResults.length > 0),
  };
};
