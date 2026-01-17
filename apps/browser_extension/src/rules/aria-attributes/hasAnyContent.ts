import { FOCUSABLE_SELECTOR } from "@a11y-visualizer/dom-utils";

export const hasAnyContent = (element: Element): boolean => {
  // テキストコンテンツがある
  if (element.textContent?.trim() !== "") {
    return true;
  }
  // 画像がある
  if (element.querySelector("img, svg, canvas, video") !== null) {
    return true;
  }
  const focusables = element.querySelectorAll(FOCUSABLE_SELECTOR);
  // フォーカス可能な要素がある
  if (
    focusables.length > 0 &&
    Array.from(focusables).some((el) => el.getAttribute("tabindex") !== "-1")
  ) {
    return true;
  }
  return false;
};
