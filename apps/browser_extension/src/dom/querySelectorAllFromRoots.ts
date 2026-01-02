/**
 * DocumentまたはShadow DOMから指定されたセレクタにマッチする要素を取得する
 *
 * @param selector - 検索するセレクタ
 * @param root - 検索対象のDocumentまたはElement（デフォルト: document）
 * @param shadowRoots - 検索対象のShadowRootの配列（オプション）
 * @returns 見つかった要素の配列
 */
export const querySelectorAllFromRoots = (
  selector: string,
  root: Document | Element,
  shadowRoots?: ShadowRoot[],
): Element[] => {
  const elements: Element[] = [];

  // rootから検索
  const elementsFromRoot = Array.from(root.querySelectorAll(selector));
  elements.push(...elementsFromRoot);

  // shadowRootsからも検索
  if (shadowRoots) {
    for (const shadowRoot of shadowRoots) {
      const elementsFromShadow = Array.from(
        shadowRoot.querySelectorAll(selector),
      );
      elements.push(...elementsFromShadow);
    }
  }

  return elements;
};
