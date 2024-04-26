export type ElementMeta = {
  x: number;
  y: number;
  width: number;
  height: number;
  tips: ElementTip[];
  hidden: boolean;
  categories: Category[];
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
