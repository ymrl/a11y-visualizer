import { isHidden } from "@a11y-visualizer/dom-utils";

export const detectModals = (root: Element | ShadowRoot): Element[] => {
  // aria-modal="true"な要素を検出（ただし、アクセシビリティツリーにあるもののみ）
  const ariaModalElements = Array.from(
    root.querySelectorAll('[aria-modal="true"]'),
  ).filter((element) => !isHidden(element));

  // showModal()で開かれたdialog要素を検出
  const openDialogElements = Array.from(root.querySelectorAll("dialog")).filter(
    (dialog) => (dialog as HTMLDialogElement).open,
  );

  // 重複を除去して結合
  return Array.from(new Set([...ariaModalElements, ...openDialogElements]));
};

export const shouldHideBackgroundElements = (root: Element): boolean => {
  const modals = detectModals(root);
  return modals.length > 0;
};
