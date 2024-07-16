import { RuleResult } from "../rules";

export type ElementMeta = {
  name: string;
  category: Category;
  ruleResults: RuleResult[];
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
  | "table"
  | "tableCell"
  | "fieldset"
  | "page"
  | "general";
