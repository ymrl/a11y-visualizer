import type { RuleResult } from "../../src/rules";

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

export type ElementPosition = {
  x: number;
  y: number;
  absoluteX: number;
  absoluteY: number;
  width: number;
  height: number;
};

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
