export const isHidden = (el: Element): boolean => {
  const tagName = el.tagName.toLowerCase();
  if (el.matches("details:not([open]) *")) {
    if (tagName === "summary" && el.parentElement) {
      return isHidden(el.parentElement);
    }
    return true;
  }

  const d = el.ownerDocument;
  const w = d.defaultView;
  if (!w) return true;
  let t = el;
  while (t && t !== el.ownerDocument.body) {
    const style = w.getComputedStyle(t);
    if (
      // area elements are display:hidden by default in Firefox
      (style.display === "none" && tagName !== "area") ||
      style.visibility === "hidden" ||
      style.getPropertyValue("content-visibility") === "hidden"
    )
      return true;
    if (!t.parentElement) return true;
    t = t.parentElement;
  }
  return false;
};
