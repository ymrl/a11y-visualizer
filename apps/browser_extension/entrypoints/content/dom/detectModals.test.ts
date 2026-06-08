import { afterEach, beforeEach, describe, expect, it } from "vitest";
import {
  detectAriaModals,
  detectModalDialogs,
  detectModals,
  isAnnouncementSuppressedByModal,
  shouldHideBackgroundElements,
} from "./detectModals";

// showModal()はjsdomでは未実装のため、実ブラウザ環境でのみ実行する
const supportsShowModal =
  typeof HTMLDialogElement !== "undefined" &&
  typeof HTMLDialogElement.prototype.showModal === "function";

describe("detectModals", () => {
  let container: HTMLElement;

  beforeEach(() => {
    container = document.createElement("div");
    document.body.appendChild(container);
  });

  afterEach(() => {
    document.body.removeChild(container);
  });

  it("aria-modal='true'な要素を検出する", () => {
    container.innerHTML = `
      <div aria-modal="true" id="modal1">Modal 1</div>
      <div aria-modal="false" id="not-modal">Not Modal</div>
      <div id="no-aria">No Aria</div>
    `;

    const modals = detectModals(container);
    expect(modals).toHaveLength(1);
    expect(modals[0].id).toBe("modal1");
  });

  it("openなdialog要素を検出する", () => {
    const dialog = document.createElement("dialog");
    dialog.id = "dialog1";
    dialog.open = true;
    container.appendChild(dialog);

    const closedDialog = document.createElement("dialog");
    closedDialog.id = "dialog2";
    closedDialog.open = false;
    container.appendChild(closedDialog);

    const modals = detectModals(container);
    expect(modals).toHaveLength(1);
    expect(modals[0].id).toBe("dialog1");
  });

  it("aria-modalとopenなdialogの両方を検出する", () => {
    container.innerHTML = `<div aria-modal="true" id="modal1">Modal 1</div>`;

    const dialog = document.createElement("dialog");
    dialog.id = "dialog1";
    dialog.open = true;
    container.appendChild(dialog);

    const modals = detectModals(container);
    expect(modals).toHaveLength(2);

    const ids = modals.map((modal) => modal.id);
    expect(ids).toContain("modal1");
    expect(ids).toContain("dialog1");
  });

  it("重複する要素を除去する", () => {
    const dialog = document.createElement("dialog");
    dialog.id = "dialog1";
    dialog.setAttribute("aria-modal", "true");
    dialog.open = true;
    container.appendChild(dialog);

    const modals = detectModals(container);
    expect(modals).toHaveLength(1);
    expect(modals[0].id).toBe("dialog1");
  });

  it("モーダルが存在しない場合は空配列を返す", () => {
    container.innerHTML = `
      <div>Regular div</div>
      <p>Regular paragraph</p>
    `;

    const modals = detectModals(container);
    expect(modals).toHaveLength(0);
  });

  it("ネストしたモーダルも検出する", () => {
    container.innerHTML = `
      <div>
        <div aria-modal="true" id="nested-modal">Nested Modal</div>
      </div>
    `;

    const modals = detectModals(container);
    expect(modals).toHaveLength(1);
    expect(modals[0].id).toBe("nested-modal");
  });
});

describe("detectAriaModals", () => {
  let container: HTMLElement;

  beforeEach(() => {
    container = document.createElement("div");
    document.body.appendChild(container);
  });

  afterEach(() => {
    document.body.removeChild(container);
  });

  it("aria-modal='true'な要素を検出する", () => {
    container.innerHTML = `
      <div aria-modal="true" id="modal1">Modal 1</div>
      <div aria-modal="false" id="not-modal">Not Modal</div>
      <div id="no-aria">No Aria</div>
    `;

    const modals = detectAriaModals(container);
    expect(modals).toHaveLength(1);
    expect(modals[0].id).toBe("modal1");
  });

  it("非表示なaria-modal要素は除外する", () => {
    container.innerHTML = `
      <div aria-modal="true" id="hidden-modal" style="display: none;">Hidden</div>
    `;

    const modals = detectAriaModals(container);
    expect(modals).toHaveLength(0);
  });

  it("aria-modalが存在しない場合は空配列を返す", () => {
    container.innerHTML = `<div>Regular content</div>`;

    const modals = detectAriaModals(container);
    expect(modals).toHaveLength(0);
  });
});

