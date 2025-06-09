export const getScrollBaseElement = (
  el: Element,
  d = el.ownerDocument,
  w = d.defaultView,
): Element | undefined => {
  if (!w) return undefined;
  const style = w.getComputedStyle(el);
  const { overflowX, overflowY } = style;
  if (el === d.body) return undefined;
  if (
    ["auto", "scroll"].includes(overflowX) ||
    ["auto", "scroll"].includes(overflowY)
  )
    return el;
  if (el.parentElement) return getScrollBaseElement(el.parentElement, d, w);
  return undefined;
};
