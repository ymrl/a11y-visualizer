export type ElementInfo = {
  tagName: string;
  hasAlt: boolean | undefined;
  x: number;
  y: number;
  width: number;
  height: number;
  type: "input" | "textarea" | "select" | "button";
  name: string;
  role: string;
  description: string;
  hidden: boolean;
};

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
  | "link"
  | "heading"
  | "ariaHidden";
