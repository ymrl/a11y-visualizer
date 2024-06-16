export type ElementMeta = {
  tips: ElementTip[];
  category: Category;
} & ElementPosition;

export type ElementPosition = {
  x: number;
  y: number;
  absoluteX: number;
  absoluteY: number;
  width: number;
  height: number;
};

export type TipType =
  | "name"
  | "role"
  | "tagName"
  | "landmark"
  | "description"
  | "level"
  | "ariaStatus"
  | "lang"
  | "pageTitle"
  | "tableHeader"
  | "warning"
  | "error";
export type ElementTip = {
  type: TipType;
  content: string;
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
