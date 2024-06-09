export const isHidden = (el: Element): boolean => {
  if (el instanceof HTMLElement && !el.offsetParent) return true;
  if (el.matches("details:not([open]) > *:not(summary)")) return true;

  const d = el.ownerDocument;
  const w = d.defaultView;
  if (!w) return true;
  let t = el;
  while (t && t !== el.ownerDocument.body) {
    const style = w.getComputedStyle(t);
    if (style.visibility === "hidden") return true;
    if (!t.parentElement) return true;
    t = t.parentElement;
  }
  return false;
};
