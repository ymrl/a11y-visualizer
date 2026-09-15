/**
 * 要素のスクロール基準となる祖先要素(overflowがauto/scrollの要素)を取得する
 *
 * @param el - 対象の要素
 * @param d - 要素が属するDocument
 * @param w - 要素が属するWindow
 * @param cache - 判定結果のキャッシュ。同一の収集パス内で使い回すと、
 *   同じ祖先を持つ要素間でgetComputedStyleの再計算を省略できる。
 *   スクロール基準がない場合はnullとして保存される
 * @returns スクロール基準となる要素。ない場合はundefined
 */
export const getScrollBaseElement = (
  el: Element,
  d = el.ownerDocument,
  w = d.defaultView,
  cache?: WeakMap<Element, Element | null>,
): Element | undefined => {
  if (!w) return undefined;
  if (cache?.has(el)) return cache.get(el) ?? undefined;

  let result: Element | undefined;
  if (el === d.body) {
    result = undefined;
  } else {
    const { overflowX, overflowY } = w.getComputedStyle(el);
    if (
      ["auto", "scroll"].includes(overflowX) ||
      ["auto", "scroll"].includes(overflowY)
    ) {
      result = el;
    } else if (el.parentElement) {
      result = getScrollBaseElement(el.parentElement, d, w, cache);
    } else {
      result = undefined;
    }
  }
  cache?.set(el, result ?? null);
  return result;
};
