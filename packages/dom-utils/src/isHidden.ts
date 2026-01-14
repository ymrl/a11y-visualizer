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
  let t: Element | null = el;
  while (t && t !== el.ownerDocument.body) {
    const style = w.getComputedStyle(t);
    if (
      // area elements are display:hidden by default in Firefox
      (style.display === "none" && tagName !== "area") ||
      style.visibility === "hidden" ||
      style.getPropertyValue("content-visibility") === "hidden"
    )
      return true;

    // 次の親要素を取得（Shadow DOMを考慮）
    if (t.parentElement) {
      t = t.parentElement;
    } else if (t.parentNode instanceof ShadowRoot) {
      // Shadow DOMの場合、host要素を辿る
      t = t.parentNode.host;
    } else {
      // 本当に親がない場合は隠れている
      return true;
    }
  }
  return false;
};
