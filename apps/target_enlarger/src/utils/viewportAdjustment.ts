import { SmallTargetInfo } from "../detector/targetDetector";

export interface ViewportConstrainedPosition {
  left: number;
  top: number;
  width: number;
  height: number;
  isAdjusted: boolean;
  adjustments: {
    left?: number;
    top?: number;
    width?: number;
    height?: number;
  };
}

export const constrainToViewport = (
  targetInfo: SmallTargetInfo,
  margin: number = 8,
): ViewportConstrainedPosition => {
  const { position, recommendedSize } = targetInfo;
  const viewport = {
    width: window.innerWidth,
    height: window.innerHeight,
    scrollX: window.scrollX,
    scrollY: window.scrollY,
  };

  // オーバーレイの理想的な位置
  const idealLeft =
    position.absoluteX - (recommendedSize.width - position.width) / 2;
  const idealTop =
    position.absoluteY - (recommendedSize.height - position.height) / 2;

  // ビューポート内での座標
  const viewportLeft = idealLeft - viewport.scrollX;
  const viewportTop = idealTop - viewport.scrollY;

  let adjustedLeft = idealLeft;
  let adjustedTop = idealTop;
  let adjustedWidth = recommendedSize.width;
  let adjustedHeight = recommendedSize.height;
  const adjustments: ViewportConstrainedPosition["adjustments"] = {};
  let isAdjusted = false;

  // 左端のはみ出しチェック
  if (viewportLeft < margin) {
    const adjustment = margin - viewportLeft;
    adjustedLeft = idealLeft + adjustment;
    adjustments.left = adjustment;
    isAdjusted = true;
  }

  // 右端のはみ出しチェック
  const rightEdge = viewportLeft + adjustedWidth;
  if (rightEdge > viewport.width - margin) {
    const adjustment = rightEdge - (viewport.width - margin);
    adjustedLeft = adjustedLeft - adjustment;
    adjustments.left = (adjustments.left || 0) - adjustment;
    isAdjusted = true;

    // 左端に押し戻されすぎる場合は幅を縮小
    if (adjustedLeft - viewport.scrollX < margin) {
      adjustedWidth = viewport.width - 2 * margin;
      adjustedLeft = viewport.scrollX + margin;
      adjustments.width = adjustedWidth - recommendedSize.width;
      adjustments.left = margin - viewportLeft;
      isAdjusted = true;
    }
  }

  // 上端のはみ出しチェック
  if (viewportTop < margin) {
    const adjustment = margin - viewportTop;
    adjustedTop = idealTop + adjustment;
    adjustments.top = adjustment;
    isAdjusted = true;
  }

  // 下端のはみ出しチェック
  const bottomEdge = viewportTop + adjustedHeight;
  if (bottomEdge > viewport.height - margin) {
    const adjustment = bottomEdge - (viewport.height - margin);
    adjustedTop = adjustedTop - adjustment;
    adjustments.top = (adjustments.top || 0) - adjustment;
    isAdjusted = true;

    // 上端に押し戻されすぎる場合は高さを縮小
    if (adjustedTop - viewport.scrollY < margin) {
      adjustedHeight = viewport.height - 2 * margin;
      adjustedTop = viewport.scrollY + margin;
      adjustments.height = adjustedHeight - recommendedSize.height;
      adjustments.top = margin - viewportTop;
      isAdjusted = true;
    }
  }

  // 最小サイズの保証
  const minSize =
    Math.min(targetInfo.position.width, targetInfo.position.height) + 8;
  if (adjustedWidth < minSize) {
    adjustedWidth = minSize;
    adjustments.width = adjustedWidth - recommendedSize.width;
    isAdjusted = true;
  }
  if (adjustedHeight < minSize) {
    adjustedHeight = minSize;
    adjustments.height = adjustedHeight - recommendedSize.height;
    isAdjusted = true;
  }

  return {
    left: adjustedLeft,
    top: adjustedTop,
    width: adjustedWidth,
    height: adjustedHeight,
    isAdjusted,
    adjustments,
  };
};

export const isElementInViewport = (
  element: Element,
  margin: number = 0,
): boolean => {
  const rect = element.getBoundingClientRect();
  return (
    rect.top >= -margin &&
    rect.left >= -margin &&
    rect.bottom <= window.innerHeight + margin &&
    rect.right <= window.innerWidth + margin
  );
};

export const getViewportVisibleRatio = (element: Element): number => {
  const rect = element.getBoundingClientRect();
  const viewport = {
    left: 0,
    top: 0,
    right: window.innerWidth,
    bottom: window.innerHeight,
  };

  const visibleLeft = Math.max(rect.left, viewport.left);
  const visibleTop = Math.max(rect.top, viewport.top);
  const visibleRight = Math.min(rect.right, viewport.right);
  const visibleBottom = Math.min(rect.bottom, viewport.bottom);

  if (visibleLeft >= visibleRight || visibleTop >= visibleBottom) {
    return 0;
  }

  const visibleArea =
    (visibleRight - visibleLeft) * (visibleBottom - visibleTop);
  const totalArea = rect.width * rect.height;

  return totalArea > 0 ? visibleArea / totalArea : 0;
};

export const isElementVisible = (element: Element): boolean => {
  // hidden属性チェック
  if (element.hasAttribute("hidden")) {
    return false;
  }

  // HTMLElementでない場合（SVG要素など）はgetComputedStyleをスキップ
  if (!(element instanceof HTMLElement)) {
    return true;
  }

  const style = window.getComputedStyle(element);

  // display: none チェック
  if (style.display === "none") {
    return false;
  }

  // visibility: hidden チェック
  if (style.visibility === "hidden") {
    return false;
  }

  // 親要素も再帰的にチェック（documentまで）
  const parent = element.parentElement;
  if (parent && parent !== document.documentElement) {
    return isElementVisible(parent);
  }

  return true;
};

export const isElementVisibleAndInViewport = (
  element: Element,
  margin: number = 0,
): boolean => {
  return isElementVisible(element) && isElementInViewport(element, margin);
};
