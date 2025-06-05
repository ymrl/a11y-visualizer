export const getPositionBaseElement = (
  el: Element | null,
  d: Document,
  w: Window,
): Element | null => {
  if (!el) return null;
  const position = w.getComputedStyle(el).position;
  if (position && position !== "static") return el;
  if (el === d.body) return null;
  return getPositionBaseElement(el.parentElement, d, w);
};
