export const testCategories = [
  { slug: "headings", dictKey: "headings" },
  { slug: "images", dictKey: "images" },
  { slug: "links", dictKey: "links" },
  { slug: "buttons", dictKey: "buttons" },
  { slug: "form-controls", dictKey: "forms" },
  { slug: "layout", dictKey: "landmarks" },
  { slug: "lists", dictKey: "lists" },
  { slug: "tables", dictKey: "tables" },
  { slug: "aria-hidden", dictKey: "ariaHidden" },
  { slug: "live-regions", dictKey: "liveRegions" },
  { slug: "inert", dictKey: "inert" },
  { slug: "shadow-dom", dictKey: "shadowDom" },
] as const;

export type TestCategory = (typeof testCategories)[number];
