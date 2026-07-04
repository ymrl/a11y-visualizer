/**
 * インタラクティブなロールを持つ要素を表すロール一覧。
 * HTML仕様のinteractive contentに相当する要素はタグ名で検出するため、
 * ここではrole属性で明示されたウィジェット系ロールを補完的に検出する
 */
const INTERACTIVE_ROLES = [
  "button",
  "checkbox",
  "combobox",
  "link",
  "menuitem",
  "menuitemcheckbox",
  "menuitemradio",
  "option",
  "radio",
  "searchbox",
  "slider",
  "spinbutton",
  "switch",
  "tab",
  "textbox",
] as const;

/**
 * インタラクティブなHTML要素（リンク、ボタン、フォームコントロールなど）を
 * 子孫に持つかどうかを判定する
 *
 * HTML仕様のinteractive contentに相当する要素をタグ名ベースで検出するほか、
 * role属性でインタラクティブなロールが明示された要素も検出する。
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
      ...INTERACTIVE_ROLES.map((role) => `[role~="${role}"]`),
    ].join(","),
  );
};
