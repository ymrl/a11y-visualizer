/**
 * 要素自身に `aria-hidden="true"` が指定されているかどうかを判定する
 *
 * 祖先は判定しない。祖先も含めて判定する場合は {@link isInAriaHidden} を使う
 *
 * @param el - 対象の要素
 * @returns aria-hidden="true" が指定されている場合はtrue
 */
export const isAriaHidden = (el: Element): boolean =>
  el.getAttribute("aria-hidden") === "true";

/**
 * 要素が `aria-hidden="true"` の影響下にある（自身または祖先に指定されている）
 * かどうかを判定する
 *
 * アクセシビリティツリーから除外されている要素をルールの評価対象外にしたり、
 * ライブリージョンの読み上げ対象外の判定に使う
 *
 * @param el - 対象の要素
 * @returns 自身または祖先に aria-hidden="true" が指定されている場合はtrue
 */
export const isInAriaHidden = (el: Element): boolean => {
  if (isAriaHidden(el)) {
    return true;
  }
  const parent = el.parentElement;
  if (!parent) {
    return false;
  }
  return isInAriaHidden(parent);
};
