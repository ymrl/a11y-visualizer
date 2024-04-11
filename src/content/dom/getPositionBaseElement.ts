export const getPositionBaseElement = (
  el: Element | null,
  d: Document,
  w: Window,
): Element | null => {
  if (!el) return null;
  if (w.getComputedStyle(el).position !== "static") return el;
  if (el === d.body) return null;
  return getPositionBaseElement(el, d, w);
};
