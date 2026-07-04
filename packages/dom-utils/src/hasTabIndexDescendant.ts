/**
 * tabindex属性を持つ要素を子孫に持つかどうかを判定する
 *
 * {@link hasInteractiveDescendant} と組み合わせて、フォーカス可能な要素の
 * 入れ子（nested-interactiveルール）の検出に使う
 *
 * @param el - 対象の要素（要素自身は判定対象に含まれない）
 * @returns tabindex属性を持つ子孫を持つ場合はtrue
 */
export const hasTabIndexDescendant = (el: Element): boolean => {
  return !!el.querySelector("[tabindex]");
};
