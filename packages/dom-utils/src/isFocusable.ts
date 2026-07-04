/**
 * フォーカス可能になりうる要素にマッチするCSSセレクタ
 *
 * リンク・フォームコントロール・contenteditable・tabindex持ちの要素などを対象とする。
 * disabled属性や負のtabindexは考慮しないため、厳密な判定には
 * {@link isFocusable} を使う
 */
export const FOCUSABLE_SELECTOR = [
  "a[href]",
  "map > area[href]",
  "button",
  "input:not([type=hidden])",
  "object",
  "select",
  "textarea",
  "[contenteditable]",
  "details > summary",
  "[tabindex]",
].join(", ");
/**
 * 要素がフォーカス可能かどうかを判定する
 *
 * {@link FOCUSABLE_SELECTOR} にマッチするかで判定する。
 * コントロールにフォーカス可否を求めるルール（control-focusなど）で使う
 *
 * @param element - 対象の要素
 * @param keyboard - trueの場合、キーボードフォーカス可能かを判定する
 *   （負のtabindexが指定されている要素を除外する）
 * @returns フォーカス可能な場合はtrue
 */
export const isFocusable = (
  element: Element,
  keyboard: boolean = false,
): boolean => {
  const matches = element.matches(FOCUSABLE_SELECTOR);
  if (keyboard && matches) {
    const tabindex = element.getAttribute("tabindex");
    return tabindex === null || parseInt(tabindex, 10) >= 0;
  }
  return matches;
};
