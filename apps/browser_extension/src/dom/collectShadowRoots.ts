/**
 * 指定されたノード以下のすべてのShadowRootを収集する
 * ネストしたShadow DOM（Shadow DOM内のShadow DOM）も再帰的に収集する
 *
 * @param root - 検索を開始するルートノード（デフォルト: document.body）
 * @returns 見つかったShadowRootの配列
 */
export const collectShadowRoots = (
  root: Node = document.body,
): ShadowRoot[] => {
  const shadowRoots: ShadowRoot[] = [];

  /**
   * ノードツリーを再帰的に走査してShadowRootを収集
   */
  const traverse = (node: Node) => {
    // nodeがElementの場合、shadowRootをチェック
    if (node instanceof Element && node.shadowRoot) {
      shadowRoots.push(node.shadowRoot);
      // shadowRoot内も探索
      traverse(node.shadowRoot);
    }

    // 子ノードを再帰的に探索
    node.childNodes.forEach((child) => {
      traverse(child);
    });
  };

  traverse(root);
  return shadowRoots;
};
