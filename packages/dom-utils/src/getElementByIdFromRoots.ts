/**
 * DocumentまたはShadow DOMから指定されたIDを持つ要素を取得する
 *
 * @param id - 検索する要素のID
 * @param document - 検索対象のDocument
 * @param shadowRoots - 検索対象のShadowRootの配列（オプション）
 * @returns 見つかった要素、見つからない場合はnull
 */
export const getElementByIdFromRoots = (
  id: string,
  document: Document,
  shadowRoots?: ShadowRoot[],
): Element | null => {
  // まずdocumentから検索
  const elementFromDocument = document.getElementById(id);
  if (elementFromDocument) {
    return elementFromDocument;
  }

  // documentで見つからなければ、各Shadow DOMから検索
  if (shadowRoots) {
    for (const shadowRoot of shadowRoots) {
      const elementFromShadow = shadowRoot.getElementById(id);
      if (elementFromShadow) {
        return elementFromShadow;
      }
    }
  }

  return null;
};
