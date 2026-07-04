/**
 * 要素が視覚的に非表示（レンダリングされていない）かどうかを判定する
 *
 * 自身と祖先の `display: none`・`visibility: hidden`・
 * `content-visibility: hidden`、および開いていないdetails要素の中身を
 * 非表示として扱う。祖先の探索はShadow DOM境界を越えてhost要素を辿る。
 * aria-hiddenやinertは考慮しない（それぞれ {@link isInAriaHidden}・
 * {@link isInInert} を使う）。
 *
 * 表示されていない要素をオーバーレイ表示やルール評価の対象外にするために使う
 *
 * @param el - 対象の要素
 * @returns 非表示の場合はtrue
 */
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
