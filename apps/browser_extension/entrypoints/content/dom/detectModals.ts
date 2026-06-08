import { isHidden } from "@a11y-visualizer/dom-utils";

// aria-modal="true"な要素を検出（ただし、アクセシビリティツリーにあるもののみ）
export const detectAriaModals = (root: Element | ShadowRoot): Element[] =>
  Array.from(root.querySelectorAll('[aria-modal="true"]')).filter(
    (element) => !isHidden(element),
  );

// showModal()で開かれたdialog要素を検出（:modal疑似クラスにマッチするもの）
// show()やopen属性のみで開かれた非モーダルなdialogは含まない
export const detectModalDialogs = (root: Element | ShadowRoot): Element[] =>
  Array.from(root.querySelectorAll("dialog")).filter((dialog) =>
    dialog.matches(":modal"),
  );

export const detectModals = (root: Element | ShadowRoot): Element[] => {
  const ariaModalElements = detectAriaModals(root);

  // open状態のdialog要素を検出
  const openDialogElements = Array.from(root.querySelectorAll("dialog")).filter(
    (dialog) => (dialog as HTMLDialogElement).open,
  );

  // 重複を除去して結合
  return Array.from(new Set([...ariaModalElements, ...openDialogElements]));
};

// ライブリージョンの更新を通知すべきでないか（モーダルの外側にあるか）を判定する
export const isAnnouncementSuppressedByModal = (
  element: Element,
  root: Element | ShadowRoot,
  announceOutOfModal: boolean,
): boolean => {
  // showModal()で開かれたdialogは、それ以外をアクセシビリティツリーから除外するため、
  // 設定に関わらずモーダル外のライブリージョンは通知しない
  const modalDialogs = detectModalDialogs(root);
  if (modalDialogs.length > 0) {
    return !modalDialogs.some(
      (dialog) => dialog.contains(element) || dialog === element,
    );
  }

  // aria-modalはブラウザがアクセシビリティツリーから除外しないため、
  // NVDA等の挙動シミュレーションとして、announceOutOfModalがOFFのときのみ外側を抑制する
  if (!announceOutOfModal) {
    const ariaModals = detectAriaModals(root);
    if (ariaModals.length > 0) {
      return !ariaModals.some(
        (modal) => modal.contains(element) || modal === element,
      );
    }
  }

  return false;
};

export const shouldHideBackgroundElements = (root: Element): boolean => {
  const modals = detectModals(root);
  return modals.length > 0;
};
