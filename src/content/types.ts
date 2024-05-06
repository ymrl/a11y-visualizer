export type ElementMeta = {
  tips: ElementTip[];
  hidden: boolean;
  categories: Category[];
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
  | "description"
  | "level"
  | "warning"
  | "error";
export type ElementTip = {
  type: TipType;
  content: string;
};

export type Category =
  | "image"
  | "formControl"
  | "button"
  | "link"
  | "heading"
  | "ariaHidden";
