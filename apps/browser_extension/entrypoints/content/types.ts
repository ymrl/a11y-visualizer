import type { ElementPosition } from "@a11y-visualizer/dom-utils";
import type { RuleResult } from "@a11y-visualizer/rules";

export type ElementMeta = {
  name: string;
  category: Category;
  ruleResults: RuleResult[];
  rects: {
    relativeX: number;
    relativeY: number;
    width: number;
    height: number;
  }[];
} & ElementPosition;

export type { ElementPosition };

export type Category =
  | "image"
  | "heading"
  | "control"
  | "section"
  | "list"
  | "listItem"
  | "table"
  | "tableCell"
  | "group"
  | "page"
  | "wai-aria"
  | "tabIndex"
  | "general";
