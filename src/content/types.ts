export type ElementMeta = {
  tips: ElementTip[];
  hidden: boolean;
  categories: Category[];
  nickName: string;
} & ElementPosition;

export type ElementPosition = {
  x: number;
  y: number;
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
