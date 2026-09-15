import {
  getKnownRole,
  isAriaHidden,
  isHidden,
} from "@a11y-visualizer/dom-utils";

/**
 * ライブリージョンの読み上げレベルを表す。`off` は読み上げ対象外を意味する。
 */
export type ResolvedLiveLevel = "polite" | "assertive" | "off";

/**
 * 要素の実効的なライブリージョンレベルを解決する。
 *
 * - 明示的な `aria-live` 属性はロールの暗黙値を上書きする
 * - `aria-live` の無効値（`off`/`polite`/`assertive` 以外）は `off` として扱う
 * - `aria-live` 属性がない場合は実効ロールの暗黙値を使い、ライブリージョンの
 *   ロール（alert / status / log）でなければ `off` を返す
 *
 * @param el - 対象の要素
 * @returns 解決したライブリージョンレベル
 */
export const resolveLiveLevel = (el: Element): ResolvedLiveLevel => {
  const ariaLive = el.getAttribute("aria-live");
  if (ariaLive === "assertive" || ariaLive === "polite" || ariaLive === "off") {
    return ariaLive;
  }
  if (ariaLive !== null) {
    // 無効な値は off 相当
    return "off";
  }
  const role = getKnownRole(el);
  if (role === "alert") {
    return "assertive";
  }
  if (role === "status" || role === "log") {
    return "polite";
  }
  return "off";
};

/**
 * 支援技術が実際に読み上げるテキストのみを取り出す。
 *
 * `aria-hidden="true"` の要素や、`display:none` などで視覚的に非表示の要素の
 * テキストは除外する。DOMから切り離されたノード（削除された要素など）は
 * 算出スタイルを取得できないため、視覚的な非表示判定は行わず `aria-hidden` の
 * みで判定する。
 *
 * @param node - 対象のノード
 * @returns 読み上げ対象のテキスト
 */
export const getAnnounceableText = (node: Node): string => {
  if (node.nodeType === Node.TEXT_NODE) {
    return node.textContent || "";
  }
  if (node.nodeType !== Node.ELEMENT_NODE) {
    return "";
  }
  const el = node as Element;
  if (isAriaHidden(el)) {
    return "";
  }
  // 切り離されたノードは算出スタイルを取得できないため視覚的な非表示は判定しない
  if (el.isConnected && isHidden(el)) {
    return "";
  }
  let text = "";
  node.childNodes.forEach((child) => {
    text += getAnnounceableText(child);
  });
  return text;
};
