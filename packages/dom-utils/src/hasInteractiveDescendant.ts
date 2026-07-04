/**
 * インタラクティブなHTML要素（リンク、ボタン、フォームコントロールなど）を
 * 子孫に持つかどうかを判定する
 *
 * HTML仕様のinteractive contentに相当する要素をタグ名ベースで検出する。
 * role属性によるインタラクティブ要素は検出しない。
 * インタラクティブ要素の入れ子（nested-interactiveルール）の検出に使う
 *
 * @param el - 対象の要素（要素自身は判定対象に含まれない）
 * @returns インタラクティブな子孫を持つ場合はtrue
 */
export const hasInteractiveDescendant = (el: Element): boolean => {
  return !!el.querySelector(
    [
      "a[href]",
      "audio[controls]",
      "button",
      "details",
      "embed",
      "iframe",
      "img[usemap]",
      'input:not([type="hidden"])',
      "label",
      "select",
      "textarea",
      "video",
    ].join(","),
  );
};
