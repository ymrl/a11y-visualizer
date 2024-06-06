export type ElementMeta = {
  tips: ElementTip[];
  hidden: boolean;
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
  | "fieldset"
  | "general";
