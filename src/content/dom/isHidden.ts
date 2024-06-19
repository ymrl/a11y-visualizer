export const isHidden = (el: Element): boolean => {
  if (el.matches("details:not([open]) *")) {
    if (el.tagName.toLowerCase() === "summary" && el.parentElement) {
      return isHidden(el.parentElement);
    }
    return true;
  }
  if (el.matches("[hidden]")) return true;

  const d = el.ownerDocument;
  const w = d.defaultView;
  if (!w) return true;
  let t = el;
  while (t && t !== el.ownerDocument.body) {
    const style = w.getComputedStyle(t);
    if (style.display === "none" || style.visibility === "hidden") return true;
    if (!t.parentElement) return true;
    t = t.parentElement;
  }
  return false;
};