describe("detectModalDialogs", () => {
  let container: HTMLElement;

  beforeEach(() => {
    container = document.createElement("div");
    document.body.appendChild(container);
  });

  afterEach(() => {
    document.body.removeChild(container);
  });

  it.runIf(supportsShowModal)("showModal()で開かれたdialogを検出する", () => {
    const dialog = document.createElement("dialog");
    dialog.id = "modal-dialog";
    container.appendChild(dialog);
    dialog.showModal();

    const dialogs = detectModalDialogs(container);
    expect(dialogs).toHaveLength(1);
    expect(dialogs[0].id).toBe("modal-dialog");

    dialog.close();
  });

  it.runIf(supportsShowModal)(
    "show()で開かれた非モーダルなdialogは検出しない",
    () => {
      const dialog = document.createElement("dialog");
      dialog.id = "non-modal-dialog";
      container.appendChild(dialog);
      dialog.show();

      const dialogs = detectModalDialogs(container);
      expect(dialogs).toHaveLength(0);

      dialog.close();
    },
  );

  it("open属性のみで開かれたdialogは検出しない", () => {
    const dialog = document.createElement("dialog");
    dialog.id = "open-dialog";
    dialog.open = true;
    container.appendChild(dialog);

    const dialogs = detectModalDialogs(container);
    expect(dialogs).toHaveLength(0);
  });

  it("閉じたdialogは検出しない", () => {
    const dialog = document.createElement("dialog");
    dialog.id = "closed-dialog";
    container.appendChild(dialog);

    const dialogs = detectModalDialogs(container);
    expect(dialogs).toHaveLength(0);
  });
});

describe("isAnnouncementSuppressedByModal", () => {
  let container: HTMLElement;

  beforeEach(() => {
    container = document.createElement("div");
    document.body.appendChild(container);
  });

  afterEach(() => {
    document.body.removeChild(container);
  });

  it("モーダルが存在しない場合は抑制しない", () => {
    container.innerHTML = `<div id="target">Live region</div>`;
    const target = container.querySelector("#target") as Element;

    expect(isAnnouncementSuppressedByModal(target, container, false)).toBe(
      false,
    );
    expect(isAnnouncementSuppressedByModal(target, container, true)).toBe(
      false,
    );
  });

  describe("aria-modalが存在する場合", () => {
    beforeEach(() => {
      container.innerHTML = `
        <div aria-modal="true" id="modal">
          <span id="inside">Inside</span>
        </div>
        <div id="outside">Outside</div>
      `;
    });

    it("announceOutOfModalがOFFのときモーダル外を抑制する", () => {
      const inside = container.querySelector("#inside") as Element;
      const outside = container.querySelector("#outside") as Element;

      expect(isAnnouncementSuppressedByModal(outside, container, false)).toBe(
        true,
      );
      expect(isAnnouncementSuppressedByModal(inside, container, false)).toBe(
        false,
      );
    });

    it("announceOutOfModalがONのときモーダル外も抑制しない", () => {
      const outside = container.querySelector("#outside") as Element;

      expect(isAnnouncementSuppressedByModal(outside, container, true)).toBe(
        false,
      );
    });
  });

  it("open属性のみのdialog(非モーダル)はモーダル扱いせず抑制しない", () => {
    container.innerHTML = `
      <dialog id="dialog" open><span id="inside">Inside</span></dialog>
      <div id="outside">Outside</div>
    `;
    const outside = container.querySelector("#outside") as Element;

    // show()相当の非モーダルdialogは抑制対象外
    expect(isAnnouncementSuppressedByModal(outside, container, false)).toBe(
      false,
    );
  });

  describe("showModal()のdialogが存在する場合", () => {
    it.runIf(supportsShowModal)(
      "announceOutOfModalがONでもモーダル外を抑制する",
      () => {
        const dialog = document.createElement("dialog");
        dialog.innerHTML = `<span id="inside">Inside</span>`;
        container.appendChild(dialog);
        const outside = document.createElement("div");
        outside.id = "outside";
        container.appendChild(outside);
        dialog.showModal();

        const inside = dialog.querySelector("#inside") as Element;

        expect(isAnnouncementSuppressedByModal(outside, container, true)).toBe(
          true,
        );
        expect(isAnnouncementSuppressedByModal(inside, container, true)).toBe(
          false,
        );

        dialog.close();
      },
    );
  });
});

describe("shouldHideBackgroundElements", () => {
  let container: HTMLElement;

  beforeEach(() => {
    container = document.createElement("div");
    document.body.appendChild(container);
  });

  afterEach(() => {
    document.body.removeChild(container);
  });

  it("モーダルが存在する場合はtrueを返す", () => {
    container.innerHTML = `<div aria-modal="true">Modal</div>`;

    expect(shouldHideBackgroundElements(container)).toBe(true);
  });

  it("モーダルが存在しない場合はfalseを返す", () => {
    container.innerHTML = `<div>Regular content</div>`;

    expect(shouldHideBackgroundElements(container)).toBe(false);
  });
});
